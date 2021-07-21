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
          <v-btn color="primary" @click="dimensionDialog.visible = true">
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
          open-on-click
          :items="surveyContent"
        >
          <template v-slot:label="{ item }">
            <span v-html="item.name" />
            <span v-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
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
            <span v-if="item.type === surveyDimensionEnum.SURVEY_DIMENSION">
              <survey-dimension-branch
                :survey="survey"
                :survey-dimension="item"
                @refetch="refetchSurveyData"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              <survey-index-branch
                :survey="survey"
                :survey-index="item"
                @refetch="refetchSurveyData"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_ITEM" />
            <span v-else> Something went horribly wrong. </span>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <dimension-dialog
      v-model="dimensionDialog.visible"
      dialog-title="Add a New Survey Dimension"
      title-hint="e.g., 'Focal Dimension'"
      @ready="createDimension"
    />
  </v-card>
</template>

<script lang="ts">
import { ADD_DIMENSION_MUTATION } from "@/graphql/surveys.graphql";
import { SurveyDimensionEnum, SurveyDimensionView } from "@/pages/survey.types";
import DimensionDialog from "../../components/dialogs/DimensionDialog.vue";
import { DimensionDialogResponse } from "@/components/dialogs/dialog.types";
import {
  AllCapernaumSurveys_surveys,
  AllCapernaumSurveys_surveys_surveyDimensions,
  AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices,
} from "@/graphql/types/AllCapernaumSurveys";
import SurveyDimensionBranch from "@/pages/surveys/SurveyDimensionBranch.vue";
import SurveyIndexBranch from "@/pages/surveys/SurveyIndexBranch.vue";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  name: "SurveyDimensionsTab",

  setup() {
    const treeView = ref(null);

    onMounted(() => {
      console.log(treeView.value);
    });

    return { treeView };
  },

  components: {
    SurveyIndexBranch,
    SurveyDimensionBranch,
    DimensionDialog,
  },

  props: {
    survey: {
      type: Object as () => AllCapernaumSurveys_surveys,
      required: true,
    },
  },

  data() {
    return {
      surveyDimensionEnum: SurveyDimensionEnum, // Grant access to enum from within template
      dimensionDialog: {
        visible: false,
      },
    };
  },

  methods: {
    prependIcon(item: SurveyDimensionView) {
      switch (item.type) {
        case SurveyDimensionEnum.SURVEY_DIMENSION:
          return "mdi-arrow-expand-horizontal";
        case SurveyDimensionEnum.SURVEY_INDEX:
          return "mdi-format-list-bulleted";
        case SurveyDimensionEnum.SURVEY_ITEM:
          return "mdi-comment-outline";
        default:
          throw new Error("Bogus dimension item");
      }
    },

    changeAll(val: boolean) {
      // this.treeView.updateAll(true);
      (this.treeView as any).updateAll(val);
    },

    canDeleteSurveyDimension(
      surveyDimension: AllCapernaumSurveys_surveys_surveyDimensions
    ) {
      return surveyDimension.surveyIndices.every(
        (surveyIndex) => surveyIndex.scriptureEngagementPractices.length === 0
      );
    },

    canDeleteSurveyIndex(
      surveyIndex: AllCapernaumSurveys_surveys_surveyDimensions_surveyIndices
    ) {
      return surveyIndex.scriptureEngagementPractices.length === 0;
    },

    refetchSurveyData() {
      this.$apollo.queries.survey
        .refetch()
        .catch((err) => console.error("Something went wrong", err));
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
          this.dimensionDialog.visible = false;
          this.refetchSurveyData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },
  },

  computed: {
    surveyContent(): SurveyDimensionView[] {
      function compareStrings(a: string, b: string): number {
        return a < b ? -1 : a > b ? 1 : 0;
      }

      // Dimensions
      return this.survey.surveyDimensions
        .map((dim) => ({
          id: dim.id,
          name: dim.title,
          type: SurveyDimensionEnum.SURVEY_DIMENSION,
          canDelete: this.canDeleteSurveyDimension(dim),

          // Indices
          children: dim.surveyIndices
            .map((index) => ({
              id: index.id,
              dimensionId: dim.id,
              dimensionName: dim.title,
              name: index.title,
              abbreviation: index.abbreviation,
              useForPredictions: index.useForPredictions,
              type: SurveyDimensionEnum.SURVEY_INDEX,
              canDelete: this.canDeleteSurveyIndex(index),

              // Items
              children: index.surveyItems.map((item) => ({
                id: item.id,
                name: item.qualtricsText,
                type: SurveyDimensionEnum.SURVEY_ITEM,
              })),
            }))
            .sort((a, b) => compareStrings(a.name, b.name)),
        }))
        .sort((a, b) => compareStrings(a.name, b.name));
    },
  },
});
</script>
