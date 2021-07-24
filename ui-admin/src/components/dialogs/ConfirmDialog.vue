<template>
  <v-dialog
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    persistent
    max-width="600"
  >
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>{{ dialogText }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="warning" @click="confirm">
          {{ buttonLabel }}
        </v-btn>
        <v-btn text @click="cancel"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmDialog",

  props: {
    value: { type: Boolean, required: true },

    dialogTitle: { type: String, required: true },
    dialogText: { type: String, required: true },
    buttonLabel: { type: String, required: true },
  },

  methods: {
    confirm() {
      this.$emit("confirmed");
      this.$emit("input", false);
    },

    cancel() {
      this.$emit("input", false);
    },
  },
});
</script>
