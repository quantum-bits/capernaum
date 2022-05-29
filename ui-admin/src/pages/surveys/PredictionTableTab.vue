<template>
  <v-card>
    <v-card-title> Scripture Engagement Associations </v-card-title>

    <prediction-table-edit
      v-if="inEditMode"
      :association-table="associationTable"
    />
    <prediction-table-show v-else :association-table="associationTable" />

    <v-card-actions>
      <v-spacer />
      <edit-save-cancel-buttons
        :is-data-dirty="isDataDirty"
        :is-data-valid="true"
        @enter-edit-mode="inEditMode = true"
        @leave-edit-mode="inEditMode = false"
        @backup-data="backupTableContent"
        @restore-data="restoreTableContent"
        @persist-data="persistTableEdits"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import PredictionTableShow from "./PredictionTableShow.vue";
import PredictionTableEdit from "./PredictionTableEdit.vue";
import { AllCapernaumSurveys_surveys as SurveyEntity } from "@/graphql/types/AllCapernaumSurveys";
import { ALL_SCRIPTURE_ENGAGEMENT_PRACTICES } from "@/graphql/scripture-engagement-practices.graphql";
import { ScriptureEngagementPractices } from "@/graphql/types/ScriptureEngagementPractices";
import {
  UpdateAssociationTable,
  UpdateAssociationTableVariables,
} from "@/graphql/types/UpdateAssociationTable";
import { UPDATE_ASSOCIATION_TABLE } from "@/graphql/surveys.graphql";
import EditSaveCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";

interface AssociationTableHeader {
  text: string; // text for the column
  align: string; // e.g., "text-left"
}

interface AssociationTableDatum {
  indexId: number;
  practiceId: number;
  predict: boolean;
}

interface AssociationTableRow {
  title: string;
  columns: AssociationTableDatum[];
}

export interface AssociationTableContent {
  headers: AssociationTableHeader[];
  rows: AssociationTableRow[];
}

export default Vue.extend({
  name: "PredictionTableTab",

  components: {
    PredictionTableEdit,
    PredictionTableShow,
    EditSaveCancelButtons,
  },

  props: {
    survey: {
      type: Object as () => SurveyEntity,
      required: true,
    },
  },

  data() {
    return {
      associationTable: {} as AssociationTableContent,
      savedTableRows: [] as AssociationTableRow[],
      inEditMode: false,
    };
  },

  watch: {
    survey: {
      handler: function (newSurvey: SurveyEntity) {
        console.log("watched survey has changed");
        this.constructAssociationTable(newSurvey);
      },
      immediate: true,
      deep: true,
    },
  },

  computed: {
    // Returns true iff the current `associationTable.rows` are the same as `savedTableRows`.
    isDataDirty(): boolean {
      return !_.isEqual(this.associationTable.rows, this.savedTableRows);
    },
  },

  methods: {
    /**
     * Construct the association table based on the survey dimensions, indices, and items,
     * together with the list of SEPs.
     */
    async constructAssociationTable(newSurvey: SurveyEntity) {
      this.associationTable = {
        headers: [
          {
            text: "SE Practice",
            align: "text-left",
          },
        ],
        rows: [],
      };

      // Create array of survey indices that are ordered by dimension
      // and filtered to include only those used for predictions.
      const orderedActiveIndices = _.chain(newSurvey.surveyDimensions)
        .orderBy("sequence")
        .flatMap((surveyDimension) => surveyDimension.surveyIndices)
        .filter((surveyIndex) => surveyIndex.useForPredictions)
        .value();

      // Set up all the table headers. Also create a map from the survey index ID
      // to the column of the table where that index will appear.
      const indexIdToColumnIdx = new Map<number, number>();
      _.forEach(orderedActiveIndices, (surveyIndex, idx) => {
        this.associationTable.headers.push({
          text: surveyIndex.abbreviation,
          align: "text-center",
        });
        indexIdToColumnIdx.set(surveyIndex.id, idx);
      });

      // Create a row of the table for each of the SE practices. Also create a map
      // from the practice ID to the row in which that practice will appear in the table.
      const scriptureEngagementPractices =
        await this.getScriptureEngagementPractices();
      const practiceIdToRowIndex = new Map<number, number>();
      _.forEach(scriptureEngagementPractices, (sePractice, idx) => {
        const row: AssociationTableRow = {
          title: sePractice.title,
          columns: _.map(orderedActiveIndices, (index) => ({
            indexId: index.id,
            practiceId: sePractice.id,
            predict: false,
          })),
        };
        this.associationTable.rows.push(row);
        practiceIdToRowIndex.set(sePractice.id, idx);
      });

      // Iterate over the active indices again, updating those cells of the association
      // table that are currently enabled for predictions.
      _.forEach(orderedActiveIndices, (surveyIndex) => {
        _.forEach(surveyIndex.scriptureEngagementPractices, (sePractice) => {
          const tableColumn = indexIdToColumnIdx.get(surveyIndex.id);
          const tableRow = practiceIdToRowIndex.get(sePractice.id);
          if (tableRow !== undefined && tableColumn !== undefined) {
            const datum =
              this.associationTable.rows[tableRow].columns[tableColumn];
            datum.predict = true;
          } else {
            throw new Error(
              `No mapping for [${surveyIndex.id}][${sePractice.id}]`
            );
          }
        });
      });

      this.backupTableContent();
    },

    logSavedTable() {
      const allRows: { [index: string]: string[] } = {};
      for (const row of this.savedTableRows) {
        allRows[row.title] = _.map(
          row.columns,
          (col) => `${col.indexId}:${col.predict ? "YES" : ""}`
        );
      }
      console.table(allRows);
    },

    backupTableContent() {
      this.savedTableRows = _.cloneDeep(this.associationTable.rows);
      this.logSavedTable();
    },

    restoreTableContent() {
      this.associationTable.rows = _.cloneDeep(this.savedTableRows);
    },

    // Return all data entries from an array of rows.
    allEntries(rows: AssociationTableRow[]): AssociationTableDatum[] {
      return _.flatMap(rows, (row) => row.columns);
    },

    persistTableEdits() {
      // Fish out the entries that are different from the last-saved set of entries.
      const changedEntries = _.differenceWith(
        this.allEntries(this.associationTable.rows),
        this.allEntries(this.savedTableRows),
        _.isEqual // Deep comparison
      );
      console.log("CHANGED", JSON.stringify(changedEntries));

      return this.$apollo
        .mutate<UpdateAssociationTable, UpdateAssociationTableVariables>({
          mutation: UPDATE_ASSOCIATION_TABLE,
          variables: {
            updates: changedEntries,
          },
        })
        .then((result) => {
          console.log(result);
          this.backupTableContent();
          this.inEditMode = false;
        });
    },

    getScriptureEngagementPractices() {
      return this.$apollo
        .query<ScriptureEngagementPractices>({
          query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
        })
        .then((result) =>
          _.sortBy(result.data.scriptureEngagementPractices, ["title"])
        );
    },
  },
});

// Credits:
//   https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table
</script>
