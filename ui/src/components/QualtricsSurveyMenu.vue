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
import { isEmpty } from "lodash";
import { ALL_QUALTRICS_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { QualtricsSurveys_qualtricsSurveys } from "@/graphql/types/QualtricsSurveys";
import { QualtricsSurveySelection } from "@/pages/survey.types";

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
      update: data => data.qualtricsSurveys,
      fetchPolicy: "network-only"
    }
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      availableQualtricsSurveys: [] as Array<QualtricsSurveys_qualtricsSurveys>,
      //https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
      surveySelectionRules: [
        () =>
          !isEmpty(this.value) ||
          "Survey is required.  Note that each survey may only be imported once, so if the above list is empty, it may mean that all surveys have already been imported."
      ] as any
    };
  },

  computed: {
    selections(): QualtricsSurveySelection[] {
      return this.availableQualtricsSurveys
        .filter(survey => survey.importedToCapernaum)
        .map(survey => ({
          text: survey.qualtricsName,
          value: survey.qualtricsId
        }));
    }
  }
});
</script>
