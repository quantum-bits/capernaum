<template>
  <v-select
    :value="value"
    @change="$emit('input', $event)"
    :items="selections"
    :rules="[v => !!v || 'A survey must be selected']"
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
import {
  QualtricsSurvey,
  QualtricsSurveySelection
} from "@/pages/survey.types";

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
      update: data => data.qualtricsSurveys
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
      availableQualtricsSurveys: [] as Array<QualtricsSurvey>
    };
  },

  computed: {
    selections(): QualtricsSurveySelection[] {
      return this.availableQualtricsSurveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
      }));
    }
  }
});
</script>
