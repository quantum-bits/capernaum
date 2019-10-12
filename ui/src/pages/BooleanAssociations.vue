<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Boolean Association Tables</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="newAssociationTable">
          New Association Table
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="predictionTables"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td class="text-xs-right">{{ item.description }}</td>
              <td class="text-xs-right">{{ item.surveyLetter.survey.title }}</td>
              <td class="text-xs-right">{{ item.lastUpdate }}</td>
              <td class="text-xs-center">
                <span v-if="item.surveyLetter.isFrozen">
                  <!-- https://stackoverflow.com/questions/47785750/how-to-use-colors-in-vuetify -->
                  <v-icon color="success">mdi-check-circle</v-icon>
                </span>
              </td>
              <td class="text-xs-center">
                <span v-if="item.surveyLetter.isActive">
                  <v-icon color="success">mdi-check-circle</v-icon>
                </span>
              </td>
              <td class="text-xs-right">
                <v-btn text v-on:click="viewAssociationTable(item)">
                  View
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
import axios from "axios";
import { AxiosResponse } from "axios";

import { ALL_PREDICTION_TABLES_QUERY } from "@/graphql/prediction-tables.graphql";

import { PredictionTableSummary } from "@/graphql/types/PredictionTableSummary";

@Component({
  apollo: {
    predictionTables: {
      query: ALL_PREDICTION_TABLES_QUERY,
      update(data) {
        console.log("inside update; prediction table data: ", data);
        return data.predictionTables;
      }
    }
  }
})
export default class BooleanAssociations extends Vue {
  headers: any = [
    {
      text: "Association Table",
      align: "left",
      sortable: false,
      value: "title"
    },
    { text: "Description", value: "description" },
    { text: "Survey", value: "surveyTitle" },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Frozen?", value: "isFrozen" },
    { text: "Active?", value: "isActive" },
    { text: "Action", sortable: false }
  ];

  predictionTables: PredictionTableSummary | [] = [];
  
  viewAssociationTable(item: any) {
    console.log('item: ', item);
    this.$router.push({ name: "association-table", params: { id: item.id, surveyId: item.surveyLetter.survey.id } });
  }

  newAssociationTable() {
    this.$router.push({ name: "association-table" });
  }

  mounted() {
  }
}
</script>
