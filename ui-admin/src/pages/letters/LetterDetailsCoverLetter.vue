<template>
  <v-container>
    <tip-tap-editor
      title="Email Cover Letter"
      :initial-content="letter.emailMessage"
      @contentUpdated="saveEmailMessage"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TipTapEditor from "@/components/TipTapEditor.vue";
import { UPDATE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import {
  UpdateLetter,
  UpdateLetterVariables,
} from "@/graphql/types/UpdateLetter";
import { SurveyLetters_surveyLetters_letter } from "@/graphql/types/SurveyLetters";

export default Vue.extend({
  name: "LetterDetailsCoverLetter",

  components: {
    TipTapEditor,
  },

  props: {
    letter: {
      type: Object as () => SurveyLetters_surveyLetters_letter,
      required: true,
    },
  },

  methods: {
    saveEmailMessage(content: Record<string, unknown>) {
      console.log(content);
      this.$apollo
        .mutate<UpdateLetter, UpdateLetterVariables>({
          mutation: UPDATE_LETTER_MUTATION,
          variables: {
            letterData: {
              id: this.letter.id,
              emailMessage: JSON.stringify(content),
            },
          },
        })
        .catch((error) => {
          throw new Error(`Failed to save email message: ${error}`);
        });
    },
  },
});
</script>
