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
        <v-card>
          <v-card-title>
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              clearable
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="combinedSurveys"
            :search="search"
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
                v-if="item.isImported && item.hasReference"
                @click="showReason(item)"
                color="info"
                text-color="white"
                small
              >
                <v-icon small left>mdi-help-circle</v-icon>
                Can't remove
              </v-chip>

              <v-chip
                v-else-if="item.isImported"
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
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>

    <v-bottom-sheet v-model="bottomSheet.visible" inset>
      <v-sheet class="text-center" height="200px">
        <v-btn
          class="my-6"
          color="success"
          @click="bottomSheet.visible = false"
        >
          <v-icon left>mdi-close</v-icon>
          Close
        </v-btn>
        <div>{{ bottomSheet.content }}</div>
      </v-sheet>
    </v-bottom-sheet>
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
  isImported: boolean;

  // Stats on other entities that have this one as a FK.
  hasReference: boolean;
  letterCount: number;
  dimensionCount: number;
  responseCount: number;
}

import {
  ALL_QUALTRICS_SURVEYS_QUERY,
  ALL_SURVEYS_QUERY,
  DELETE_SURVEY,
  IMPORT_QUALTRICS_SURVEY
} from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import { QualtricsSurveys_qualtricsSurveys as QualtricsSurvey } from "@/graphql/types/QualtricsSurveys";
import pluralize from "pluralize";

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
      search: "",

      snackbar: {
        text: "",
        visible: false
      },

      bottomSheet: {
        content: "",
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
          combinedSurvey.hasReference = false;
          combinedSurvey.isImported = false;
        }
        return combinedSurvey;
      }

      for (let capSurvey of this.surveys) {
        const combinedSurvey = getCombinedSurvey(capSurvey.qualtricsId);
        combinedSurvey.capId = capSurvey.id;
        combinedSurvey.isImported = true;

        // Does this survey have a reference from a letter-related entity?
        // Note that we do not check for survey items because these are
        // owned by the survey itself and are not added when creating a letter,
        // adding survey dimensions, etc.
        combinedSurvey.letterCount = capSurvey.letters
          ? capSurvey.letters.length
          : 0;
        combinedSurvey.dimensionCount = capSurvey.surveyDimensions
          ? capSurvey.surveyDimensions.length
          : 0;
        combinedSurvey.responseCount = capSurvey.surveyResponses
          ? capSurvey.surveyResponses.length
          : 0;

        combinedSurvey.hasReference =
          combinedSurvey.letterCount +
            combinedSurvey.dimensionCount +
            combinedSurvey.responseCount >
          0;
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
          },
          refetchQueries: ["AllSurveys", "QualtricsSurveys"]
        })
        .then(result => {
          console.log("IMPORT RESULT", result);
          this.showSnackbar("Imported successfully");
        })
        .catch(error => this.showSnackbar(error));
    },

    literateJoin(phrases: string[]) {
      switch (phrases.length) {
        case 0:
          throw Error("No phrases");
        case 1:
          return phrases[0];
        case 2:
          return phrases.join(" and ");
        default: {
          const lastPhrase = phrases.pop();
          return phrases.join(", ") + `, and ${lastPhrase}`;
        }
      }
    },

    showReason(item: CombinedSurvey) {
      const details = [];
      if (item.letterCount > 0) {
        details.push(
          `${item.letterCount} related ${pluralize("letter", item.letterCount)}`
        );
      }
      if (item.dimensionCount > 0) {
        details.push(
          `${item.dimensionCount} survey ${pluralize(
            "dimension",
            item.dimensionCount
          )}`
        );
      }
      if (item.responseCount > 0) {
        details.push(
          `${item.responseCount} imported ${pluralize(
            "response",
            item.responseCount
          )}`
        );
      }
      this.bottomSheet.content = `This imported survey has ${this.literateJoin(
        details
      )}`;
      this.bottomSheet.visible = true;
    },

    deleteSurvey(id: number) {
      this.$apollo
        .mutate({
          mutation: DELETE_SURVEY,
          variables: {
            id
          },
          refetchQueries: ["AllSurveys", "QualtricsSurveys"]
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
