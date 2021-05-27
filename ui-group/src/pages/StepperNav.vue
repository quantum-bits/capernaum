<template>
  <div>
    <v-btn v-if="!isLastStep" color="primary" @click="updateStep(+1)">
      Continue
    </v-btn>
    <v-btn v-else color="primary" @click="submit()"> Submit </v-btn>
    <v-btn v-if="!isFirstStep" text @click="updateStep(-1)"> Back </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "StepperNav",

  props: {
    value: { type: Number, required: true },
    stepCount: { type: Number, required: true },
  },

  computed: {
    isFirstStep(): boolean {
      return this.value === 1;
    },
    isLastStep(): boolean {
      return this.value === this.stepCount;
    },
  },

  methods: {
    updateStep(offset: number) {
      this.$emit("input", this.value + offset);
    },
  },
});
</script>

<style scoped></style>
