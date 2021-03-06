<template>
  <v-layout row wrap>
    <v-flex xs12 sm11 offset-sm1>
      <h2 class="title font-weight-regular mb-3">Letter Information:</h2>
    </v-flex>
    <v-flex xs12 sm6 offset-sm2>
      <v-form ref="form" v-model="valid" lazy-validation>
        <LetterTypeMenu v-if="isNew" @click="addLetter($event)" offset-y />
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
          :disabled="!letterTypeSelected"
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
        Letter Type:
        <span class="font-weight-light">{{ letterTypeDescription }}</span>
      </h2>
      <h2 class="title font-weight-regular mb-1 mt-1">
        Survey:
        <span class="font-weight-light">{{ surveyTitle }}</span>
      </h2>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

//import axios, { AxiosResponse } from "axios";
//import gql from "graphql-tag";

//import { BooleanAssociationBriefType } from "@/types/association-table.types";
import LetterTypeMenu from "@/components/LetterTypeMenu.vue";

import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";

import { SurveySelection } from "@/pages/survey.types";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { AllSurveys_surveys } from "@/graphql/types/AllSurveys";
import {
  ADD_LETTER_MUTATION,
  UPDATE_LETTER_MUTATION,
} from "@/graphql/letters.graphql";
//import {
//  LetterCreateInput,
//  LetterUpdateInput,
//} from "@/graphql/types/globalTypes";

// used for data returned from the db (for the list used in the drop-down)
// interface BooleanAssociationType {
//   id: number; // id of the association table in our db
//   title: string; // e.g., "General (<2019)"
//   [propName: string]: any; // several other properties will/may come back from the db, but they are unimportant here
// }
@Component({
  components: {
    LetterTypeMenu,
  },
  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      fetchPolicy: "network-only",
    },
  },
})
export default class LetterInfoForm extends Vue {
  /** Form to create/update Letter Info (e.g., title, etc.) */
  @Prop({ default: null }) id!: number;
  @Prop({ default: null }) initialTitle!: string;
  @Prop({ default: null }) initialDescription!: string;
  @Prop({ default: null }) letterTypeDescription!: string;
  @Prop({ default: -Infinity }) surveyId!: number; // no id will be -Infinity, so this is presumably safe
  //@Prop({ default: null })
  //initialBooleanAssociation!: BooleanAssociationBriefType | null;
  @Prop() isNew!: boolean;

  surveys: AllSurveys_surveys[] = [];
  //booleanAssociations: BooleanAssociationType[] = [];
  title: string = this.initialTitle;
  description: string = this.initialDescription;
  errorMessage = "";
  //https://www.geeksforgeeks.org/what-is-negative-infinity-in-javascript/
  surveySelect: { text: string; value: number } = {
    text: "",
    value: -Infinity,
  };

  letterTypeSelect: ReadLetterTypes_readLetterTypes = {
    description: "",
    id: -Infinity,
    key: "",
  };

  valid = true;
  //name: string = "";
  titleRules = [
    (v: string): string | boolean => !!v || "Title is required",
    (v: string): string | boolean =>
      (v && v.length <= 80) ||
      "Title of letter must be fewer than 80 characters",
  ];
  descriptionRules = [
    (v: string): string | boolean =>
      (v && v.length <= 120) || "Description must be fewer than 120 characters",
  ];
  surveySelectionRules = [
    (v: SurveySelection): string | boolean =>
      (v && v.value !== -Infinity) ||
      "Survey is required.  Note that only one letter may be associated with each imported survey, so if no surveys show up in the above list, it may mean that all surveys already have a letter.",
  ];

  addLetter(letterType: ReadLetterTypes_readLetterTypes): void {
    console.log("letter type chosen!", letterType);
    this.letterTypeSelect = letterType;
    console.log(this.letterTypeSelect);
  }

  submit(): void {
    // TODO:
    // - add description
    // - add surveyId
    // FIXME: Replace the `as any` hack.
    console.log("survey selected: ", this.surveySelect);
    //console.log(typeof this.surveySelect.value);
    if (this.isNew) {
      if (
        (this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
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
                letterTypeId: this.letterTypeSelect.id,
                emailMessage: JSON.stringify({
                  ops: [],
                }),
              },
            },
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.$emit("letter-created", data.createLetter.id);
          })
          .catch((error) => {
            console.log("there appears to have been an error: ", error);
            this.errorMessage =
              "Sorry, there appears to have been an error.  Please tray again later.";
          });
      }
    } else {
      if (
        (this.$refs.form as Vue & {
          validate: () => boolean;
        }).validate()
      ) {
        console.log("title is: ", this.title);
        this.$apollo
          .mutate({
            mutation: UPDATE_LETTER_MUTATION,
            variables: {
              letterData: {
                id: this.id,
                title: this.title,
                description: this.description,
              },
            },
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.$emit("letter-info-updated");
          })
          .catch((error) => {
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
  letterInfoUpdated(): void {
    // nothing to send back
  }

  // using a getter, which is apparently the way to do a computed property when using vue property decorators:
  // https://github.com/kaorun343/vue-property-decorator/issues/85
  // .filter(...).map(...) might not be the fastest approach (https://stackoverflow.com/questions/34398279/map-and-filter-an-array-at-the-same-time)
  get selections(): SurveySelection[] {
    let surveyOptions: { text: string; value: number }[] = [];
    this.surveys.forEach((survey) => {
      let includeSurvey = true;
      survey.letters.forEach((letter) => {
        if (letter.letterType.id === this.letterTypeSelect.id) {
          includeSurvey = false;
        }
      });
      if (includeSurvey) {
        surveyOptions.push({
          text: survey.qualtricsName,
          value: survey.id,
        });
      }
    });
    return surveyOptions;
    //return this.surveys
    //  .filter((survey) => !survey.letter)
    //  .map((survey) => ({
    //    text: survey.qualtricsName,
    //    value: survey.id,
    //  }));
  }

  get letterTypeSelected(): boolean {
    return !(this.letterTypeSelect.id === -Infinity);
  }

  get surveyTitle(): string {
    let surveyTitle = "";
    if (!this.isNew) {
      this.surveys.forEach((survey) => {
        if (survey.id === this.surveyId) {
          surveyTitle = survey.qualtricsName;
        }
      });
    }
    return surveyTitle;
  }

  mounted(): void {
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
