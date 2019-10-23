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
              <td class="text-xs-right">{{ item.survey.title }}</td>
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
              <td class="text-xs-center">
                <v-btn text v-on:click="viewAssociationTable(item)">
                  Update Entries
                </v-btn>
              </td>
              <td class="text-xs-right">
                <v-btn text v-on:click="viewLetter(item)">
                  View Letter
                </v-btn>
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

import { ALL_LETTERS_QUERY } from "@/graphql/letters.graphql";

import { Letters, Letters_letters } from "@/graphql/types/Letters";

@Component({
  apollo: {
    letters: {
      query: ALL_LETTERS_QUERY,
      update(letters: Letters) {
        console.log("letter data: ", letters.letters);

        return letters.letters;
      }
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
    { text: "Boolean Association Table", value: "booleanAssociationTable" },
    { text: "Action", sortable: false }
  ];

  letters: Letters_letters | [] = [];

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

  mounted() {
    console.log("inside mounted!");
    this.$apollo.queries.letters.refetch().then(({ data }) => {
      console.log("item(s) refetched!", data);
    });
  }
}
</script>
