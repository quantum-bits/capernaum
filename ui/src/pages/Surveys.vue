<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline mb-5">Surveys</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import {
  ALL_QUALTRICS_SURVEYS_QUERY,
  ALL_SURVEYS_QUERY
} from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import { QualtricsSurveys_qualtricsSurveys as QualtricsSurvey } from "@/graphql/types/QualtricsSurveys";

export default Vue.extend({
  name: "Surveys",

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update: data => data.surveys,
      fetchPolicy: "network-only"
    },

    qualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY,
      update: data => data.qualtricsSurveys,
      fetchPolicy: "network-only"
    }
  },

  data() {
    return {
      surveys: [] as Survey[],
      qualtricsSurveys: [] as QualtricsSurvey[],
      headers: [
        {
          text: "Survey Title (Local)",
          align: "left",
          sortable: true,
          value: "title"
        },
        { text: "Qualtrics Survey Title", value: "qualtricsTitle" },
        { text: "Last Update", value: "lastUpdate" }
      ] as any
    };
  },

  methods: {
    importQualtricsSurvey() {
      console.log("import!");
      this.$router.push({ name: "import-qualtrics-survey" });
    }
  }
});
</script>
