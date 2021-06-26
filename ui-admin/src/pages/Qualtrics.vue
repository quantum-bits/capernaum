<template>
  <v-container>
    <page-header title="Qualtrics">
      <v-switch v-model="showInactive" label="Show Inactive" />
    </page-header>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="filteredSurveys">
          <template v-slot:item="{ item: survey }">
            <tr>
              <td>{{ survey.qualtricsId }}</td>
              <td>{{ survey.qualtricsName }}</td>
              <td>
                <v-chip small>
                  {{ survey.qualtricsIsActive ? "Yes" : "No" }}
                </v-chip>
              </td>
              <td>{{ survey.qualtricsModDate | standardDate }}</td>
              <td>{{ importStatus(survey) }}</td>
              <td>{{ importDate(survey) }}</td>
              <td>
                <v-chip small color="primary">
                  {{ isSurveyOutOfDate(survey) }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  small
                  v-if="!isImported(survey)"
                  @click="importQualtricsSurvey(survey.qualtricsId)"
                >
                  Import
                </v-btn>
                <v-btn small>Update</v-btn>
              </td>
            </tr>
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
import { DateTime } from "luxon";

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
        { text: "Q ID", value: "qId" },
        { text: "Q Name", value: "qName" },
        { text: "Q Active", value: "qIsActive" },
        { text: "Q Mod Date", value: "qModDate" },
        { text: "Imported", value: "isImported" },
        { text: "Import Date", value: "capCreatedDate" },
        { text: "Out of Date", value: "outOfDate" },
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

    importDate(survey: CombinedSurveys_combinedSurveys) {
      const standardDate = Vue.filter("standardDate");
      if (survey.capernaumSurvey) {
        return standardDate(survey.capernaumSurvey.createdDate);
      }
      return "";
    },

    isSurveyOutOfDate(survey: CombinedSurveys_combinedSurveys) {
      if (!survey.capernaumSurvey) {
        return false;
      }
      const qDateTime = DateTime.fromISO(survey.qualtricsModDate);
      const capDateTime = DateTime.fromISO(survey.capernaumSurvey.createdDate);
      return qDateTime > capDateTime;
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
