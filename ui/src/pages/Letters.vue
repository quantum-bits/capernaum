<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Letters</h1>
      </v-col>
      <v-col class="text-xs-right">
        <!--
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
              >All imported surveys already have a letter. To create another
              letter, please import a survey first.</span
            >
          </v-tooltip>
        </span>
        <span v-else>
          <v-btn
            color="primary"
            :disabled="!canCreateLetter"
            @click="newLetter"
          >
            New Letter
          </v-btn>
        </span>
        -->
        <NewLetterButton @click="addLetter($event)" offset-y />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="letters" class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <!--<td class="text-xs-right">{{ item.description }}</td>-->
              <td class="text-xs-right">{{ item.surveyTitle }}</td>
              <td class="text-xs-right">{{ item.updated | dateAndTime }}</td>
              <td class="text-xs-right">{{ item.letterType }}</td>
              <td class="text-xs-right">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a @click="viewAssociationTable(item)" v-on="on">
                      <v-icon>
                        {{ "mdi-table" }}
                      </v-icon>
                    </a>
                  </template>
                  <span
                    >View/edit boolean association table for this letter.</span
                  >
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a @click="viewLetter(item)" v-on="on">
                      <v-icon>
                        {{ "mdi-pencil" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>View details and/or edit this letter.</span>
                </v-tooltip>
                <v-tooltip v-if="item.canDelete" top>
                  <template v-slot:activator="{ on }">
                    <a @click="deleteLetter(item.id)" v-on="on">
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
                  <span
                    >This letter has letter elements and/or boolean
                    associations, and so cannot be deleted.</span
                  >
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
import { Component, Vue } from "vue-property-decorator";

import {
  ALL_LETTERS_QUERY,
  DELETE_LETTER_MUTATION,
} from "@/graphql/letters.graphql";

import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { Letters, Letters_letters } from "@/graphql/types/Letters";
import {
  AllSurveys,
  AllSurveys_surveys as Survey,
} from "@/graphql/types/AllSurveys";

import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";

import LetterTypeMenu from "@/components/LetterTypeMenu.vue";
import NewLetterButton from "@/components/NewLetterButton.vue";

interface LetterInfo {
  title: string;
  isFrozen: boolean;
  surveyTitle: string;
  updated: string;
  id: number;
  canDelete: boolean;
}

@Component({
  components: {
    LetterTypeMenu,
    NewLetterButton,
  },
  apollo: {
    letterData: {
      query: ALL_LETTERS_QUERY,
      update(letters: Letters) {
        console.log("letter data: ", letters.letters);

        return letters.letters;
      },
      fetchPolicy: "network-only",
    },

    surveys: {
      query: ALL_SURVEYS_QUERY,
      //update(data: AllSurveys) {
      //  this.allSurveysHaveLetters = data.surveys.every(
      //    (survey) => survey.letter !== null
      //  );
      //  return data.surveys;
      //},
      fetchPolicy: "network-only",
    },
  },
})
export default class LettersPage extends Vue {
  headers = [
    {
      text: "Letter",
      align: "left",
      value: "title",
    },
    { text: "Survey", value: "surveyTitle" },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Type", value: "letterType" },
    { text: "Actions", sortable: false },
  ];

  letterData: Letters_letters[] = [];
  surveys: Survey[] = [];
  //allSurveysHaveLetters = false;

  get letters(): LetterInfo[] {
    return this.letterData.map((letter: Letters_letters) => ({
      title: letter.title,
      isFrozen: letter.isFrozen,
      surveyTitle: letter.survey.qualtricsName,
      updated: letter.updated,
      letterType: letter.letterType.description,
      id: letter.id,
      canDelete: this.canDeleteLetter(letter),
    }));
  }

  get canCreateLetter(): boolean {
    return false;
  }

  canDeleteLetter(letter: Letters_letters): boolean {
    return (
      letter.letterElements.length === 0 && letter.tableEntries.length === 0
    );
  }

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
        this.refreshSurveyData();
      })
      .catch((error) => {
        console.log(
          "there appears to have been an error when attempting to delete the letter: ",
          error
        );
      });
  }

  newLetter(): void {
    console.log("create new letter");
    this.$router.push({ name: "compose" });
  }

  addLetter(event: string): void {
    console.log("create new letter!", event);
    this.$router.push({ name: "compose" });
  }

  viewAssociationTable(item: LetterInfo): void {
    console.log("item: ", item);
    this.$router.push({
      name: "association-table",
      params: { letterId: item.id.toString() },
    });
  }

  viewLetter(item: LetterInfo): void {
    console.log("item: ", item);
    console.log("view letter!");
    this.$router.push({
      name: "compose",
      params: { letterId: item.id.toString() },
    });
  }

  refreshLetterData(): void {
    this.$apollo.queries.letterData.refetch().then(({ data }) => {
      console.log("item(s) refetched!", data);
    });
  }

  refreshSurveyData(): void {
    this.$apollo.queries.surveys.refetch().then(({ data }) => {
      console.log("item(s) refetched!", data);
    });
  }
}
</script>
