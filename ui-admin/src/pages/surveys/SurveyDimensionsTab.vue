<template>
  <v-card>
    <v-card-title>
      <v-row justify="space-around">
        <v-col cols="auto"> Dimensions, Indices, Items </v-col>
        <v-col cols="auto">
          <v-btn text color="primary" @click="changeAll(true)">Show All</v-btn>
          <v-btn text color="primary" @click="changeAll(false)">Hide All</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="showDimensionAddDialog">
            Add Dimension
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-row>
      <v-col cols="10" offset="1">
        <v-treeview
          ref="treeView"
          dense
          color="primary"
          rounded
          hoverable
          :items="surveyContent"
          data-cy="tree-view"
        >
          <template v-slot:label="{ item }">
            <span v-html="item.name" />
            <span v-if="item.type === surveyElementType.Index">
              ({{ item.entity.abbreviation }})
            </span>
            <sep-chip v-if="hasSepChip(item)" />
          </template>

          <template v-slot:prepend="{ item }">
            <v-icon>{{ prependIcon(item) }}</v-icon>
          </template>

          <template v-slot:append="{ item }">
            <span v-if="item.type === surveyElementType.Dimension">
              <icon-button
                icon-name="mdi-plus-circle"
                tool-tip="Add a new survey index for this survey dimension."
                @click="showIndexAddDialog(item.entity)"
              />
              <icon-button
                icon-name="mdi-pencil"
                tool-tip="Edit this survey dimension."
                @click="showDimensionEditDialog(item.entity)"
              />
              <icon-button
                :can-click="canDeleteSurveyDimension(item.entity)"
                icon-name="mdi-close-circle"
                tool-tip="Delete this survey dimension and all associated survey indexes."
                disabled-tool-tip="One or more survey indexes associated with this survey dimension have boolean associations, so it cannot be deleted."
                @click="showConfirmDeleteDimensionDialog(item.entity)"
              />
            </span>

            <span v-else-if="item.type === surveyElementType.Index">
              <icon-button
                icon-name="mdi-pencil"
                tool-tip="Edit this survey index and its survey items."
                @click="showIndexEditDialog(item.entity)"
              />
              <icon-button
                :can-click="!hasAssociatedPractices(item.entity)"
                icon-name="mdi-close-circle"
                tool-tip="Delete this survey index and all associations to survey items."
                disabled-tool-tip="This survey index has boolean associations and cannot be deleted."
                @click="showConfirmDeleteIndexDialog(item.entity)"
              />
            </span>

            <span v-else-if="item.type === surveyElementType.Item" />
            <span v-else> Something went horribly wrong. </span>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <dimension-dialog
      v-model="dimensionDialog.visible"
      :dialog-title="dimensionDialog.dialogTitle"
      :title-hint="dimensionDialog.titleHint"
      :dialog-mode="dimensionDialog.dialogMode"
      :survey-dimension="dimensionDialog.surveyDimension"
      @ready="dimensionDialog.callback"
    />

    <index-dialog
      v-model="indexDialog.visible"
      :dialog-title="indexDialog.dialogTitle"
      :dialog-mode="indexDialog.dialogMode"
      :title-hint="indexDialog.titleHint"
      :abbreviation-hint="indexDialog.abbreviationHint"
      :survey-index="indexDialog.surveyIndex"
      :available-items="availableItems"
      :selected-items="indexDialog.selectedItems"
      :can-turn-off-predictions="indexDialog.canTurnOffPredictions"
      @ready="indexDialog.callback"
    />

    <confirm-dialog
      v-model="confirmDialog.visible"
      :dialog-title="confirmDialog.dialogTitle"
      :dialog-text="confirmDialog.dialogText"
      :button-label="confirmDialog.buttonLabel"
      @confirmed="confirmDialog.callback"
    />

    <snackbar ref="snackbar" />
  </v-card>
</template>

<script lang="ts">
import {
  ADD_DIMENSION_MUTATION,
  ADD_INDEX_MUTATION,
  DELETE_DIMENSION,
  DELETE_INDEX,
  UPDATE_DIMENSION_MUTATION,
  UPDATE_INDEX_MUTATION,
} from "@/graphql/surveys.graphql";
import DimensionDialog from "./DimensionDialog.vue";
import {
  DialogMode,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";
import {
  AllCapernaumSurveys_surveys as SurveyEntity,
  AllCapernaumSurveys_surveys_surveyDimensions as SurveyDimensionEntity,
  AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices as SurveyIndexEntity,
  AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_surveyItems as SurveyItemEntity,
} from "@/graphql/types/AllCapernaumSurveys";
import IconButton from "@/components/buttons/IconButton.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import IndexDialog from "@/pages/surveys/IndexDialog.vue";
import {
  TossSurveyIndex,
  TossSurveyIndexVariables,
} from "@/graphql/types/TossSurveyIndex";
import { UpdateIndex, UpdateIndexVariables } from "@/graphql/types/UpdateIndex";
import {
  SurveyDimensionCreateInput,
  SurveyDimensionUpdateInput,
  SurveyIndexCreateInput,
  SurveyIndexUpdateInput,
} from "@/graphql/types/globalTypes";
import { AddIndex, AddIndexVariables } from "@/graphql/types/AddIndex";
import * as _ from "lodash";
import { TossSurveyDimension } from "@/graphql/types/TossSurveyDimension";
import {
  UpdateDimension,
  UpdateDimensionVariables,
} from "@/graphql/types/UpdateDimension";
import Vue, { VueConstructor } from "vue";
import {
  AddDimension,
  AddDimensionVariables,
} from "@/graphql/types/AddDimension";
import Snackbar from "@/components/Snackbar.vue";
import SepChip from "@/pages/surveys/SepChip.vue";

enum SurveyElementType {
  Dimension,
  Index,
  Item,
}

interface AbstractSurveyView {
  id: number;
  name: string;
  type: SurveyElementType;
}

interface SurveyDimensionView extends AbstractSurveyView {
  entity: SurveyDimensionEntity;
  children: SurveyIndexView[];
}

interface SurveyIndexView extends AbstractSurveyView {
  entity: SurveyIndexEntity;
  children: SurveyItemView[];
}

interface SurveyItemView extends AbstractSurveyView {
  entity: SurveyItemEntity;
}

type VueExt = Vue & {
  $refs: {
    snackbar: { trigger: (content: string, color?: string) => void };
    treeView: { updateAll: (val: boolean) => void };
  };
};

export default (Vue as VueConstructor<VueExt>).extend({
  name: "SurveyDimensionsTab",

  components: {
    SepChip,
    Snackbar,
    ConfirmDialog,
    DimensionDialog,
    IndexDialog,
    IconButton,
  },

  props: {
    survey: {
      type: Object as () => SurveyEntity,
      required: true,
    },
  },

  data() {
    return {
      // Grant access to enum from within template
      surveyElementType: SurveyElementType,

      // Work with this copy, rather than the initial prop.
      workingSurvey: _.cloneDeep(this.survey),

      dimensionDialog: {
        dialogTitle: "",
        titleHint: "e.g., 'Focal Dimension'",
        dialogMode: DialogMode.Noop,
        surveyDimension: null as unknown as SurveyDimensionEntity,
        callback: () => null,
        visible: false,
      },

      indexDialog: {
        dialogTitle: "",
        titleHint: "e.g., 'Focus on Others'",
        abbreviationHint: "e.g., 'FOO'",
        dialogMode: DialogMode.Noop,
        surveyIndex: null as unknown as SurveyIndexEntity,
        availableItems: [] as SurveyItemSelection[],
        canTurnOffPredictions: false,
        callback: () => null,
        visible: false,
      },

      confirmDialog: {
        dialogTitle: "",
        dialogText: "",
        buttonLabel: "Delete",
        callback: () => null,
        visible: false,
      },

      rules: {
        required: [(v: never) => !!v || "Required field"],
      },
    };
  },

  computed: {
    availableItems(): SurveyItemSelection[] {
      return this.workingSurvey.surveyItems.map((item) => ({
        text: item.qualtricsText,
        value: item.id,
      }));
    },

    surveyContent(): SurveyDimensionView[] {
      // Dimensions
      return this.workingSurvey.surveyDimensions
        .map((dim: SurveyDimensionEntity) => ({
          id: dim.id,
          name: dim.title,
          type: SurveyElementType.Dimension,
          entity: dim,

          // Indices
          children: dim.surveyIndices
            .map((idx: SurveyIndexEntity) => ({
              id: idx.id,
              name: idx.title,
              type: SurveyElementType.Index,
              entity: idx,

              // Items
              children: idx.surveyItems
                .map((item: SurveyItemEntity) => ({
                  id: item.id,
                  name: item.qualtricsText,
                  type: SurveyElementType.Item,
                  entity: item,
                }))
                .sort((a, b) => a.name.localeCompare(b.name)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  },

  watch: {
    survey: {
      handler: function (newSurvey: SurveyEntity) {
        console.log("watched survey has changed");
        this.workingSurvey = _.cloneDeep(newSurvey);
      },
      immediate: true,
    },
  },

  methods: {
    emitUpdatedEvent() {
      console.log("emitUpdatedEvent()");
      this.$emit("survey-updated", this.workingSurvey);
    },

    triggerSnackbar(content: string, color?: string) {
      this.$refs.snackbar.trigger(content, color);
    },

    hideDimensionDialog() {
      this.dimensionDialog.visible = false;
    },

    hideIndexDialog() {
      this.indexDialog.visible = false;
    },

    hideConfirmDialog() {
      this.confirmDialog.visible = false;
    },

    changeAll(val: boolean) {
      console.log(val ? "SHOW ALL" : "HIDE ALL");
      this.$refs.treeView.updateAll(val);
    },

    hasSepChip(item: SurveyDimensionView | SurveyIndexView): boolean {
      if (item.type === SurveyElementType.Dimension) {
        return _.some(
          (item.entity as SurveyDimensionEntity).surveyIndices,
          (idx) => idx.useForPredictions
        );
      } else if (item.type === SurveyElementType.Index) {
        return (item.entity as SurveyIndexEntity).useForPredictions;
      }
      return false;
    },

    // Dimension methods

    showDimensionAddDialog() {
      _.assign(this.dimensionDialog, {
        dialogTitle: "Add a New Survey Dimension",
        dialogMode: DialogMode.Create,
        callback: (dialogResponse: SurveyDimensionCreateInput) => {
          this.createDimension(dialogResponse)
            .then((response) => {
              const newDimension = response.data?.createSurveyDimension;
              if (newDimension) {
                this.workingSurvey.surveyDimensions.push(newDimension);
                this.hideDimensionDialog();
                this.triggerSnackbar("Dimension added");
                this.emitUpdatedEvent();
              } else {
                this.triggerSnackbar(
                  `Failed to create new dimension: ${response.errors}`,
                  "error"
                );
              }
            })
            .catch((error) => {
              this.triggerSnackbar(
                `Error creating dimension: ${error}`,
                "error"
              );
            });
        },
        visible: true,
      });
    },

    showDimensionEditDialog(dimension: SurveyDimensionEntity) {
      _.assign(this.dimensionDialog, {
        dialogTitle: "Edit an Existing Survey Dimension",
        dialogMode: DialogMode.Update,
        surveyDimension: dimension,
        callback: (updatedDimension: SurveyDimensionEntity) => {
          updatedDimension.id = dimension.id;
          this.updateDimension(updatedDimension)
            .then(() => {
              _.assign(dimension, updatedDimension);
              this.hideDimensionDialog();
              this.triggerSnackbar("Dimension updated");
              this.emitUpdatedEvent();
            })
            .catch((error) => {
              this.triggerSnackbar(
                `Error updating dimension: ${error}`,
                "error"
              );
            });
        },
        visible: true,
      });
    },

    showConfirmDeleteDimensionDialog(dimension: SurveyDimensionEntity) {
      _.assign(this.confirmDialog, {
        dialogTitle: `Really delete dimension '${dimension.title}'?`,
        dialogText: "Will also delete any associated indexes.",
        buttonLabel: "Delete",
        callback: () => {
          this.deleteDimension(dimension.id)
            .then(() => {
              this.workingSurvey.surveyDimensions = _.reject(
                this.workingSurvey.surveyDimensions,
                (dim) => dim.id === dimension.id
              );
              this.triggerSnackbar("Dimension deleted");
              this.emitUpdatedEvent();
            })
            .catch((error) => {
              this.triggerSnackbar(
                `Error deleting dimension: ${error}`,
                "warning"
              );
            });
        },
        visible: true,
      });
    },

    createDimension(dialogResponse: SurveyDimensionCreateInput) {
      return this.$apollo.mutate<AddDimension, AddDimensionVariables>({
        mutation: ADD_DIMENSION_MUTATION,
        variables: {
          createInput: {
            surveyId: this.workingSurvey.id,
            title: dialogResponse.title,
          },
        },
      });
    },

    updateDimension(updateInput: SurveyDimensionUpdateInput) {
      return this.$apollo.mutate<UpdateDimension, UpdateDimensionVariables>({
        mutation: UPDATE_DIMENSION_MUTATION,
        variables: {
          updateInput,
        },
      });
    },

    canDeleteSurveyDimension(surveyDimension: SurveyDimensionEntity) {
      return surveyDimension.surveyIndices.every(
        (surveyIndex) => surveyIndex.scriptureEngagementPractices.length === 0
      );
    },

    deleteDimension(surveyDimensionId: number) {
      return this.$apollo.mutate<TossSurveyDimension, TossSurveyIndexVariables>(
        {
          mutation: DELETE_DIMENSION,
          variables: {
            id: surveyDimensionId,
          },
        }
      );
    },

    // Index methods

    showIndexAddDialog(dimension: SurveyDimensionEntity) {
      _.assign(this.indexDialog, {
        dialogTitle: `Add a new survey index for '${dimension.title}'`,
        dialogMode: DialogMode.Create,
        canTurnOffPredictions: true,
        availableItems: this.availableItems,
        callback: (dialogResponse: SurveyIndexCreateInput) => {
          dialogResponse.surveyDimensionId = dimension.id;
          this.createIndex(dialogResponse)
            .then((response) => {
              const newIndex = response.data?.surveyIndexCreate;
              if (newIndex) {
                dimension.surveyIndices.push(newIndex);
                this.hideIndexDialog();
                this.triggerSnackbar("Index created");
                this.emitUpdatedEvent();
              } else {
                this.triggerSnackbar(
                  `Failed to create new index: ${response.errors}`,
                  "error"
                );
              }
            })
            .catch((error) => {
              this.triggerSnackbar(`Problem creating index: ${error}`);
            });
        },
        visible: true,
      });
    },

    showIndexEditDialog(surveyIndex: SurveyIndexEntity) {
      _.assign(this.indexDialog, {
        dialogTitle: `Edit Survey Index '${surveyIndex.title}'`,
        dialogMode: DialogMode.Update,
        surveyIndex: surveyIndex,
        canTurnOffPredictions: !this.hasAssociatedPractices(surveyIndex),
        callback: (updatedIndex: SurveyIndexUpdateInput) => {
          this.updateIndex({
            ...updatedIndex,
            id: surveyIndex.id,
          })
            .then(() => {
              // Set everything except the items.
              _.assign(
                surveyIndex,
                _.pick(updatedIndex, [
                  "title",
                  "abbreviation",
                  "useForPredictions",
                ])
              );

              // Set the items, if any.
              surveyIndex.surveyItems = this.workingSurvey.surveyItems.filter(
                (item) => updatedIndex.itemIds?.includes(item.id)
              );

              this.hideIndexDialog();
              this.triggerSnackbar(`Index '${surveyIndex.title}' updated`);
              this.emitUpdatedEvent();
            })
            .catch((error) => {
              this.triggerSnackbar(`Problem updating index: ${error}`);
            });
        },
        visible: true,
      });
    },

    showConfirmDeleteIndexDialog(surveyIndex: SurveyIndexEntity) {
      _.assign(this.confirmDialog, {
        dialogTitle: `Really delete the index '${surveyIndex.title}'?`,
        dialogText: "Will also delete any associated survey items",
        buttonLabel: "Delete",
        callback: () => {
          this.deleteIndex(surveyIndex.id)
            .then(() => {
              _.forEach(this.workingSurvey.surveyDimensions, (dim) => {
                dim.surveyIndices = _.reject(
                  dim.surveyIndices,
                  (idx) => idx.id === surveyIndex.id
                );
              });
              this.triggerSnackbar(`Index '${surveyIndex.title}' deleted`);
              this.emitUpdatedEvent();
            })
            .catch((error) => {
              this.triggerSnackbar(`Problem deleting index: ${error}`);
            });
        },
        visible: true,
      });
    },

    createIndex(createInput: SurveyIndexCreateInput) {
      return this.$apollo.mutate<AddIndex, AddIndexVariables>({
        mutation: ADD_INDEX_MUTATION,
        variables: {
          createInput,
        },
      });
    },

    updateIndex(updateInput: SurveyIndexUpdateInput) {
      return this.$apollo.mutate<UpdateIndex, UpdateIndexVariables>({
        mutation: UPDATE_INDEX_MUTATION,
        variables: {
          updateInput,
        },
      });
    },

    hasAssociatedPractices(surveyIndex: SurveyIndexEntity) {
      return surveyIndex.scriptureEngagementPractices.length > 0;
    },

    deleteIndex(surveyIndexId: number) {
      return this.$apollo.mutate<TossSurveyIndex, TossSurveyIndexVariables>({
        mutation: DELETE_INDEX,
        variables: {
          id: surveyIndexId,
        },
      });
    },

    prependIcon(item: AbstractSurveyView) {
      switch (item.type) {
        case SurveyElementType.Dimension:
          return "mdi-arrow-expand-horizontal";
        case SurveyElementType.Index:
          return "mdi-format-list-bulleted";
        case SurveyElementType.Item:
          return "mdi-comment-outline";
        default:
          throw new Error("Bogus dimension item");
      }
    },
  },
});
</script>
