<template>
  <span v-if="!canCreateLetter">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-btn color="primary" disabled>
            New Letter
          </v-btn>
        </span>
      </template>
      <span
        >All imported surveys already have a letter. To create another letter,
        please import a survey first.</span
      >
    </v-tooltip>
  </span>
  <span v-else>
    <v-btn
      color="primary"
      :disabled="!canCreateLetter"
      @click="emitAddLetter()"
    >
      New Letter
    </v-btn>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_LETTER_TYPES_QUERY } from "@/graphql/letters.graphql";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";
import {
  AllSurveys,
  AllSurveys_surveys,
  AllSurveys_surveys_letters,
} from "@/graphql/types/AllSurveys";


export default Vue.extend({
  name: "NewLetterButton",

  apollo: {
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
    surveys: {
      query: ALL_SURVEYS_QUERY,
      //update(data: AllSurveys) {
        //this.allSurveysHaveLetters = data.surveys.every(
        //  (survey) => survey.letter !== null
        //);
      //  console.log("surveys! ", data.surveys);
      //  return data.surveys;
      //},
      fetchPolicy: "network-only",
    },
  },

  data() {
    return {
      readLetterTypes: [] as ReadLetterTypes_readLetterTypes[],
      surveys: [] as AllSurveys_surveys[],
    };
  },

  computed: {
    canCreateLetter(): boolean {
      // https://stackoverflow.com/questions/38922998/add-property-to-an-array-of-objects
      //let letterTypeArray: LetterType[] = this.readLetterTypes.map((obj) => ({
      //  ...obj,
      //  allowAddLetter: true,
      //}));
      let allowAddLetter = false;
      this.readLetterTypes.forEach((letterType: ReadLetterTypes_readLetterTypes) => {
        //let allowAddLetter = false;
        this.surveys.forEach((survey) => {
          let hasThisType = false;
          survey.letters.forEach((letter: AllSurveys_surveys_letters) => {
            if (letter.letterType.key === letterType.key) {
              hasThisType = true;
              console.log('this survey has this type of letter!', letter.letterType.key);
            }
          });
          if (!hasThisType) {
            allowAddLetter = true;
            console.log('one or more surveys do not yet have letters of all types!');
          }
        });
      });
      return allowAddLetter;
    },
  },

  methods: {
    emitAddLetter() {
      this.$emit("click", 'new letter!');
    },
  },
});
</script>
