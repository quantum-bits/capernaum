<template>
  <element-card
    title="Scripture Engagement Counts"
    :sub-title="element.id"
    :card-data="cardData"
  >
    Scripture engagement count data will appear here.
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";

export default Vue.extend({
  name: "SECountElement",

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
