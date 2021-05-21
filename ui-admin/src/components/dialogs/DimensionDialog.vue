<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="dimensionForm" v-model="formValid" lazy-validation>
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

          <v-btn color="success" text @click="$emit('action', false)">
            Cancel
          </v-btn>

          <v-btn :disabled="!formValid" color="success" text @click="onSubmit">
            Submit
          </v-btn>
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

  model: {
    prop: "visible",
    event: "action",
  },

  props: {
    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },

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
    onSubmit() {
      const response: DimensionDialogResponse = {
        title: this.dimensionTitle,
      };
      this.$emit("ready", response);
      this.$emit("action", false);
    },
  },

  watch: {
    visible: {
      handler: function (newValue) {
        //KK: deleted oldValue here because it was not being used (typescript warning)
        if (newValue) {
          this.dimensionTitle = this.initialTitle;

          if (this.$refs.dimensionForm) {
            (this.$refs.dimensionForm as Vue & {
              resetValidation: () => boolean;
            }).resetValidation();
          }
        }
      },
      immediate: true,
    },
  },
});
</script>
