<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Imported Surveys</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="importQualtricsSurvey">
          Import Qualtrics Survey
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="surveys" class="elevation-1">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td class="text-xs-right">{{ item.qualtricsName }}</td>
              <td class="text-xs-right">{{ item.qualtricsModDate }}</td>
              <td class="text-xs-center">
                <span v-if="item.isFrozen">
                  <!-- https://stackoverflow.com/questions/47785750/how-to-use-colors-in-vuetify -->
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";

//import {
//  SurveyItem,
//  SurveySelection //,
//  //SurveyDimensionEnum
//} from "./survey.types";

import { Surveys } from "@/graphql/types/Surveys";

// Next: make the divs open-able, with the questions inside(?)

export default Vue.extend({
  /** page to choose a Qualtrics survey so that it can be downloaded */
  name: "ImportedSurveys",

  props: {},

  data() {
    return {
      surveys: [] as Surveys,
      headers: [
        {
          text: "Survey Title (Local)",
          align: "left",
          sortable: true,
          value: "title"
        },
        { text: "Qualtrics Survey Title", value: "qualtricsTitle" },
        { text: "Last Update", value: "lastUpdate" },
        { text: "Frozen?", value: "isFrozen" },
        { text: "Active?", value: "isActive" }
      ] as any
    };
  },

  methods: {
    importQualtricsSurvey() {
      console.log("import!");
      this.$router.push({ name: "import-qualtrics-survey" });
    }
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update(data) {
        console.log("inside update: ", data);
        return data.surveys;
      }
    }
  },

  mounted() {
    console.log("mounted....");
    this.surveys
      ? console.log("surveys exist!")
      : console.log("surveys do not yet exist....");
    this.$apollo.queries.surveys.refetch().then(({ data }) => {
      console.log("item(s) refetched!", data);
    });
  }
});
</script>
