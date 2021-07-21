<template>
  <span>
    <icon-button
      icon-name="mdi-plus-circle"
      tool-tip="Add a new survey index for this survey dimension."
      @click="visible.indexDialog = true"
    />
    <icon-button
      icon-name="mdi-pencil"
      tool-tip="Edit this survey dimension."
      @click="visible.dimensionDialog = true"
    />
    <icon-button
      :can-click="surveyDimension.canDelete"
      icon-name="mdi-close-circle"
      tool-tip="Delete this survey dimension and all associated survey indexes."
      disabled-tool-tip="One or more survey indexes associated with this survey dimension have boolean associations, so it cannot be deleted."
      @click="visible.deleteDialog = true"
    />

    <!--    <dimension-dialog-->
    <!--      v-model="visible.dimensionDialog"-->
    <!--      dialog-title="Edit an existing survey dimension"-->
    <!--      title-hint="e.g., 'Focal Dimension'"-->
    <!--      :initial-title="surveyDimension.name"-->
    <!--      @ready="updateDimension"-->
    <!--    />-->

    <!--    <index-dialog-->
    <!--      v-model="visible.indexDialog"-->
    <!--      :dialog-title="`Add a new survey index for '${surveyDimension.name}'`"-->
    <!--      title-hint="e.g., 'A focus on others"-->
    <!--      abbreviation-hint="e.g., 'FOO'"-->
    <!--      :available-items="availableItems"-->
    <!--      :can-turn-off-predictions="true"-->
    <!--      @ready="createIndex"-->
    <!--    />-->

    <!--    <confirm-dialog-->
    <!--      v-model="visible.deleteDialog"-->
    <!--      :dialog-title="`Really delete the dimension '${surveyDimension.name}'?`"-->
    <!--      dialog-text="Doing so will also delete any associated indexes."-->
    <!--      button-label="Delete"-->
    <!--      @confirmed="deleteDimension"-->
    <!--    />-->
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyDimensionView } from "@/pages/survey.types";
import {
  ADD_INDEX_MUTATION,
  DELETE_DIMENSION,
  UPDATE_DIMENSION_MUTATION,
} from "@/graphql/surveys.graphql";
// import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
// import DimensionDialog from "../../components/dialogs/DimensionDialog.vue";
// import IndexDialog from "../../components/dialogs/IndexDialog.vue";
import {
  DimensionDialogResponse,
  IndexDialogResponse,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import IconButton from "@/components/buttons/IconButton.vue";

export default Vue.extend({
  name: "SurveyDimensionBranch",
  components: { IconButton },
  // components: {
  //   ConfirmDialog,
  //   DimensionDialog,
  //   IndexDialog,
  // },

  props: {
    survey: {
      type: Object as () => AllCapernaumSurveys_surveys,
      required: true,
    },
    surveyDimension: {
      type: Object as () => SurveyDimensionView,
      required: true,
    },
  },

  data() {
    return {
      visible: {
        dimensionDialog: false,
        indexDialog: false,
        deleteDialog: false,
      },

      rules: {
        required: [(v: string) => !!v || "Required field"],
      },
    };
  },

  methods: {
    refetchSurveyData() {
      this.$emit("refetch");
    },

    updateDimension(dialogResponse: DimensionDialogResponse) {
      this.$apollo
        .mutate({
          mutation: UPDATE_DIMENSION_MUTATION,
          variables: {
            updateInput: {
              id: this.surveyDimension.id,
              title: dialogResponse.title,
              // FIXME: sequence should not be hard-coded
              sequence: 10,
            },
          },
        })
        .then(() => {
          this.visible.dimensionDialog = false;
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    createIndex(dialogResponse: IndexDialogResponse) {
      this.$apollo
        .mutate({
          mutation: ADD_INDEX_MUTATION,
          variables: {
            createInput: {
              surveyDimensionId: this.surveyDimension.id,
              ...dialogResponse,
            },
          },
        })
        .then(() => {
          this.visible.indexDialog = false;
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    deleteDimension() {
      this.$apollo
        .mutate({
          mutation: DELETE_DIMENSION,
          variables: {
            id: this.surveyDimension.id,
          },
        })
        .then(() => {
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },
  },

  computed: {
    availableItems(): SurveyItemSelection[] {
      return this.survey.surveyItems.map((item) => ({
        id: item.id,
        name: item.qualtricsText,
      }));
    },
  },
});
</script>
