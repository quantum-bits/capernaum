<template>
  <v-select
    v-model="letterTypeSelect"
    :items="letterTypes"
    :rules="letterTypeSelectionRules"
    label="Type of Letter"
    item-text="description"
    item-value="id"
    required
    persistent-hint
    return-object
    single-line
    @change="emitLetterType()"
  />
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

//interface LetterType extends ReadLetterTypes_readLetterTypes {
//  allowAddLetter: boolean;
//}

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
      letterTypeSelect: {
        description: "",
        id: -Infinity,
        key: "",
      } as ReadLetterTypes_readLetterTypes,
      letterTypeSelectionRules: [
        (v: ReadLetterTypes_readLetterTypes): string | boolean =>
          (v && v.id !== -Infinity) ||
          "Type of letter is required.  Note that only one letter of each type may be associated with each imported survey, so if no letter types show up in the above list, it may mean that all surveys already have a letter of all possible types.",
      ],
    };
  },

  computed: {
    letterTypes(): ReadLetterTypes_readLetterTypes[] {
      // https://stackoverflow.com/questions/38922998/add-property-to-an-array-of-objects
      //let letterTypeArray: LetterType[] = this.readLetterTypes.map((obj) => ({
      //  ...obj,
      //  allowAddLetter: true,
      //}));
      let allowedLetterTypes: ReadLetterTypes_readLetterTypes[] = [];

      this.readLetterTypes.forEach(
        (letterType: ReadLetterTypes_readLetterTypes) => {
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
          //letterType.allowAddLetter = allowAddLetter;
          if (allowAddLetter) {
            allowedLetterTypes.push(letterType);
          }
        }
      );
      //console.log("computed letter type array:", letterTypeArray);
      console.log("allowed letter types: ", allowedLetterTypes);

      return allowedLetterTypes;
    },
  },

  methods: {
    //emitLetterType(readLetterType: ReadLetterTypes_readLetterTypes) {
    //  this.$emit("click", this.letterTypeSelect);
    //},
    emitLetterType() {
      this.$emit("click", this.letterTypeSelect);
    },
  },
});
</script>
