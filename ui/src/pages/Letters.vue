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
            <tr @click="viewLetter(item)">
              <td>{{ item.letter.name }}</td>
              <td class="text-xs-right">{{ item.survey.qualtricsName }}</td>
              <td class="text-xs-right">
                {{ item.letter.updated | dateAndTime }}
              </td>
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
import { DateTime } from "luxon";

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
        { text: "Active?", value: "isActive" }
      ]
    };
  },

  filters: {
    dateAndTime(value: string) {
      const dt = DateTime.fromISO(value);
      return dt.toFormat("y-M-d tt");
    }
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
