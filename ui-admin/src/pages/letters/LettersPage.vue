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
              <td>
                <router-link
                  :to="{
                    name: 'compose',
                    params: { surveyLetterId: surveyLetter.id },
                  }"
                >
                  {{ surveyLetter.letter.title || "Untitled" }}
                </router-link>
              </td>
              <td>
                <v-icon class="mr-1">
                  {{ letterTypeIcon(surveyLetter) }}
                </v-icon>
                {{ letterTypeDescription(surveyLetter) }}
              </td>
              <td>{{ surveyLetter.letter.updated | standardDate }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'surveys',
                    params: { surveyId: surveyLetter.survey.id },
                  }"
                >
                  {{ surveyLetter.survey.qualtricsName }}
                </router-link>
              </td>
              <td>
                <v-tooltip v-if="canDeleteLetter(surveyLetter.letter)" top>
                  <template v-slot:activator="{ on }">
                    <a @click="deleteLetter(surveyLetter.letter.id)" v-on="on">
                      <v-icon>mdi-close-circle</v-icon>
                    </a>
                  </template>
                  <span>Delete this letter.</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="grey--text text--lighten-1">
                      mdi-close-circle
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
    allSurveyLetters: {
      query: SURVEY_LETTERS_QUERY,
      update: (data) => data.surveyLetters,
      // Make sure we refetch all the letter information. Otherwise, changes
      // to letter content (particularly removing all letter elements) will
      // confuse the template. The "delete" button will not even appear (!)
      // after deleting the last letter element.
      // TODO: Is there a better way to handle this? `cache-and-network` doesn't work.
      fetchPolicy: "no-cache",
    },
  },

  data() {
    return {
      headers: [
        { text: "Letter" },
        { text: "Type" },
        { text: "Last Update" },
        { text: "Survey" },
        { text: "Actions", sortable: false, align: "center" },
      ],
      allSurveyLetters: [] as SurveyLetters_surveyLetters[],
    };
  },

  computed: {
    surveyLetters(): SurveyLetters_surveyLetters[] {
      return this.allSurveyLetters.filter((ltr) => !!ltr.survey.importedDate);
    },
  },

  methods: {
    canDeleteLetter(letter: SurveyLetters_surveyLetters_letter): boolean {
      console.log(
        `${letter.title} element count ${letter.letterElements.length}`
      );
      return letter.letterElements.length === 0;
    },

    letterTypeDescription(surveyLetter: SurveyLetters_surveyLetters) {
      return surveyLetter.letterType.description;
    },

    letterTypeIcon(surveyLetter: SurveyLetters_surveyLetters) {
      return surveyLetter.letterType.key === "individual"
        ? "mdi-email"
        : "mdi-email-multiple";
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
          this.allSurveyLetters = _.filter(
            this.allSurveyLetters,
            (surveyLetter) => surveyLetter.letter.id !== letterId
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
  },
});
</script>
