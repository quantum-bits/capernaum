<template>
  <v-container v-if="surveyLetter.letter">
    <v-row>
      <v-col>
        <letter-details-card :survey-letter="surveyLetter" />
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>{{ emailDescription }}</v-card-title>
          <letter-text-area
            :letterId="surveyLetter.letter.id"
            :initialTextDelta="surveyLetter.letter.emailMessage"
            :isEmailText="true"
          />
          <!-- FIXME - This was inside the previous element.
        v-on:edit-mode-on="setEmailEditModeOn()"
        v-on:edit-mode-off="setEmailEditModeOff()"
        -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import LetterTextArea from "@/pages/letters/LetterTextArea.vue";
import LetterDetailsCard from "@/pages/letters/LetterDetailsCard.vue";

export default Vue.extend({
  name: "LetterDetailsTab",

  components: {
    LetterTextArea,
    LetterDetailsCard,
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
    emailDescription(): string {
      // return
      // FIXME
      // this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
      //   ? "Email to Group Admin"
      //   :
      return "Email";
    },
  },
});
</script>
