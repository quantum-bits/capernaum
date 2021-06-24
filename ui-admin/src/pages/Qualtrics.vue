<template>
  <v-container>
    <page-header title="Qualtrics">
      <v-switch v-model="showAllSurveys" label="Show All" />
    </page-header>
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
                              @click="importQualtricsSurvey(item.qualtricsId)"
                            >
                              <v-list-item-title>Update</v-list-item-title>
                            </v-list-item>
                          </template>
                          <span>Update from Qualtrics</span>
                        </v-tooltip>
                        <v-tooltip left :disabled="disableEdit(item)">
                          <template v-slot:activator="{ on }">
                            <v-list-item
                              v-on="on"
                              :disabled="disableEdit(item)"
                              @click="launchEditSurveyDialog(item)"
                            >
                              <v-list-item-title> Edit </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span> Edit survey properties </span>
                        </v-tooltip>
                        <v-tooltip left :disabled="disableRemove(item)">
                          <template v-slot:activator="{ on }">
                            <v-list-item
                              v-on="on"
                              :disabled="disableRemove(item)"
                              @click="deleteSurvey(item.capId)"
                            >
                              <v-list-item-title> Remove </v-list-item-title>
                            </v-list-item>
                          </template>
                          <span>
                            Remove from Capernaum (no change on Qualtrics)
                          </span>
                        </v-tooltip>
                      </v-list>
                    </v-menu>
                  </v-toolbar>

                  <v-divider v-show="item.isImported" />
                  <v-list dense>
                    <v-list-item
                      v-for="letterCount in item.letterCounts"
                      :key="letterCount.id"
                      v-show="item.isImported"
                    >
                      <v-list-item-content>{{
                        letterCount.letterTypeDescription
                      }}</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ letterCount.count }}
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
                      <v-list-item-content>Public Name</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.publicName }}
                      </v-list-item-content>
                    </v-list-item>
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
                        {{ item.qualtricsModDate | standardDateTime }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-show="item.isImported">
                      <v-list-item-content>Groups OK?</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.okayForGroup }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-divider v-show="item.isImported" />
                  <v-card-text v-show="item.isImported">
                    <strong>Detailed Description: </strong>
                    {{ item.detailedDescription }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>

    <survey-dialog
      v-model="editSurveyDialog.visible"
      dialog-title="Edit Survey Properties"
      :detailed-description="editSurveyDialog.detailedDescription"
      :qualtrics-name="editSurveyDialog.qualtricsName"
      :okay-for-group="editSurveyDialog.okayForGroup"
      :public-name="editSurveyDialog.publicName"
      @ready="editSurvey"
    />

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

interface LetterCount {
  count: number;
  letterTypeDescription: string;
  id: number;
}

interface CombinedSurvey {
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  qualtricsIsActive: boolean;
  okayForGroup: boolean;
  publicName: string;
  detailedDescription: string;

  capId: number | null;
  isImported: boolean;

  // Stats on other entities that have this one as a FK.
  hasReference: boolean;
  letterCounts: LetterCount[];
  dimensionCount: number;
  responseCount: number;
}

import { ALL_LETTER_TYPES_QUERY } from "@/graphql/letters.graphql";

import {
  ALL_QUALTRICS_SURVEYS_QUERY,
  ALL_SURVEYS_QUERY,
  DELETE_SURVEY,
  IMPORT_QUALTRICS_SURVEY,
  UPDATE_SURVEY_MUTATION,
} from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import { QualtricsSurveys_qualtricsSurveys as QualtricsSurvey } from "@/graphql/types/QualtricsSurveys";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";
import SurveyDialog from "../components/dialogs/SurveyDialog.vue";
import { SurveyDialogResponse } from "@/components/dialogs/dialog.types";

import pluralize from "pluralize";
import PageHeader from "@/pages/PageHeader.vue";

export default Vue.extend({
  name: "Surveys",

  components: {
    SurveyDialog,
    PageHeader,
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update: (data) => {
        console.log("surveys!", data.surveys);
        return data.surveys;
      },
      fetchPolicy: "network-only",
    },
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
    qualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY,
      variables: {
        includeInactive: true,
      },
      update: (data) => data.qualtricsSurveys,
      fetchPolicy: "network-only",
    },
  },

  data() {
    return {
      surveys: [] as Survey[],
      readLetterTypes: [] as ReadLetterTypes_readLetterTypes[],
      qualtricsSurveys: [] as QualtricsSurvey[],
      showAllSurveys: false,

      searchFor: "",

      sortBy: "qualtricsName",
      sortDesc: false,
      sortCriteria: [
        {
          text: "Name",
          value: "qualtricsName",
        },
        {
          text: "Date",
          value: "qualtricsModDate",
        },
      ],

      snackbar: {
        text: "",
        visible: false,
      },

      bottomSheet: {
        content: "",
        visible: false,
      },
      editSurveyDialog: {
        visible: false,
        detailedDescription: "",
        qualtricsName: "",
        okayForGroup: false,
        publicName: "",
        id: -Infinity,
      },
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
        console.log("here is the combined survey: ", combinedSurvey);
        combinedSurvey.capId = capSurvey.id;
        combinedSurvey.isImported = true;
        console.log("okay for group?", capSurvey.okayForGroup);
        combinedSurvey.okayForGroup = capSurvey.okayForGroup;
        combinedSurvey.publicName = capSurvey.publicName;
        combinedSurvey.detailedDescription = capSurvey.detailedDescription;

        // Does this survey have a reference from a letter-related entity?
        // Note that we do not check for survey items because these are
        // owned by the survey itself and are not added when creating a letter,
        // adding survey dimensions, etc.
        //combinedSurvey.letterCount = capSurvey.letter ? 1 : 0;

        combinedSurvey.letterCounts = [];
        let totalNumberLettersThisSurvey = 0;
        this.readLetterTypes.forEach((letterType) => {
          let numberLettersThisType = 0;
          capSurvey.letters.forEach((letter) => {
            console.log("letter", letter);
            if (letter.letterType.key === letterType.key) {
              numberLettersThisType += 1;
              totalNumberLettersThisSurvey += 1;
            }
          });
          combinedSurvey.letterCounts.push({
            count: numberLettersThisType,
            letterTypeDescription: letterType.description + "s",
            id: letterType.id,
          });
        });
        console.log("letter counts this survey: ", combinedSurvey.letterCounts);
        console.log(
          "total number of letters for this survey: ",
          totalNumberLettersThisSurvey
        );
        combinedSurvey.dimensionCount = capSurvey.surveyDimensions
          ? capSurvey.surveyDimensions.length
          : 0;
        combinedSurvey.responseCount = capSurvey.surveyResponses
          ? capSurvey.surveyResponses.length
          : 0;

        combinedSurvey.hasReference =
          totalNumberLettersThisSurvey +
            combinedSurvey.dimensionCount +
            combinedSurvey.responseCount >
          0;
      }
      console.log("surveys: ", this.surveys);

      for (let qualtricsSurvey of this.qualtricsSurveys) {
        const combinedSurvey = getCombinedSurvey(qualtricsSurvey.qualtricsId);
        combinedSurvey.qualtricsId = qualtricsSurvey.qualtricsId;
        combinedSurvey.qualtricsIsActive = qualtricsSurvey.qualtricsIsActive;
        combinedSurvey.qualtricsModDate = qualtricsSurvey.qualtricsModDate;
        combinedSurvey.qualtricsName = qualtricsSurvey.qualtricsName;
      }

      return Array.from(combinedSurveyMap.values()).filter(
        (survey) =>
          survey.capId || survey.qualtricsIsActive || this.showAllSurveys
      );
    },
  },

  methods: {
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

    launchEditSurveyDialog(item: CombinedSurvey) {
      if (item.capId !== null) {
        console.log("edit this survey: ", item);
        this.editSurveyDialog.detailedDescription = item.detailedDescription;
        this.editSurveyDialog.qualtricsName = item.qualtricsName;
        this.editSurveyDialog.okayForGroup = item.okayForGroup;
        this.editSurveyDialog.publicName = item.publicName;
        this.editSurveyDialog.id = item.capId;
        this.editSurveyDialog.visible = true;
      } else {
        console.log("the survey id is not a number!");
      }
    },

    editSurvey(dialogResponse: SurveyDialogResponse) {
      console.log("response from dialog:", dialogResponse);
      this.$apollo
        .mutate({
          mutation: UPDATE_SURVEY_MUTATION,
          variables: {
            updateInput: {
              id: this.editSurveyDialog.id,
              detailedDescription: dialogResponse.detailedDescription,
              okayForGroup: dialogResponse.okayForGroup,
              publicName: dialogResponse.publicName,
            },
          },
        })
        .then((response) => {
          console.log("response after the update: ", response);
          this.editSurveyDialog.visible = false;
          //this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    disableImport(item: CombinedSurvey) {
      return item.isImported;
    },
    disableUpdate(item: CombinedSurvey) {
      return !item.isImported;
    },
    disableEdit(item: CombinedSurvey) {
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
      let totalNumberLetters = 0;
      item.letterCounts.forEach((letterCount) => {
        totalNumberLetters += letterCount.count;
      });
      if (totalNumberLetters > 0) {
        details.push(
          `${totalNumberLetters} related ${pluralize(
            "letter",
            totalNumberLetters
          )}`
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
            id,
          },
          refetchQueries: ["AllSurveys", "QualtricsSurveys"],
        })
        .then((result) => {
          console.log("DELETE RESULT", result);
          this.showSnackbar("Deleted successfully");
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
