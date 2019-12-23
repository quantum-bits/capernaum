<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="indexForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="currentState.title"
            label="Survey Index"
            :hint="titleHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <v-text-field
            v-model="currentState.abbreviation"
            label="Survey Index Abbreviation"
            :hint="abbreviationHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <span v-if="canTurnOffPredictions">
            <v-switch
              v-model="currentState.useForPredictions"
              label="Use For Predictions in Boolean Association Table"
            />
          </span>
          <span v-else>
            <v-tooltip left max-width="300">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    v-model="currentState.useForPredictions"
                    disabled
                    label="Use for predictions in Boolean association table"
                  />
                </span>
              </template>
              <span>
                One or more survey indexes associated with this survey dimension
                have boolean associations, so this setting cannot be turned off.
              </span>
            </v-tooltip>
          </span>

          <v-select
            v-model="currentState.selectedItems"
            :items="currentState.availableItems"
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

          <v-btn color="success" text @click="onCancel">
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
import {
  IndexDialogInitialState,
  IndexDialogResponse
} from "@/pages/SurveyDimensions/dialog.types";
import { SurveyIndexView, SurveyItemView } from "@/pages/survey.types";

export default Vue.extend({
  name: "IndexDialog",

  model: {
    prop: "visible",
    event: "action"
  },

  props: {
    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },
    abbreviationHint: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },

    initialState: { type: Object as () => IndexDialogInitialState }
  },

  data() {
    return {
      currentState: {} as IndexDialogInitialState,
      formValid: false,

      canTurnOffPredictions: true, // used to control whether the "turn off predictions slider" is disabled or not in the edit dimensions dialog

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    onCancel() {
      this.$emit("action", false);
    },

    onSubmit() {
      const response: IndexDialogResponse = {
        title: this.currentState.title,
        abbreviation: this.currentState.abbreviation,
        useForPredictions: this.currentState.useForPredictions,
        itemIds: this.currentState.children.map(surveyItem => surveyItem.id)
      };
      this.$emit("ready", response);
      this.$emit("action", false);
    }
  },

  watch: {
    visible: {
      handler: function(newValue) {
        if (newValue) {
          this.currentState = { ...this.initialState };
          if (this.$refs.indexForm && newValue) {
            // FIXME: Replace the `as any` hack.
            (this.$refs.indexForm as any).resetValidation();
          }
        }
      }
    }
  }
});
</script>
