<template>
  <v-container v-if="oneLetter">
    <v-layout v-if="oneLetter.isFrozen" class="mb-3">
      <v-flex xs12>
        <v-alert :value="true" type="info">
          Note that this association table has been frozen -- it is no longer
          editable.
        </v-alert>
      </v-flex>
    </v-layout>

    <v-layout v-if="!tableEditModeOn" row wrap>
      <v-flex xs8>
        <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
      </v-flex>
      <v-flex xs4 class="text-xs-right">
        <v-btn
          class="mr-2"
          v-if="allowHideTable"
          color="primary"
          dark
          @click="hideTable"
        >
          Hide Table
        </v-btn>
        <v-btn
          v-if="!oneLetter.isFrozen"
          color="primary"
          dark
          @click="editTable"
        >
          Edit Table
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="tableData" class="elevation-1">
          <!-- https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table -->
          <template v-slot:item="{ item, headers }">
            <tr>
              <td
                v-for="header in headers"
                :key="header.value"
                class="text-xs-center"
              >
                <span v-if="header.value === 'practice'">
                  {{ item[header.value] }}
                </span>
                <span v-else>
                  <v-icon
                    v-if="item.spiritualFocusOrientationIdDict[header.value]"
                    color="success"
                    >mdi-check-circle</v-icon
                  >
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-layout v-if="tableEditModeOn" row wrap>
      <v-flex xs8>
        <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
      </v-flex>
      <v-flex xs4 v-if="!oneLetter.isFrozen" xs3 class="text-xs-right">
        <v-btn class="mr-2" color="primary" dark @click="cancelEdits">
          Cancel
        </v-btn>
        <v-btn color="success" dark @click="saveTableEdits">
          Save Edits
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="tableData" class="elevation-1">
          <!-- https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table -->
          <template v-slot:item="{ item, headers }">
            <tr>
              <td
                v-for="header in headers"
                :key="header.value"
                class="text-xs-center"
              >
                <span v-if="header.value === 'practice'">
                  {{ item[header.value] }}
                </span>
                <span v-else>
                  <!-- note: deleted :input-value="myprops.item[header.value]", since it seemed superfluous with the addition of v-model -->
                  <v-checkbox
                    v-model="item.spiritualFocusOrientationIdDict[header.value]"
                    color="primary"
                    hide-details
                  ></v-checkbox>
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { orderBy } from "lodash";

import {
  AssociationTableHeader,
  SpiritualFocusOrientation,
  TableData
} from "../types/association-table.types";

import { ONE_LETTER_QUERY } from "@/graphql/letters.graphql";
import { REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION } from "@/graphql/prediction-tables.graphql";

import {
  OneLetter,
  OneLetter_letter,
  OneLetter_letter_scriptureEngagementPractices,
  OneLetter_letter_survey_surveyDimensions
} from "@/graphql/types/OneLetter";
import { PartialPredictionTableEntry } from "@/graphql/types/globalTypes";

@Component({
  //components: { AssociationTableInfoForm },
  apollo: {
    oneLetter: {
      query: ONE_LETTER_QUERY,
      variables() {
        return {
          letterId: parseInt(this.letterId)
        };
      },
      update(oneLetter: OneLetter) {
        console.log("inside update; letter data: ", oneLetter);
        // construct headers
        this.tableColumns = [];
        this.headers = [];
        this.headers.push({
          text: "SE Practice",
          align: "left",
          sortable: true,
          value: "practice"
        });
        let surveyDimensions: OneLetter_letter_survey_surveyDimensions[] = orderBy(
          oneLetter.letter.survey.surveyDimensions,
          "sequence"
        );
        surveyDimensions.forEach(dimension => {
          dimension.surveyIndices.forEach(index => {
            if (index.useForPredictions) {
              //this.tableColumns.push(index);
              this.headers.push({
                text: index.abbreviation,
                align: "left",
                sortable: true,
                value: "columnId-" + index.id // unique id for this index
              });
            }
          });
        });

        let scriptureEngagementPractices: OneLetter_letter_scriptureEngagementPractices[] = orderBy(
          oneLetter.letter.scriptureEngagementPractices,
          "sequence"
        );

        let tableEntriesDict: { [key: number]: string[] } = {};
        scriptureEngagementPractices.forEach(practice => {
          tableEntriesDict[practice.id] = [];
        });
        oneLetter.letter.tableEntries.forEach(entry => {
          tableEntriesDict[entry.practice.id].push(
            "columnId-" + entry.surveyIndex.id
          );
        });

        this.tableData = [];
        scriptureEngagementPractices.forEach(practice => {
          let idDict: any = {};
          this.headers.forEach((header: AssociationTableHeader) => {
            if (header.value !== "practice") {
              idDict[header.value] = tableEntriesDict[practice.id].includes(
                header.value
              );
            }
          });
          this.tableData.push({
            practice: practice.title,
            practiceId: practice.id, // added so that we can figure out which practice this is when we go to save the data
            practiceOrder: practice.sequence, // added so we know the original ordering...not sure if we will allow this to change
            spiritualFocusOrientationIdDict: idDict
          });
        });
        console.log("table data: ", this.tableData);
        this.originalTableData = JSON.parse(JSON.stringify(this.tableData)); // this can be used later if the user clicks "cancel"

        return oneLetter.letter; // return oneLetter, but in the end we are not actually using it anywhere....
      },
      skip() {
        console.log("skipping fetch of letter data....");
        return this.letterId === null;
      }
    }
  }
})
export default class AssociationTable extends Vue {
  @Prop({ default: null }) letterId!: number; // letter id
  @Prop({ default: false }) allowHideTable!: boolean; // whether or not the table may be hidden
  oneLetter: OneLetter_letter | null = null;

  tableColumns: SpiritualFocusOrientation[] = [];
  tableData: TableData[] = [];
  originalTableData: TableData[] = [];
  headers: AssociationTableHeader[] = [];

  tableEditModeOn: boolean = false;

  hideTable() {
    this.$emit("hide-table");
  }

  editTable() {
    this.tableEditModeOn = true;
  }

  cancelEdits() {
    this.tableData = JSON.parse(JSON.stringify(this.originalTableData));
    this.tableEditModeOn = false;
  }

  saveTableEdits() {
    // save edits to db....
    this.tableEditModeOn = false;
    let partialPredictionTableEntries: PartialPredictionTableEntry[] = [];
    for (let tableRow of this.tableData) {
      //https://stackoverflow.com/questions/16174182/typescript-looping-through-a-dictionary
      Object.entries(tableRow.spiritualFocusOrientationIdDict).forEach(
        ([key, value]) => {
          if (value) {
            // the focus/orientation ids are part of the key in the spiritualFocusOrientationIdDict object
            // (e.g., "columnId-2" means the focus/orientation id is 2);
            // if the value is true, the id is harvested from the key and saved to an array
            let id: number = +key.split("columnId-")[1];
            //spiritualFocusOrientationIds.push(id);
            partialPredictionTableEntries.push({
              surveyIndexId: id,
              practiceId: tableRow.practiceId,
              // hard-coding the sequence for now....
              sequence: 10
            });
          }
        }
      );
    }
    console.log("partialPredictionTableEntries", partialPredictionTableEntries);

    this.$apollo
      .mutate({
        mutation: REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION,
        variables: {
          replaceInput: {
            letterId: this.oneLetter!.id,
            entries: partialPredictionTableEntries
          }
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
        this.refetchLetterData();
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
      });
  }

  refetchLetterData() {
    this.$apollo.queries.oneLetter.refetch().then(({ data }) => {
      console.log("survey data refetched! ", data);
    });
  }

  mounted() {}
}
</script>
