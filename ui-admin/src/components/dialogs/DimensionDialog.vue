<template>
  <v-dialog
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    persistent
    max-width="800"
  >
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-form ref="dimensionForm" v-model="formValid">
        <v-card-text>
          <v-text-field
            v-model="dimensionTitle"
            label="Survey Dimension"
            :hint="titleHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text :disabled="!formValid" color="warning" @click="onSave">
            Save
          </v-btn>
          <v-btn text @click="$emit('input', false)"> Cancel </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { DimensionDialogResponse } from "@/components/dialogs/dialog.types";

export default Vue.extend({
  name: "DimensionDialog",

  props: {
    value: { type: Boolean, required: true },

    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },
    initialTitle: String,
  },

  data() {
    return {
      dimensionTitle: "",
      formValid: false,

      rules: {
        required: [(v: string): boolean | string => !!v || "Required field"],
      },
    };
  },

  methods: {
    onSave() {
      const response: DimensionDialogResponse = {
        title: this.dimensionTitle,
      };
      this.$emit("input", false);
      this.$emit("ready", response);
    },
  },
});
</script>
