<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <h1 class="headline mb-5">Import Qualtrics Survey</h1>
        Import a survey from Qualtrics into Capernaum and give it a title. This
        is the first step in constructing a letter, boolean associations, survey
        dimensions, etc.
      </v-flex>
      <v-flex xs7 offset-xs1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-select
            v-model="surveySelect"
            :items="selections"
            :rules="[v => !!v || 'A survey must be selected']"
            label="Qualtrics Survey"
            required
            persistent-hint
            return-object
            single-line
          />

          <v-text-field
            v-model="title"
            :counter="100"
            :rules="titleRules"
            label="Title of Survey within Capernaum"
            required
          ></v-text-field>
          <v-btn :disabled="!valid" color="success" @click="submit">
            Submit
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";

import {
  SurveyItem,
  SurveySelection,
  SurveyDimensionEnum
} from "./survey-dimension.types";

export default Vue.extend({
  /** page to choose a Qualtrics survey so that it can be downloaded */
  name: "ImportQualtricsSurvey",

  props: {},

  data() {
    return {
      surveys: [] as SurveyItem[],
      title: "" as string,
      valid: true,
      //FIXME: make surveySelect of the appropriate type
      surveySelect: null as any,
      //select: null as any,
      //name: "",
      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 100) ||
          "Title of survey must be less than 100 characters"
      ] as any
    };
  },

  methods: {
    submit() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("title is: ", this.title);
        console.log("selected survey: ", this.surveySelect);
        /*
            this.$apollo.mutate({
            mutation: ADD_LETTER_MUTATION,
            variables: {
                name: this.name
            }
            });
            */
      }
    }
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    }
  },

  computed: {
    selections(): SurveySelection[] {
      return this.surveys.map(survey => ({
        text: survey.name,
        value: survey.id
      }));
    }
  },

  mounted() {
    console.log("mounted....");
  }
});
</script>
