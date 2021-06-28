<template>
  <v-container>
    <v-row align="baseline" class="justify-space-around">
      <v-btn
        color="primary"
        :disabled="!isSurveySelected"
        @click="dimensionDialog.visible = true"
      >
        Add Survey Dimension
      </v-btn>
    </v-row>

    <v-row>
      <v-col cols="10" offset="1">
        <v-treeview dense rounded hoverable :items="surveyContent">
          <template v-slot:label="{ item }">
            <span v-html="item.name"></span>
            <span v-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              ({{ item.abbreviation }})
            </span>
          </template>
          <template v-slot:prepend="{ item }">
            <v-icon v-if="item.type === surveyDimensionEnum.SURVEY_ITEM">
              {{ "mdi-comment-outline" }}
            </v-icon>
          </template>
          <template v-slot:append="{ item }">
            <span v-if="item.type === surveyDimensionEnum.SURVEY_DIMENSION">
              <dimension-branch
                :survey="survey"
                :survey-dimension="item"
                @refetch="refetchSurveyData"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              <index-branch
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ADD_DIMENSION_MUTATION } from "@/graphql/surveys.graphql";
import { SurveyDimensionEnum, SurveyDimensionView } from "@/pages/survey.types";
import {
  OneSurvey_survey as Survey,
  OneSurvey_survey_surveyDimensions as SurveyDimension,
  OneSurvey_survey_surveyDimensions_surveyIndices as SurveyIndex,
} from "@/graphql/types/OneSurvey";
import DimensionBranch from "./SurveyDimensionBranch.vue";
import DimensionDialog from "../../components/dialogs/DimensionDialog.vue";
import IndexBranch from "./SurveyIndexBranch.vue";
import { DimensionDialogResponse } from "@/components/dialogs/dialog.types";

export default Vue.extend({
  name: "SurveyDimensionsTab",

  components: {
    DimensionBranch,
    DimensionDialog,
    IndexBranch,
  },

  props: {
    survey: {
      type: {} as () => Survey,
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
    canDeleteSurveyDimension(surveyDimension: SurveyDimension) {
      return surveyDimension.surveyIndices.every(
        (surveyIndex) => surveyIndex.predictionTableEntries.length === 0
      );
    },

    canDeleteSurveyIndex(surveyIndex: SurveyIndex) {
      return surveyIndex.predictionTableEntries.length === 0;
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
