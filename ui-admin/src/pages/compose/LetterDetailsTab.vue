<template>
  <div>
    <div v-if="surveyLetter.letter">
      <v-row>
        <v-col xs7 offset-xs1>
          <h2 class="title font-weight-regular mb-1">
            Letter:
            <span class="font-weight-light">{{
              surveyLetter.letter.title
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Description:
            <span class="font-weight-light">{{
              surveyLetter.letter.description
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Letter Type:
            <span class="font-weight-light">{{
              surveyLetter.letterType.description
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Survey:
            <span class="font-weight-light">
              {{ surveyLetter.survey.qualtricsName }}
            </span>
          </h2>
          <h2 class="title font-weight-regular mb-5">
            Last Update:
            <span class="font-weight-light">
              {{ surveyLetter.letter.updated | standardDateTime }}
            </span>
          </h2>
        </v-col>
        <v-col class="text-xs-right">
          <v-btn color="primary" dark @click="toggleEditMode"> Edit </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-if="surveyLetter && editModeOn">
      <LetterInfoForm
        :id="surveyLetter.letter.id"
        :surveyId="surveyLetter.survey.id"
        :initialTitle="surveyLetter.letter.title"
        :initialDescription="surveyLetter.letter.description"
        :letterTypeDescription="surveyLetter.letterType.description"
        :isNew="isNew"
        v-on:letter-info-updated="letterInfoUpdated"
      >
      </LetterInfoForm>
    </div>
    <div v-if="letterIsNewAndEditModeOn">
      <LetterInfoForm
        :isNew="isNew"
        v-on:letter-created="newLetterCreated($event)"
      >
      </LetterInfoForm>
    </div>
    <div v-if="surveyLetter">
      <v-row>
        <v-col>
          <h2 class="title font-weight-regular mb-1">
            Boolean Association Table: NOT HERE ANY LONGER
            <!-- FIXME --->
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2 class="title font-weight-regular mb-3 mt-4">Text for Email:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <LetterTextArea
            :letterId="surveyLetter.letter.id"
            :initialTextDelta="surveyLetter.letter.emailMessage"
            :description="emailDescription"
            :isEmailText="'true'"
            v-on:edit-mode-on="setEmailEditModeOn()"
            v-on:edit-mode-off="setEmailEditModeOff()"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import LetterTextArea from "@/pages/compose/LetterTextArea.vue";
import LetterInfoForm from "@/pages/compose/LetterInfoForm.vue";

export default Vue.extend({
  name: "LetterDetailsTab",

  components: {
    LetterTextArea,
    LetterInfoForm,
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },
});
</script>

<style scoped></style>
