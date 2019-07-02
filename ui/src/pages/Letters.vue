<template>
  <v-container>
    <v-layout row wrap>
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
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">[Survey Name Here]</td>
            <td class="text-xs-right">{{ props.item.updated }}</td>
            <td class="text-xs-center">
              <span v-if="props.item.isFrozen">
                <!-- https://stackoverflow.com/questions/47785750/how-to-use-colors-in-vuetify -->
                <v-icon color="success">check_circle</v-icon>
              </span>
            </td>
            <td class="text-xs-center">
              <span v-if="props.item.isActive">
                <v-icon color="success">check_circle</v-icon>
              </span>
            </td>
            <td class="text-xs-right">
              <button v-on:click="viewLetter(props.item)">View</button>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";
import { SurveyMetadata } from "../../../server/src/qualtrics/qualtrics.models";
import gql from "graphql-tag";

@Component({
  apollo: {
    letters: {
      query: gql`
        query allLetters {
          letters {
            id
            name
            created
            updated
            isFrozen
          }
        }
      `,
      variables: { includeInactive: false }
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
