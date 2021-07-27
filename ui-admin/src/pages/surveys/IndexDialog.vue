<template>
  <v-dialog v-model="visible" persistent max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="indexForm" v-model="formValid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="workingIndex.title"
            label="Survey Index"
            :hint="titleHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <v-text-field
            v-model="workingIndex.abbreviation"
            label="Survey Index Abbreviation"
            :hint="abbreviationHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <span v-if="canTurnOffPredictions">
            <v-switch
              v-model="workingIndex.useForPredictions"
              label="Use For Predictions in Boolean Association Table"
            />
          </span>
          <span v-else>
            <v-tooltip left max-width="300">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    v-model="workingIndex.useForPredictions"
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
            v-model="selectedItems"
            :items="availableItems"
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
import { SurveyIndexUpdateInput } from "@/graphql/types/globalTypes";

type VueExt = Vue & {
  $refs: {
    indexForm: {
      reset: () => void;
      resetValidation: () => void;
    };
  };
};

export default (Vue as VueConstructor<VueExt>).extend({
  name: "IndexDialog",

  props: {
    value: { type: Boolean, required: true },

    dialogTitle: { type: String, required: true },
    dialogMode: { type: Number, required: true },
    titleHint: { type: String, required: true },
    abbreviationHint: { type: String, required: true },
    canTurnOffPredictions: { type: Boolean, required: true },
    availableItems: {
      type: Array as () => SurveyItemSelection[],
      required: true,
    },
    surveyIndex: {
      type: Object as () => AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices,
    },
  },

  // beforeCreate() {
  //   console.log("BEFORE CREATE");
  // },
  created() {
    console.log("CREATED");
    if (this.dialogMode === DialogMode.Create && this.surveyIndex) {
      throw new Error("Passed survey index in create mode");
    } else if (this.dialogMode === DialogMode.Update && !this.surveyIndex) {
      throw new Error("No survey index supplied for update mode");
    }
  },

  // beforeMount() {
  //   console.log("BEFORE MOUNT");
  // },
  // mounted() {
  //   console.log("MOUNTED");
  // },

  // beforeUpdate() {
  //   console.log("BEFORE UPDATE");
  // },
  // updated() {
  //   console.log("UPDATED");
  // },

  // beforeDestroy() {
  //   console.log("BEFORE DESTROY");
  // },
  // destroyed() {
  //   console.log("DESTROYED");
  // },

  data() {
    return {
      workingIndex: {
        title: "",
        abbreviation: "",
        useForPredictions: false,
      } as Pick<
        AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices,
        "title" | "abbreviation" | "useForPredictions"
      >,
      selectedItems: [] as SurveyItemSelection[],
      formValid: false,
      rules: {
        required: [(v: string): boolean | string => !!v || "Required field"],
      },
    };
  },

  // As coded:
  // <index-dialog v-model="dimTabVisible" ... />
  //
  // Behaves as:
  // <index-dialog
  //   v-bind:value="dimTabVisible"
  //   v-on:input="dimTabVisible = $event"
  // />

  /* To open dialog
     1. SurveyDimensionTab: set dimTabVisible to true.
     2. IndexDialog: value becomes true because bound to dimTabVisible
     3. IndexDialog: visible computed prop's get() runs, returns true from value
     4. VDialog: respond to v-model="visible" by displaying
     To close dialog
     1. IndexDialog: set visible to false
     2. IndexDialog: visible computed prop's set() runs, emitting input even with false value
     3. SurveyDimensionTab: set dimTabVisible to false
     4. IndexDialog: value because false because bound to dimTabVisible
     5. IndexDialog: visible computed prop's get() runs, returns false
     6. VDialog: respond to v-model="visible" by hiding
   */

  computed: {
    visible: {
      get(): boolean {
        if (this.dialogMode === DialogMode.Create) {
          if (this.$refs.indexForm) {
            console.log("RESET FORM");
            this.$refs.indexForm.reset();
          } else {
            console.log("REFS NOT READY");
          }
        }
        console.log("VISIBLE GET", this.value);
        return this.value;
      },
      set(newValue: boolean) {
        console.log("VISIBLE SET", newValue);
        this.$emit("input", newValue);
      },
    },

    mainActionLabel(): string {
      return this.dialogMode === DialogMode.Create ? "Create" : "Update";
    },
  },

  methods: {
    onCancel() {
      this.visible = false;
    },

    onSave() {
      const response: Partial<SurveyIndexUpdateInput> = {
        title: this.workingIndex.title,
        abbreviation: this.workingIndex.abbreviation,
        useForPredictions: this.workingIndex.useForPredictions,
        itemIds: this.selectedItems.map((item) => item.value),
      };
      this.visible = false;
      this.$emit("ready", response);
    },
  },

  watch: {
    surveyIndex: {
      handler: function (
        newValue: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices
      ) {
        this.workingIndex.title = newValue.title;
        this.workingIndex.abbreviation = newValue.abbreviation;
        this.workingIndex.useForPredictions = newValue.useForPredictions;
        this.selectedItems = newValue.surveyItems.map((item) => ({
          text: item.qualtricsText,
          value: item.id,
        }));
      },
      // immediate: true,
      deep: true,
    },
  },
});
</script>
