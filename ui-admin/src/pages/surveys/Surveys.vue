<template>
  <v-container>
    <page-header title="Surveys">
      <survey-selector v-model="selectedSurveyId" :surveys="surveys" />
    </page-header>
    <v-tabs v-model="currentTab" fixed-tabs>
      <v-tab>Details</v-tab>
      <v-tab>Dimensions</v-tab>
      <v-tab>Predictions</v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab" v-if="isSurveySelected">
      <v-tab-item>
        <survey-detail-tab :survey="selectedSurvey" />
      </v-tab-item>
      <v-tab-item>
        <survey-dimensions-tab :survey="selectedSurvey" />
      </v-tab-item>
      <v-tab-item>
        <survey-predictions-tab />
      </v-tab-item>
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
import SurveyDetailTab from "./SurveyDetailTab.vue";
import SurveyDimensionsTab from "./SurveyDimensionsTab.vue";
import SurveyPredictionsTab from "./PredictionTableTab.vue";

export default Vue.extend({
  name: "Surveys",

  components: {
    PageHeader,
    SurveySelector,
    SurveyDetailTab,
    SurveyDimensionsTab,
    SurveyPredictionsTab,
  },

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
