<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="$emit('click')">
        <v-icon>{{ iconName }}</v-icon>
      </v-btn>
    </template>
    <span>{{ toolTip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IconButton",

  props: {
    iconName: { type: String, required: true },
    toolTip: { type: String, required: true },
  },
});
</script>
