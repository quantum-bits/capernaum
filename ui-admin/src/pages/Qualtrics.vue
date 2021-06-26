<template>
  <v-container>
    <page-header title="Qualtrics">
      <v-switch v-model="showInactive" label="Show Inactive" />
    </page-header>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="filteredSurveys">
          <template v-slot:[`item.qualtricsModDate`]="{ item }">
            {{ item.qualtricsModDate | standardDate }}
          </template>
          <template v-slot:[`item.qualtricsIsActive`]="{ item }">
            {{ item.qualtricsIsActive ? "Yes" : "No" }}
          </template>
          <template v-slot:[`item.importStatus`]="{ item }">
            {{ importStatus(item) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              small
              v-if="!isImported(item)"
              @click="importQualtricsSurvey(item.qualtricsId)"
            >
              Import
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import {
  COMBINED_SURVEYS_QUERY,
  IMPORT_QUALTRICS_SURVEY,
} from "@/graphql/surveys.graphql";
import PageHeader from "@/pages/PageHeader.vue";
import { CombinedSurveys_combinedSurveys } from "@/graphql/types/CombinedSurveys";

export default Vue.extend({
  name: "Qualtrics",

  components: {
    PageHeader,
  },

  apollo: {
    combinedSurveys: {
      query: COMBINED_SURVEYS_QUERY,
    },
  },

  data() {
    return {
      headers: [
        { text: "Q ID", value: "qualtricsId" },
        { text: "Q Name", value: "qualtricsName" },
        { text: "Q Mod Date", value: "qualtricsModDate" },
        { text: "Q Active", value: "qualtricsIsActive" },
        { text: "Imported", value: "importStatus" },
        { text: "Import Date", value: "capernaumSurvey.createdDate" },
        { text: "Actions", value: "actions" },
      ],
      combinedSurveys: [] as CombinedSurveys_combinedSurveys[],
      showInactive: false,

      snackbar: {
        text: "",
        visible: false,
      },
    };
  },

  computed: {
    filteredSurveys(): CombinedSurveys_combinedSurveys[] {
      return this.combinedSurveys.filter(
        (survey) => this.showInactive || survey.qualtricsIsActive
      );
    },
  },

  methods: {
    isImported(survey: CombinedSurveys_combinedSurveys) {
      return !!survey.capernaumSurvey?.id;
    },

    importStatus(survey: CombinedSurveys_combinedSurveys) {
      return this.isImported(survey)
        ? `Yes (PK=${survey.capernaumSurvey?.id})`
        : "No";
    },

    importQualtricsSurvey(qualtricsSurveyId: string) {
      this.$apollo
        .mutate({
          mutation: IMPORT_QUALTRICS_SURVEY,
          variables: {
            qualtricsId: qualtricsSurveyId,
          },
          refetchQueries: ["AllSurveys", "QualtricsSurveys"],
        })
        .then((result) => {
          console.log("IMPORT RESULT", result);
          this.showSnackbar("Imported successfully");
        })
        .catch((error) => this.showSnackbar(error));
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },
  },
});
</script>
