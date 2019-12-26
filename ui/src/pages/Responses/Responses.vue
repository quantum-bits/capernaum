<template>
  <v-container>
    <v-row class="align-baseline">
      <v-col> <h3>Fetch Responses from Qualtrics</h3></v-col>
      <v-col>
        <v-select
          v-model="selectedQualtricsId"
          :items="availableSurveys"
          label="Choose imported survey"
        />
      </v-col>
      <v-col>
        <v-btn color="primary" @click="fetchFromQualtrics">Fetch</v-btn>
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
            <v-icon @click="sendEmail(item)">
              mdi-email
            </v-icon>
            <v-icon class="ml-2" @click="generatePDF(item)">
              mdi-adobe-acrobat
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <response-summary
      v-if="haveResponseSummary"
      :response-summary="responseSummary"
    />

    <mail-dialog
      v-model="mailDialog.visible"
      :respondent-email="mailDialog.respondentEmail"
      :admin-email="mailDialog.adminEmail"
      :attachment-path="mailDialog.attachmentPath"
    />
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
  WriteLetter_writeLetter
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

      responseSummary: {} as WriteLetter_writeLetter,

      mailDialog: {
        visible: false,
        respondentEmail: "",
        adminEmail: "",
        attachmentPath: ""
      }
    };
  },

  computed: {
    availableSurveys(): object {
      return this.surveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
      }));
    },

    haveResponseSummary(): boolean {
      return !isEmpty(this.responseSummary);
    }
  },

  methods: {
    sendEmail(surveyResponse: SurveyResponse) {
      // Open the mail dialog.
      this.mailDialog.respondentEmail = surveyResponse.email;
      this.mailDialog.adminEmail = this.$store.state.user.email;
      this.mailDialog.attachmentPath = this.responseSummary.pdfFilePath;
      this.mailDialog.visible = true;
    },

    generatePDF(surveyResponse: SurveyResponse) {
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
        .then(response => (this.responseSummary = response.data!.writeLetter));
    },

    letterTitle(item: SurveyResponse) {
      if (!item.survey.letters) {
        return "N/A";
      } else if (item.survey.letters.length !== 1) {
        return `${item.survey.letters.length} letters?`;
      } else {
        return item.survey.letters[0].title;
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
