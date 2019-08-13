<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Survey Follow-up Letters</h1>
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
              <td>{{ item.name }}</td>
              <td class="text-xs-right">[Survey Name Here]</td>
              <td class="text-xs-right">{{ item.updated }}</td>
              <td class="text-xs-center">
                <span v-if="item.isFrozen">
                  <v-icon color="success">mdi-check-circle</v-icon>
                </span>
              </td>
              <td class="text-xs-center">
                <span v-if="item.isActive">
                  <v-icon color="success">mdi-check-circle</v-icon>
                </span>
              </td>
              <td class="text-xs-right">
                <v-btn text v-on:click="viewLetter(item)">View</v-btn>
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

@Component({
  apollo: {
    letters: {
      query: ALL_LETTERS_QUERY
    }
  }
})
export default class Letters extends Vue {
  letters: any[] = [];

  headers: any = [
    {
      text: "Letter",
      align: "left",
      sortable: false,
      value: "title"
    },
    { text: "Survey", value: "surveyTitle" },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Frozen?", value: "isFrozen" },
    { text: "Active?", value: "isActive" },
    { text: "Action", sortable: false }
  ];

  viewLetter(item: any) {
    this.$router.push({ name: "compose", params: { id: item.id } });
  }

  newLetter() {
    this.$router.push({ name: "compose" });
  }
}
</script>
