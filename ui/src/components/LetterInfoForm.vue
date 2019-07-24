<template>
  <v-layout row wrap>
    <v-flex xs12 sm11 offset-sm1>
      <h2 class="title font-weight-regular mb-3">Letter Information:</h2>
    </v-flex>
    <v-flex xs12 sm6 offset-sm2>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :counter="80"
          :rules="nameRules"
          label="Title of Letter"
          required
        ></v-text-field>
        <v-select
          v-model="surveySelect"
          :items="surveys"
          item-text="name"
          item-value="id"
          :rules="[v => !!v || 'Survey is required']"
          label="Survey"
          required
          persistent-hint
          return-object
          single-line
        />
        <v-select
          v-model="booleanAssociationSelect"
          :items="booleanAssociations"
          item-text="title"
          item-value="id"
          label="Boolean Association Table"
          clearable
          persistent-hint
          return-object
          single-line
        />
        <v-btn :disabled="!valid" color="success" @click="submit">
          Submit
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

import axios from "axios";
import { AxiosResponse } from "axios";
import gql from "graphql-tag";

import { BooleanAssociationBriefType } from "../pages/association-table.types";

interface SurveyItemType {
  id: number; // id of the survey in our db
  name: string; // e.g., "Christian Life Survey"
  isActive: boolean;
}

// used for data returned from the db (for the list used in the drop-down)
interface BooleanAssociationType {
  id: number; // id of the association table in our db
  title: string; // e.g., "General (<2019)"
  [propName: string]: any; // several other properties will/may come back from the db, but they are unimportant here
}

@Component({
  apollo: {
    surveys: {
      query: gql`
        query allSurveys {
          surveys(includeInactive: false) {
            id
            name
            isActive
          }
        }
      `
    }
  }
})
export default class LetterInfoForm extends Vue {
  /** Form to create/update Letter Info (e.g., title, etc.) */
  @Prop() id!: number;
  @Prop() initialTitle!: string;
  @Prop() initialSurveyId!: number;
  @Prop({ default: null })
  initialBooleanAssociation!: BooleanAssociationBriefType | null;
  @Prop() isNew!: boolean;

  surveys: SurveyItemType[] = [];
  booleanAssociations: BooleanAssociationType[] = [];
  name: string = this.initialTitle;

  valid: boolean = true;
  //name: string = "";
  nameRules: any = [
    (v: any) => !!v || "Title is required",
    (v: any) =>
      (v && v.length <= 80) || "Title of letter must be less than 80 characters"
  ];

  surveySelect: any = null;
  booleanAssociationSelect: any = null;

  submit() {
    if (this.$refs.form.validate()) {

      console.log('name is: ', this.name)
      this.$apollo.mutate({
        mutation: gql`
          mutation addLetter($name: String!) {
            createLetter(name: $name) {
              id
              name
            }
          }
        `,
        variables: {
          name: this.name
        }
      });
      /*
      console.log("save info");
      console.log("survey: ", this.surveySelect);
      console.log("boolean association table: ", this.booleanAssociationSelect);
      this.saveInfo();
      */
    }
  }

  @Emit("save-info")
  saveInfo() {
    // need to redirect or something, depending on if this is a new letter....
  }

  mounted() {
    console.log("boolean association: ", this.initialBooleanAssociation);
    axios
      .get("http://localhost:3000/survey-data/")
      .then((response: AxiosResponse) => {
        console.log("surveys: ", response);
        this.surveys = response.data;
        if (!this.isNew) {
          for (let survey of this.surveys) {
            if (survey.id === this.initialSurveyId) {
              this.surveySelect = survey;
            }
          }
        }
      });
    axios
      .get("http://localhost:3000/boolean-associations/")
      .then((response: AxiosResponse) => {
        console.log(response);
        this.booleanAssociations = response.data;
        if (!this.isNew && this.initialBooleanAssociation !== null) {
          for (let booleanAssociation of this.booleanAssociations) {
            if (booleanAssociation.id === this.initialBooleanAssociation.id) {
              this.booleanAssociationSelect = booleanAssociation;
            }
          }
        }
      });
  }
}
</script>
