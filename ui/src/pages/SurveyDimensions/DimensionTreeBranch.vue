<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <a @click="addSurveyIndex(surveyDimension)" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-plus-circle" }}
          </v-icon>
        </a>
      </template>
      <span>Add a new survey index for this survey dimension.</span>
    </v-tooltip>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <a @click="showDimensionDialog" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-pencil" }}
          </v-icon>
        </a>
      </template>
      <span>Edit this survey dimension.</span>
    </v-tooltip>

    <v-tooltip v-if="surveyDimension.canDelete" top>
      <template v-slot:activator="{ on }">
        <a @click="deleteDimension(surveyDimension)" v-on="on">
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

    <dimension-dialog
      title="Edit Survey Dimension"
      hint="e.g., 'Focal Dimension'"
      :visible="dimensionDialog.visible"
      @dimension-ready="updateDimension"
    />

    <confirm-delete-dialog
      v-model="deleteDialog.visible"
      :customText="deleteDialog.dialogText"
      :customTitle="deleteDialog.dialogTitle"
      @delete-is-confirmed="deleteIsConfirmed"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyDimensionView } from "@/pages/survey.types";
import {
  DELETE_DIMENSION,
  UPDATE_DIMENSION_MUTATION
} from "@/graphql/surveys.graphql";
import { OneSurvey_survey as Survey } from "@/graphql/types/OneSurvey";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import DimensionDialog from "@/pages/SurveyDimensions/DimensionDialog.vue";

export default Vue.extend({
  name: "DimensionTreeBranch",

  components: {
    ConfirmDeleteDialog,
    DimensionDialog
  },

  props: {
    survey: {
      type: Object as () => Survey,
      required: true
    },
    surveyDimension: {
      type: Object as () => SurveyDimensionView,
      required: true
    }
  },

  data() {
    return {
      dimensionDialog: {
        visible: false
      },

      deleteDialog: {
        visible: false,
        dialogTitle: "",
        dialogText: ""
      },

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    refetchSurveyData() {
      this.$emit("refetch");
    },

    showDimensionDialog() {
      this.dimensionDialog.visible = true;
    },

    hideDimensionDialog() {
      this.dimensionDialog.visible = false;
    },

    updateDimension(dimensionDetails: any) {
      console.log("DIM DETAILS", dimensionDetails);
      this.$apollo
        .mutate({
          mutation: UPDATE_DIMENSION_MUTATION,
          variables: {
            id: this.surveyDimension.id,
            title: dimensionDetails.dimensionName,
            // FIXME: sequence should not be hard-coded
            sequence: 10
          }
        })
        .then(() => {
          this.hideDimensionDialog();
          this.refetchSurveyData();
        })
        .catch(error => {
          console.log("there appears to have been an error: ", error);
        });
    },

    deleteDimension(dimension: SurveyDimensionView) {
      this.deleteDialog = {
        dialogTitle: `Really delete the dimension '${dimension.name}'?`,
        dialogText: "Doing so will also delete any associated indexes.",
        visible: true
      };
    },

    deleteIsConfirmed() {
      this.$apollo
        .mutate({
          mutation: DELETE_DIMENSION,
          variables: {
            id: this.surveyDimension.id
          }
        })
        .then(() => {
          this.refetchSurveyData();
        })
        .catch(error => {
          console.log("there appears to have been an error: ", error);
        });
    }
  }
});
</script>
