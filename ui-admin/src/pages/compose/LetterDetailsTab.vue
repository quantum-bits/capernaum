<template>
  <v-card v-if="surveyLetter.letter">
    <v-row>
      <v-col>
        <v-card-title>Letter Details</v-card-title>
        <static-info-list :info="staticInfo" />
        <v-card-text>
          <letter-details-form :survey-letter="surveyLetter" v-slot="{ knobs }">
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!knobs.valid"
                color="success"
                @click="knobs.submit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </letter-details-form>
        </v-card-text>
      </v-col>

      <v-col>
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
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import LetterTextArea from "@/pages/compose/LetterTextArea.vue";
import { LetterTypeEnum } from "@/types/letter.types";
import LetterDetailsForm from "@/pages/compose/LetterDetailsForm.vue";
import StaticInfoList, {
  StaticInfoItem,
} from "@/components/lists/StaticInfoList.vue";
import prettyFormat from "pretty-format";

export default Vue.extend({
  name: "LetterDetailsTab",

  components: {
    StaticInfoList,
    LetterTextArea,
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
    staticInfo(): StaticInfoItem[] {
      return [
        {
          name: "Survey",
          value: this.surveyLetter.survey.qualtricsName,
        },
        {
          name: "Letter Type",
          value: this.surveyLetter.letterType.description,
        },
      ];
    },

    emailDescription(): string {
      return this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
        ? "Email to Group Admin"
        : "Email to Respondent";
    },
  },

  methods: {
    dump(arg: any) {
      console.debug(prettyFormat(arg));
      return arg;
    },
  },
});
</script>
