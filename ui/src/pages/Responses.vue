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
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div v-if="selectedResponse">
          <div v-if="responseDetails">
            <h4>Details</h4>
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
                    {{ surveyIndex.title }} ({{ surveyIndex.abbreviation }})
                    [[{{ meanResponse(surveyIndex.surveyItems) }}]]
                    <ol>
                      <li
                        v-for="item in surveyIndex.surveyItems"
                        :key="item.id"
                      >
                        ({{ item.qualtricsId }} =
                        {{ item.surveyItemResponses[0].value }})
                        {{ item.qualtricsText }}
                      </li>
                    </ol>
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
import { ResponseSummary } from "@/graphql/types/ResponseSummary";
import mean from "lodash/mean";
import { ResponseDetails_surveyResponse_survey_surveyDimensions_surveyIndices_surveyItems as SurveyItem } from "@/graphql/types/ResponseDetails";

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

      update: data => data.surveyResponse,

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
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Response ID", value: "qualtricsResponseId" },
        { text: "Email", value: "email" },
        { text: "Start", value: "startDate" },
        { text: "End", value: "endDate" },
        { text: "Duration", value: "duration" },
        { text: "Finished", value: "finished" }
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
    meanResponse(surveyItems: SurveyItem[]) {
      return mean(
        surveyItems.map(item => item.surveyItemResponses[0].value)
      ).toPrecision(3);
    },

    showDetails(item: any) {
      this.selectedResponse = item.id;
    },

    async fetchFromQualtrics() {
      try {
        console.log("IMPORT RESPONSES", this.selectedQualtricsId);
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
        console.log("QR", queryResult);
        const responseSummary = queryResult.data;
        console.log("responseSummary", responseSummary);
        this.responseSummary = responseSummary;
      } catch (err) {
        throw err;
      }
    }
  }
});
</script>
