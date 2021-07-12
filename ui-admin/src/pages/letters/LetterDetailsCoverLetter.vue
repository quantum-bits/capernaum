<template>
  <v-container>
    <tip-tap-editor
      title="Email Cover Letter"
      :tip-tap-json="messageContent"
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
import { isQuillDeltaString, quillDeltaToTipTapJson } from "@/helpers";

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

  computed: {
    messageContent(): Record<string, unknown> {
      const emailMessage = this.letter.emailMessage;
      if (isQuillDeltaString(emailMessage)) {
        return quillDeltaToTipTapJson(emailMessage);
      } else {
        return JSON.parse(this.letter.emailMessage);
      }
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
