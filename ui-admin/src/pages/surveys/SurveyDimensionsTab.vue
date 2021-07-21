<template>
  <v-card>
    <v-card-title>
      <v-row justify="space-around">
        <v-col cols="auto"> Dimensions, Indices, Items </v-col>
        <v-col cols="auto">
          <v-btn text @click="changeAll(true)">Show All</v-btn>
          <v-btn text @click="changeAll(false)">Hide All</v-btn>
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
        >
          <template v-slot:label="{ item }">
            <span v-html="item.name" />
            <span v-if="item.type === surveyElementType.Index">
              ({{ item.abbreviation }})
              <v-tooltip v-if="item.useForPredictions" top>
                <span> Items in this index used for SEP predictions. </span>
                <template v-slot:activator="{ on }">
                  <v-chip small color="primary" v-on="on">SEP</v-chip>
                </template>
              </v-tooltip>
            </span>
          </template>

          <template v-slot:prepend="{ item }">
            <v-icon>{{ prependIcon(item) }}</v-icon>
          </template>

          <template v-slot:append="{ item }">
            <span v-if="item.type === surveyElementType.Dimension">
              <icon-button
                icon-name="mdi-pencil"
                tool-tip="Edit this survey dimension."
                @click="showDimensionEditDialog"
              />
              <icon-button
                :can-click="canDeleteSurveyDimension(item)"
                icon-name="mdi-close-circle"
                tool-tip="Delete this survey dimension and all associated survey indexes."
                disabled-tool-tip="One or more survey indexes associated with this survey dimension have boolean associations, so it cannot be deleted."
                @click="showConfirmDeleteDimensionDialog"
              />
            </span>

            <span v-else-if="item.type === surveyElementType.Index">
              <icon-button
                icon-name="mdi-plus-circle"
                tool-tip="Add a new survey index for this survey dimension."
                @click="showIndexAddDialog"
              />
              <icon-button
                icon-name="mdi-pencil"
                tool-tip="Edit this survey index and/or update the associations to survey items."
                @click="showIndexEditDialog"
              />
              <icon-button
                :can-click="canDeleteSurveyIndex(item)"
                icon-name="mdi-close-circle"
                tool-tip="Delete this survey index and the associations to survey items."
                disabled-tool-tip="This survey index has boolean associations and cannot be deleted."
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
      :survey-dimension="dimensionDialog.surveyDimension"
      @ready="dimensionDialog.callback"
    />

    <index-dialog
      v-model="indexDialog.visible"
      :dialog-title="indexDialog.dialogTitle"
      :title-hint="indexDialog.titleHint"
      :abbreviation-hint="indexDialog.abbreviationHint"
      :survey-index="indexDialog.surveyIndex"
      :available-items="availableItems"
      :selected-tems="indexDialog.selectedItems"
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
  DimensionDialogResponse,
  SurveyItemSelection,
} from "@/components/dialogs/dialog.types";
import {
  AllCapernaumSurveys_surveys as SurveyEntity,
  AllCapernaumSurveys_surveys_surveyDimensions as SurveyDimensionEntity,
  AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices as SurveyIndexEntity,
  AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices_surveyItems as SurveyItemEntity,
} from "@/graphql/types/AllCapernaumSurveys";
import { defineComponent, ref } from "@vue/composition-api";
import IconButton from "@/components/buttons/IconButton.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import IndexDialog from "@/pages/surveys/IndexDialog.vue";
import {
  TossSurveyIndex,
  TossSurveyIndexVariables,
} from "@/graphql/types/TossSurveyIndex";
import { UpdateIndex, UpdateIndexVariables } from "@/graphql/types/UpdateIndex";
import {
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

export default defineComponent({
  name: "SurveyDimensionsTab",

  setup() {
    const treeView = ref();

    const changeAll = (val: boolean) => {
      console.log(val ? "SHOW ALL" : "HIDE ALL");
      treeView.value.updateAll(val);
    };

    return { treeView, changeAll };
  },

  components: {
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

      dimensionDialog: {
        dialogTitle: "",
        titleHint: "e.g., 'Focal Dimension'",
        surveyDimension: null as unknown as SurveyEntity,
        callback: null as unknown as (ddr: DimensionDialogResponse) => void,
        visible: false,
      },

      indexDialog: {
        dialogTitle: "",
        titleHint: "e.g., 'Focus on Others'",
        abbreviationHint: "e.g., 'FOO'",
        surveyIndex: null as unknown as SurveyIndexEntity,
        selectedItems: [] as SurveyItemEntity[],
        canTurnOffPredictions: false,
        callback: null as unknown as (siv: SurveyIndexView) => void,
        visible: false,
      },

      confirmDialog: {
        dialogTitle: "",
        dialogText: "",
        buttonLabel: "Delete",
        callback: null as unknown as () => void,
        visible: false,
      },

      rules: {
        required: [(v: never) => !!v || "Required field"],
      },
    };
  },

  computed: {
    availableItems(): SurveyItemSelection[] {
      return this.survey.surveyItems.map((item) => ({
        id: item.id,
        name: item.qualtricsText,
      }));
      // .concat(this.selectedItems);
    },

    surveyContent(): SurveyDimensionView[] {
      // Dimensions
      return this.survey.surveyDimensions.map((dim: SurveyDimensionEntity) => ({
        id: dim.id,
        name: dim.title,
        type: SurveyElementType.Dimension,
        entity: dim,

        // Indices
        children: dim.surveyIndices.map((idx: SurveyIndexEntity) => ({
          id: idx.id,
          name: idx.title,
          type: SurveyElementType.Index,
          entity: idx,

          // Items
          children: idx.surveyItems.map((item: SurveyItemEntity) => ({
            id: item.id,
            name: item.qualtricsText,
            type: SurveyElementType.Item,
            entity: item,
          })),
        })),
      }));
    },
  },

  methods: {
    hideDimensionDialog() {
      this.dimensionDialog.visible = false;
    },

    hideIndexDialog() {
      this.indexDialog.visible = false;
    },

    hideConfirmDialog() {
      this.confirmDialog.visible = false;
    },

    // Dimension methods
    showDimensionAddDialog() {
      _.assign(this.dimensionDialog, {
        dialogTitle: "Add a New Survey Dimension",
        callback: this.createDimension,
        visible: true,
      });
    },

    showDimensionEditDialog(dimensionView: SurveyDimensionView) {
      _.assign(this.dimensionDialog, {
        dialogTitle: "Edit and Existing Survey Dimension",
        surveyDimension: dimensionView.entity,
        callback: this.updateDimension,
        visible: true,
      });
    },

    showConfirmDeleteDimensionDialog(dimensionView: SurveyDimensionView) {
      _.assign(this.dimensionDialog, {
        dialogTitle: `Really delete dimension '${dimensionView.name}'?`,
        dialogText: "Doing so will also delete any associated indexes.",
        buttonLabel: "Delete",
        callback: this.deleteDimension,
        visible: true,
      });
    },

    createDimension(dialogResponse: DimensionDialogResponse) {
      this.$apollo
        .mutate({
          mutation: ADD_DIMENSION_MUTATION,
          variables: {
            createInput: {
              surveyId: this.survey.id,
              title: dialogResponse.title,
              // FIXME: sequence should not be hard-coded
              sequence: 10,
            },
          },
        })
        .then(() => {
          this.hideDimensionDialog();
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    updateDimension(updateInput: SurveyDimensionUpdateInput) {
      this.$apollo
        .mutate<UpdateDimension, UpdateDimensionVariables>({
          mutation: UPDATE_DIMENSION_MUTATION,
          variables: {
            updateInput,
          },
        })
        .then(() => {
          this.hideDimensionDialog();
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    canDeleteSurveyDimension(surveyDimension: SurveyDimensionEntity) {
      console.log("DIM", surveyDimension);
      return surveyDimension.surveyIndices.every(
        (surveyIndex) => surveyIndex.scriptureEngagementPractices.length === 0
      );
    },

    deleteDimension(surveyDimensionId: number) {
      this.$apollo
        .mutate<TossSurveyDimension, TossSurveyIndexVariables>({
          mutation: DELETE_DIMENSION,
          variables: {
            id: surveyDimensionId,
          },
        })
        .then(() => {
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    // Index methods
    showIndexAddDialog(dimension: SurveyDimensionView) {
      _.assign(this.indexDialog, {
        dialogTitle: `Add a new survey index for '${dimension.name}'`,
        canTurnOffPredictions: true,
        callback: this.createIndex,
        visible: true,
      });
    },

    selectedItems(index: SurveyIndexView): SurveyItemSelection[] {
      return index.children.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },

    showIndexEditDialog(
      dimensionView: SurveyDimensionView,
      indexView: SurveyIndexView
    ) {
      _.assign(this.indexDialog, {
        dialogTitle: `Edit Survey Index for '${dimensionView.name}'`,
        surveyIndex: indexView.entity,
        selectedItems: this.selectedItems(indexView),
        canTurnOffPredictions: this.canDeleteSurveyIndex(indexView.entity),
        callback: this.updateIndex,
        visible: true,
      });
    },

    showConfirmDeleteIndexDialog(index: SurveyIndexView) {
      _.assign(this.confirmDialog, {
        dialogTitle: `Really delete the index '${index.name}'?`,
        dialogText: "This action is not reversible.",
        visible: true,
      });
    },

    createIndex(createInput: SurveyIndexCreateInput) {
      this.$apollo
        .mutate<AddIndex, AddIndexVariables>({
          mutation: ADD_INDEX_MUTATION,
          variables: {
            createInput,
          },
        })
        .then(() => {
          this.hideIndexDialog();
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    updateIndex(updateInput: SurveyIndexUpdateInput) {
      this.$apollo
        .mutate<UpdateIndex, UpdateIndexVariables>({
          mutation: UPDATE_INDEX_MUTATION,
          variables: {
            updateInput,
          },
        })
        .then(() => {
          this.hideIndexDialog();
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    canDeleteSurveyIndex(surveyIndex: SurveyIndexEntity) {
      return surveyIndex.scriptureEngagementPractices.length === 0;
    },

    deleteIndex(surveyIndexId: number) {
      this.$apollo
        .mutate<TossSurveyIndex, TossSurveyIndexVariables>({
          mutation: DELETE_INDEX,
          variables: {
            id: surveyIndexId,
          },
        })
        .then(() => {
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    prependIcon(item: SurveyDimensionView) {
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

    refetchSurveyData() {
      this.$apollo.queries.survey
        .refetch()
        .catch((err) => console.error("Something went wrong", err));
    },
  },
});
</script>
