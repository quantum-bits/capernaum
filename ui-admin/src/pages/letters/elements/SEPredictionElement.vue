<template>
  <element-card title="SE Prediction" :card-data="cardData">
    AN SEP PREDICTION
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { CardData } from "@/pages/letters/LetterContentTab.vue";

export default Vue.extend({
  name: "SEPredictionElement",

  components: { ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    cardData: { type: Object as () => CardData, required: true },
  },
});
</script>
