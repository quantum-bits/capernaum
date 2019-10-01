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
import { QualtricsSurveySelection } from "@/pages/survey.types";

export interface QualtricsSurveyListItem {
  qualtricsId: string;
  qualtricsName: string;
}

export default Vue.extend({
  name: "QualtricsSurveyMenu",

  apollo: {
    qualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY
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
      qualtricsSurveys: [] as Array<QualtricsSurveyListItem>
    };
  },

  computed: {
    selections(): QualtricsSurveySelection[] {
      return this.qualtricsSurveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
      }));
    }
  }
});
</script>
