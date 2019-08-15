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
          :items="booleanAssociationSummary"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td class="text-xs-right">{{ item.surveyTitle }}</td>
              <td class="text-xs-right">{{ item.lastUpdate }}</td>
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

@Component
export default class BooleanAssociations extends Vue {
  headers: any = [
    {
      text: "Association Table",
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

  booleanAssociationSummary: any = [];

  viewAssociationTable(item: any) {
    this.$router.push({ name: "association-table", params: { id: item.id } });
  }

  newAssociationTable() {
    this.$router.push({ name: "association-table" });
  }

  mounted() {
    axios
      .get("http://localhost:4000/boolean-associations")
      .then((response: AxiosResponse) => {
        console.log(response);
        response.data.map((val: any) => {
          console.log(val.title);
          this.booleanAssociationSummary.push({
            title: val.title,
            surveyTitle: val.surveyTitle,
            lastUpdate: val.lastUpdate,
            id: val.id,
            isFrozen: val.isFrozen,
            isActive: val.isActive
          });
        });
      });
  }
}
</script>
