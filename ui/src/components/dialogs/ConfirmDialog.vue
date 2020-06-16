<template>
  <v-row justify="center">
    <v-dialog v-model="visible" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
        <v-card-text>{{ dialogText }}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="confirm">
            {{ buttonLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmDialog",

  model: {
    prop: "visible",
    event: "show",
  },

  props: {
    visible: { type: Boolean, required: true },
    dialogTitle: { type: String, required: true },
    dialogText: { type: String, required: true },
    buttonLabel: { type: String, required: true },
  },

  methods: {
    cancel() {
      this.$emit("show", false);
    },

    confirm() {
      this.$emit("confirmed");
      this.$emit("show", false);
    },
  },
});
</script>
