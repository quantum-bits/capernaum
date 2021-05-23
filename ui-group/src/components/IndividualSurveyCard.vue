<template>
  <v-card elevation="2" outlined shaped tile>
    <v-card-title> Take Individual Survey </v-card-title>
    <v-card-text class="text-sm-left">
      Take the Christian Life Survey on your own. This will be the option for
      most people. Once you have completed the survey you will receive an email
      with a summary of results and recommendations for scripture engagement
      practices that may be helpful to you.
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <v-btn class="button-colour" text @click="takeIndividualSurvey">
        Go to survey
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndividualSurveyCard",

  methods: {
    takeIndividualSurvey() {
      console.log("go to individual survey");
    },
  },
});
</script>

<style scoped>
.button-colour {
  color: #4e2b4d;
}
</style>
