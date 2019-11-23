<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Imported Surveys</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <span v-if="!surveysAvailableForImport">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-btn color="primary" disabled>
                  Import Qualtrics Survey
                </v-btn>
              </span>
            </template>
            <span
              >All available Qualtrics surveys have already been imported.</span
            >
          </v-tooltip>
        </span>
        <span v-else>
          <v-btn color="primary" dark @click="importQualtricsSurvey">
            Import Qualtrics Survey
          </v-btn>
        </span>
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

import {
  ALL_QUALTRICS_SURVEYS_QUERY,
  ALL_SURVEYS_QUERY
} from "@/graphql/surveys.graphql";
import { AllSurveys_surveys } from "@/graphql/types/AllSurveys";
import { QualtricsSurveys_qualtricsSurveys as QualtricsSurvey } from "@/graphql/types/QualtricsSurveys";

// Next: make the divs open-able, with the questions inside(?)

export default Vue.extend({
  /** page to choose a Qualtrics survey so that it can be downloaded */
  name: "ImportedSurveys",

  props: {},

  data() {
    return {
      surveys: [] as AllSurveys_surveys[],
      availableQualtricsSurveys: [] as QualtricsSurvey[],
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
      },
      fetchPolicy: "network-only"
    },
    availableQualtricsSurveys: {
      query: ALL_QUALTRICS_SURVEYS_QUERY,
      update: data => data.qualtricsSurveys,
      fetchPolicy: "network-only"
    }
  },

  computed: {
    surveysAvailableForImport() {
      let allSurveysImported = true;
      this.availableQualtricsSurveys.forEach((survey: QualtricsSurvey) => {
        if (survey.importedAs.length === 0) {
          allSurveysImported = false;
        }
      });
      return !allSurveysImported;
    }
  },

  mounted() {
    console.log("mounted....");
    this.surveys
      ? console.log("surveys exist!")
      : console.log("surveys do not yet exist....");
    //this.$apollo.queries.surveys.refetch().then(({ data }) => {
    //  console.log("item(s) refetched!", data);
    //});
  }
});
</script>
