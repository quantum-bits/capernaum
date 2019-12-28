<template>
  <v-container>
    <v-row class="align-baseline justify-space-between">
      <v-col cols="4">
        <h3>Fetch Responses from Qualtrics</h3>
      </v-col>
      <v-col cols="4">
        <v-row class="align-baseline">
          <v-select
            class="mr-2"
            v-model="selectedQualtricsId"
            :items="availableSurveys"
            label="Choose imported survey"
          />
          <v-btn color="primary" @click="fetchFromQualtrics">Fetch</v-btn>
        </v-row>
      </v-col>
      <v-col cols="1">
        <v-progress-circular v-if="spinnerVisible" indeterminate />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h4>All Responses</h4>
        <v-data-table
          :headers="masterHeaders"
          :items="allResponses.surveyResponses"
          class="elevation-1"
        >
          <template v-slot:item.letter="{ item }">
            {{ letterTitle(item) }}
          </template>
          <template v-slot:item.date="{ item }">
            {{ item.endDate | sensibleDate }}
          </template>
          <template v-slot:item.action="{ item }">
            <div v-if="hasOneLetter(item)">
              <v-icon @click="sendEmail(item)">
                mdi-email
              </v-icon>
              <v-icon class="ml-2" @click="generatePDF(item)">
                mdi-adobe-acrobat
              </v-icon>
            </div>
            <div v-else>
              No letter!
            </div>
          </template>
        </v-data-table>
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
      :attachment-path="mailDialog.attachmentPath"
    />

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL_RESPONSES_QUERY,
  IMPORT_SURVEY_RESPONSES
} from "@/graphql/responses.graphql";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
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
import MailDialog from "./MailDialog.vue";
import ResponseSummary from "./ResponseSummary.vue";

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
    ResponseSummary
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    },

    allResponses: {
      query: ALL_RESPONSES_QUERY,
      update: data => data
    }
  },

  data() {
    return {
      surveys: [] as ImportedSurvey[],
      selectedQualtricsId: "",

      allResponses: {} as AllResponses,
      masterHeaders: [
        { text: "Date", value: "date" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Letter", value: "letter" },
        { text: "Response ID", value: "qualtricsResponseId" },
        { text: "Email", value: "email" },
        { text: "Action", value: "action" }
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
      this.clearLetterWriterOutput();
      this.spinnerVisible = true;

      this.$apollo
        .mutate<WriteLetter>({
          mutation: WRITE_LETTER_MUTATION,
          variables: {
            letterWriterInput: {
              letterId: surveyResponse.survey.letters[0].id,
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

    hasOneLetter(item: SurveyResponse) {
      return item.survey.letters && item.survey.letters.length === 1;
    },

    letterTitle(item: SurveyResponse) {
      if (this.hasOneLetter(item)) {
        return item.survey.letters[0].title;
      } else {
        return "No letter!";
      }
    },

    async fetchFromQualtrics() {
      try {
        // Import all responses for one survey from the Qualtrics API.
        await this.$apollo.mutate({
          mutation: IMPORT_SURVEY_RESPONSES,
          variables: {
            qId: this.selectedQualtricsId
          },
          refetchQueries: ["AllResponses"]
        });

        // Read them in to refresh the table.
        const queryResult = await this.$apollo.query<AllResponses>({
          query: ALL_RESPONSES_QUERY
        });
        this.allResponses = queryResult.data;
      } catch (err) {
        throw err;
      }
    }
  }
});
</script>
