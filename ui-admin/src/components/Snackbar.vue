<template>
  <v-snackbar v-model="visible" :timeout="timeout">
    {{ content }}
    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="visible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Snackbar",

  props: {
    content: { type: String, required: true, default: null },
    timeout: { type: Number, default: 2000 },
  },

  data() {
    return {
      visible: false,
    };
  },

  watch: {
    // Trigger snackbar when parent changes content prop.
    content: function () {
      this.visible = true;
    },
  },
});
</script>
