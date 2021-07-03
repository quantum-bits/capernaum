<template>
  <v-container>
    <page-header title="Letters">
      <v-col>
        <NewLetterButton @click="addLetter($event)" offset-y />
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
                    params: { surveyId: surveyLetter.survey.id },
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
                <v-tooltip v-if="canDeleteLetter(surveyLetter)" top>
                  <template v-slot:activator="{ on }">
                    <a @click="deleteLetter(surveyLetter.id)" v-on="on">
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
import NewLetterButton from "@/components/buttons/NewLetterButton.vue";
import PageHeader from "@/pages/PageHeader.vue";
import { DELETE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import { SURVEY_LETTERS_QUERY } from "@/graphql/surveys.graphql";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";

export default Vue.extend({
  name: "Letters",

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
        { text: "Actions", sortable: false },
      ],
      surveyLetters: [] as SurveyLetters_surveyLetters[],
    };
  },

  methods: {
    canDeleteLetter(surveyLetter: SurveyLetters_surveyLetters): boolean {
      return surveyLetter.letter.letterElements.length === 0;
    },

    deleteLetter(id: number): void {
      console.log("delete letter!", id);
      this.$apollo
        .mutate({
          mutation: DELETE_LETTER_MUTATION,
          variables: {
            id: id,
          },
        })
        .then(({ data }) => {
          console.log("letter successfully deleted!", data);
          this.refreshLetterData();
        })
        .catch((error) => {
          console.log(
            "there appears to have been an error when attempting to delete the letter: ",
            error
          );
        });
    },

    newLetter(): void {
      console.log("create new letter");
      this.$router.push({ name: "compose" });
    },

    addLetter(event: string): void {
      console.log("create new letter!", event);
      this.$router.push({ name: "compose" });
    },

    viewLetter(surveyLetter: SurveyLetters_surveyLetters): void {
      console.log("item: ", surveyLetter);
      console.log("view letter!");
      this.$router.push({
        name: "compose",
        params: { letterId: surveyLetter.id.toString() },
      });
    },

    refreshLetterData(): void {
      this.$apollo.queries.letterData.refetch().then(({ data }) => {
        console.log("item(s) refetched!", data);
      });
    },
  },
});
</script>
