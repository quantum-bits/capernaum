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
  LETTERS_FOR_SURVEYS,
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

// Track `survey` missing a letter of type `letterType`.
interface MissingLetter {
  survey: LettersForSurveys_surveys;
  letterType: LettersForSurveys_letterTypes;
}

export default Vue.extend({
  name: "NewLetterButton",

  apollo: {
    lettersForSurveys: {
      query: LETTERS_FOR_SURVEYS,
      update(data) {
        this.letterTypes = data.letterTypes;
        this.surveys = data.surveys;
      },
    },
  },

  data() {
    return {
      letterTypes: [] as LettersForSurveys_letterTypes[],
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
              survey.surveyLetters,
              (sl) => sl.letterType.id === letterType.id
            )
          ) {
            console.log(
              `'${survey.qualtricsName}' has type '${letterType.key}'`
            );
          } else {
            // No letter of this type
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
          console.log("addLetter", result);
          // Add the newly added letter type to the associated surveys. This removes
          // the survey-letter combination from the menu.
          const survey = _.find(
            this.surveys,
            (survey) => survey.id === missingLetter.survey.id
          );
          if (survey) {
            survey.surveyLetters.push({ letterType: missingLetter.letterType });
          } else {
            throw new Error("Survey not found");
          }

          // Let the parent page know that a new letter was added.
          this.$emit("addedLetter", result.data?.createSurveyLetter);
        });
    },
  },
});
</script>
