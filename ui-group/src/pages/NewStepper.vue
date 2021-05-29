<template>
  <v-container>
    <h2>Request Group Administration of the Christian Life Survey</h2>
    <v-stepper v-model="step" vertical non-linear>
      <v-stepper-step :step="1" editable :complete="stepValid">
        Overview
      </v-stepper-step>
      <v-stepper-content :step="1">
        <v-card>
          <v-form v-model="stepValid">
            <v-card-text>
              This form allows you to request an administration of the Christian
              Life Survey for your group.

              <v-text-field
                v-model="firstName"
                :rules="[rules.required]"
                label="First name"
              />
              <v-text-field
                v-model="lastName"
                :rules="[rules.required]"
                label="Last name"
              />
            </v-card-text>
          </v-form>
        </v-card>
        <stepper-nav v-model="step" :step-count="3" :disabled="!stepValid" />
      </v-stepper-content>

      <stepper-step title="Two Steps Back" :step="2" :step-count="4" />

      <v-stepper-step :step="3" editable> Your information </v-stepper-step>
      <v-stepper-content :step="3">
        <v-card>
          <p>EMAIL AND STUFF</p>
        </v-card>
        <stepper-nav v-model="step" :step-count="4" />
      </v-stepper-content>

      <v-stepper-step step="4" editable> Your group </v-stepper-step>
      <v-stepper-content step="4">
        <v-card>
          <v-card-text>
            <p>GROUP DETAILS</p>
          </v-card-text>
        </v-card>
        <stepper-nav v-model="step" :step-count="4" />
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import StepperNav from "@/pages/StepperNav.vue";
import StepperStep from "@/pages/StepperStep.vue";

export default Vue.extend({
  name: "NewStepper",

  components: {
    StepperNav,
    StepperStep,
  },

  data() {
    return {
      step: 1,
      firstName: "",
      lastName: "",
      stepValid: false,

      rules: {
        required: (val: string) => !!val || "Required",
        complete: (val: any) => console.log("VAL IS", val),
      },
    };
  },
});
</script>

<style scoped>
p {
  text-align: left;
}
</style>
