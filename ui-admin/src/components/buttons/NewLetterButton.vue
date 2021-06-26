<template>
  <span v-if="!canCreateLetter">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-btn color="primary" disabled> New Letter </v-btn>
        </span>
      </template>
      <span
        >All imported surveys already have letters of all types. To create
        another letter, please import a survey first.</span
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
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";

export default Vue.extend({
  name: "NewLetterButton",

  apollo: {
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
    surveys: {
      query: ALL_CAPERNAUM_SURVEYS,
    },
  },

  data() {
    return {
      readLetterTypes: [] as ReadLetterTypes_readLetterTypes[],
      surveys: [] as AllCapernaumSurveys_surveys[],
    };
  },

  computed: {
    canCreateLetter(): boolean {
      let allowAddLetter = false;
      this.readLetterTypes.forEach(
        (letterType: ReadLetterTypes_readLetterTypes) => {
          //let allowAddLetter = false;
          this.surveys.forEach((survey) => {
            let hasThisType = false;
            survey.letters.forEach((letter) => {
              if (letter.letterType.key === letterType.key) {
                hasThisType = true;
                console.log(
                  "this survey has this type of letter!",
                  letter.letterType.key
                );
              }
            });
            if (!hasThisType) {
              allowAddLetter = true;
              console.log(
                "one or more surveys do not yet have letters of all types!"
              );
            }
          });
        }
      );
      return allowAddLetter;
    },
  },

  methods: {
    emitAddLetter() {
      this.$emit("click", "new letter!");
    },
  },
});
</script>
