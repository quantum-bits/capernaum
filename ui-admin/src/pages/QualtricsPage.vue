<template>
  <v-container>
    <page-header title="Qualtrics">
      <v-switch v-model="showInactive" label="Show Inactive" />
    </page-header>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredSurveys"
          :loading="loadingSurveys > 0"
          loading-text="Loading surveys from Qualtrics"
        >
          <template v-slot:item="{ item: survey }">
            <tr>
              <td v-if="isImported(survey)">
                <router-link
                  v-bind="attrs"
                  v-on="on"
                  :to="{
                    name: 'surveys',
                    params: { surveyId: survey.capernaumSurvey.id },
                  }"
                >
                  {{ survey.qualtricsName }}
                </router-link>
              </td>
              <td v-else>
                {{ survey.qualtricsName }}
              </td>
              <td>{{ survey.qualtricsId }}</td>
              <td>
                <v-chip small :color="isActive(survey) ? 'success' : ''">
                  {{ survey.qualtricsIsActive ? "Yes" : "No" }}
                </v-chip>
              </td>
              <td>{{ survey.qualtricsModDate | standardDate }}</td>
              <td>
                <v-chip small :color="isImported(survey) ? 'success' : ''">
                  {{ isImported(survey) ? "Yes" : "No" }}
                </v-chip>
              </td>
              <td>{{ importDate(survey) }}</td>
              <td>
                <v-chip
                  v-if="isImported(survey)"
                  small
                  :color="isOutOfDate(survey) ? 'error' : 'success'"
                >
                  {{ isOutOfDate(survey) ? "Yes" : "No" }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  small
                  v-if="!isImported(survey)"
                  @click="importFromQualtrics(survey)"
                >
                  Import
                </v-btn>
                <v-btn
                  small
                  color="error"
                  v-if="isOutOfDate(survey)"
                  @click="importFromQualtrics(survey)"
                >
                  Update
                </v-btn>
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
import {
  ImportQualtricsSurvey,
  ImportQualtricsSurveyVariables,
} from "@/graphql/types/ImportQualtricsSurvey";

export default Vue.extend({
  name: "QualtricsPage",

  components: {
    PageHeader,
  },

  apollo: {
    combinedSurveys: {
      query: COMBINED_SURVEYS_QUERY,
      loadingKey: "loadingSurveys",
    },
  },

  data() {
    return {
      headers: [
        { text: "Q Name", value: "qName" },
        { text: "Q ID", value: "qId" },
        { text: "Q Active", value: "qIsActive" },
        { text: "Q Mod Date", value: "qModDate" },
        { text: "Imported?", value: "isImported" },
        { text: "Import Date" },
        { text: "Out of Date?", value: "outOfDate" },
        { text: "Actions", value: "actions" },
      ],
      combinedSurveys: [] as CombinedSurveys_combinedSurveys[],
      loadingSurveys: 0,
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

    isActive(survey: CombinedSurveys_combinedSurveys) {
      return survey.qualtricsIsActive;
    },

    isOutOfDate(survey: CombinedSurveys_combinedSurveys) {
      if (!survey.capernaumSurvey) {
        return false;
      }
      const qDateTime = DateTime.fromISO(survey.qualtricsModDate);
      const capDateTime = DateTime.fromISO(survey.capernaumSurvey.importedDate);
      return qDateTime > capDateTime;
    },

    importDate(survey: CombinedSurveys_combinedSurveys) {
      const standardDate = Vue.filter("standardDate");
      if (survey.capernaumSurvey) {
        console.log("CAP SURVEY", survey.capernaumSurvey);
        return standardDate(survey.capernaumSurvey.importedDate);
      }
      return "";
    },

    /**
     * Import (or re-import) a survey from Qualtrics
     * @param survey entry in `combinedSurveys`
     */
    importFromQualtrics(survey: CombinedSurveys_combinedSurveys) {
      this.$apollo
        .mutate<ImportQualtricsSurvey, ImportQualtricsSurveyVariables>({
          mutation: IMPORT_QUALTRICS_SURVEY,
          variables: {
            qualtricsId: survey.qualtricsId,
          },
          // fetchPolicy: "no-cache",
        })
        .then((result) => {
          console.log("IMPORT RESULT", result);
          if (result.data) {
            // Data are automatically updated by the Apollo client/cache.
            this.showSnackbar("Imported successfully");
          }
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
