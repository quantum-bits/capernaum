<template>
  <v-container>
    <h1 class="headline mb-5">Survey Follow-up Letters</h1>

    <v-data-table
      :headers="headers"
      :items="surveyLetterSummary"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.lastUpdate }}</td>
        <td class="text-xs-right">{{ props.item.surveyTitle }}</td>
        <td class="text-xs-right">
          <button v-on:click="viewLetter(props.item)">View</button>
        </td>
      </template>
    </v-data-table>

    <!--

        // named route
router.push({ name: 'user', params: { userId: '123' } })

    <CourseOfferingAdminActions
            v-bind:courseOffering="props.item"
            display-context="compact"
            v-on:action="dispatchAction($event, props.item)"
          />


    <v-layout row wrap>
      <v-flex xs6>
        <v-textarea
          name="input-7-1"
          label="Default style"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          hint="Hint text"
        ></v-textarea>
      </v-flex>
      <v-flex xs6>
        <v-textarea
          solo
          name="input-7-4"
          label="Solo textarea"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>
      </v-flex>
      <v-flex xs6>
        <v-textarea
          box
          name="input-7-4"
          label="Box textarea"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>
      </v-flex>
      <v-flex xs6>
        <v-textarea
          outline
          name="input-7-4"
          label="Outline textarea"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>
      </v-flex>
    </v-layout>

    -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";
import { SurveyMetadata } from "../../../server/src/qualtrics/qualtrics.models";

@Component({
  apollo: {
    surveyList: require("../graphql/getSurveys.gql")
  }
})
export default class Letters extends Vue {
  surveyList: any[] = [];

  headers: any = [
    {
      text: "Letter",
      align: "left",
      sortable: false,
      value: "title"
    },
    { text: "Last Update", value: "lastUpdate" },
    { text: "Survey", value: "surveyTitle" },
    { text: "Action", sortable: false }
  ];

  surveyLetterSummary: any = [];

  viewLetter(item: any) {
    console.log("view letter: ", item);
    this.$router.push({ name: "compose", params: { id: item.id } });
  }
  /*
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
            id: val.id
          });
        });
        //this.surveyLetterSummary = response.data.map((val: any) => ({
        //		title: val.title,
        //		surveyTitle: val.survey-title
        //	}));
      });
  }
  */
}
</script>
