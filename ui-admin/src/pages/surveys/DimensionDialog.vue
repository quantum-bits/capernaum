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
          <v-btn text :disabled="!formValid" color="warning" @click="onReady">
            {{ mainActionLabel }}
          </v-btn>
          <v-btn text @click="$emit('input', false)"> Cancel </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { AllCapernaumSurveys_surveys_surveyDimensions } from "@/graphql/types/AllCapernaumSurveys";
import { DialogMode } from "@/components/dialogs/dialog.types";

export default Vue.extend({
  name: "DimensionDialog",

  props: {
    value: { type: Boolean, required: true },

    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },

    dialogMode: { type: Number, required: true },
    surveyDimension:
      Object as () => AllCapernaumSurveys_surveys_surveyDimensions,
  },

  created() {
    if (this.dialogMode === DialogMode.Create && this.surveyDimension) {
      throw new Error("Passed survey dimension in create mode");
    } else if (this.dialogMode === DialogMode.Update && !this.surveyDimension) {
      throw new Error("In update mode, but no survey dimension supplied");
    }
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

  computed: {
    mainActionLabel(): string {
      return this.dialogMode === DialogMode.Create ? "Create" : "Update";
    },
  },

  watch: {
    surveyDimension(newValue) {
      this.dimensionTitle = newValue.title;
    },
  },

  methods: {
    onReady() {
      const response: Partial<AllCapernaumSurveys_surveys_surveyDimensions> = {
        title: this.dimensionTitle,
      };
      this.$emit("input", false);
      this.$emit("ready", response);
    },
  },
});
</script>
