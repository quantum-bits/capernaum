<template>
  <v-card>
    <v-card-title>
      Scripture Engagement Associations
      <v-spacer />
      <v-btn color="primary" :disabled="inEditMode" @click="enterEditMode">
        Edit
      </v-btn>
      <v-btn
        color="warning"
        class="mx-2"
        :disabled="!inEditMode || noUnsavedChanges"
        @click="saveTableEdits"
      >
        Save
      </v-btn>
      <v-btn :disabled="!inEditMode" @click="cancelEditMode"> Cancel </v-btn>
    </v-card-title>

    <prediction-table-edit
      v-if="inEditMode"
      :association-table="associationTable"
    />

    <prediction-table-show v-else :association-table="associationTable" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import PredictionTableShow from "./PredictionTableShow.vue";
import PredictionTableEdit from "./PredictionTableEdit.vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import { ALL_SCRIPTURE_ENGAGEMENT_PRACTICES } from "@/graphql/scripture-engagement-practices.graphql";
import { ScriptureEngagementPractices } from "@/graphql/types/ScriptureEngagementPractices";

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
  },

  props: {
    survey: {
      type: Object as () => AllCapernaumSurveys_surveys,
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

  computed: {
    // Returns true iff the current `associationTable.rows` are the same as `savedTableRows`.
    noUnsavedChanges(): boolean {
      return _.isEqual(this.associationTable.rows, this.savedTableRows);
    },
  },

  /**
   * Do most of the heavy lifting in this lifecycle event. Using the `apollo` option
   * was more trouble than it was worth.
   */
  async mounted() {
    this.associationTable = {
      headers: [{ text: "SE Practice", align: "text-left" }],
      rows: [],
    };

    // Read SE practices.
    const _sepResult = await this.readScriptureEngagementPractices();
    const scriptureEngagementPractices =
      _sepResult.data.scriptureEngagementPractices;

    // Create array of survey indices that are ordered by dimension
    // and filtered to include only those used for predictions.
    const orderedActiveIndices = _.chain(this.survey.surveyDimensions)
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
    const practiceIdToRowIndex = new Map<number, number>();
    _.forEach(scriptureEngagementPractices, (practice, idx) => {
      const row: AssociationTableRow = {
        title: practice.title,
        columns: _.map(orderedActiveIndices, (index) => ({
          indexId: index.id,
          practiceId: practice.id,
          predict: false,
        })),
      };
      this.associationTable.rows.push(row);
      practiceIdToRowIndex.set(practice.id, idx);
    });

    // Iterate over the active indices again, updating those cells of the association
    // table that are currently enabled for predictions.
    _.forEach(orderedActiveIndices, (surveyIndex) => {
      _.forEach(surveyIndex.scriptureEngagementPractices, (sePractice) => {
        const tableColumn = indexIdToColumnIdx.get(surveyIndex.id);
        const tableRow = practiceIdToRowIndex.get(sePractice.id);
        if (tableRow && tableColumn) {
          const datum =
            this.associationTable.rows[tableRow].columns[tableColumn];
          datum.predict = true;
        }
      });
    });

    this.saveTableRows();
  },

  methods: {
    enterEditMode(): void {
      this.inEditMode = true;
    },

    cancelEditMode(): void {
      this.restoreTableRows();
      this.inEditMode = false;
    },

    saveTableRows() {
      this.savedTableRows = _.cloneDeep(this.associationTable.rows);
    },

    restoreTableRows() {
      this.associationTable.rows = _.cloneDeep(this.savedTableRows);
    },

    readScriptureEngagementPractices() {
      return this.$apollo.query<ScriptureEngagementPractices>({
        query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
      });
    },

    // Return all data entries from an array of rows.
    allEntries(rows: AssociationTableRow[]): AssociationTableDatum[] {
      return _.flatMap(rows, (row) => row.columns);
    },

    saveTableEdits() {
      // Fish out the entries that are different from the last-saved set of entries.
      const changedEntries = _.differenceWith(
        this.allEntries(this.associationTable.rows),
        this.allEntries(this.savedTableRows),
        _.isEqual // Deep comparison
      );
      console.log("CHANGED", JSON.stringify(changedEntries));

      this.saveTableRows();
      this.inEditMode = false;
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
