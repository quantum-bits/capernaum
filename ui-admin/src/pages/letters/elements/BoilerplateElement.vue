<template>
  <element-card :title="title" :sub-title="element.id" :card-data="cardData">
    <tip-tap-editor
      flat
      :initial-content="this.element.textDelta"
      @html-updated="htmlContent = $event"
      @save-content="saveContent"
    />
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { stripHtmlTags, truncateWords } from "@/helpers";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import TipTapEditor from "@/components/TipTapEditor.vue";
import {
  UpdateLetterElement,
  UpdateLetterElementVariables,
} from "@/graphql/types/UpdateLetterElement";
import { UPDATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";

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

  data() {
    return {
      htmlContent: "",
    };
  },

  computed: {
    title(): string {
      const truncatedText = truncateWords(stripHtmlTags(this.htmlContent));
      const segments = ["Text"];
      if (truncatedText.length > 0) {
        segments.push(`(${truncatedText})`);
      }
      return segments.join(" ");
    },
  },

  methods: {
    updateHtml(html: string) {
      this.htmlContent = html;
    },

    saveContent(content: { [key: string]: unknown }) {
      this.$apollo
        .mutate<UpdateLetterElement, UpdateLetterElementVariables>({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: this.element.id,
              textDelta: JSON.stringify(content),
            },
          },
        })
        .then((result) => console.log(result))
        .catch((error) => {
          console.error(`Save failed: ${error}`);
          throw error;
        });
    },
  },
});
</script>
