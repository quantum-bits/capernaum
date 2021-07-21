<template>
  <v-dialog persistent max-width="600">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="theForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dialogState.machineName"
            label="Name"
            hint="(e.g., 'Production Server')"
            :rules="rules.required"
          />
          <v-text-field
            v-model="dialogState.hostName"
            label="Host Name"
            hint="(e.g., 'galilee.cse.taylor.edu')"
            :rules="rules.required"
          />
          <v-switch v-model="dialogState.isActive" label="Active" />
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
import { MachineCreateInput } from "@/graphql/types/globalTypes";

export default Vue.extend({
  name: "MachineDialog",

  props: {
    value: { type: Boolean, required: true, default: false },
    dialogTitle: { type: String, required: true },

    machineName: { type: String, required: true },
    hostName: { type: String, required: true },
    isActive: { type: Boolean, required: true },
  },

  data() {
    return {
      dialogState: {
        machineName: "",
        hostName: "",
        isActive: true,
      },

      formValid: false,
      rules: {
        required: [(v: string): boolean | string => !!v || "Required field"],
      },
    };
  },

  methods: {
    onSave() {
      const result: MachineCreateInput = {
        name: this.dialogState.machineName,
        hostName: this.dialogState.hostName,
        active: this.dialogState.isActive,
      };
      this.$emit("ready", result);
      this.$emit("input", false);
    },
  },

  watch: {
    value: {
      handler: function (newValue) {
        if (newValue) {
          this.dialogState.machineName = this.machineName;
          this.dialogState.hostName = this.hostName;
          this.dialogState.isActive = this.isActive;

          if (this.$refs.theForm) {
            (
              this.$refs.theForm as Vue & {
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
