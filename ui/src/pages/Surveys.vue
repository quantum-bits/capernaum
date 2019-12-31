<template>
  <v-container>
    <v-row class="align-baseline justify-space-between">
      <v-col cols="6">
        <h1 class="headline mb-5">Surveys</h1>
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="showAllSurveys" label="Show All" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="combinedSurveys"
          class="elevation-1"
        >
          <template v-slot:item.qualtricsIsActive="{ item }">
            <v-icon color="success" v-if="item.qualtricsIsActive">
              mdi-check
            </v-icon>
            <v-icon color="warning" v-else>
              mdi-minus
            </v-icon>
          </template>
          <template v-slot:item.action="{ item }">
            <v-chip
              v-if="item.capId"
              @click="deleteSurvey(item.capId)"
              color="warning"
              text-color="white"
              small
            >
              <v-icon small left>mdi-delete</v-icon>
              Remove
            </v-chip>
            <v-chip
              v-else
              @click="importQualtricsSurvey(item.qualtricsId)"
              color="primary"
              text-color="white"
              small
            >
              <v-icon small left>mdi-arrow-down-bold-circle</v-icon>
              Import
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

interface CombinedSurvey {
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;

  capId: number | null;
}

import {
  ALL_QUALTRICS_SURVEYS_QUERY,
  ALL_SURVEYS_QUERY,
  DELETE_SURVEY,
  IMPORT_QUALTRICS_SURVEY
} from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import { QualtricsSurveys_qualtricsSurveys as QualtricsSurvey } from "@/graphql/types/QualtricsSurveys";

export default Vue.extend({
  name: "Surveys",

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update: data => data.surveys,
      fetchPolicy: "network-only"
    },

    qualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY,
      variables: {
        includeInactive: true
      },
      update: data => data.qualtricsSurveys,
      fetchPolicy: "network-only"
    }
  },

  data() {
    return {
      surveys: [] as Survey[],
      qualtricsSurveys: [] as QualtricsSurvey[],
      showAllSurveys: false,

      snackbar: {
        text: "",
        visible: false
      },

      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "qualtricsName"
        },
        {
          text: "Cap ID",
          value: "capId"
        },
        {
          text: "Qualtrics ID",
          value: "qualtricsId"
        },
        {
          text: "Last Update",
          value: "qualtricsModDate"
        },
        {
          text: "Active",
          value: "qualtricsIsActive"
        },
        {
          text: "Action",
          value: "action",
          align: "center"
        }
      ]
    };
  },

  computed: {
    combinedSurveys(): CombinedSurvey[] {
      const combinedSurveyMap: Map<string, CombinedSurvey> = new Map();

      function getCombinedSurvey(key: string) {
        let combinedSurvey = combinedSurveyMap.get(key);
        if (!combinedSurvey) {
          combinedSurvey = {} as CombinedSurvey;
          combinedSurveyMap.set(key, combinedSurvey);
        }
        return combinedSurvey;
      }

      for (let capSurvey of this.surveys) {
        const combinedSurvey = getCombinedSurvey(capSurvey.qualtricsId);
        combinedSurvey.capId = capSurvey.id;
      }

      for (let qualtricsSurvey of this.qualtricsSurveys) {
        const combinedSurvey = getCombinedSurvey(qualtricsSurvey.qualtricsId);
        combinedSurvey.qualtricsId = qualtricsSurvey.qualtricsId;
        combinedSurvey.qualtricsIsActive = qualtricsSurvey.qualtricsIsActive;
        combinedSurvey.qualtricsModDate = qualtricsSurvey.qualtricsModDate;
        combinedSurvey.qualtricsName = qualtricsSurvey.qualtricsName;
      }

      return Array.from(combinedSurveyMap.values()).filter(
        survey =>
          survey.capId || survey.qualtricsIsActive || this.showAllSurveys
      );
    }
  },

  methods: {
    importQualtricsSurvey(qualtricsSurveyId: string) {
      this.$apollo
        .mutate({
          mutation: IMPORT_QUALTRICS_SURVEY,
          variables: {
            qualtricsId: qualtricsSurveyId
          }
        })
        .then(result => {
          console.log("IMPORT RESULT", result);
          this.showSnackbar("Imported successfully");
        })
        .catch(error => this.showSnackbar(error));
    },

    deleteSurvey(id: number) {
      this.$apollo
        .mutate({
          mutation: DELETE_SURVEY,
          variables: {
            id
          }
        })
        .then(result => {
          console.log("DELETE RESULT", result);
          this.showSnackbar("Deleted successfully");
        })
        .catch(error => this.showSnackbar(error));
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    }
  }
});
</script>
