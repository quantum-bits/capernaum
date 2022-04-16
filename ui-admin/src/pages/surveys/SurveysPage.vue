<template>
  <v-container>
    <page-header title="Surveys">
      <v-select
        label="Select an imported survey (import using Qualtrics tab)"
        v-model="selectedSurveyId"
        :items="availableSurveys"
        @change="onSurveySelected"
      />
    </page-header>
    <v-tabs v-model="currentTab" fixed-tabs>
      <v-tab>Details</v-tab>
      <v-tab>Dimensions</v-tab>
      <v-tab>Associations</v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab" v-if="selectedSurveyId > 0">
      <v-tab-item>
        <survey-detail-tab :survey="selectedSurvey" />
      </v-tab-item>
      <v-tab-item>
        <survey-dimensions-tab
          :survey="selectedSurvey"
          @survey-updated="onSurveyUpdated"
        />
      </v-tab-item>
      <v-tab-item>
        <prediction-table-tab :survey="selectedSurvey" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "@/pages/PageHeader.vue";
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import {
  AllCapernaumSurveys,
  AllCapernaumSurveys_surveys as SurveyEntity,
} from "@/graphql/types/AllCapernaumSurveys";
import SurveyDetailTab from "./SurveyDetailsTab.vue";
import SurveyDimensionsTab from "./SurveyDimensionsTab.vue";
import PredictionTableTab from "@/pages/surveys/PredictionTableTab.vue";
import * as _ from "lodash";

interface Selection {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "SurveysPage",

  components: {
    PageHeader,
    SurveyDetailTab,
    SurveyDimensionsTab,
    PredictionTableTab,
  },

  data() {
    return {
      surveys: [] as SurveyEntity[],
      currentTab: 0,
      selectedSurveyId: undefined as number | undefined,
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
    availableSurveys(): Selection[] {
      return this.surveys
        .filter((survey) => !!survey.importedDate)
        .map((survey) => ({
          text: survey.qualtricsName,
          value: survey.id,
        }));
    },

    selectedSurvey(): SurveyEntity | undefined {
      return _.find(
        this.surveys,
        (survey) => survey.id === this.selectedSurveyId
      );
    },
  },

  methods: {
    onSurveySelected(surveyId: number) {
      this.selectedSurveyId = surveyId;
      this.$router.replace({
        name: "surveys",
        params: { surveyId: surveyId.toString() },
      });
    },

    onSurveyUpdated(survey: SurveyEntity) {
      if (this.selectedSurveyId) {
        this.$set(this.surveys, this.selectedSurveyId, survey);
        console.log(`Set survey ${this.selectedSurveyId} to`, survey);
      } else {
        throw new Error("Selected survey ID is not set");
      }
    },
  },
});
</script>
