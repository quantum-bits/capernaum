<template>
  <div>
    <v-tooltip v-if="surveyIndex.useForPredictions" top>
      <template v-slot:activator="{ on }">
        <v-icon class="mx-2" v-on="on">
          {{ "mdi-table" }}
        </v-icon>
      </template>
      <span>
        Items for this index used in Boolean Association Table.
      </span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <a @click="editIndex" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-pencil" }}
          </v-icon>
        </a>
      </template>
      <span>
        Edit this survey index and/or update the associations to survey items.
      </span>
    </v-tooltip>

    <v-tooltip v-if="surveyIndex.canDelete" top>
      <template v-slot:activator="{ on }">
        <a @click="deleteIndex" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-close-circle" }}
          </v-icon>
        </a>
      </template>
      <span>
        Delete this survey index and the associations to survey items.
      </span>
    </v-tooltip>
    <v-tooltip v-else top>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
          {{ "mdi-close-circle" }}
        </v-icon>
      </template>
      <span>
        This survey index has boolean associations and cannot be deleted.
      </span>
    </v-tooltip>

    <v-dialog persistent v-model="surveyIndexDialog.visible" max-width="800">
      <v-card>
        <v-card-title class="headline">
          {{ surveyIndexDialog.dialogTitle }}
        </v-card-title>
        <v-form
          ref="indexForm"
          v-model="surveyIndexDialog.valid"
          lazy-validation
        >
          <v-card-text>
            <v-text-field
              v-model="surveyIndexDialog.text"
              label="Survey Index"
              :hint="surveyIndexDialog.dialogHint"
              :rules="rules.required"
              outlined
              persistent-hint
            />

            <v-text-field
              v-model="surveyIndexDialog.abbrev"
              label="Survey Index Abbreviation"
              :hint="surveyIndexDialog.abbrevHint"
              :rules="rules.required"
              outlined
              persistent-hint
            />

            <span v-if="canTurnOffPredictions">
              <v-switch
                v-model="surveyIndexDialog.useForPredictions"
                label="Use For Predictions in Boolean Association Table"
              ></v-switch>
            </span>
            <span v-else>
              <v-tooltip left max-width="300">
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-switch
                      v-model="surveyIndexDialog.useForPredictions"
                      disabled
                      label="Use for predictions in Boolean association table"
                    ></v-switch>
                  </span>
                </template>
                <span>
                  One or more survey indexes associated with this survey
                  dimension have boolean associations, so this setting cannot be
                  turned off.
                </span>
              </v-tooltip>
            </span>

            <template>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12" sm="12">
                    <v-select
                      v-model="selectedSurveyItems"
                      :items="surveyItems"
                      :item-text="'name'"
                      :item-value="'id'"
                      label="Choose Survey Items"
                      return-object
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="success" text @click="cancelIndexDialog()">
              Cancel
            </v-btn>

            <v-btn
              :disabled="!surveyIndexDialog.valid"
              color="success"
              text
              @click="submitIndex()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <ConfirmDeleteDialog
      v-model="deleteDialog.visible"
      :customText="deleteDialog.dialogText"
      :customTitle="deleteDialog.dialogTitle"
      @delete-is-confirmed="deleteIsConfirmed"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyIndexView, SurveyItemView } from "../survey.types";

import {
  ADD_INDEX_MUTATION,
  DELETE_INDEX,
  UPDATE_INDEX_MUTATION
} from "../../graphql/surveys.graphql";
import { OneSurvey_survey as Survey } from "@/graphql/types/OneSurvey";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";

export default Vue.extend({
  name: "IndexTreeBranch",

  components: {
    ConfirmDeleteDialog
  },

  // https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480
  props: {
    survey: {
      type: Object as () => Survey,
      required: true
    },
    surveyIndex: {
      type: Object as () => SurveyIndexView,
      required: true
    }
  },

  data() {
    return {
      // Survey items current selected in the index dialog.
      selectedSurveyItems: [] as SurveyItemView[],

      surveyIndexDialog: {
        text: "",
        abbrev: "",
        useForPredictions: true,
        valid: false,

        dialogTitle: "",
        dialogHint: "",
        abbrevHint: "",

        visible: false,
        editOn: false
      },

      deleteDialog: {
        visible: false,
        dialogTitle: "",
        dialogText: ""
      },

      serverError: false,
      canTurnOffPredictions: true, // used to control whether the "turn off predictions slider" is disabled or not in the edit dimensions dialog

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    refetchSurveyData() {
      this.$emit("refetch");
    },

    prepareDialog() {
      this.serverError = false;
      // FIXME: Replace the `as any` hack.
      (this.$refs.indexForm as any).resetValidation();
    },

    isDialogValid() {
      // FIXME: Replace the `as any` hack.
      return (this.$refs.indexForm as any).validate();
    },

    addIndex() {
      this.prepareDialog();
      this.selectedSurveyItems = [];

      this.surveyIndexDialog = {
        text: "",
        abbrev: "",
        useForPredictions: true,
        valid: false,

        dialogTitle: `Add a New Survey Index for '${this.surveyIndex.dimensionName}'`,
        dialogHint: "e.g., 'A Focus on Others'",
        abbrevHint: "e.g., 'FOO'",

        visible: true,
        editOn: false
      };
      this.canTurnOffPredictions = true;
    },

    editIndex() {
      this.selectedSurveyItems = this.surveyIndex.children.map(item => ({
        id: item.id,
        name: item.name
      }));

      this.surveyIndexDialog = {
        text: this.surveyIndex.name,
        abbrev: this.surveyIndex.abbrev,
        useForPredictions: this.surveyIndex.useForPredictions,
        valid: false,

        dialogTitle: `Edit Survey Index for '${this.surveyIndex.dimensionName}'`,
        dialogHint: "e.g., 'A Focus on Others'",
        abbrevHint: "e.g., 'FOO'",

        visible: true,
        editOn: true
      };
      this.canTurnOffPredictions = this.surveyIndex.canDelete;
    },

    deleteIndex() {
      this.deleteDialog = {
        dialogTitle: `Really delete the index '${this.surveyIndex.name}'?`,
        dialogText: "This action is not reversible.",
        visible: true
      };
    },

    deleteIsConfirmed() {
      this.$apollo
        .mutate({
          mutation: DELETE_INDEX,
          variables: {
            id: this.surveyIndex.id
          }
        })
        .then(({ data }) => {
          console.log("item(s) deleted!", data);
          this.refetchSurveyData();
        })
        .catch(error => {
          console.log("there appears to have been an error: ", error);
        });
    },

    cancelIndexDialog() {
      this.surveyIndexDialog.visible = false;
    },

    submitIndex() {
      if (!this.isDialogValid()) {
        console.log("there appears to be a problem with the form....");
        return;
      }

      if (this.surveyIndexDialog.editOn) {
        // Update an existing index.
        this.$apollo
          .mutate({
            mutation: UPDATE_INDEX_MUTATION,
            variables: {
              id: this.surveyIndex.id,
              abbreviation: this.surveyIndexDialog.abbrev,
              title: this.surveyIndexDialog.text,
              useForPredictions: this.surveyIndexDialog.useForPredictions,
              itemIds: this.selectedSurveyItems.map(surveyItem => surveyItem.id)
            }
          })
          .then(() => {
            this.cancelIndexDialog();
            this.refetchSurveyData();
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
            this.serverError = true;
          });
      } else {
        // Add a new index.
        this.$apollo
          .mutate({
            mutation: ADD_INDEX_MUTATION,
            variables: {
              dimensionId: this.surveyIndex.dimensionId,
              abbreviation: this.surveyIndexDialog.abbrev,
              title: this.surveyIndexDialog.text,
              useForPredictions: this.surveyIndexDialog.useForPredictions,
              itemIds: this.selectedSurveyItems.map(surveyItem => surveyItem.id)
            }
          })
          .then(() => {
            this.cancelIndexDialog();
            this.refetchSurveyData();
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
            this.serverError = true;
          });
      }
    }
  },

  computed: {
    surveyItems(): SurveyItemView[] {
      let returnArray: SurveyItemView[] = [];

      if (this.surveyIndex) {
        this.surveyIndex.children.forEach(item => {
          returnArray.push({
            id: item.id,
            name: item.name
          });
        });
      }

      this.survey.surveyItems.forEach(item => {
        returnArray.push({
          id: item.id,
          name: item.qualtricsText
        });
      });
      console.log("return array: ", returnArray);
      return returnArray;
    }
  }
});
</script>
