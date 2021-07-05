<template>
  <v-card outlined class="my-2" elevation="2">
    <v-card-title>
      <v-icon class="mr-2">mdi-drag-vertical</v-icon>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <slot></slot>
    </v-card-text>
    <element-buttons />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ElementButtons from "@/pages/letters/elements/ElementButtons.vue";

export default Vue.extend({
  name: "ElementCard",

  components: { ElementButtons },

  props: {
    title: { type: String, required: true },
  },
});
</script>

<style scoped></style>
