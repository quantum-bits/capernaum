<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <h1 class="headline mb-5">Survey Follow-up Letters</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <v-btn
            color="primary"
            dark
            @click="newLetter"
            >
            New Letter
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="surveyLetterSummary" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.surveyTitle }}</td>
            <td class="text-xs-right">{{ props.item.lastUpdate }}</td>
            <td class="text-xs-center">
              <span v-if="props.item.isFrozen">
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

@Component
export default class Letters extends Vue {
  headers: any = [
    {
      text: "Letter",
      align: "left",
      sortable: false,
      value: "title"
    },
    { text: "Survey", value: "surveyTitle" },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Frozen?", value: "isFrozen"},
    { text: "Active?", value: "isActive"},
    { text: "Action", sortable: false }
  ];

  surveyLetterSummary: any = [];

  viewLetter(item: any) {
    this.$router.push({ name: "compose", params: { id: item.id } });
  }

  newLetter() {
    this.$router.push({ name: "compose" });
  }

  mounted() {
    axios
      //.get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .get("http://localhost:3000/letter-data")
      .then((response: AxiosResponse) => {
        console.log(response);
        response.data.map((val: any) => {
          console.log(val.title);
          this.surveyLetterSummary.push({
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
