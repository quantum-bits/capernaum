<template>
  <v-container>
    <prediction-table-edit
      v-if="tableEditModeOn"
      :headers="headers"
      :table-data="tableData"
    />
    <prediction-table-show v-else :headers="headers" :table-data="tableData" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import {
  AssociationTableHeader,
  SpiritualFocusOrientation,
  AssociationTableData,
} from "./prediction-table.types";
import { REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION } from "@/graphql/prediction-tables.graphql";
import { PartialPredictionTableEntry } from "@/graphql/types/globalTypes";
import PredictionTableShow from "./PredictionTableShow.vue";
import PredictionTableEdit from "./PredictionTableEdit.vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import { ALL_SCRIPTURE_ENGAGEMENT_PRACTICES } from "@/graphql/scripture-engagement-practices.graphql";
import { ScriptureEngagementPractices_scriptureEngagementPractices } from "@/graphql/types/ScriptureEngagementPractices";

interface AssociationTableHeader {
  text: string; // text for the column
  value: string; // "practice" for the first column; "columnId-id" for the rest, where id is the id of the spiritual focus/orientation in the db
  align: string; // e.g., "left"
  sortable: boolean; // whether or not the column is sortable
}

type AssociationTableDatum = { [key: string]: boolean };

interface AssociationTableContent {
  headers: AssociationTableHeader[];
  data: AssociationTableDatum[];
}

export default Vue.extend({
  name: "SurveyPredictionsTab",

  components: {
    PredictionTableEdit,
    PredictionTableShow,
  },

  props: {
    survey: {
      type: {} as () => AllCapernaumSurveys_surveys,
      required: true,
    },
  },

  data() {
    return {
      associationTable: {} as AssociationTableContent,
      scriptureEngagementPractices:
        [] as ScriptureEngagementPractices_scriptureEngagementPractices[],

      originalTableData: [],
      tableEditModeOn: false,
    };
  },

  apollo: {
    scriptureEngagementPractices: {
      query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
    },
  },

  mounted() {
    this.associationTable = {
      headers: [
        {
          text: "SE Practice",
          align: "left",
          sortable: true,
          value: "practice",
        },
      ],
      data: [],
    };

    const indexIdToColumnIdx = new Map<number, number>();

    const sortedDimensions = _.orderBy(
      this.survey.surveyDimensions,
      "sequence"
    );
    sortedDimensions.forEach((dimension) => {
      dimension.surveyIndices
        .filter((sidx) => sidx.useForPredictions)
        .forEach((surveyIndex, idx) => {
          this.associationTable.headers.push({
            text: surveyIndex.abbreviation,
            value: surveyIndex.id.toFixed(),
            align: "center",
            sortable: false,
          });
          indexIdToColumnIdx.set(surveyIndex.id, idx);
        });
    });

    const practiceIdToRowIndex = new Map<number, number>();

    this.scriptureEngagementPractices.forEach((practice, idx) => {
      practiceIdToRowIndex.set(practice.id, idx);
    });
    oneLetter.letter.tableEntries.forEach((entry) => {
      practiceIdToRowIndex[entry.practice.id].push(
        `columnId-${entry.surveyIndex.id}`
      );
    });

    this.tableData = [];
    this.scriptureEngagementPractices.forEach((practice) => {
      let idDict: IdDict = {};
      this.headers.forEach((header: AssociationTableHeader) => {
        if (header.value !== "practice") {
          idDict[header.value] = practiceIdToRowIndex[practice.id].includes(
            header.value
          );
        }
      });
      this.tableData.push({
        practice: practice.title,
        practiceId: practice.id, // added so that we can figure out which practice this is when we go to save the data
        practiceOrder: practice.sequence, // added so we know the original ordering...not sure if we will allow this to change
        spiritualFocusOrientationIdDict: idDict,
      });
    });
    console.log("table data: ", this.tableData);
    this.originalTableData = JSON.parse(JSON.stringify(this.tableData)); // this can be used later if the user clicks "cancel"
  },

  methods: {
    hideTable(): void {
      this.$emit("hide-table");
    },

    editTable(): void {
      this.tableEditModeOn = true;
    },

    cancelEdits(): void {
      this.tableData = JSON.parse(JSON.stringify(this.originalTableData));
      this.tableEditModeOn = false;
    },

    saveTableEdits(): void {
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
                sequence: 10,
              });
            }
          }
        );
      }
      console.log(
        "partialPredictionTableEntries",
        partialPredictionTableEntries
      );

      this.$apollo
        .mutate({
          mutation: REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION,
          variables: {
            replaceInput: {
              letterId: this.oneLetter?.id,
              entries: partialPredictionTableEntries,
            },
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          this.refetchLetterData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    refetchLetterData(): void {
      this.$apollo.queries.oneLetter.refetch().then(({ data }) => {
        console.log("survey data refetched! ", data);
      });
    },
  },
});

// Credits:
//   https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table
</script>
