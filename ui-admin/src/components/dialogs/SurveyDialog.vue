<template>
  <v-dialog persistent max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-card-subtitle>{{ qualtricsName }}</v-card-subtitle>
      <v-form ref="surveyForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dialogState.publicName"
            label="Public Name for this Survey"
            hint="This is the name for this survey that will be displayed publicly"
            :rules="rules.required"
            outlined
            persistent-hint
          />
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

          <v-btn color="success" text @click="$emit('input', false)">
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

  props: {
    dialogTitle: { type: String, required: true },
    value: { type: Boolean, required: true, default: false },
    detailedDescription: { type: String, required: true },
    qualtricsName: { type: String, required: true },
    okayForGroup: { type: Boolean, required: true },
    publicName: { type: String, required: true },
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
        publicName: "",
      },
    };
  },

  methods: {
    onSubmit() {
      const response: SurveyDialogResponse = {
        detailedDescription: this.dialogState.description,
        okayForGroup: this.dialogState.okayForGroup,
        publicName: this.dialogState.publicName,
      };
      this.$emit("ready", response);
      this.$emit("input", false);
    },
  },

  watch: {
    value: {
      handler: function (newValue) {
        //KK: deleted oldValue here because it was not being used (typescript warning)
        if (newValue) {
          this.dialogState.description = this.detailedDescription;
          this.dialogState.okayForGroup = this.okayForGroup;
          this.dialogState.publicName = this.publicName;
          console.log("dialog state: ", this.dialogState);
          if (this.$refs.surveyForm) {
            (
              this.$refs.surveyForm as Vue & {
                resetValidation: () => boolean;
              }
            ).resetValidation();
          }
        }
      },
      immediate: true,
    },
  },
});
</script>
