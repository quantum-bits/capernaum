<template>
  <div>
    <v-tooltip top>
      <span>Add a new survey index for this survey dimension.</span>
      <template v-slot:activator="{ on }">
        <a @click="visible.indexDialog = true" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-plus-circle" }}
          </v-icon>
        </a>
      </template>
    </v-tooltip>

    <v-tooltip top>
      <span>Edit this survey dimension.</span>
      <template v-slot:activator="{ on }">
        <a @click="visible.dimensionDialog = true" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-pencil" }}
          </v-icon>
        </a>
      </template>
    </v-tooltip>

    <v-tooltip v-if="surveyDimension.canDelete" top>
      <span>
        Delete this survey dimension and all associated survey indexes.
      </span>
      <template v-slot:activator="{ on }">
        <a @click="visible.deleteDialog = true" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-close-circle" }}
          </v-icon>
        </a>
      </template>
    </v-tooltip>
    <v-tooltip v-else top>
      <span>
        One or more survey indexes associated with this survey dimension have
        boolean associations, so it cannot be deleted.
      </span>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
          {{ "mdi-close-circle" }}
        </v-icon>
      </template>
    </v-tooltip>

    <dimension-dialog
      v-model="visible.dimensionDialog"
      dialog-title="Edit an existing survey dimension"
      title-hint="e.g., 'Focal Dimension'"
      :initial-title="surveyDimension.name"
      @ready="updateDimension"
    />

    <index-dialog
      v-model="visible.indexDialog"
      :dialog-title="`Add a new survey index for '${surveyDimension.name}'`"
      title-hint="e.g., 'A focus on others"
      abbreviation-hint="e.g., 'FOO'"
      :available-items="availableItems"
      @ready="createIndex"
    />

    <confirm-dialog
      v-model="visible.deleteDialog"
      :dialog-title="`Really delete the dimension '${surveyDimension.name}'?`"
      dialog-text="Doing so will also delete any associated indexes."
      button-label="Delete"
      @confirmed="deleteDimension"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyDimensionView } from "@/pages/survey.types";
import {
  ADD_INDEX_MUTATION,
  DELETE_DIMENSION,
  UPDATE_DIMENSION_MUTATION
} from "@/graphql/surveys.graphql";
import { OneSurvey_survey as Survey } from "@/graphql/types/OneSurvey";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import DimensionDialog from "./DimensionDialog.vue";
import IndexDialog from "./IndexDialog.vue";
import { SurveyIndexCreateInput } from "@/graphql/types/globalTypes";
import {
  DimensionDialogResponse,
  IndexDialogResponse,
  SurveyItemSelection
} from "@/pages/SurveyDimensions/dialog.types";

export default Vue.extend({
  name: "DimensionBranch",

  components: {
    ConfirmDialog,
    DimensionDialog,
    IndexDialog
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
      visible: {
        dimensionDialog: false,
        indexDialog: false,
        deleteDialog: false
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

    updateDimension(dialogResponse: DimensionDialogResponse) {
      this.$apollo
        .mutate({
          mutation: UPDATE_DIMENSION_MUTATION,
          variables: {
            updateInput: {
              id: this.surveyDimension.id,
              title: dialogResponse.title,
              // FIXME: sequence should not be hard-coded
              sequence: 10
            }
          }
        })
        .then(() => {
          this.visible.dimensionDialog = false;
          this.refetchSurveyData();
        })
        .catch(error => {
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
              ...dialogResponse
            }
          }
        })
        .then(() => {
          this.visible.indexDialog = false;
          this.refetchSurveyData();
        })
        .catch(error => {
          console.log("there appears to have been an error: ", error);
        });
    },

    deleteDimension() {
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
  },

  computed: {
    availableItems(): SurveyItemSelection[] {
      const rtn = this.survey.surveyItems.map(item => ({
        id: item.id,
        name: item.qualtricsText
      }));
      console.log("AVAILABLE", rtn);
      return rtn;
    }
  }
});
</script>
