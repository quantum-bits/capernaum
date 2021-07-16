<template>
  <v-row class="align-baseline">
    <v-col>
      <h1 class="headline my-4">{{ title }}</h1>
    </v-col>
    <slot />
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PageHeader",

  props: {
    title: { type: String, required: true },
  },
});
</script>
