<template>
  <v-select
    label="Select a survey"
    :items="surveySelections"
    :value="value"
    @change="onChange($event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";

interface SurveySelection {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "SurveySelector",

  props: {
    surveys: {
      type: Array as () => AllCapernaumSurveys_surveys[],
      required: true,
    },
    value: Number,
  },

  computed: {
    surveySelections(): SurveySelection[] {
      return this.surveys.map((survey) => ({
        text: survey.qualtricsName,
        value: survey.id,
      }));
    },
  },

  methods: {
    onChange(surveyId: number) {
      this.$emit("input", surveyId);
    },
  },
});
</script>
