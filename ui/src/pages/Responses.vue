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
          :items="responseSummary.surveyResponses"
          class="elevation-1"
          @click:row="showDetails"
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

    <v-row>
      <v-col>
        <div v-if="selectedResponse">
          <div v-if="responseDetails">
            <h4>Details ({{ responseDetails.email }})</h4>
            <ol>
              <li
                v-for="dimension in responseDetails.survey.surveyDimensions"
                :key="dimension.id"
              >
                {{ dimension.title }}
                <ol>
                  <li
                    v-for="surveyIndex in dimension.surveyIndices"
                    :key="surveyIndex.id"
                  >
                    {{ surveyIndex.title }} ({{ surveyIndex.abbreviation }}) =
                    {{ meanResponse(surveyIndex) }}
                    <ul>
                      <li
                        v-for="item in itemsWithResponse(surveyIndex)"
                        :key="item.id"
                      >
                        ({{ item.qualtricsId }} =
                        {{ item.surveyItemResponse.value }})
                        {{ item.qualtricsText }}
                      </li>
                    </ul>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
          <p v-else>This person submitted no responses.</p>
        </div>
        <p v-else>Click a response for details.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  IMPORT_SURVEY_RESPONSES,
  ONE_RESPONSE_DETAIL_QUERY,
  RESPONSE_SUMMARY_QUERY
} from "@/graphql/responses.graphql";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import {
  ResponseSummary,
  ResponseSummary_surveyResponses
} from "@/graphql/types/ResponseSummary";
import mean from "lodash/mean";
import { ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems as SurveyItem } from "@/graphql/types/ResponseDetails";
import { ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices as SurveyIndex } from "@/graphql/types/ResponseDetails";
import { AllSurveys_surveys } from "@/graphql/types/AllSurveys";
import { WRITE_LETTER_MUTATION } from "@/graphql/letters.graphql";

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

    responseSummary: {
      query: RESPONSE_SUMMARY_QUERY,
      update: data => data
    },

    responseDetails: {
      query: ONE_RESPONSE_DETAIL_QUERY,
      variables() {
        return {
          id: this.selectedResponse
        };
      },
      update(data) {
        return data.surveyResponse;
      },
      skip() {
        return !this.selectedResponse;
      }
    }
  },

  data() {
    return {
      surveys: [] as ImportedSurvey[],
      selectedQualtricsId: "",

      responseSummary: {} as ResponseSummary,
      masterHeaders: [
        { text: "Date", value: "date" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Letter", value: "letter" },
        { text: "Response ID", value: "qualtricsResponseId" },
        { text: "Email", value: "email" },
        { text: "Action", value: "action" }
      ],

      selectedResponse: null,
      responseDetails: null
    };
  },

  computed: {
    availableSurveys(): object {
      return this.surveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
      }));
    }
  },

  methods: {
    generatePDF(surveyResponse: ResponseSummary_surveyResponses) {
      this.$apollo.mutate({
        mutation: WRITE_LETTER_MUTATION,
        variables: {
          letterWriterInput: {
            letterId: surveyResponse.survey.letters[0].id,
            surveyResponseId: surveyResponse.id
          }
        }
      });
    },

    meanResponse(surveyIndex: SurveyIndex) {
      const validItems = this.itemsWithResponse(surveyIndex);
      return mean(
        validItems.map(item => item.surveyItemResponse!.value)
      ).toPrecision(3);
    },

    letterTitle(item: ResponseSummary_surveyResponses) {
      if (!item.survey.letters) {
        return "N/A";
      } else if (item.survey.letters.length !== 1) {
        return `${item.survey.letters.length} letters?`;
      } else {
        return item.survey.letters[0].title;
      }
    },

    itemsWithResponse(index: SurveyIndex) {
      return index.surveyItems.filter(item => item.surveyItemResponse);
    },

    showDetails(item: any) {
      this.selectedResponse = item.id;
    },

    async fetchFromQualtrics() {
      try {
        // Import all responses for one survey from the Qualtrics API.
        await this.$apollo.mutate({
          mutation: IMPORT_SURVEY_RESPONSES,
          variables: {
            qId: this.selectedQualtricsId
          },
          refetchQueries: ["ResponseSummary"]
        });

        // Read them in to refresh the table.
        const queryResult = await this.$apollo.query<ResponseSummary>({
          query: RESPONSE_SUMMARY_QUERY
        });
        const responseSummary = queryResult.data;
        this.responseSummary = responseSummary;
      } catch (err) {
        throw err;
      }
    }
  }
});
</script>
