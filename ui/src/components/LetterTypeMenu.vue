<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
              Add Letter
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in letterTypes"
              :key="item.key"
              :disabled="!item.allowAddLetter"
              @click="emitLetterType(item)"
            >
              <v-list-item-title>{{ item.description }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </span>
    </template>
    <span
      >All imported surveys already have a letter. To create another letter,
      please import a survey first.</span
    >
  </v-tooltip>
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

interface LetterType extends ReadLetterTypes_readLetterTypes {
  allowAddLetter: boolean;
}

export default Vue.extend({
  name: "LetterTypeMenu",

  apollo: {
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update(data: AllSurveys) {
        //this.allSurveysHaveLetters = data.surveys.every(
        //  (survey) => survey.letter !== null
        //);
        console.log("surveys! ", data.surveys);
        return data.surveys;
      },
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
    letterTypes(): LetterType[] {
      // https://stackoverflow.com/questions/38922998/add-property-to-an-array-of-objects
      let letterTypeArray: LetterType[] = this.readLetterTypes.map((obj) => ({
        ...obj,
        allowAddLetter: true,
      }));
      letterTypeArray.forEach((letterType: LetterType) => {
        let allowAddLetter = false;

        this.surveys.forEach((survey) => {
          let hasThisType = false;
          survey.letters.forEach((letter: AllSurveys_surveys_letters) => {
            if (letter.letterType.key === letterType.key) {
              hasThisType = true;
            }
          });
          if (!hasThisType) {
            allowAddLetter = true;
          }
        });
        letterType.allowAddLetter = allowAddLetter;
      });
      console.log("computed letter type array:", letterTypeArray);
      return letterTypeArray;
    },
  },

  methods: {
    emitLetterType(readLetterType: ReadLetterTypes_readLetterTypes) {
      this.$emit("click", readLetterType);
    },
  },
});
</script>
