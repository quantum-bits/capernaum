<template>
  <element-card :title="title" :sub-title="element.id" :card-data="cardData">
    <span v-html="textHtml" />
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { quillDeltaToHtml, stripHtmlTags, truncateWords } from "@/helpers";
import { CardData } from "@/pages/letters/LetterContentTab.vue";

export default Vue.extend({
  name: "BoilerplateElement",

  components: { ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    cardData: { type: Object as () => CardData, required: true },
  },

  computed: {
    title(): string {
      return `Text (${truncateWords(stripHtmlTags(this.textHtml))}...)`;
    },

    textHtml(): string {
      return this.element.textDelta
        ? quillDeltaToHtml(this.element.textDelta)
        : "NO QUILL DELTA";
    },
  },
});
</script>
