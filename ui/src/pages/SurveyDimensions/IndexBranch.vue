<template>
  <div>
    <v-tooltip v-if="surveyIndex.useForPredictions" top>
      <span>
        Items for this index used in Boolean Association Table.
      </span>
      <template v-slot:activator="{ on }">
        <v-icon class="mx-2" v-on="on">
          {{ "mdi-table" }}
        </v-icon>
      </template>
    </v-tooltip>

    <v-tooltip top>
      <span>
        Edit this survey index and/or update the associations to survey items.
      </span>
      <template v-slot:activator="{ on }">
        <a @click="visible.indexDialog = true" v-on="on">
          <v-icon class="mx-2">
            {{ "mdi-pencil" }}
          </v-icon>
        </a>
      </template>
    </v-tooltip>

    <v-tooltip v-if="surveyIndex.canDelete" top>
      <span>
        Delete this survey index and the associations to survey items.
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
        This survey index has boolean associations and cannot be deleted.
      </span>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
          {{ "mdi-close-circle" }}
        </v-icon>
      </template>
    </v-tooltip>

    <index-dialog
      v-model="visible.indexDialog"
      :dialog-title="`Edit index for '${surveyIndex.dimensionName}'`"
      title-hint="e.g., 'A Focus on Others'"
      abbreviation-hint="e.g., 'FOO'"
      :title="surveyIndex.name"
      :abbreviation="surveyIndex.abbreviation"
      :useForPredictions="surveyIndex.useForPredictions"
      :selectedItems="selectedItems"
      :available-items="availableItems"
      :can-turn-off-predictions="surveyIndex.canDelete"
      @ready="updateIndex"
    />

    <confirm-dialog
      v-model="visible.deleteDialog"
      :dialog-title="`Really delete the index '${surveyIndex.name}'?`"
      dialog-text="This action is not reversible."
      button-label="Delete"
      @confirmed="deleteIndex"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyIndexView } from "../survey.types";

import { DELETE_INDEX, UPDATE_INDEX_MUTATION } from "@/graphql/surveys.graphql";
import { OneSurvey_survey as Survey } from "@/graphql/types/OneSurvey";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import {
  IndexDialogResponse,
  SurveyItemSelection
} from "@/pages/SurveyDimensions/dialog.types";
import IndexDialog from "@/pages/SurveyDimensions/IndexDialog.vue";

export default Vue.extend({
  name: "IndexBranch",

  components: {
    ConfirmDialog,
    IndexDialog
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
      visible: {
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

    updateIndex(dialogResponse: IndexDialogResponse) {
      this.$apollo
        .mutate({
          mutation: UPDATE_INDEX_MUTATION,
          variables: {
            updateInput: {
              id: this.surveyIndex.id,
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

    deleteIndex() {
      this.$apollo
        .mutate({
          mutation: DELETE_INDEX,
          variables: {
            id: this.surveyIndex.id
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
      return this.survey.surveyItems
        .map(item => ({
          id: item.id,
          name: item.qualtricsText
        }))
        .concat(this.selectedItems);
    },

    selectedItems(): SurveyItemSelection[] {
      return this.surveyIndex.children.map(item => ({
        id: item.id,
        name: item.name
      }));
    }
  }
});
</script>
