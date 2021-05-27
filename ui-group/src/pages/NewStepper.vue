<template>
  <v-container>
    <h2>Request Group Administration of the Christian Life Survey</h2>
    <v-stepper v-model="step" vertical non-linear>
      <v-stepper-step step="1" editable> Overview </v-stepper-step>
      <v-stepper-content step="1">
        <v-card>
          <v-card-text>
            This form allows you to request an administration of the Christian
            Life Survey for your group.
          </v-card-text>
        </v-card>
        <stepper-nav v-model="step" :step-count="3" />
      </v-stepper-content>

      <v-stepper-step step="2" editable> Your information </v-stepper-step>
      <v-stepper-content step="2">
        <v-card>
          <p>EMAIL AND STUFF</p>
        </v-card>
        <stepper-nav v-model="step" :step-count="3" />
      </v-stepper-content>

      <v-stepper-step step="3" editable> Your group </v-stepper-step>
      <v-stepper-content step="3">
        <v-card>
          <v-card-text>
            <p>GROUP DETAILS</p>
          </v-card-text>
        </v-card>
        <stepper-nav v-model="step" :step-count="3" />
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import StepperNav from "@/pages/StepperNav.vue";

export default Vue.extend({
  name: "NewStepper",

  components: {
    StepperNav,
  },

  data() {
    return {
      step: 1,
    };
  },
});
</script>

<style scoped>
p {
  text-align: left;
}
</style>
