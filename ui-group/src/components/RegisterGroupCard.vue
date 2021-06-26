<template>
  <v-card elevation="2" outlined shaped tile>
    <v-card-title> Register Your Group </v-card-title>
    <v-card-text class="text-sm-left">
      Register your group to take the Christian Life Survey. You will receive
      summary data about your group after they have completed the survey.

      <p class="mt-5" v-if="noSurveys">
        <strong> We're sorry,</strong> but the group sign-up feature is currently undergoing 
        a small update and is unavailable at the moment.  Please check back in 
        soon to sign up your group!
      </p>
    </v-card-text>
    <v-divider class="mx-4" />
    <v-card-actions>
      <v-btn class="button-colour" :disabled="noSurveys" text @click="registerGroup">
        Register Group
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";

// TODO: use the automatically generated type AllSurveys_surveys (generated using yarn gen:types);
//import { AllSurveys_surveys } from "../graphql/types/AllSurveys";

// for some reason if I change the selectedSurvey type from SelectedSurvey to AllSurveys_surveys, I get a compilation error
// (error: 'AllSurveys_surveys' is defined but never used  no-unused-vars)
interface SelectedSurvey {
  id: number;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  okayForGroup: boolean;
  publicName: string;
  detailedDescription: string;
}

export default Vue.extend({
  name: "RegisterGroupCard",

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY,
      update: (data) => {
        console.log("surveys! ", data);
        return data.surveys.filter(
          (survey: SelectedSurvey) => survey.okayForGroup
        );
      },
    },
  },

  data() {
    return {
      surveys: [],
    };
  },

  computed: {
    noSurveys(): boolean {
      return this.surveys.length === 0;
    },
  },

  methods: {
    registerGroup() {
      this.$router.push({ name: "group-sign-up" });
    },
  },
});
</script>

<style scoped>
.button-colour {
  color: #4e2b4d;
}
</style>
