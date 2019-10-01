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
          <QualtricsSurveyMenu v-model="selectedSurvey" />

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
    <v-layout v-if="serverError">
      <v-flex class="red--text text-center" pa-10 xs7 offset-xs1>
        Sorry, there appears to have been an error. Please try again later.
      </v-flex>
    </v-layout>
    <v-layout v-if="serverError">
      <v-flex xs6 offset-xs6>
        <v-btn color="success" @click="returnToSurveys">
          Return to Surveys
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { IMPORT_QUALTRICS_SURVEY } from "@/graphql/surveys.graphql";

import { QualtricsSurvey, QualtricsSurveySelection } from "./survey.types";
import QualtricsSurveyMenu from "@/components/QualtricsSurveyMenu.vue";

export default Vue.extend({
  /** page to choose a Qualtrics survey so that it can be downloaded */
  name: "ImportQualtricsSurvey",

  components: { QualtricsSurveyMenu },

  data() {
    return {
      qualtricsSurveys: [] as QualtricsSurvey[],
      selectedSurvey: {} as QualtricsSurveySelection,
      title: "" as string,
      valid: true,
      serverError: false,
      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 100) ||
          "Title of survey must be less than 100 characters"
      ] as any
    };
  },

  methods: {
    returnToSurveys() {
      this.$router.push({ name: "imported-surveys" });
    },
    submit() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("title is: ", this.title);

        this.$apollo
          .mutate({
            mutation: IMPORT_QUALTRICS_SURVEY,
            variables: {
              qualtricsImportInput: {
                qualtricsId: this.selectedSurvey.value,
                title: this.title
              }
            }
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.$router.push({ name: "imported-surveys" });
            // FIXME: at the moment, when we go back to the imported surveys page, the new survey isn't there...?!?
            // maybe need to force a page reload or put a subscription on that page so that it keeps checking to see if there are
            // more surveys...?
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
            this.serverError = true;
          });
      }
    }
  }
});
</script>
