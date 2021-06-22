<template>
  <v-container>
    <v-row class="align-baseline">
      <v-col cols="3">
        <h1 class="headline">Responses</h1>
      </v-col>
      <v-col cols="8">
        <v-row class="align-baseline">
          <v-col>
            <v-select
              class="mr-2"
              v-model="chosenLetterType"
              :items="letterTypes"
              item-text="description"
              item-value="id"
              return-object
              label="Letter Type"
              @change="updateData($event)"
          /></v-col>
          <!-- https://codepen.io/giorgosk/pen/zdWrEY -->
          <!--
          <v-col v-if="isGroupLetter">
            <v-select
              class="mr-2"
              v-model="chosenGroup"
              :items="groups"
              item-text="name"
              item-value="id"
              return-object
              label="Choose Group"
              @change="fetchGroupResponses($event)"
          /></v-col>
          -->
          <v-col>
            <v-select
              class="mr-2"
              v-model="selectedQualtricsId"
              :items="availableSurveys"
              label="Choose survey to import"
          /></v-col>
          <v-col>
            <v-btn
              color="primary"
              :disabled="selectedQualtricsId.length === 0"
              @click="fetchFromQualtrics"
            >
              Fetch
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1">
        <v-progress-circular v-if="spinnerVisible" indeterminate />
      </v-col>
    </v-row>
    <v-row v-if="!isGroupLetter && !isIndividualLetter">
      <v-col>
        <v-card class="mx-auto" max-width="500">
          <v-card-text>
            Please select a Letter Type to get started.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="isGroupLetter && !groupSelected">
      <v-col>
        <v-card class="mx-auto" max-width="500">
          <v-card-text> Please select a Group to get started. </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="isGroupLetter">
      <v-col>
        <v-card>
          <v-card-title>
            Groups
            <!--
            <v-btn
              color="warning"
              :disabled="!selectedResponses.length"
              @click="deleteDialog.visible = true"
            >
              Delete Selected
            </v-btn>
            -->
            <v-spacer />
            <v-text-field
              v-model="groupSearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable
            />
          </v-card-title>
          <v-data-table
            :headers="groupHeaders"
            :items="groups"
            :search="groupSearch"
            v-model="selectedResponses"
            class="elevation-1"
          >
            <template v-slot:[`item.action`]="{ item }">
              <v-icon class="ml-2" @click="fetchGroupResponses(item)">
                mdi-download
              </v-icon>
            </template>
          </v-data-table>
        </v-card></v-col
      >
    </v-row>

    <v-row v-if="groupSelected">
      <v-col>
        <v-card class="mx-auto">
          <v-card-title>
            {{ chosenGroup.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ chosenGroup.type }}
          </v-card-subtitle>
          <v-card-text>
            <p>
              <strong>Admin:</strong> {{ chosenGroup.adminFirstName }}
              {{ chosenGroup.adminLastName }} (email:
              {{ chosenGroup.adminEmail }})
            </p>
            <p><strong>Code Word: </strong> {{ chosenGroup.codeWord }}</p>
            <p><strong>Closed After: </strong> {{ chosenGroup.closedAfter }}</p>
            <p><strong>Created: </strong> {{ chosenGroup.created }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-email</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-adobe-acrobat</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="(isGroupLetter && groupSelected) || isIndividualLetter">
      <v-col>
        <v-card>
          <v-card-title>
            <v-btn
              color="warning"
              :disabled="!selectedResponses.length"
              @click="deleteDialog.visible = true"
            >
              Delete Selected
            </v-btn>
            <v-spacer />
            <v-text-field
              v-model="responseSearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable
            />
          </v-card-title>
          <v-data-table
            :headers="masterHeaders"
            :items="surveyResponses"
            :search="responseSearch"
            v-model="selectedResponses"
            show-select
            class="elevation-1"
          >
            <template v-slot:[`item.letter`]="{ item }">
              {{ letterTitle(item) }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ item.endDate | sensibleDate }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-icon
                :disabled="!hasIndividualLetter(item)"
                @click="sendEmail(item)"
              >
                mdi-email
              </v-icon>
              <v-icon
                class="ml-2"
                :disabled="!hasIndividualLetter(item)"
                @click="generatePDF(item)"
              >
                mdi-adobe-acrobat
              </v-icon>
              <v-icon class="ml-2" @click="deleteResponse(item)">
                mdi-close-circle
              </v-icon>
            </template>
          </v-data-table>
        </v-card></v-col
      >
    </v-row>

    <response-summary
      v-if="haveLetterWriterOutput"
      :write-letter="letterWriterOutput"
    />

    <mail-dialog
      v-model="mailDialog.visible"
      :respondent-email="mailDialog.respondentEmail"
      :admin-email="mailDialog.adminEmail"
      :text-content="mailDialog.textContent"
      :html-content="mailDialog.htmlContent"
      :attachment-path="mailDialog.attachmentPath"
    />

    <confirm-dialog
      v-model="deleteDialog.visible"
      dialog-title="Confirm delete"
      :dialog-text="bulkDeleteText"
      button-label="Delete"
      @confirmed="deleteSelected"
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
import {
  ALL_RESPONSES_QUERY,
  GROUP_RESPONSES_QUERY,
  IMPORT_SURVEY_RESPONSES,
} from "@/graphql/responses.graphql";
import {
  ALL_SURVEYS_QUERY,
  DELETE_SURVEY_RESPONSE,
} from "@/graphql/surveys.graphql";

import { ALL_LETTER_TYPES_QUERY } from "@/graphql/letters.graphql";

import { ALL_GROUPS } from "@/graphql/groups.graphql";

import { WRITE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import { AllResponses_surveyResponses as SurveyResponse } from "@/graphql/types/AllResponses";
import {
  WriteLetter,
  WriteLetter_writeLetter as LetterWriterOutput,
} from "@/graphql/types/WriteLetter";
import isEmpty from "lodash/isEmpty";
import MailDialog from "@/components/dialogs/MailDialog.vue";
import ResponseSummary from "@/components/ResponseSummary.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { ImportSurveyResponses } from "@/graphql/types/ImportSurveyResponses";
import { AllGroups_allGroups } from "@/graphql/types/AllGroups";
import pluralize from "pluralize";
import { LetterTypeEnum } from "@/types/letter.types";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";
import { quillDeltaToHtml } from "@/helpers/quill";

interface ImportedSurvey {
  id: number;
  title: string;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
}

export default Vue.extend({
  name: "Responses",

  components: {
    MailDialog,
    ConfirmDialog,
    ResponseSummary,
  },

  data() {
    return {
      surveys: [] as ImportedSurvey[],
      groups: [] as AllGroups_allGroups[],
      letterTypes: [] as ReadLetterTypes_readLetterTypes[],
      chosenLetterType: {
        id: -Infinity,
        key: "",
        description: "",
      } as ReadLetterTypes_readLetterTypes,
      chosenGroup: null as AllGroups_allGroups | null,
      // surveySelection: {} as SurveySelection, // Selection from allSurveys
      selectedQualtricsId: "",
      responseSearch: "",
      groupSearch: "",
      selectedResponses: [],
      surveyResponses: [] as SurveyResponse[],

      masterHeaders: [
        { text: "Date", value: "date" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Letter", value: "letter" },
        { text: "Response ID", value: "qualtricsResponseId" },
        { text: "Email", value: "email" },
        { text: "Action", value: "action", sortable: false },
      ],

      groupHeaders: [
        { text: "Admin First Name", value: "adminFirstName" },
        { text: "Admin Last Name", value: "adminLastName" },
        { text: "Date", value: "date" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Email", value: "adminEmail" },
        { text: "Group Name", value: "name" },
        { text: "Fetch Responses", value: "action", sortable: false },
      ],

      letterWriterOutput: {} as LetterWriterOutput,

      mailDialog: {
        visible: false,
        respondentEmail: "",
        adminEmail: "",
        textContent: "",
        htmlContent: "",
        attachmentPath: "",
      },

      snackbar: {
        visible: false,
        text: "",
      },

      bottomSheet: {
        visible: false,
        content: "",
      },

      deleteDialog: {
        visible: false,
        response: {} as SurveyResponse,
      },

      spinnerVisible: false,
    };
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
    },

    letterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
      update: (data) => {
        console.log("letter types: ", data);
        //console.log(this.chosenLetterType);
        /*data.readLetterTypes.forEach((letterType: ReadLetterTypes_readLetterTypes) => {
          if (letterType.key === LetterTypeEnum.INDIVIDUAL) {
            this.chosenLetterType = {
              id: letterType.id,
              key: letterType.key,
              description: letterType.description
            }
          }
        });
        */
        return data.readLetterTypes;
      },
    },
  },

  computed: {
    isGroupLetter(): boolean {
      return this.chosenLetterType.key === LetterTypeEnum.GROUP;
    },

    groupSelected(): boolean {
      return (
        this.chosenLetterType.key === LetterTypeEnum.GROUP &&
        this.chosenGroup !== null
      );
    },

    isIndividualLetter(): boolean {
      return this.chosenLetterType.key === LetterTypeEnum.INDIVIDUAL;
    },

    availableSurveys(): Array<Record<string, string>> {
      return this.surveys.map((survey) => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId,
      }));
    },

    bulkDeleteText(): string {
      const numSelected = this.selectedResponses.length;
      return `Delete ${numSelected} ${pluralize(
        "response",
        numSelected
      )} from Capernaum?
      Qualtrics is not affected.`;
    },

    haveLetterWriterOutput(): boolean {
      return !isEmpty(this.letterWriterOutput);
    },
  },

  methods: {
    updateData(chosenLetterType: ReadLetterTypes_readLetterTypes) {
      console.log("letter type updated: ", chosenLetterType);
      if (chosenLetterType.key === LetterTypeEnum.GROUP) {
        this.fetchGroups();
      } else if (chosenLetterType.key === LetterTypeEnum.INDIVIDUAL) {
        this.fetchAllResponses();
      }
    },

    fetchGroups() {
      this.$apollo
        .query({
          query: ALL_GROUPS,
        })
        .then(({ data }) => {
          console.log("received groups!", data.allGroups);
          this.groups = data.allGroups;
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    fetchAllResponses() {
      this.$apollo
        .query({
          query: ALL_RESPONSES_QUERY,
        })
        .then(({ data }) => {
          console.log("received responses!", data.surveyResponses);
          this.surveyResponses = data.surveyResponses;
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    fetchGroupResponses(group: AllGroups_allGroups) {
      console.log("inside fetch group responses: ", group);
      this.chosenGroup = group;
      let chosenGroupId = group.id;
      //if (this.chosenGroup !== null) {
      this.$apollo
        .query({
          query: GROUP_RESPONSES_QUERY,
          variables: {
            groupId: chosenGroupId,
          },
        })
        .then(({ data }) => {
          console.log("received responses!", data.groupResponses);
          this.surveyResponses = data.groupResponses;
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
      //}
    },

    clearLetterWriterOutput() {
      this.letterWriterOutput = {} as LetterWriterOutput;
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    sendEmail(surveyResponse: SurveyResponse) {
      let numIndividualLetters = 0;
      let htmlContent = "<p>Survey results</p>";
      surveyResponse.survey.letters.forEach((letter) => {
        if (letter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
          htmlContent = quillDeltaToHtml(letter.emailMessage);
          numIndividualLetters += 1;
        }
      });

      if (numIndividualLetters === 0) {
        throw Error("Survey has no individual letter");
      } else if (numIndividualLetters > 1) {
        throw Error("Survey has more than one individual letter");
      }

      this.mailDialog.respondentEmail = surveyResponse.email;
      this.mailDialog.adminEmail = this.$store.state.user.email;
      this.mailDialog.attachmentPath = this.letterWriterOutput.pdfAbsolutePath;
      alert("this.mailDialog.textContent = quillHtmlToText(htmlContent);");
      this.mailDialog.textContent = htmlContent;
      this.mailDialog.htmlContent = htmlContent;
      this.mailDialog.visible = true;
    },

    generatePDF(surveyResponse: SurveyResponse) {
      let numIndividualLetters = 0;
      let letterId = -Infinity;
      surveyResponse.survey.letters.forEach((letter) => {
        if (letter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
          letterId = letter.id;
          numIndividualLetters += 1;
        }
      });
      if (numIndividualLetters === 0) {
        throw Error("Survey has no individual letter");
      } else if (numIndividualLetters > 1) {
        throw Error("Survey has more than one individual letter");
      }

      this.clearLetterWriterOutput();
      this.spinnerVisible = true;

      this.$apollo
        .mutate<WriteLetter>({
          mutation: WRITE_LETTER_MUTATION,
          variables: {
            writerInput: {
              letterId: letterId,
              surveyResponseId: surveyResponse.id,
            },
          },
        })
        .then((response) => {
          console.log("response", response);
          if (response.data) {
            const writeLetter = response.data.writeLetter;

            this.showSnackbar(writeLetter.message);
            if (writeLetter.responseSummary) {
              this.letterWriterOutput = writeLetter;
            }
          }
        })
        .catch((error) => {
          console.error("generatePDF error", error);
        })
        .finally(() => {
          this.spinnerVisible = false;
        });
    },

    hasIndividualLetter(item: SurveyResponse) {
      let hasIndividualLetter = false;
      item.survey.letters.forEach((letter) => {
        if (letter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
          hasIndividualLetter = true; // there should only be one individual letter per survey; we're technically searching to see if there is at least one....
        }
      });
      return hasIndividualLetter;
    },

    confirmDelete(item: SurveyResponse) {
      this.deleteDialog.response = item;
      this.deleteDialog.visible = true;
    },

    deleteResponse(surveyResponse: SurveyResponse) {
      this.$apollo
        .mutate({
          mutation: DELETE_SURVEY_RESPONSE,
          variables: {
            id: surveyResponse.id,
          },
        })
        .then(() => {
          const responseIndex = this.surveyResponses.findIndex(
            (item) => item.id === surveyResponse.id
          );
          this.surveyResponses.splice(responseIndex, 1);
        });
    },

    async deleteSelected() {
      try {
        this.spinnerVisible = true;
        for (let response of this.selectedResponses) {
          await this.deleteResponse(response);
        }

        const numDeleted = this.selectedResponses.length;
        this.showSnackbar(
          `Deleted ${numDeleted} ${pluralize("response", numDeleted)}`
        );
      } catch (err) {
        this.showSnackbar(err);
      } finally {
        this.selectedResponses = [];
        this.spinnerVisible = false;
      }
    },

    letterTitle(item: SurveyResponse) {
      let letterTitle = "No letter"; // default
      if (this.chosenLetterType.key === LetterTypeEnum.INDIVIDUAL) {
        console.log("individual letter!", item);
        item.survey.letters.forEach((letter) => {
          if (letter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
            letterTitle = letter.title;
          }
        });
      } else if (this.chosenLetterType.key === LetterTypeEnum.GROUP) {
        item.survey.letters.forEach((letter) => {
          if (letter.letterType.key === LetterTypeEnum.GROUP) {
            letterTitle = letter.title;
          }
        });
      }
      return letterTitle;
    },

    fetchFromQualtrics() {
      // Import all responses for one survey from the Qualtrics API.
      this.spinnerVisible = true;

      this.$apollo
        .mutate<ImportSurveyResponses>({
          mutation: IMPORT_SURVEY_RESPONSES,
          variables: {
            qId: this.selectedQualtricsId,
          },
          refetchQueries: ["AllResponses"],
        })
        .then((mutationResult) => {
          const stats = mutationResult.data?.importQualtricsSurveyResponses;
          if (stats) {
            this.bottomSheet.content = `Imported ${
              stats.importCount
            } ${pluralize("response", stats.importCount)} (${
              stats.duplicateCount
            } ${pluralize("duplicate", stats.duplicateCount)})`;
            this.bottomSheet.visible = true;
            this.selectedQualtricsId = "";
          }
        })
        .finally(() => {
          this.spinnerVisible = false;
        });
    },
  },
  mounted(): void {
    console.log("mounted....");
    //this.refetchSEPracticeData();
  },
});
</script>
