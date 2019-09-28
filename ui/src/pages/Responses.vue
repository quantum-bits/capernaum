<template>
  <v-container>
    <v-row>
      <v-col>
        <h4>All Responses</h4>
        <v-data-table
          :headers="masterHeaders"
          :items="responseSummaries"
          class="elevation-1"
          @click:row="showDetails"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div v-if="selectedResponse">
          <div v-if="responseDetails.length">
            <h4>Details ({{ responseDetails.length }} responses)</h4>
            <v-data-table
              :headers="detailHeaders"
              :items="responseDetails"
              class="elevation-1"
            />
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
  RESPONSES_SUMMARY_QUERY,
  ONE_RESPONSE_DETAIL_QUERY
} from "@/graphql/responses.graphql";

export default Vue.extend({
  name: "Responses",

  apollo: {
    responseSummaries: {
      query: RESPONSES_SUMMARY_QUERY,
      update: data => data.surveyResponses
    },

    responseDetails: {
      query: ONE_RESPONSE_DETAIL_QUERY,
      variables() {
        return {
          id: this.selectedResponse
        };
      },
      update: data => data.surveyResponse.surveyItemResponses,
      skip() {
        return !this.selectedResponse;
      }
    }
  },

  data() {
    return {
      responseSummaries: [],
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
      responseDetails: [],
      detailHeaders: [
        { text: "ID", value: "surveyItem.qualtricsId" },
        { text: "Text", value: "surveyItem.qualtricsText" },
        { text: "Choice", value: "value" },
        { text: "Response", value: "label" }
      ]
    };
  },

  methods: {
    showDetails(item: any) {
      this.selectedResponse = item.id;
    }
  }
});
</script>
