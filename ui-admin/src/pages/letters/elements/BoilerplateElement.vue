<template>
  <element-card :title="title">
    <span v-html="textHtml" />
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { quillDeltaToHtml, stripHtmlTags, truncateWords } from "@/helpers";

export default Vue.extend({
  name: "BoilerplateElement",

  components: { ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
  },

  computed: {
    textHtml(): string {
      return this.element.textDelta
        ? quillDeltaToHtml(this.element.textDelta)
        : "NO QUILL DELTA";
    },

    title(): string {
      return `Text (${truncateWords(stripHtmlTags(this.textHtml))}...)`;
    },
  },
});
</script>
