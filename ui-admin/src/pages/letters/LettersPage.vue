<template>
  <v-container>
    <page-header title="Letters">
      <v-col>
        <new-letter-button
          :current-survey-letters="surveyLetters"
          @addedLetter="updateTable"
          offset-y
        />
      </v-col>
    </page-header>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="surveyLetters">
          <template v-slot:item="{ item: surveyLetter }">
            <tr>
              <td>{{ surveyLetter.letter.title }}</td>
              <td>{{ surveyLetter.letter.updated | standardDate }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'surveys',
                    params: { surveyLetterId: surveyLetter.survey.id },
                  }"
                >
                  {{ surveyLetter.survey.qualtricsName }}
                </router-link>
              </td>
              <td>{{ surveyLetter.letterType.description }}</td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a class="mr-4" @click="viewLetter(surveyLetter)" v-on="on">
                      <v-icon>
                        {{ "mdi-pencil" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>View and edit this letter.</span>
                </v-tooltip>
                <v-tooltip v-if="canDeleteLetter(surveyLetter.letter)" top>
                  <template v-slot:activator="{ on }">
                    <a @click="deleteLetter(surveyLetter.letter.id)" v-on="on">
                      <v-icon>
                        {{ "mdi-close-circle" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>Delete this letter.</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="grey--text text--lighten-1">
                      {{ "mdi-close-circle" }}
                    </v-icon>
                  </template>
                  <span>
                    This letter has content, so it can't be deleted.
                  </span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import NewLetterButton from "@/pages/letters/NewLetterButton.vue";
import PageHeader from "@/pages/PageHeader.vue";
import { DELETE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import { SURVEY_LETTERS_QUERY } from "@/graphql/surveys.graphql";
import {
  SurveyLetters_surveyLetters,
  SurveyLetters_surveyLetters_letter,
} from "@/graphql/types/SurveyLetters";
import {
  DeleteLetter,
  DeleteLetterVariables,
} from "@/graphql/types/DeleteLetter";
import * as _ from "lodash";

export default Vue.extend({
  name: "LettersPage",

  components: {
    NewLetterButton,
    PageHeader,
  },

  apollo: {
    surveyLetters: {
      query: SURVEY_LETTERS_QUERY,
    },
  },

  data() {
    return {
      headers: [
        { text: "Letter" },
        { text: "Last Update" },
        { text: "Survey" },
        { text: "Type" },
        { text: "Actions", sortable: false, align: "center" },
      ],
      surveyLetters: [] as SurveyLetters_surveyLetters[],
    };
  },

  methods: {
    canDeleteLetter(letter: SurveyLetters_surveyLetters_letter): boolean {
      return letter.letterElements.length === 0;
    },

    deleteLetter(letterId: number): void {
      this.$apollo
        .mutate<DeleteLetter, DeleteLetterVariables>({
          mutation: DELETE_LETTER_MUTATION,
          variables: {
            id: letterId,
          },
        })
        .then((response) => {
          console.log("Letter deleted", response);
          this.surveyLetters = _.filter(
            this.surveyLetters,
            (sl) => sl.letter.id !== letterId
          );
        })
        .catch((error) => {
          console.log("Error attempting to delete letter", error);
        });
    },

    updateTable(newSurveyLetter: SurveyLetters_surveyLetters) {
      console.log("UPDATE TABLE", newSurveyLetter);
      this.surveyLetters.push({
        id: newSurveyLetter.id,
        letter: newSurveyLetter.letter,
        letterType: newSurveyLetter.letterType,
        survey: newSurveyLetter.survey,
      });
    },

    viewLetter(surveyLetter: SurveyLetters_surveyLetters): void {
      this.$router.push({
        name: "compose",
        params: { surveyLetterId: surveyLetter.id.toString() },
      });
    },
  },
});
</script>
