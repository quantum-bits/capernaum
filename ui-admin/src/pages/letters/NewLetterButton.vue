<template>
  <span v-if="!canCreateLetter">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-btn color="primary" disabled> New Letter </v-btn>
        </span>
      </template>
      <span>
        All imported surveys already have letters of all types. To create
        another letter, please import a survey first.
      </span>
    </v-tooltip>
  </span>
  <span v-else>
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          :disabled="!canCreateLetter"
          v-on="on"
          v-bind="attrs"
        >
          New Letter
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(missing, idx) in missingLetters" :key="idx">
          <v-list-item-title @click="addLetter(missing)">
            {{ missing.survey.qualtricsName }}
            ({{ missing.letterType.description }})
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import {
  CREATE_SURVEY_LETTER,
  LETTERS_AND_SURVEYS,
} from "@/graphql/letters.graphql";
import {
  LettersForSurveys_letterTypes,
  LettersForSurveys_surveys,
} from "@/graphql/types/LettersForSurveys";
import * as _ from "lodash";
import {
  CreateSurveyLetter,
  CreateSurveyLetterVariables,
} from "@/graphql/types/CreateSurveyLetter";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";

// Track `survey` missing a letter of type `letterType`.
interface MissingLetter {
  survey: LettersForSurveys_surveys;
  letterType: LettersForSurveys_letterTypes;
}

export default Vue.extend({
  name: "NewLetterButton",

  apollo: {
    lettersForSurveys: {
      query: LETTERS_AND_SURVEYS,
      update(data) {
        this.letterTypes = data.letterTypes;
        this.surveys = data.surveys.filter(
          (survey: LettersForSurveys_surveys) => !!survey.importedDate
        );
      },
    },
  },

  props: {
    // Current survey-letter combinations
    currentSurveyLetters: {
      type: Array as () => SurveyLetters_surveyLetters[],
      required: true,
    },
  },

  data() {
    return {
      // All the letter types.
      letterTypes: [] as LettersForSurveys_letterTypes[],
      // All the known surveys.
      surveys: [] as LettersForSurveys_surveys[],
    };
  },

  computed: {
    missingLetters(): MissingLetter[] {
      const missing: MissingLetter[] = [];
      _.forEach(this.surveys, (survey) => {
        _.forEach(this.letterTypes, (letterType) => {
          if (
            _.find(
              this.currentSurveyLetters,
              (csl) =>
                csl.survey.id === survey.id &&
                csl.letterType.id === letterType.id
            )
          ) {
            // Already have a survey-letter that matches.
            console.log(
              `'${survey.qualtricsName}' has type '${letterType.key}'`
            );
          } else {
            // No survey-letter of this type.
            missing.push({ survey: survey, letterType: letterType });
          }
        });
      });

      console.log("Missing letters", missing);
      return missing;
    },

    canCreateLetter(): boolean {
      return this.missingLetters.length > 0;
    },
  },

  methods: {
    addLetter(missingLetter: MissingLetter) {
      this.$apollo
        .mutate<CreateSurveyLetter, CreateSurveyLetterVariables>({
          mutation: CREATE_SURVEY_LETTER,
          variables: {
            input: {
              surveyId: missingLetter.survey.id,
              letterTypeId: missingLetter.letterType.id,
            },
          },
        })
        .then((result) => {
          const newSurveyLetter = result.data?.createSurveyLetter;
          if (newSurveyLetter) {
            this.$emit("addedLetter", newSurveyLetter);
            this.$router.push({
              name: "compose",
              params: { surveyLetterId: newSurveyLetter.id.toString() },
            });
          } else {
            throw new Error("Failed to add survey letter");
          }
        });
    },
  },
});
</script>
