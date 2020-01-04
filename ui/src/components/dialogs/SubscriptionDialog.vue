<template>
  <v-dialog persistent v-model="visible" max-width="600">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="theForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-select
            :items="hostChoices"
            required
            label="Machine"
            v-model="dialogState.hostName"
          />
          <v-select
            :items="subscriptionChoices"
            label="Subscription"
            v-model="dialogState.subscriptionType"
          />
          <v-select
            :items="surveyChoices"
            label="Survey"
            v-model="dialogState.surveyId"
            :disabled="dialogState.subscriptionType !== 'completed-response'"
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
import { ALL_MACHINES } from "@/graphql/machine.graphql";
import { AllMachines_machines as Machine } from "@/graphql/types/AllMachines";
import { SubscriptionDialogResponse } from "@/components/dialogs/dialog.types";
import { SubscriptionType } from "@/types/qualtrics.types";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";

interface StringStringChoice {
  text: string;
  value: string;
}

export default Vue.extend({
  name: "SubscriptionDialog",

  model: {
    prop: "visible",
    event: "action"
  },

  props: {
    dialogTitle: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },

    hostName: { type: String, required: true },
    subscriptionType: { type: String, required: true },
    surveyId: { type: String, required: true }
  },

  apollo: {
    machines: {
      query: ALL_MACHINES
    },

    surveys: {
      query: ALL_SURVEYS_QUERY
    }
  },

  data() {
    return {
      machines: [] as Machine[],
      surveys: [] as Survey[],
      dialogState: {
        hostName: "",
        subscriptionType: "",
        surveyId: ""
      },

      subscriptionChoices: [
        { text: "Survey Activated", value: "activate-survey" },
        { text: "Survey Deactivated", value: "deactivate-survey" },
        { text: "Response Completed", value: "completed-response" }
      ],

      formValid: false
    };
  },

  computed: {
    hostChoices(): StringStringChoice[] {
      return this.machines.map(machine => ({
        text: machine.name,
        value: machine.hostName
      }));
    },

    surveyChoices(): StringStringChoice[] {
      return this.surveys.map(survey => ({
        text: survey.qualtricsName,
        value: survey.qualtricsId
      }));
    }
  },

  methods: {
    onSubmit() {
      const result: SubscriptionDialogResponse = {
        hostName: this.dialogState.hostName,
        subscriptionType: this.dialogState.subscriptionType as SubscriptionType,
        surveyId: this.dialogState.surveyId
      };
      this.$emit("action", false);
      this.$emit("ready", result);
    }
  },

  watch: {
    visible: {
      handler: function(newValue) {
        if (newValue) {
          this.dialogState.hostName = this.hostName;
          this.dialogState.subscriptionType = this.subscriptionType;
          this.dialogState.surveyId = this.surveyId;

          if (this.$refs.theForm) {
            // FIXME: Replace the `as any` hack.
            (this.$refs.theForm as any).resetValidation();
          }
        }
      },
      immediate: true
    }
  }
});
</script>
