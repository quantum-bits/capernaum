<template>
  <v-dialog
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    persistent
    max-width="800"
  >
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
          <v-btn text color="warning" :disabled="!formValid" @click="onSave">
            {{ mainActionLabel }}
          </v-btn>
          <v-btn text @click="onCancel"> Cancel </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import {
  DialogMode,
  IndexDialogResponse,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";
import { AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices } from "@/graphql/types/AllCapernaumSurveys";

type VueExt = Vue & {
  $refs: {
    indexForm: { resetValidation: () => void };
  };
};

export default (Vue as VueConstructor<VueExt>).extend({
  name: "IndexDialog",

  props: {
    value: { type: Boolean, required: true },

    dialogTitle: { type: String, required: true },
    titleHint: { type: String, required: true },
    abbreviationHint: { type: String, required: true },
    availableItems: {
      type: Array as () => SurveyItemSelection[],
      required: true,
    },
    // Can we turn off "use for predictions" slider?
    canTurnOffPredictions: { type: Boolean, required: true },

    dialogMode: { type: Number, required: true },
    surveyIndex:
      Object as () => AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices,
  },

  created() {
    if (this.dialogMode === DialogMode.Create && this.surveyIndex) {
      throw new Error("Passed survey index in create mode");
    } else if (this.dialogMode === DialogMode.Update && !this.surveyIndex) {
      throw new Error("No survey index supplied for update mode");
    }
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

  computed: {
    mainActionLabel(): string {
      return this.dialogMode === DialogMode.Create ? "Create" : "Update";
    },
  },

  methods: {
    onCancel() {
      this.$emit("input", false);
    },

    onSave() {
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
    surveyIndex: {
      handler: function (newValue) {
        if (newValue) {
          this.dialogState.title = newValue.title;
          this.dialogState.abbreviation = newValue.abbreviation;
          this.dialogState.useForPredictions = newValue.useForPredictions;
          this.dialogState.selectedItems = newValue.selectedItems;
          this.$refs.indexForm.resetValidation();
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>
