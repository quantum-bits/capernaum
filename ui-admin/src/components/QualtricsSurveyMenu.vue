<template>
  <v-select
    :value="value"
    @change="$emit('input', $event)"
    :items="selections"
    :rules="surveySelectionRules"
    label="Qualtrics Survey"
    required
    persistent-hint
    return-object
    single-line
  />
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_QUALTRICS_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { QualtricsSurveys } from "@/graphql/types/QualtricsSurveys";
import { QualtricsSurveySelection } from "@/pages/survey.types";
import is from "is";

export default Vue.extend({
  /**
   * Present a select list containing active Qualtrics surveys.
   * Emits an object containing the
   * - Qualtrics name (`text` property)
   * - Qualtrics ID (`value` property)
   * of the selected survey.
   */
  name: "QualtricsSurveyMenu",

  apollo: {
    availableQualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY,
      fetchPolicy: "network-only",
    },
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      availableQualtricsSurveys: {} as QualtricsSurveys,
      surveySelectionRules: [
        (): boolean | string =>
          !is.defined(this.value) ||
          "Survey is required.  Note that each survey may only be imported once, so if the above list is empty, it may mean that all surveys have already been imported.",
      ],
    };
  },

  computed: {
    selections(): QualtricsSurveySelection[] {
      return this.availableQualtricsSurveys.qualtricsSurveys
        .filter((survey) => is.defined(survey.capernaumSurvey))
        .map((survey) => ({
          text: survey.qualtricsName,
          value: survey.qualtricsId,
        }));
    },
  },
});
</script>
