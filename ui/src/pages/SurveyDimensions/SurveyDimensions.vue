<template>
  <v-container>
    <!-- Heading -->
    <v-row align="baseline" class="justify-space-around">
      <h1 class="headline">Survey Dimensions</h1>

      <v-col cols="4">
        <v-select
          v-model="surveySelect"
          :items="selections"
          :rules="[v => !!v || 'Survey is required']"
          label="Survey"
          required
          persistent-hint
          return-object
          single-line
        />
      </v-col>

      <v-btn
        color="primary"
        :disabled="!isSurveySelected"
        @click="showDimensionDialog"
      >
        Add Survey Dimension
      </v-btn>
    </v-row>

    <!-- Tree -->
    <v-row v-if="surveySelect">
      <v-col cols="10" offset="1" v-if="isSurveyDataValid">
        <v-treeview dense rounded hoverable :items="surveyDimensions">
          <template v-slot:label="{ item }">
            <div v-html="item.name"></div>
          </template>
          <template v-slot:prepend="{ item }">
            <v-icon v-if="item.type === surveyDimensionEnum.SURVEY_ITEM">
              {{ "mdi-comment-outline" }}
            </v-icon>
          </template>
          <template v-slot:append="{ item }">
            <span v-if="item.type === surveyDimensionEnum.SURVEY_DIMENSION">
              <dimension-tree-branch
                :survey="surveyData"
                :surveyDimension="item"
                @refetch="refetchSurveyData"
                ref="dimensionTreeBranch"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              <index-tree-branch
                :survey="surveyData"
                :surveyIndex="item"
                @refetch="refetchSurveyData"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_ITEM">
              Item
            </span>
            <span v-else>
              Something went horribly wrong.
            </span>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <dimension-dialog
      dialog-title="Add a New Survey Dimension"
      dialog-hint="e.g., 'Focal Dimension'"
      :value="dimensionDialog.visible"
      @dimension-ready="addDimension"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import {
  ADD_DIMENSION_MUTATION,
  ALL_SURVEYS_QUERY,
  ONE_SURVEY_QUERY
} from "@/graphql/surveys.graphql";

import {
  WhichItems,
  SurveyDimensionEnum,
  SurveyDimensionView,
  SurveySelection
} from "../survey.types";

import {
  OneSurvey_survey as Survey,
  OneSurvey_survey_surveyDimensions as SurveyDimension,
  OneSurvey_survey_surveyDimensions_surveyIndices as SurveyIndex
} from "@/graphql/types/OneSurvey";
import DimensionTreeBranch from "./DimensionTreeBranch.vue";
import IndexTreeBranch from "./IndexTreeBranch.vue";
import isEmpty from "lodash/isEmpty";
import DimensionDialog from "@/pages/SurveyDimensions/DimensionDialog.vue";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "SurveyDimensions",

  components: {
    DimensionTreeBranch,
    DimensionDialog,
    IndexTreeBranch
  },

  data() {
    return {
      surveyDimensionEnum: SurveyDimensionEnum, // Grant access to enum from within template

      surveys: [] as Survey[],
      surveyData: {} as Survey,
      surveySelect: {} as SurveySelection,

      dimensionDialog: {
        visible: false
      }
    };
  },

  methods: {
    canDeleteSurveyDimension(surveyDimension: SurveyDimension) {
      return surveyDimension.surveyIndices.every(
        surveyIndex => surveyIndex.predictionTableEntries.length === 0
      );
    },

    canDeleteSurveyIndex(surveyIndex: SurveyIndex) {
      return surveyIndex.predictionTableEntries.length === 0;
    },

    refetchSurveyData() {
      this.$apollo.queries.surveyData.refetch().then(({ data }) => {
        console.log("survey data refetched! ", data);
      });
    },

    showDimensionDialog() {
      this.dimensionDialog.visible = true;
    },

    hideDimensionDialog() {
      this.dimensionDialog.visible = false;
    },

    addDimension(dimensionDetails: any) {
      console.log("DIM DETAILS", dimensionDetails);
      this.$apollo
        .mutate({
          mutation: ADD_DIMENSION_MUTATION,
          variables: {
            surveyId: this.surveyData.id,
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
    }
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    },

    // the following query runs automatically when this.surveySelect updates
    // (i.e., when something is chosen from the drop-down)
    surveyData: {
      query: ONE_SURVEY_QUERY,
      variables() {
        console.log("survey select: ", this.surveySelect);
        console.log(
          "qualtricsId (to use fetch survey dimension data): ",
          this.surveySelect.value
        );
        return {
          surveyId: this.surveySelect.value,
          which: WhichItems.WITHOUT_INDEX
        };
      },
      update(data) {
        console.log("data: ", data);
        return data.survey;
      },
      skip() {
        return !this.isSurveySelected;
      },
      fetchPolicy: "network-only"
    }
  },

  computed: {
    selections(): SurveySelection[] {
      return this.surveys.map(survey => ({
        text: survey.title,
        value: survey.id
      }));
    },

    isSurveySelected(): boolean {
      return !isEmpty(this.surveySelect);
    },

    isSurveyDataValid(): boolean {
      return !isEmpty(this.surveyData);
    },

    surveyDimensions(): SurveyDimensionView[] {
      return this.surveyData.surveyDimensions.map(dim => ({
        id: dim.id,
        name: dim.title,
        type: "survey-dimension",
        canDelete: this.canDeleteSurveyDimension(dim),
        children: dim.surveyIndices.map(index => ({
          id: index.id,
          dimensionId: dim.id,
          dimensionName: dim.title,
          name: index.title,
          abbrev: index.abbreviation,
          useForPredictions: dim.useForPredictions,
          type: "survey-index",
          canDelete: this.canDeleteSurveyIndex(index),
          children: index.surveyItems.map(item => ({
            id: item.id,
            name: item.qualtricsText,
            type: "survey-item"
          }))
        }))
      }));
    }
  }
});
</script>
