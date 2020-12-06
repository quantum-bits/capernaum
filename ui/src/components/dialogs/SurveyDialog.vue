<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-card-subtitle>{{ qualtricsName }}</v-card-subtitle>
      <v-form ref="surveyForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dialogState.description"
            label="Description"
            hint="Short description that someone signing up a group will see"
            :rules="rules.required"
            outlined
            persistent-hint
          />
          <v-checkbox
            v-model="dialogState.okayForGroup"
            label="OK for Group (if checked, will show up as a group survey option)"
          ></v-checkbox>
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
import { SurveyDialogResponse } from "@/components/dialogs/dialog.types";

export default Vue.extend({
  name: "SurveyDialog",

  model: {
    prop: "visible",
    event: "action",
  },

  props: {
    dialogTitle: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },
    detailedDescription: { type: String, required: true },
    qualtricsName: { type: String, required: true },
    okayForGroup: { type: Boolean, required: true },
  },

  data() {
    return {
      formValid: false,

      rules: {
        required: [(v: string): boolean | string => !!v || "Required field"],
      },
      dialogState: {
        description: "",
        okayForGroup: false,
      },
    };
  },

  methods: {
    onSubmit() {
      const response: SurveyDialogResponse = {
        detailedDescription: this.dialogState.description,
        okayForGroup: this.dialogState.okayForGroup,
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
          this.dialogState.description = this.detailedDescription;
          this.dialogState.okayForGroup = this.okayForGroup;
          console.log("dialog state: ", this.dialogState);
          if (this.$refs.surveyForm) {
            (this.$refs.surveyForm as Vue & {
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
