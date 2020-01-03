<template>
  <v-container>
    <v-row class="align-baseline">
      <v-col>
        <h1 class="headline">Responses</h1>
      </v-col>
      <v-col>
        <v-row class="align-baseline">
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
            <template v-slot:item.letter="{ item }">
              {{ letterTitle(item) }}
            </template>
            <template v-slot:item.date="{ item }">
              {{ item.endDate | sensibleDate }}
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon :disabled="!hasLetter(item)" @click="sendEmail(item)">
                mdi-email
              </v-icon>
              <v-icon
                class="ml-2"
                :disabled="!hasLetter(item)"
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
  IMPORT_SURVEY_RESPONSES
} from "@/graphql/responses.graphql";
import {
  ALL_SURVEYS_QUERY,
  DELETE_SURVEY_RESPONSE
} from "@/graphql/surveys.graphql";
import { WRITE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import {
  AllResponses,
  AllResponses_surveyResponses as SurveyResponse
} from "@/graphql/types/AllResponses";
import {
  WriteLetter,
  WriteLetter_writeLetter as LetterWriterOutput
} from "@/graphql/types/WriteLetter";
import isEmpty from "lodash/isEmpty";
import MailDialog from "@/components/MailDialog.vue";
import ResponseSummary from "@/components/ResponseSummary.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { ImportSurveyResponses } from "@/graphql/types/ImportSurveyResponses";
import pluralize from "pluralize";

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
    ResponseSummary
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    },

    surveyResponses: {
      query: ALL_RESPONSES_QUERY,
      update: data => data.surveyResponses
    }
  },

  data() {
    return {
      surveys: [] as ImportedSurvey[],
      selectedQualtricsId: "",
      responseSearch: "",
      selectedResponses: [],
      surveyResponses: [] as SurveyResponse[],

      masterHeaders: [
        { text: "Date", value: "date" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Letter", value: "letter" },
        { text: "Response ID", value: "qualtricsResponseId" },
        { text: "Email", value: "email" },
        { text: "Action", value: "action", sortable: false }
      ],

      letterWriterOutput: {} as LetterWriterOutput,

      mailDialog: {
        visible: false,
        respondentEmail: "",
        adminEmail: "",
        attachmentPath: ""
      },

      snackbar: {
        visible: false,
        text: ""
      },

      bottomSheet: {
        visible: false,
        content: ""
      },

      deleteDialog: {
        visible: false,
        response: {} as SurveyResponse
      },

      spinnerVisible: false
    };
  },

  computed: {
    availableSurveys(): object {
      return this.surveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
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
    }
  },

  methods: {
    clearLetterWriterOutput() {
      this.letterWriterOutput = {} as LetterWriterOutput;
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    sendEmail(surveyResponse: SurveyResponse) {
      this.mailDialog.respondentEmail = surveyResponse.email;
      this.mailDialog.adminEmail = this.$store.state.user.email;
      this.mailDialog.attachmentPath = this.letterWriterOutput.pdfAbsolutePath;
      this.mailDialog.visible = true;
    },

    generatePDF(surveyResponse: SurveyResponse) {
      if (!surveyResponse.survey.letter) {
        throw Error("Survey has no letter");
      }

      this.clearLetterWriterOutput();
      this.spinnerVisible = true;

      this.$apollo
        .mutate<WriteLetter>({
          mutation: WRITE_LETTER_MUTATION,
          variables: {
            writerInput: {
              letterId: surveyResponse.survey.letter.id,
              surveyResponseId: surveyResponse.id
            }
          }
        })
        .then(response => {
          console.log("response", response);
          if (response.data) {
            const writeLetter = response.data.writeLetter;

            this.showSnackbar(writeLetter.message);
            if (writeLetter.responseSummary) {
              this.letterWriterOutput = writeLetter;
            }
          }
        })
        .catch(error => {
          console.error("generatePDF error", error);
        })
        .finally(() => {
          this.spinnerVisible = false;
        });
    },

    hasLetter(item: SurveyResponse) {
      return item.survey.letter !== null;
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
            id: surveyResponse.id
          }
        })
        .then(() => {
          const responseIndex = this.surveyResponses.findIndex(
            item => item.id === surveyResponse.id
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
      if (item.survey.letter) {
        return item.survey.letter.title;
      } else {
        return "No letter";
      }
    },

    fetchFromQualtrics() {
      // Import all responses for one survey from the Qualtrics API.
      this.spinnerVisible = true;

      this.$apollo
        .mutate<ImportSurveyResponses>({
          mutation: IMPORT_SURVEY_RESPONSES,
          variables: {
            qId: this.selectedQualtricsId
          },
          refetchQueries: ["AllResponses"]
        })
        .then(mutationResult => {
          const stats = mutationResult.data!.importQualtricsSurveyResponses;
          this.bottomSheet.content = `Imported ${stats.importCount} ${pluralize(
            "response",
            stats.importCount
          )} (${stats.duplicateCount} ${pluralize(
            "duplicate",
            stats.duplicateCount
          )})`;
          this.bottomSheet.visible = true;
          this.selectedQualtricsId = "";
        })
        .finally(() => {
          this.spinnerVisible = false;
        });
    }
  }
});
</script>
