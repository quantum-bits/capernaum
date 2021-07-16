<template>
  <v-container>
    <page-header title="Responses">
      <v-col>
        <v-select
          :disabled="availableSurveys.length === 0"
          v-model="selectedSurveyId"
          :items="availableSurveys"
          label="Select a survey"
          @change="fetchSurveyResponses()"
        />
      </v-col>
      <v-col>
        <v-select
          :disabled="availableGroups.length <= 1"
          v-model="selectedGroupId"
          :items="availableGroups"
          label="Select a group"
          @change="fetchSurveyResponses()"
        />
      </v-col>
      <v-col cols="1">
        <v-progress-circular v-if="spinnerVisible" indeterminate />
      </v-col>
    </page-header>

    <v-row>
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
              {{ item.endDate | standardDate }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-icon @click="sendEmail(item)"> mdi-email </v-icon>
              <v-icon class="ml-2" @click="generatePDF(item)">
                mdi-adobe-acrobat
              </v-icon>
              <v-icon class="ml-2" @click="deleteResponse(item)">
                mdi-close-circle
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
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
  IMPORT_SURVEY_RESPONSES,
  SURVEY_RESPONSES_QUERY,
} from "@/graphql/responses.graphql";
import {
  ALL_CAPERNAUM_SURVEYS,
  DELETE_SURVEY_RESPONSE,
} from "@/graphql/surveys.graphql";
import { WRITE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import {
  WriteLetter,
  WriteLetter_writeLetter as LetterWriterOutput,
} from "@/graphql/types/WriteLetter";
import isEmpty from "lodash/isEmpty";
import MailDialog from "@/components/dialogs/MailDialog.vue";
import ResponseSummary from "@/components/ResponseSummary.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { ImportSurveyResponses } from "@/graphql/types/ImportSurveyResponses";
import { AllGroups_groups } from "@/graphql/types/AllGroups";
import pluralize from "pluralize";
import {
  AllCapernaumSurveys,
  AllCapernaumSurveys_surveys,
} from "@/graphql/types/AllCapernaumSurveys";
import PageHeader from "@/pages/PageHeader.vue";
import * as _ from "lodash";
import {
  SurveyResponses,
  SurveyResponses_surveyResponses,
  SurveyResponsesVariables,
} from "@/graphql/types/SurveyResponses";

interface Selection {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "ResponsesPage",

  components: {
    PageHeader,
    MailDialog,
    ConfirmDialog,
    ResponseSummary,
  },

  data() {
    return {
      surveys: [] as AllCapernaumSurveys_surveys[],
      selectedSurveyId: null as number | null,
      selectedGroupId: null as number | null,
      surveyResponses: [] as SurveyResponses_surveyResponses[],

      groups: [] as AllGroups_groups[],
      chosenGroup: null as AllGroups_groups | null,
      responseSearch: "",
      groupSearch: "",
      selectedResponses: [],

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
        response: {} as SurveyResponses_surveyResponses,
      },

      spinnerVisible: false,
    };
  },

  mounted(): void {
    this.showSpinner();
    this.$apollo
      .query<AllCapernaumSurveys>({
        query: ALL_CAPERNAUM_SURVEYS,
      })
      .then((response) => {
        this.surveys = response.data.surveys;
      })
      .catch((error) => {
        throw new Error(`Failed to fetch surveys: ${error}`);
      })
      .finally(() => {
        this.hideSpinner();
      });
  },

  computed: {
    availableSurveys(): Selection[] {
      return this.surveys.map((survey) => ({
        text: survey.qualtricsName,
        value: survey.id,
      }));
    },

    selectedSurvey(): AllCapernaumSurveys_surveys | undefined {
      return _.find(
        this.surveys,
        (survey) => survey.id === this.selectedSurveyId
      );
    },

    availableGroups(): Selection[] {
      if (!this.selectedSurvey) {
        return [];
      }
      const selections = this.selectedSurvey.groups.map((group) => ({
        text: group.name,
        value: group.id,
      }));
      selections.unshift({ text: "All Groups", value: -1 });
      return selections;
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
    showSpinner() {
      this.spinnerVisible = true;
    },

    hideSpinner() {
      this.spinnerVisible = false;
    },

    fetchSurveyResponses() {
      if (this.selectedSurveyId) {
        const variables: SurveyResponsesVariables = {
          surveyId: this.selectedSurveyId,
        };
        if (this.selectedGroupId && this.selectedGroupId > 0) {
          variables.groupId = this.selectedGroupId;
        }

        return this.$apollo
          .query<SurveyResponses, SurveyResponsesVariables>({
            query: SURVEY_RESPONSES_QUERY,
            variables,
          })
          .then((result) => {
            this.surveyResponses = result.data.surveyResponses;
            console.log("SURVEY RESPONSES", this.surveyResponses);
          });
      } else {
        throw new Error("No survey selected");
      }
    },

    // fetchGroups() {
    //   this.$apollo
    //     .query({
    //       query: ALL_GROUPS,
    //     })
    //     .then(({ data }) => {
    //       console.log("received groups!", data.allGroups);
    //       this.groups = data.allGroups;
    //     })
    //     .catch((error) => {
    //       console.log("there appears to have been an error: ", error);
    //     });
    // },

    // fetchAllResponses() {
    //   this.$apollo
    //     .query({
    //       query: SURVEY_RESPONSES_QUERY,
    //     })
    //     .then(({ data }) => {
    //       console.log("received responses!", data.surveyResponses);
    //       this.surveyResponses = data.surveyResponses;
    //     })
    //     .catch((error) => {
    //       console.log("there appears to have been an error: ", error);
    //     });
    // },
    //
    // fetchGroupResponses(group: AllGroups_groups) {
    //   console.log("inside fetch group responses: ", group);
    //   this.chosenGroup = group;
    //   let chosenGroupId = group.id;
    //   //if (this.chosenGroup !== null) {
    //   this.$apollo
    //     .query({
    //       query: GROUP_RESPONSES_QUERY,
    //       variables: {
    //         groupId: chosenGroupId,
    //       },
    //     })
    //     .then(({ data }) => {
    //       console.log("received responses!", data.groupResponses);
    //       this.surveyResponses = data.groupResponses;
    //     })
    //     .catch((error) => {
    //       console.log("there appears to have been an error: ", error);
    //     });
    //   //}
    // },

    clearLetterWriterOutput() {
      this.letterWriterOutput = {} as LetterWriterOutput;
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    sendEmail(surveyResponse: SurveyResponses_surveyResponses) {
      let numIndividualLetters = 0;
      let htmlContent = "<p>Survey results</p>";
      // surveyResponse.survey.surveyLetters.forEach((surveyLetter) => {
      //   // FIXME
      //   // if (surveyLetter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
      //   //   htmlContent = quillDeltaToHtml(surveyLetter.letter.emailMessage);
      //   //   numIndividualLetters += 1;
      //   // }
      // });

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

    generatePDF(surveyResponse: SurveyResponses_surveyResponses) {
      let numIndividualLetters = 0;
      let letterId = -Infinity;
      // surveyResponse.survey.surveyLetters.forEach((surveyLetter) => {
      //   // FIXME
      //   // if (surveyLetter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
      //   //   letterId = surveyLetter.letter.id;
      //   //   numIndividualLetters += 1;
      //   // }
      // });
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

    hasIndividualLetter(item: SurveyResponses_surveyResponses) {
      let hasIndividualLetter = false;
      // item.survey.surveyLetters.forEach((surveyLetter) => {
      //   // FIXME
      //   // if (surveyLetter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
      //   //   hasIndividualLetter = true; // there should only be one individual letter per survey; we're technically searching to see if there is at least one....
      //   // }
      // });
      // return hasIndividualLetter;
    },

    confirmDelete(item: SurveyResponses_surveyResponses) {
      this.deleteDialog.response = item;
      this.deleteDialog.visible = true;
    },

    deleteResponse(surveyResponse: SurveyResponses_surveyResponses) {
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

    letterTitle(item: SurveyResponses_surveyResponses) {
      let letterTitle = "No letter"; // default
      // FIXME
      // if (this.chosenLetterType.key === LetterTypeEnum.INDIVIDUAL) {
      //   console.log("individual letter!", item);
      //   item.survey.surveyLetters.forEach((surveyLetter) => {
      //     if (surveyLetter.letterType.key === LetterTypeEnum.INDIVIDUAL) {
      //       letterTitle = surveyLetter.letter.title;
      //     }
      //   });
      // } else if (this.chosenLetterType.key === LetterTypeEnum.GROUP) {
      //   item.survey.surveyLetters.forEach((surveyLetter) => {
      //     if (surveyLetter.letterType.key === LetterTypeEnum.GROUP) {
      //       letterTitle = surveyLetter.letter.title;
      //     }
      //   });
      // }
      return letterTitle;
    },

    fetchFromQualtrics() {
      // Import all responses for one survey from the Qualtrics API.
      this.spinnerVisible = true;

      this.$apollo
        .mutate<ImportSurveyResponses>({
          mutation: IMPORT_SURVEY_RESPONSES,
          variables: {
            qId: this.selectedSurveyId,
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
            this.selectedSurveyId = null;
          }
        })
        .finally(() => {
          this.spinnerVisible = false;
        });
    },
  },
});
</script>
