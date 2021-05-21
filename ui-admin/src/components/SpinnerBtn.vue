<template>
  <v-btn
    class="mr-2"
    color="primary"
    dark
    :loading="spinning"
    :disabled="spinning"
    @click="onClick"
  >
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SpinnerBtn",

  props: {
    spinning: { type: Boolean, default: false },
  },

  methods: {
    onClick() {
      this.$emit("click");
    },
  },
});
</script>
