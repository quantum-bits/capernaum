<template>
  <v-container>
    <page-header title="Letters">
      <v-col class="text-xs-right">
        <NewLetterButton @click="addLetter($event)" offset-y />
      </v-col>
    </page-header>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="letters" class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <!--<td class="text-xs-right">{{ item.description }}</td>-->
              <td class="text-xs-right">{{ item.surveyTitle }}</td>
              <td class="text-xs-right">
                {{ item.updated | standardDateTime }}
              </td>
              <td class="text-xs-right">{{ item.letterType }}</td>
              <td class="text-xs-right">
                <v-tooltip v-if="!item.isGroupLetter" top>
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
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="grey--text text--lighten-1">
                      {{ "mdi-table" }}
                    </v-icon>
                  </template>
                  <span
                    >No boolean association table because this is a group
                    letter.</span
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
import Vue from "vue";

import {
  ALL_LETTERS_QUERY,
  DELETE_LETTER_MUTATION,
} from "@/graphql/letters.graphql";
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import NewLetterButton from "@/components/buttons/NewLetterButton.vue";
import PageHeader from "@/pages/PageHeader.vue";
import { AllLetters_letters } from "@/graphql/types/AllLetters";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";

export default Vue.extend({
  name: "Letters",

  components: {
    NewLetterButton,
    PageHeader,
  },

  apollo: {
    letters: {
      query: ALL_LETTERS_QUERY,
      fetchPolicy: "network-only",
    },

    surveys: {
      query: ALL_CAPERNAUM_SURVEYS,
      fetchPolicy: "network-only",
    },
  },

  data() {
    return {
      headers: [
        {
          text: "Letter",
          align: "left",
          value: "title",
        },
        { text: "Survey", value: "surveyTitle" },
        { text: "Last Update", value: "lastUpdate" },
        { text: "Type", value: "letterType" },
        { text: "Actions", sortable: false },
      ],
      letters: [] as AllLetters_letters[],
      surveys: [] as AllCapernaumSurveys_surveys[],
    };
  },

  methods: {
    canDeleteLetter(letter: AllLetters_letters): boolean {
      return letter.letterElements.length === 0;
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
          this.refreshSurveyData();
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

    viewAssociationTable(letter: AllLetters_letters): void {
      console.log("item: ", letter);
      this.$router.push({
        name: "association-table",
        params: { letterId: letter.id.toString() },
      });
    },

    viewLetter(letter: AllLetters_letters): void {
      console.log("item: ", letter);
      console.log("view letter!");
      this.$router.push({
        name: "compose",
        params: { letterId: letter.id.toString() },
      });
    },

    refreshLetterData(): void {
      this.$apollo.queries.letterData.refetch().then(({ data }) => {
        console.log("item(s) refetched!", data);
      });
    },

    refreshSurveyData(): void {
      this.$apollo.queries.surveys.refetch().then(({ data }) => {
        console.log("item(s) refetched!", data);
      });
    },
  },
});
</script>
