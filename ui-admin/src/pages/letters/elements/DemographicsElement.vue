<template>
  <v-card>
    <v-card-title>Demographics</v-card-title>
    <v-card-text> </v-card-text>
    <edit-save-delete-cancel-buttons />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";

export default Vue.extend({
  name: "DemographicsElement",

  components: { EditSaveDeleteCancelButtons },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
  },
});
</script>
