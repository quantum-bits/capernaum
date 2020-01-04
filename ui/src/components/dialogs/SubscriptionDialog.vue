<template>
  <v-dialog persistent v-model="visible" max-width="600">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="theForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-select
            :items="hostChoices"
            label="Machine"
            v-model="dialogState.hostId"
          />
          <v-select
            :items="subscriptionChoices"
            label="Subscription"
            v-model="dialogState.subscriptionType"
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

interface MachineChoice {
  text: string;
  value: number;
}

interface SubscriptionChoice {
  text: string;
  value: SubscriptionType;
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

    hostId: { type: Number, required: true },
    subscriptionType: { type: String, required: true }
  },

  apollo: {
    machines: {
      query: ALL_MACHINES
    }
  },

  data() {
    return {
      machines: [] as Machine[],
      dialogState: {
        hostId: NaN,
        subscriptionType: ""
      },

      subscriptionChoices: [
        { text: "Survey Activated", value: "activateSurvey" },
        { text: "Survey Deactivated", value: "deactivateSurvey" },
        { text: "Response Completed", value: "completedResponse" }
      ],

      formValid: false,
      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  computed: {
    hostChoices(): MachineChoice[] {
      return this.machines.map(machine => ({
        text: machine.name,
        value: machine.id
      }));
    }
  },

  methods: {
    onSubmit() {
      const result: SubscriptionDialogResponse = {
        hostId: this.dialogState.hostId,
        subscriptionType: this.dialogState.subscriptionType as SubscriptionType
      };
      this.$emit("ready", result);
      this.$emit("action", false);
    }
  },

  watch: {
    visible: {
      handler: function(newValue) {
        if (newValue) {
          this.dialogState.hostId = this.hostId;
          this.dialogState.subscriptionType = this.subscriptionType;

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
