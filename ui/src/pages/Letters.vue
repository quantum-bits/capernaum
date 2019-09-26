<template>
  <v-container>
    <v-row>
      <v-col xs9>
        <h1 class="headline mb-5">Survey Follow-up Letters</h1>
      </v-col>
      <v-col xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="newLetter">
          New Letter
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="surveyLetters"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.letter.name }}</td>
              <td class="text-xs-right">{{ item.survey.qualtricsName }}</td>
              <td class="text-xs-right">{{ item.letter.updated }}</td>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_SURVEY_LETTERS_QUERY } from "@/graphql/letters.graphql";

export default Vue.extend({
  name: "Letters",

  apollo: {
    surveyLetters: {
      query: ALL_SURVEY_LETTERS_QUERY
    }
  },

  data() {
    return {
      surveyLetters: [],
      headers: [
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
      ]
    };
  },

  methods: {
    viewLetter(item: any) {
      this.$router.push({ name: "compose", params: { id: item.id } });
    },

    newLetter() {
      this.$router.push({ name: "compose" });
    }
  }
});
</script>
