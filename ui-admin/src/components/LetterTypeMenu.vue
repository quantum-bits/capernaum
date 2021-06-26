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
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";

export default Vue.extend({
  name: "LetterTypeMenu",

  apollo: {
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
    surveys: {
      query: ALL_CAPERNAUM_SURVEYS,
      fetchPolicy: "network-only",
    },
  },

  data() {
    return {
      readLetterTypes: [] as ReadLetterTypes_readLetterTypes[],
      surveys: [] as AllCapernaumSurveys_surveys[],
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
      let allowedLetterTypes: ReadLetterTypes_readLetterTypes[] = [];

      this.readLetterTypes.forEach(
        (letterType: ReadLetterTypes_readLetterTypes) => {
          let allowAddLetter = false;

          this.surveys.forEach((survey) => {
            let hasThisType = false;
            survey.letters.forEach((letter) => {
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
