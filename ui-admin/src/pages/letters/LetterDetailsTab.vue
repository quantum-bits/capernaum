<template>
  <v-container v-if="surveyLetter.letter">
    <v-row>
      <v-col>
        <letter-details-form :survey-letter="surveyLetter" />
      </v-col>

      <v-col>
        <letter-details-cover-letter :email-message="emailMessage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import { isQuillDeltaString, quillDeltaToTipTapJson } from "@/helpers";
import LetterDetailsForm from "@/pages/letters/LetterDetailsForm.vue";
import LetterDetailsCoverLetter from "@/pages/letters/LetterDetailsCoverLetter.vue";

export default Vue.extend({
  name: "LetterDetailsTab",

  components: {
    LetterDetailsCoverLetter,
    LetterDetailsForm,
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      inEditMode: false,
    };
  },

  computed: {
    emailMessage(): Record<string, any> {
      const emailMessage = this.surveyLetter.letter.emailMessage;
      if (isQuillDeltaString(emailMessage)) {
        return quillDeltaToTipTapJson(emailMessage);
      } else {
        return JSON.parse(this.surveyLetter.letter.emailMessage);
      }
    },
  },
});
</script>
