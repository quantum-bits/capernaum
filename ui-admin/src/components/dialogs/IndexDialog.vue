<template>
  <v-dialog persistent max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="indexForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dialogState.title"
            label="Survey Index"
            :hint="titleHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <v-text-field
            v-model="dialogState.abbreviation"
            label="Survey Index Abbreviation"
            :hint="abbreviationHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <span v-if="canTurnOffPredictions">
            <v-switch
              v-model="dialogState.useForPredictions"
              label="Use For Predictions in Boolean Association Table"
            />
          </span>
          <span v-else>
            <v-tooltip left max-width="300">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    v-model="dialogState.useForPredictions"
                    disabled
                    label="Use for predictions in Boolean association table"
                  />
                </span>
              </template>
              <span>
                This survey index has boolean associations, so this setting
                cannot be turned off.
              </span>
            </v-tooltip>
          </span>

          <v-select
            v-model="dialogState.selectedItems"
            :items="availableItems"
            item-value="id"
            item-text="name"
            label="Choose Survey Items"
            return-object
            multiple
            chips
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="success" text @click="onCancel"> Cancel </v-btn>

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
import {
  IndexDialogResponse,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";

export default Vue.extend({
  name: "IndexDialog",

  props: {
    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },
    abbreviationHint: { type: String, required: true },
    value: { type: Boolean, required: true },
    availableItems: {
      type: Array as () => SurveyItemSelection[],
      required: true,
    },
    // Can we turn off "use for predictions" slider?
    canTurnOffPredictions: { type: Boolean, required: true },

    title: String,
    abbreviation: String,
    useForPredictions: Boolean,
    selectedItems: Array as () => SurveyItemSelection[],
  },

  data() {
    return {
      dialogState: {
        title: "",
        abbreviation: "",
        useForPredictions: false,
        selectedItems: [] as SurveyItemSelection[],
      },

      formValid: false,

      rules: {
        required: [(v: string): boolean | string => !!v || "Required field"],
      },
    };
  },

  methods: {
    onCancel() {
      this.$emit("input", false);
    },

    onSubmit() {
      const response: IndexDialogResponse = {
        title: this.dialogState.title,
        abbreviation: this.dialogState.abbreviation,
        useForPredictions: this.dialogState.useForPredictions,
        itemIds: this.dialogState.selectedItems.map((item) => item.id),
      };
      this.$emit("ready", response);
      this.$emit("input", false);
    },
  },

  watch: {
    value: {
      handler: function (newValue) {
        if (newValue) {
          this.dialogState.title = this.title;
          this.dialogState.abbreviation = this.abbreviation;
          this.dialogState.useForPredictions = this.useForPredictions;
          this.dialogState.selectedItems = this.selectedItems;

          if (this.$refs.indexForm) {
            // FIXME: Replace the `as any` hack.
            (
              this.$refs.indexForm as Vue & {
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
