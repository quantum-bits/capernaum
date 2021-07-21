<template>
  <span>
    <icon-button
      icon-name="mdi-pencil"
      tool-tip="Edit this survey index and/or update the associations to survey items."
      @click="visible.indexDialog = true"
    />
    <icon-button
      :can-click="surveyIndex.canDelete"
      icon-name="mdi-close-circle"
      tool-tip="Delete this survey index and the associations to survey items."
      disabled-tool-tip="This survey index has boolean associations and cannot be deleted."
    />

    <!--    <index-dialog-->
    <!--      v-model="visible.indexDialog"-->
    <!--      :dialog-title="`Edit index for '${surveyIndex.dimensionName}'`"-->
    <!--      title-hint="e.g., 'A Focus on Others'"-->
    <!--      abbreviation-hint="e.g., 'FOO'"-->
    <!--      :title="surveyIndex.name"-->
    <!--      :abbreviation="surveyIndex.abbreviation"-->
    <!--      :useForPredictions="surveyIndex.useForPredictions"-->
    <!--      :selectedItems="selectedItems"-->
    <!--      :available-items="availableItems"-->
    <!--      :can-turn-off-predictions="surveyIndex.canDelete"-->
    <!--      @ready="updateIndex"-->
    <!--    />-->

    <!--    <confirm-dialog-->
    <!--      v-model="visible.deleteDialog"-->
    <!--      :dialog-title="`Really delete the index '${surveyIndex.name}'?`"-->
    <!--      dialog-text="This action is not reversible."-->
    <!--      button-label="Delete"-->
    <!--      @confirmed="deleteIndex"-->
    <!--    />-->
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyIndexView } from "@/pages/survey.types";

import { DELETE_INDEX, UPDATE_INDEX_MUTATION } from "@/graphql/surveys.graphql";
import { OneSurvey_survey as Survey } from "@/graphql/types/OneSurvey";
// import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
// import IndexDialog from "@/components/dialogs/IndexDialog.vue";
import {
  IndexDialogResponse,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";
import IconButton from "@/components/buttons/IconButton.vue";

export default Vue.extend({
  name: "SurveyIndexBranch",
  components: { IconButton },
  // components: {
  //   ConfirmDialog,
  //   IndexDialog,
  // },

  // https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480
  props: {
    survey: {
      type: Object as () => Survey,
      required: true,
    },
    surveyIndex: {
      type: Object as () => SurveyIndexView,
      required: true,
    },
  },

  data() {
    return {
      visible: {
        indexDialog: false,
        deleteDialog: false,
      },

      rules: {
        required: [(v: never) => !!v || "Required field"],
      },
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

    deleteIndex() {
      this.$apollo
        .mutate({
          mutation: DELETE_INDEX,
          variables: {
            id: this.surveyIndex.id,
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
      return this.survey.surveyItems
        .map((item) => ({
          id: item.id,
          name: item.qualtricsText,
        }))
        .concat(this.selectedItems);
    },

    selectedItems(): SurveyItemSelection[] {
      return this.surveyIndex.children.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },
  },
});
</script>
