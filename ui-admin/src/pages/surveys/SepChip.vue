<template>
  <v-tooltip top>
    <span> Items within are used for SEP predictions. </span>
    <template v-slot:activator="{ on }">
      <v-chip x-small class="ml-1" color="warning" v-on="on">SEP</v-chip>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SepChip",
});
</script>
