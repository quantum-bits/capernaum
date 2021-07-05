<template>
  <v-card>
    <v-card-title>Boilerplate Text</v-card-title>
    <v-card-text>
      {{ textHtml }}
    </v-card-text>
    <element-buttons />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ElementButtons from "@/pages/letters/elements/ElementButtons.vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";

export default Vue.extend({
  name: "BoilerplateElement",

  components: { ElementButtons },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
  },

  data() {
    return {
      textHtml: this.element.textDelta,
    };
  },
});
</script>
