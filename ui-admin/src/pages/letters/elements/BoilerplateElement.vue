<template>
  <element-card :title="title" :sub-title="element.id" :card-data="cardData">
    <tip-tap-editor flat :initial-content="this.element.textDelta" />
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { quillDeltaToHtml, stripHtmlTags, truncateWords } from "@/helpers";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import TipTapEditor from "@/components/TipTapEditor.vue";

export default Vue.extend({
  name: "BoilerplateElement",

  components: { TipTapEditor, ElementCard },

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
