<template>
  <div>
    <v-stepper-step :step="step" editable :complete="contentValid">
      {{ title }}
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-card>
        <v-form v-model="contentValid">
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
      <stepper-nav
        v-model="step"
        :step-count="stepCount"
        :disabled="!contentValid"
      />
    </v-stepper-content>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import StepperNav from "@/pages/StepperNav.vue";

export default Vue.extend({
  name: "StepperStep",

  components: {
    StepperNav,
  },

  props: {
    title: { type: String, required: true },
    step: { type: Number, required: true },
    stepCount: { type: Number, required: true },
  },

  data() {
    return {
      firstName: "",
      lastName: "",
      contentValid: false,

      rules: {
        required: (val: string) => !!val || "Required",
        complete: (val: any) => console.log("VAL IS", val),
      },
    };
  },
});
</script>
