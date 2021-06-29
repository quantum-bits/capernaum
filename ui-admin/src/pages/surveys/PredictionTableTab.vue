<template>
  <v-container>
    <prediction-table-edit
      v-if="tableEditModeOn"
      :association-table="associationTable"
    />
    <prediction-table-show v-else :association-table="associationTable" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION } from "@/graphql/prediction-tables.graphql";
import { PartialPredictionTableEntry } from "@/graphql/types/globalTypes";
import PredictionTableShow from "./PredictionTableShow.vue";
import PredictionTableEdit from "./PredictionTableEdit.vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import { ALL_SCRIPTURE_ENGAGEMENT_PRACTICES } from "@/graphql/scripture-engagement-practices.graphql";
import { ScriptureEngagementPractices } from "@/graphql/types/ScriptureEngagementPractices";

interface AssociationTableHeader {
  text: string; // text for the column
  value: string; // "practice" for the first column; "columnId-id" for the rest, where id is the id of the spiritual focus/orientation in the db
  align: string; // e.g., "left"
  sortable: boolean; // whether or not the column is sortable
}

type AssociationTableDatum = { [key: string]: boolean | number };
type AssociationTableRow = AssociationTableDatum[];

export interface AssociationTableContent {
  headers: AssociationTableHeader[];
  data: AssociationTableRow[];
}

export default Vue.extend({
  name: "PredictionTableTab",

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
      originalTableData: [] as AssociationTableRow[],
      tableEditModeOn: false,
    };
  },

  async mounted() {
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

    const sepResult = await this.readScriptureEngagementPractices();
    const scriptureEngagementPractices =
      sepResult.data.scriptureEngagementPractices;

    const orderedActiveIndices = _.chain(this.survey.surveyDimensions)
      .orderBy("sequence")
      .flatMap((surveyDimension) => surveyDimension.surveyIndices)
      .filter((surveyIndex) => surveyIndex.useForPredictions)
      .value();

    const indexIdToColumnIdx = new Map<number, number>();
    _.forEach(orderedActiveIndices, (surveyIndex, idx) => {
      this.associationTable.headers.push({
        text: surveyIndex.abbreviation,
        value: surveyIndex.id.toFixed(),
        align: "center",
        sortable: false,
      });
      indexIdToColumnIdx.set(surveyIndex.id, idx);
    });
    const columnCount = indexIdToColumnIdx.size;

    const practiceIdToRowIndex = new Map<number, number>();
    _.forEach(scriptureEngagementPractices, (practice, idx) => {
      const row: AssociationTableRow = [];
      _.times(columnCount, () => row.push({ predict: false }));
      this.associationTable.data.push(row);
      practiceIdToRowIndex.set(practice.id, idx);
    });

    _.forEach(orderedActiveIndices, (surveyIndex) => {
      _.forEach(surveyIndex.predictionTableEntries, (pte) => {
        const tableColumn = indexIdToColumnIdx.get(surveyIndex.id);
        const tableRow = practiceIdToRowIndex.get(pte.practice.id);
        if (tableRow && tableColumn) {
          const datum = this.associationTable.data[tableRow][tableColumn];
          datum.predict = true;
          datum.indexId = surveyIndex.id;
          datum.practiceId = pte.practice.id;
        }
      });
    });

    console.log(JSON.stringify(this.associationTable, null, 2));
    console.log(practiceIdToRowIndex);
    console.log(indexIdToColumnIdx);

    this.originalTableData = [...this.associationTable.data];
  },

  methods: {
    hideTable(): void {
      this.$emit("hide-table");
    },

    editTable(): void {
      this.tableEditModeOn = true;
    },

    cancelEdits(): void {
      this.associationTable.data = this.originalTableData;
      this.tableEditModeOn = false;
    },

    readScriptureEngagementPractices() {
      return this.$apollo.query<ScriptureEngagementPractices>({
        query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
      });
    },

    saveTableEdits(): void {
      // save edits to db....
      this.tableEditModeOn = false;
      let partialPredictionTableEntries: PartialPredictionTableEntry[] = [];
      // for (let tableRow of this.tableData) {
      //   //https://stackoverflow.com/questions/16174182/typescript-looping-through-a-dictionary
      //   Object.entries(tableRow.spiritualFocusOrientationIdDict).forEach(
      //     ([key, value]) => {
      //       if (value) {
      //         // the focus/orientation ids are part of the key in the spiritualFocusOrientationIdDict object
      //         // (e.g., "columnId-2" means the focus/orientation id is 2);
      //         // if the value is true, the id is harvested from the key and saved to an array
      //         let id: number = +key.split("columnId-")[1];
      //         //spiritualFocusOrientationIds.push(id);
      //         partialPredictionTableEntries.push({
      //           surveyIndexId: id,
      //           practiceId: tableRow.practiceId,
      //           // hard-coding the sequence for now....
      //           sequence: 10,
      //         });
      //       }
      //     }
      //   );
      // }
      console.log(
        "partialPredictionTableEntries",
        partialPredictionTableEntries
      );

      this.$apollo
        .mutate({
          mutation: REPLACE_PREDICTION_TABLE_ENTRIES_MUTATION,
          variables: {
            replaceInput: {
              letterId: 42, //this.oneLetter?.id,
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
