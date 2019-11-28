<template>
  <v-container>
    <v-row class="align-baseline">
      <v-col>Fetch Responses from Qualtrics</v-col>
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
            <v-icon class="mr-2" @click="generatePDF(item)">
              mdi-pdf-box
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row v-if="haveResponseSummary">
      <v-col>
        <ol>
          <li>
            Survey ({{ responseSummary.responseSummary.surveySummary.id }} -
            {{ responseSummary.responseSummary.surveySummary.qualtricsId }})
            <ul>
              <li>
                Title {{ responseSummary.responseSummary.surveySummary.title }}
              </li>
              <li>
                Q Name
                {{
                  responseSummary.responseSummary.surveySummary.qualtricsName
                }}
              </li>
            </ul>
          </li>
          <li>
            Response ({{ responseSummary.responseSummary.id }} -
            {{ responseSummary.responseSummary.qualtricsResponseId }})
            <ul>
              <li>Status {{ responseSummary.ok ? "OK" : "FAILED" }}</li>
              <li>Date {{ responseSummary.responseSummary.date }}</li>
              <li>Email {{ responseSummary.responseSummary.email }}</li>
              <li>
                <a :href="responseSummary.pdfUrl" target="_blank">PDF File </a>
              </li>
            </ul>
          </li>
          <li>
            Dimensions
            <ol>
              <li
                v-for="dim in responseSummary.responseSummary
                  .dimensionSummaries"
                :key="dim.id"
              >
                (ID {{ dim.id }}) {{ dim.title }}
                <ol>
                  <li v-for="index in dim.indexSummaries" :key="index.id">
                    ({{ index.id }} - {{ index.abbreviation }})
                    {{ index.title }} = {{ index.meanResponse }}
                    <ol>
                      <li v-for="item in index.itemSummaries" :key="item.id">
                        ({{ item.id }} {{ item.qualtricsId }})
                        {{ item.qualtricsText }} ({{ item.responseId }}) =
                        {{ item.responseValue }} - {{ item.responseLabel }}
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
          <li>
            Predictions
            <ol>
              <li
                v-for="prediction in responseSummary.responseSummary
                  .predictionSummaries"
                :key="prediction.practiceSummary.id"
              >
                ({{ prediction.practiceSummary.id }})
                {{ prediction.practiceSummary.title }}
                {{ prediction.predict ? "PREDICT" : "DON'T PREDICT" }}
                <ol>
                  <li
                    v-for="details in prediction.predictionDetails"
                    :key="details.abbreviation"
                  >
                    {{ details.title }}
                    ({{ details.abbreviation }})
                    {{ details.meanResponse }}
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      </v-col>
    </v-row>
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
  AllResponses_surveyResponses
} from "@/graphql/types/AllResponses";
import {
  WriteLetter,
  WriteLetter_writeLetter
} from "@/graphql/types/WriteLetter";
import isEmpty from "lodash/isEmpty";

interface ImportedSurvey {
  id: number;
  title: string;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
}

export default Vue.extend({
  name: "Responses",

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

      responseSummary: {} as WriteLetter_writeLetter
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
    generatePDF(surveyResponse: AllResponses_surveyResponses) {
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

    letterTitle(item: AllResponses_surveyResponses) {
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
