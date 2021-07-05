<template>
  <element-card
    :title="`Dimension (${element.surveyDimension.title})`"
    :show-content="showContent"
  >
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";

export default Vue.extend({
  name: "DimensionChartElement",

  components: { ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    showContent: { type: Boolean, default: true },
  },
});
</script>
