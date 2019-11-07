<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Letters</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="newLetter">
          New Letter
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="letters" class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <!--<td class="text-xs-right">{{ item.description }}</td>-->
              <td class="text-xs-right">{{ item.surveyTitle }}</td>
              <td class="text-xs-right">{{ item.updated | dateAndTime }}</td>
              <td class="text-xs-center">
                <span v-if="item.isFrozen">
                  <!-- https://stackoverflow.com/questions/47785750/how-to-use-colors-in-vuetify -->
                  <v-icon color="success">mdi-check-circle</v-icon>
                </span>
              </td>
              <td class="text-xs-center">
                -- is active ? --
              </td>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import {
  ALL_LETTERS_QUERY,
  DELETE_LETTER_MUTATION
} from "@/graphql/letters.graphql";

import LetterElementMenu from "@/components/LetterElementMenu.vue";
import { Letters, Letters_letters } from "@/graphql/types/Letters";

@Component({
  apollo: {
    letterData: {
      query: ALL_LETTERS_QUERY,
      update(letters: Letters) {
        console.log("letter data: ", letters.letters);

        return letters.letters;
      },
      fetchPolicy: "network-only"
    }
  }
})
export default class LettersPage extends Vue {
  headers: any = [
    {
      text: "Letter",
      align: "left",
      sortable: false,
      value: "title"
    },
    //{ text: "Description", value: "description" },
    { text: "Survey", value: "surveyTitle" },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Frozen?", value: "isFrozen" },
    { text: "Active?", value: "isActive" },
    { text: "Actions", sortable: false }
  ];

  letterData: Letters_letters[] = [];

  get letters() {
    return this.letterData.map((letter: Letters_letters) => ({
      title: letter.title,
      isFrozen: letter.isFrozen,
      surveyTitle: letter.survey.title,
      updated: letter.updated,
      id: letter.id,
      canDelete: this.canDeleteLetter(letter)
    }));
  }

  canDeleteLetter(letter: Letters_letters) {
    return (
      letter.letterElements.length === 0 && letter.tableEntries.length === 0
    );
  }

  deleteLetter(id: number) {
    console.log("delete letter!", id);
    this.$apollo
      .mutate({
        mutation: DELETE_LETTER_MUTATION,
        variables: {
          id: id
        }
      })
      .then(({ data }) => {
        console.log("letter successfully deleted!", data);
        this.refreshLetterData();
      })
      .catch(error => {
        console.log(
          "there appears to have been an error when attempting to delete the letter: ",
          error
        );
      });
  }

  newLetter() {
    console.log("create new letter");
    this.$router.push({ name: "compose" });
  }

  viewAssociationTable(item: any) {
    console.log("item: ", item);
    this.$router.push({
      name: "association-table",
      params: { letterId: item.id }
    });
  }

  viewLetter(item: any) {
    console.log("item: ", item);
    console.log("view letter!");
    this.$router.push({ name: "compose", params: { letterId: item.id } });
  }

  refreshLetterData() {
    this.$apollo.queries.letterData.refetch().then(({ data }) => {
      console.log("item(s) refetched!", data);
    });
  }

  mounted() {
    console.log("inside mounted!");
    //this.$apollo.queries.letters.refetch().then(({ data }) => {
    //  console.log("item(s) refetched!", data);
    //});
  }
}
</script>
