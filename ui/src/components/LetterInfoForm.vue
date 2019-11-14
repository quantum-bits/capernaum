<template>
  <v-layout row wrap>
    <v-flex xs12 sm11 offset-sm1>
      <h2 class="title font-weight-regular mb-3">Letter Information:</h2>
    </v-flex>
    <v-flex xs12 sm6 offset-sm2>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="title"
          :counter="80"
          :rules="titleRules"
          label="Title of Letter"
          required
        ></v-text-field>
        <v-text-field
          v-model="description"
          :counter="120"
          :rules="descriptionRules"
          label="Description"
          required
        ></v-text-field>
        <v-select
          v-if="isNew"
          v-model="surveySelect"
          :items="selections"
          :rules="surveySelectionRules"
          label="Survey"
          required
          persistent-hint
          return-object
          single-line
        />
        <div v-if="errorMessage" class="red--text mb-4">{{ errorMessage }}</div>
        <v-btn :disabled="!valid" color="success" @click="submit">
          Submit
        </v-btn>
      </v-form>
    </v-flex>
    <v-flex v-if="!isNew" xs12 sm11 offset-sm1>
      <h2 class="title font-weight-regular mb-1 mt-6">
        Survey:
        <span class="font-weight-light">{{ surveyTitle }}</span>
      </h2>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

import axios, { AxiosResponse } from "axios";
import gql from "graphql-tag";

//import { BooleanAssociationBriefType } from "@/types/association-table.types";
import { Survey, SurveyItem, SurveySelection } from "@/pages/survey.types";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import {
  ADD_LETTER_MUTATION,
  UPDATE_LETTER_MUTATION
} from "@/graphql/letters.graphql";
import {
  LetterCreateInput,
  LetterUpdateInput
} from "@/graphql/types/globalTypes";

// used for data returned from the db (for the list used in the drop-down)
// interface BooleanAssociationType {
//   id: number; // id of the association table in our db
//   title: string; // e.g., "General (<2019)"
//   [propName: string]: any; // several other properties will/may come back from the db, but they are unimportant here
// }

@Component({
  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    }
  }
})
export default class LetterInfoForm extends Vue {
  /** Form to create/update Letter Info (e.g., title, etc.) */
  @Prop({ default: null }) id!: number;
  @Prop({ default: null }) initialTitle!: string;
  @Prop({ default: null }) initialDescription!: string;
  @Prop({ default: Number.NEGATIVE_INFINITY }) surveyId!: number; // no id will be -Infinity, so this is presumably safe
  //@Prop({ default: null })
  //initialBooleanAssociation!: BooleanAssociationBriefType | null;
  @Prop() isNew!: boolean;

  surveys: Survey[] = [];
  //booleanAssociations: BooleanAssociationType[] = [];
  title: string = this.initialTitle;
  description: string = this.initialDescription;
  errorMessage: string = "";
  //https://www.geeksforgeeks.org/what-is-negative-infinity-in-javascript/
  surveySelect: { text: string; value: number } = {
    text: "",
    value: Number.NEGATIVE_INFINITY
  };

  valid: boolean = true;
  //name: string = "";
  titleRules: any = [
    (v: any) => !!v || "Title is required",
    (v: any) =>
      (v && v.length <= 80) ||
      "Title of letter must be fewer than 80 characters"
  ];
  descriptionRules: any = [
    (v: any) =>
      (v && v.length <= 120) || "Description must be fewer than 120 characters"
  ];
  surveySelectionRules: any = [
    (v: any) =>
      (v && v.value !== Number.NEGATIVE_INFINITY) || "Survey is required"
  ];

  submit() {
    // TODO:
    // - add description
    // - add surveyId
    // FIXME: Replace the `as any` hack.
    console.log("survey selected: ", this.surveySelect);
    //console.log(typeof this.surveySelect.value);
    if (this.isNew) {
      if ((this.$refs.form as any).validate()) {
        console.log("title is: ", this.title);
        this.$apollo
          .mutate({
            mutation: ADD_LETTER_MUTATION,
            variables: {
              createInput: {
                title: this.title,
                description: this.description,
                isFrozen: false,
                surveyId: this.surveySelect.value,
                emailMessage: JSON.stringify({
                  ops: []
                })
              }
            }
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.$emit("letter-created", data.createLetter.id);
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
            this.errorMessage =
              "Sorry, there appears to have been an error.  Please tray again later.";
          });
      }
    } else {
      if ((this.$refs.form as any).validate()) {
        console.log("title is: ", this.title);
        this.$apollo
          .mutate({
            mutation: UPDATE_LETTER_MUTATION,
            variables: {
              letterData: {
                id: this.id,
                title: this.title,
                description: this.description
              }
            }
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.$emit("letter-info-updated");
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
            this.errorMessage =
              "Sorry, there appears to have been an error.  Please tray again later.";
          });
      }
    }

    /*
                console.log("save info");
                console.log("survey: ", this.surveySelect);
                console.log("boolean association table: ", this.booleanAssociationSelect);
                this.saveInfo();
                */
  }

  @Emit("letter-info-updated")
  letterInfoUpdated() {
    // nothing to send back
  }

  // using a getter, which is apparently the way to do a computed property when using vue property decorators:
  // https://github.com/kaorun343/vue-property-decorator/issues/85
  get selections(): SurveySelection[] {
    return this.surveys.map(survey => ({
      text: survey.title,
      value: survey.id
    }));
  }

  get surveyTitle() {
    let surveyTitle = "";
    if (!this.isNew) {
      this.surveys.forEach(survey => {
        if (survey.id === this.surveyId) {
          surveyTitle = survey.title;
        }
      });
    }
    return surveyTitle;
  }

  mounted() {
    console.log("title: ", this.title);
    console.log(typeof this.title);
    //console.log("boolean association: ", this.initialBooleanAssociation);
    //axios
    //  .get("http://localhost:4000/survey-data/")
    //  .then((response: AxiosResponse) => {
    //    console.log("surveys: ", response);
    //    //this.surveys = response.data;
    //    if (!this.isNew) {
    //      for (let survey of this.surveys) {
    //        if (survey.id === this.initialSurveyId) {
    //          this.surveySelect = survey;
    //        }
    //      }
    //    }
    //  });
    // json-server -p 4000 --watch db.json
    //   axios
    //     .get("http://localhost:4000/boolean-associations/")
    //     .then((response: AxiosResponse) => {
    //       console.log(response);
    //       this.booleanAssociations = response.data;
    //       if (!this.isNew && this.initialBooleanAssociation !== null) {
    //         for (let booleanAssociation of this.booleanAssociations) {
    //           if (booleanAssociation.id === this.initialBooleanAssociation.id) {
    //             this.booleanAssociationSelect = booleanAssociation;
    //           }
    //         }
    //       }
    //     });
  }
}
</script>
