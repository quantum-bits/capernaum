<template>
  <v-container>
    <page-header title="Surveys">
      <survey-selector v-model="selectedSurveyId" :surveys="surveys" />
    </page-header>
    <v-tabs v-model="currentTab" fixed-tabs>
      <v-tab>Details</v-tab>
      <v-tab>Dimensions</v-tab>
      <v-tab>Indices</v-tab>
      <v-tab>Predictions</v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab" v-if="isSurveySelected">
      <v-tab-item>
        <v-card flat>
          <v-card-title> Details </v-card-title>
          <v-card-text>
            {{ selectedSurvey }}
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>X Dimensions</v-tab-item>
      <v-tab-item>X Indices</v-tab-item>
      <v-tab-item>X Prediction</v-tab-item>
    </v-tabs-items>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "@/pages/PageHeader.vue";
import SurveySelector from "@/components/SurveySelector.vue";
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import {
  AllCapernaumSurveys,
  AllCapernaumSurveys_surveys,
} from "@/graphql/types/AllCapernaumSurveys";
import * as is from "is";

export default Vue.extend({
  name: "Surveys",

  components: { PageHeader, SurveySelector },

  data() {
    return {
      surveys: [] as AllCapernaumSurveys_surveys[],
      currentTab: 0,
      selectedSurveyId: undefined as number | undefined,
      selectedSurvey: undefined as AllCapernaumSurveys_surveys | undefined,
    };
  },

  mounted() {
    this.$apollo
      .query<AllCapernaumSurveys>({ query: ALL_CAPERNAUM_SURVEYS })
      .then((response) => {
        // Set local data.
        this.surveys = response.data.surveys;

        // Check for URL parameter.
        const surveyId = this.$route.params.surveyId;
        if (surveyId) {
          this.selectedSurveyId = parseInt(surveyId);
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  computed: {
    isSurveySelected(): boolean {
      return is.defined(this.selectedSurvey);
    },
  },

  watch: {
    selectedSurveyId: function (): void {
      const possibleSurvey = this.surveys.find(
        (survey) => survey.id === this.selectedSurveyId
      );

      if (possibleSurvey) {
        this.selectedSurvey = possibleSurvey;
      } else {
        throw new Error(`Can't find survey ${this.selectedSurveyId}`);
      }
    },
  },
});
</script>
