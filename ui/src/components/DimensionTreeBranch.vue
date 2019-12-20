<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <a @click="addSurveyIndex(item)" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-plus-circle" }}
          </v-icon>
        </a>
      </template>
      <span>Add a new survey index for this survey dimension.</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <a @click="editSurveyDimension(item)" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-pencil" }}
          </v-icon>
        </a>
      </template>
      <span>Edit this survey dimension.</span>
    </v-tooltip>
    <v-tooltip v-if="item.canDelete" top>
      <template v-slot:activator="{ on }">
        <a @click="deleteDimension(item)" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-close-circle" }}
          </v-icon>
        </a>
      </template>
      <span>
        Delete this survey dimension and all associated survey indexes.
      </span>
    </v-tooltip>
    <v-tooltip v-else top>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
          {{ "mdi-close-circle" }}
        </v-icon>
      </template>
      <span>
        One or more survey indexes associated with this survey dimension have
        boolean associations, so it cannot be deleted.
      </span>
    </v-tooltip>
    <v-dialog
      persistent
      v-model="surveyDimensionDialog.visible"
      max-width="800"
    >
      <v-card>
        <v-card-title class="headline">
          {{ surveyDimensionDialog.dialogTitle }}
        </v-card-title>
        <v-form ref="dimensionForm" v-model="valid" lazy-validation>
          <v-card-text>
            <v-text-field
              v-model="surveyDimensionDialog.text"
              label="Survey Dimension"
              :hint="surveyDimensionDialog.dialogHint"
              :rules="nameRules"
              outlined
              persistent-hint
            />
            <div v-if="serverError" class="red--text text-center">
              Sorry, there appears to have been an error. Please try again
              later.
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="success" text @click="cancelDimensionDialog()">
              Cancel
            </v-btn>

            <v-btn
              :disabled="!valid"
              color="success"
              text
              @click="submitSurveyDimension()"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyDimensionEnum, SurveyDimensionView } from "@/pages/survey.types";
import {
  ADD_DIMENSION_MUTATION,
  UPDATE_DIMENSION_MUTATION
} from "@/graphql/surveys.graphql";

export default Vue.extend({
  name: "DimensionTreeBranch",

  data() {
    return {
      surveyDimensionDialog: {
        id: NaN, //id of the survey dimension currently being edited
        editOn: false, // true when editing a survey dimension (as opposed to adding a new one)
        visible: false,
        text: "",
        dialogTitle: "",
        dialogHint: ""
      },
      valid: true,

      canTurnOffPredictions: true // used to control whether the "turn off predictions slider" is disabled or not in the edit dimensions dialog
    };
  },

  methods: {
    refetchSurveyData() {
      this.$emit("refetch");
    },

    addSurveyDimension() {
      this.surveyDimensionDialog.visible = true;
      this.surveyDimensionDialog.text = "";
      this.surveyDimensionDialog.dialogTitle = "Add a New Survey Dimension";
      this.surveyDimensionDialog.dialogHint = "e.g., 'Focal Dimension'";
      console.log("valid? ", this.valid);
      this.canTurnOffPredictions = true;
      if (this.$refs.dimensionForm) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.dimensionForm as any).resetValidation();
      }
    },

    editSurveyDimension(dimension: SurveyDimensionView) {
      console.log("dimension: ", dimension);
      this.surveyDimensionDialog.visible = true;
      this.surveyDimensionDialog.editOn = true;
      this.surveyDimensionDialog.id = dimension.id;
      this.surveyDimensionDialog.text = dimension.name;
      this.surveyDimensionDialog.dialogTitle = "Edit Survey Dimension";
      this.surveyDimensionDialog.dialogHint = "e.g., 'Focal Dimension'";
      this.canTurnOffPredictions = dimension.canDelete;
    },

    deleteDimension(dimension: SurveyDimensionView) {
      console.log("delete dimension!", dimension);
      this.deleteDialog.dialogTitle =
        "Really delete the dimension " + "'" + dimension.name + "'?";
      this.deleteDialog.dialogText =
        "Doing so will also delete any associated indexes.";
      this.showConfirmDeleteDialog = true;
      this.deleteDialog.type = SurveyDimensionEnum.SURVEY_DIMENSION;
      this.deleteDialog.id = dimension.id;
    },

    cancelDimensionDialog() {
      this.surveyDimensionDialog.visible = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.dimensionForm as any).resetValidation();
      this.serverError = false;
      this.surveyDimensionDialog.editOn = false;
    },

    submitSurveyDimension() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.dimensionForm as any).validate()) {
        console.log("save info");
        if (!this.surveyDimensionDialog.editOn) {
          //adding a new dimension
          console.log("adding a new dimension");
          console.log("survey ID: ", this.surveySelect.value);
          console.log("title: ", this.surveyDimensionDialog.text);

          this.$apollo
            .mutate({
              mutation: ADD_DIMENSION_MUTATION,
              variables: {
                surveyId: this.surveySelect.value,
                title: this.surveyDimensionDialog.text,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.dimensionForm as any).resetValidation();
              this.serverError = true;
            });
        } else {
          //editing an existing dimension
          console.log("updating....");
          this.$apollo
            .mutate({
              mutation: UPDATE_DIMENSION_MUTATION,
              variables: {
                id: this.surveyDimensionDialog.id,
                title: this.surveyDimensionDialog.text,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.dimensionForm as any).resetValidation();
              this.serverError = true;
            });
        }
      } else {
        console.log("there appears to be a problem with the form....");
      }
    }
  }
});
</script>
