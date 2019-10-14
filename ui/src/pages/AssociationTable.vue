<template>
  <v-container>
    <v-layout v-if="isFrozen" class="mb-3">
      <v-flex xs12>
        <v-alert :value="true" type="info">
          Note that this association table has been frozen -- it is no longer
          editable.
        </v-alert>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs8>
        <h1 class="headline mb-3">{{ title }}</h1>
        <h2 class="title font-weight-regular mb-1">
          Survey:
          <span class="font-weight-light">{{ surveyTitle }}</span>
        </h2>
        <h2 class="title font-weight-regular mb-1">
          Letter:
          <span class="font-weight-light">{{ letterTitle }}</span>
        </h2>
        <h2 class="title font-weight-regular mb-5">
          Last Update:
          <span class="font-weight-light">{{ lastUpdate | dateAndTime }}</span>
        </h2>
      </v-flex>
    </v-layout>

    <v-layout v-if="!tableEditModeOn" row wrap>
      <v-flex xs9>
        <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
      </v-flex>
      <v-flex v-if="!isFrozen" xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="editTable">
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
      <v-flex xs9>
        <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
      </v-flex>
      <v-flex v-if="!isFrozen" xs3 class="text-xs-right">
        <v-btn color="success" dark @click="saveTableEdits">
          Save Table Edits
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
                    @change="onCheckboxChange"
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
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";
import _ from "lodash";

//import LetterTextArea from "../components/LetterTextArea.vue";
//import StaticLetterElement from "../components/StaticLetterElement.vue";
import AssociationTableInfoForm from "../components/AssociationTableInfoForm.vue";

//import { LetterElementMenuItemType, LetterElementType, LetterElementEnum } from "./letter-element.types";

import {
  //ScriptureEngagementPractice,
  TableData,
  SpiritualFocusOrientation,
  AssociationTableHeader
} from "../types/association-table.types";

//import { ONE_PREDICTION_TABLE_QUERY } from "@/graphql/prediction-tables.graphql";
//import { ONE_SURVEY_QUERY } from "@/graphql/surveys.graphql";
//import { ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY } from "@/graphql/scripture-engagement-practices.graphql";

//import { OneTable } from "@/graphql/types/OneTable";

//import { OneSurvey } from "@/graphql/types/OneSurvey";

//import { ScriptureEngagementPractices } from "@/graphql/types/ScriptureEngagementPractices";

import { ONE_LETTER_QUERY } from "@/graphql/letters.graphql";
import { REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION } from "@/graphql/prediction-tables.graphql";

import {
  OneLetter,
  OneLetter_letter_tableEntries,
  OneLetter_letter_scriptureEngagementPractices,
  OneLetter_letter_survey_surveyDimensions
} from "@/graphql/types/OneLetter";

@Component({
  components: { AssociationTableInfoForm },
  apollo: {
    predictionTable: {
      query: ONE_LETTER_QUERY,
      variables() {
        return {
          letterId: parseInt(this.$route.params.letterId)
        };
      },
      update(oneLetter: OneLetter) {
        // const elements = oneSurvey.surveyLetter.letter
        //   .elements as LetterElement[];
        // for (let box of elements) {
        //   box.editModeOn = false;
        //   box.isNew = false;
        // }
        console.log("letter data: ", oneLetter);
        this.letterId = oneLetter.letter.id;
        this.isFrozen = oneLetter.letter.isFrozen;
        this.surveyTitle = oneLetter.letter.survey.title;
        this.lastUpdate = oneLetter.letter.updated;
        this.letterTitle = oneLetter.letter.title;
        // construct headers
        this.tableColumns = [];
        this.headers = [];
        this.headers.push({
          text: "SE Practice",
          align: "left",
          sortable: true,
          value: "practice"
        });
        let surveyDimensions: OneLetter_letter_survey_surveyDimensions = _.orderBy(
          oneLetter.letter.survey.surveyDimensions,
          "sequence"
        );
        surveyDimensions.forEach(dimension => {
          if (dimension.useForPredictions) {
            dimension.surveyIndices.forEach(index => {
              //this.tableColumns.push(index);
              this.headers.push({
                text: index.abbreviation,
                align: "left",
                sortable: true,
                value: "columnId-" + index.id // unique id for this index
              });
            });
          }
        });
        console.log("headers: ", this.headers);

        let scriptureEngagementPractices: OneLetter_letter_scriptureEngagementPractices = _.orderBy(
          oneLetter.letter.scriptureEngagementPractices,
          "sequence"
        );

        let tableEntriesDict = {};
        scriptureEngagementPractices.forEach(practice => {
          tableEntriesDict[practice.id] = [];
        });
        oneLetter.letter.tableEntries.forEach(entry => {
          tableEntriesDict[entry.practice.id].push(
            "columnId-" + entry.surveyIndex.id
          );
        });
        console.log("table entries dict: ", tableEntriesDict);

        this.tableData = [];
        scriptureEngagementPractices.forEach(practice => {
          let idDict: any = {};
          this.headers.forEach(header => {
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

        return oneLetter.letter.tableEntries;
      },
      skip() {
        console.log("skipping fetch of letter data....");
        return this.$route.params.letterId === undefined;
      }
    }
  }
})
export default class AssociationTable extends Vue {
  tableEntries: OneLetter_letter_tableEntries | null = null;
  //survey: OneSurvey | null = null;
  //scriptureEngagementPractices: ScriptureEngagementPractices | null = null;

  tableColumns: SpiritualFocusOrientation[] = [];
  tableData: TableData[] = [];
  headers: AssociationTableHeader[] = [];
  oldHeaders: AssociationTableHeader[] = [];

  tableEditModeOn: boolean = false;

  //isNew: boolean = false; // true if this is a new table association
  //editModeOn: boolean = false;
  title: string = "";
  surveyTitle: string = "";
  letterTitle: string = "";
  letterId: number | null = null;
  //surveyId: number = -1;
  lastUpdate: string = "";
  //id: number = -1;

  isFrozen: boolean = false;

  /* toggleEditMode() {
    this.editModeOn = true;
  } */

  /* saveInfo() {
    // save the letter info (title, etc....maybe do this in the child component and reload the page?)
    this.editModeOn = false;
  } */

  editTable() {
    this.tableEditModeOn = true;
  }

  saveTableEdits() {
    // save edits to db....
    this.tableEditModeOn = false;
    //console.log(this.tableData);
    //let scriptureEngagementPracticeData: ScriptureEngagementPractice[] = [];
    //let spiritualFocusOrientationIds: number[] = [];
    let partialPredictionTableEntries = [];
    for (let tableRow of this.tableData) {
      //spiritualFocusOrientationIds = [];
      //https://stackoverflow.com/questions/16174182/typescript-looping-through-a-dictionary
      Object.entries(tableRow.spiritualFocusOrientationIdDict).forEach(
        ([key, value]) => {
          //console.log(key, value);
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
      // scriptureEngagementPracticeData.push({
      //   id: tableRow.practiceId,
      //   order: tableRow.practiceOrder,
      //   title: tableRow.practice,
      //   spiritualFocusOrientationIds: spiritualFocusOrientationIds
      // });
    }
    //console.log("data ready to be saved: ", scriptureEngagementPracticeData);
    console.log("partialPredictionTableEntries", partialPredictionTableEntries);

    /*
    let replaceInput = {
      letterId: this.letterId,

    }
    */
    this.$apollo
      .mutate({
        mutation: REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION,
        variables: {
          replaceInput: {
            letterId: this.letterId,
            entries: partialPredictionTableEntries
          }
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
      });
  }

  onCheckboxChange() {
    //console.log(this.tableData);
    //could use this to save data every time a change is made....
  }

  // constructTable(scriptureEngagementPractices: ScriptureEngagementPractice[]) {
  //   // the data come in from the db in ScriptureEngagementPractice[] format, but we need to create a new
  //   // data type (TableData) in order to display the data conveniently in a table; when we go to save the data, we
  //   // revert back to the ScriptureEngagementPractice[] data type; the source for truth (up to this point)
  //   // in the page is this.tableData, which is of the TableData type
  //   axios
  //     .get("http://localhost:4000/spiritual-foci-orientations/")
  //     .then((response: AxiosResponse) => {
  //       this.tableColumns = _.orderBy(response.data, "order");
  //       // construct headers for data table
  //       this.oldHeaders.push({
  //         text: "SE Practice",
  //         align: "left",
  //         sortable: true,
  //         value: "practice"
  //       });
  //       for (let col of this.tableColumns) {
  //         this.oldHeaders.push({
  //           text: col.abbr,
  //           align: "left",
  //           sortable: true,
  //           value: "columnId-" + col.id
  //         });
  //       }

  //       /* let newDataRowObject: any = {};
  //       let colKey: string = "";
  //       let idDict: any = {};
  //       for (let row of scriptureEngagementPractices) {
  //         newDataRowObject = {};
  //         newDataRowObject.practice = row.title;
  //         newDataRowObject.practiceId = row.id; // added so that we can figure out which practice this is when we go to save the data
  //         newDataRowObject.practiceOrder = row.order; // added so we know the original ordering...not sure if we will allow this to change
  //         idDict = {};
  //         for (let column of this.tableColumns) {
  //           idDict[
  //             "columnId-" + column.id
  //           ] = row.spiritualFocusOrientationIds.includes(column.id);
  //         }
  //         newDataRowObject.spiritualFocusOrientationIdDict = idDict;
  //         this.tableData.push(newDataRowObject);
  //       }
  //       console.log("table: ", this.tableData);
  //       console.log("old headers: ", this.oldHeaders); */

  //     });
  // }

  // assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
  mounted() {
    /* console.log("route param: ", this.$route.params.id);
    if (this.$route.params.id === undefined) {
      // launch form for creating a new letter
      //this.editModeOn = true;
      this.tableEditModeOn = false;
      //this.isNew = true;
      axios
        .get("http://localhost:4000/scripture-engagement-practices/")
        .then((response: AxiosResponse) => {
          console.log(response.data);
          let scriptureEngagementPractices: ScriptureEngagementPractice[] = [];
          response.data.forEach((practice: any) => {
            scriptureEngagementPractices.push({
              id: practice.id,
              order: practice.order,
              title: practice.title,
              spiritualFocusOrientationIds: []
            });
          });
          scriptureEngagementPractices = _.orderBy(
            scriptureEngagementPractices,
            "order"
          );
          this.constructTable(scriptureEngagementPractices);
        });
    } else {
      axios
        .get(
          "http://localhost:4000/boolean-associations/" + this.$route.params.id
        )
        .then((response: AxiosResponse) => {
          //console.log(response);
          let scriptureEngagementPractices: ScriptureEngagementPractice[] = [];
          response.data.scriptureEngagementPractices.forEach(
            (practice: any) => {
              scriptureEngagementPractices.push(practice);
            }
          );
          scriptureEngagementPractices = _.orderBy(
            scriptureEngagementPractices,
            "order"
          );
          this.title = response.data.title;
          //this.surveyTitle = response.data.surveyTitle;
          //this.lastUpdate = response.data.lastUpdate;
          this.id = response.data.id;
          this.surveyId = response.data.surveyId;
          this.isFrozen = response.data.isFrozen;
          this.constructTable(scriptureEngagementPractices);
        });
    } */
  }
}
</script>
