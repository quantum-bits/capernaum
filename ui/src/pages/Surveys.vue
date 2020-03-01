<template>
  <v-container>
    <v-row class="align-baseline justify-space-between">
      <v-col cols="6">
        <h1 class="headline mb-5">Surveys</h1>
      </v-col>
      <v-col cols="2">
        <v-switch v-model="showAllSurveys" label="Show All" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-iterator
          :items="combinedSurveys"
          :search="searchFor"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
        >
          <template v-slot:header>
            <v-toolbar>
              <v-text-field
                v-model="searchFor"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                clearable
                hide-details
              />
              <v-spacer />
              <v-select
                v-model="sortBy"
                flat
                hide-details
                :items="sortCriteria"
                label="Sort by"
              />
              <v-btn-toggle v-model="sortDesc" mandatory>
                <v-btn class="ml-2" icon :value="false">
                  <v-icon>mdi-sort-ascending</v-icon>
                </v-btn>
                <v-btn icon :value="true">
                  <v-icon>mdi-sort-descending</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.qualtricsId"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card>
                  <v-toolbar>
                    <v-toolbar-title>{{ item.qualtricsName }}</v-toolbar-title>
                    <v-spacer />
                    <v-tooltip top v-if="item.qualtricsIsActive">
                      <template v-slot:activator="{ on }">
                        <v-chip v-on="on" color="info" text-color="white" small>
                          Active
                        </v-chip>
                      </template>
                      <span>Survey is active on Qualtrics</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.isImported">
                      <template v-slot:activator="{ on }">
                        <v-chip
                          v-on="on"
                          class="ml-2"
                          color="info"
                          text-color="white"
                          small
                        >
                          Imported
                        </v-chip>
                      </template>
                      <span>Survey is imported into Capernaum</span>
                    </v-tooltip>
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-tooltip left :disabled="disableImport(item)">
                          <template v-slot:activator="{ on }">
                            <v-list-item
                              v-on="on"
                              :disabled="disableImport(item)"
                              @click="
                                importQualtricsSurvey(item.qualtricsId, false)
                              "
                            >
                              <v-list-item-title>Import</v-list-item-title>
                            </v-list-item>
                          </template>
                          <span>Import from Qualtrics</span>
                        </v-tooltip>

                        <v-tooltip left :disabled="disableUpdate(item)">
                          <template v-slot:activator="{ on }">
                            <v-list-item
                              v-on="on"
                              :disabled="disableUpdate(item)"
                              @click="
                                importQualtricsSurvey(item.qualtricsId, true)
                              "
                            >
                              <v-list-item-title>Update</v-list-item-title>
                            </v-list-item>
                          </template>
                          <span>Update from Qualtrics</span>
                        </v-tooltip>

                        <v-tooltip left :disabled="disableRemove(item)">
                          <template v-slot:activator="{ on }">
                            <v-list-item
                              v-on="on"
                              :disabled="disableRemove(item)"
                              @click="deleteSurvey(item.capId)"
                            >
                              <v-list-item-title>
                                Remove
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span>
                            Remove from Capernaum (no change on Qualtrics)
                          </span>
                        </v-tooltip>
                      </v-list>
                    </v-menu>
                  </v-toolbar>

                  <v-list dense>
                    <v-list-item v-show="item.isImported">
                      <v-list-item-content>Letters</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.letterCount }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-show="item.isImported">
                      <v-list-item-content>Dimensions</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.dimensionCount }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-show="item.isImported">
                      <v-list-item-content>Responses</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.responseCount }}
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider v-show="item.isImported" />

                    <v-list-item v-show="item.isImported">
                      <v-list-item-content>Capernaum ID</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.capId }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Qualtrics ID</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.qualtricsId }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Last Modified</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.qualtricsModDate | dateAndTime }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
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

      searchFor: "",

      sortBy: "qualtricsName",
      sortDesc: false,
      sortCriteria: [
        {
          text: "Name",
          value: "qualtricsName"
        },
        {
          text: "Date",
          value: "qualtricsModDate"
        }
      ],

      snackbar: {
        text: "",
        visible: false
      },

      bottomSheet: {
        content: "",
        visible: false
      }
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
        combinedSurvey.letterCount = capSurvey.letter ? 1 : 0;
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
    importQualtricsSurvey(qualtricsSurveyId: string, updateOk: boolean) {
      this.$apollo
        .mutate({
          mutation: IMPORT_QUALTRICS_SURVEY,
          variables: {
            qualtricsId: qualtricsSurveyId,
            updateOk
          },
          refetchQueries: ["AllSurveys", "QualtricsSurveys"]
        })
        .then(result => {
          console.log("IMPORT RESULT", result);
          if (updateOk) {
            this.showSnackbar("Updated successfully");
          } else {
            this.showSnackbar("Imported successfully");
          }
        })
        .catch(error => this.showSnackbar(error));
    },

    disableImport(item: CombinedSurvey) {
      return item.isImported;
    },
    disableUpdate(item: CombinedSurvey) {
      return !item.isImported;
    },
    disableRemove(item: CombinedSurvey) {
      return !item.isImported || item.hasReference;
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
