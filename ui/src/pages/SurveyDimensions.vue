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

      <v-btn color="primary" @click="addSurveyDimension()">
        Add Survey Dimension
      </v-btn>
    </v-row>

    <!-- Tree -->
    <v-row v-if="surveySelect">
      <v-col cols="10" offset="1" v-if="surveyData">
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
                :dimension="item"
                @refetch="refetchSurveyData"
              />
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              <index-tree-branch :index="item" @refetch="refetchSurveyData" />
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

    <ConfirmDeleteDialog
      v-model="deleteDialog.visible"
      v-on:delete-is-confirmed="deleteIsConfirmed()"
      :customText="deleteDialog.dialogText"
      :customTitle="deleteDialog.dialogTitle"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue";

import {
  ALL_SURVEYS_QUERY,
  DELETE_DIMENSION,
  DELETE_INDEX,
  ONE_SURVEY_QUERY
} from "@/graphql/surveys.graphql";

import {
  WhichItems,
  SurveyDimensionEnum,
  SurveyDimensionView,
  SurveySelection
} from "./survey.types";

import {
  OneSurvey_survey as Survey,
  OneSurvey_survey_surveyDimensions as SurveyDimension,
  OneSurvey_survey_surveyDimensions_surveyIndices as SurveyIndex
} from "@/graphql/types/OneSurvey";
import DimensionTreeBranch from "@/components/DimensionTreeBranch.vue";
import IndexTreeBranch from "@/components/IndexTreeBranch.vue";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "SurveyDimensions",

  components: {
    DimensionTreeBranch,
    IndexTreeBranch
  },

  data() {
    return {
      deleteDialog: {
        id: NaN, // id of the dimension or index to be deleted
        visible: false,
        type: "", // will be set to the type of element that will be deleted (e.g., surveyDimensionEnum.SURVEY_INDEX)
        dialogTitle: "", // custom title sent to the confirm delete dialog
        dialogText: "" // custom text sent to the confirm delete dialog
      },

      surveyDimensionEnum: SurveyDimensionEnum, // Grant access to enum from within template
      surveyData: (null as any) as Survey,

      surveys: [] as Survey[],

      //FIXME: make surveySelect of the appropriate type
      surveySelect: (null as any) as SurveySelection,

      nameRules: [(v: any) => !!v || "Title is required"],
      abbrevRules: [(v: any) => !!v || "Abbreviation is required"]
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

    deleteIsConfirmed() {
      console.log("delete is confirmed!");
      if (this.deleteDialog.type === SurveyDimensionEnum.SURVEY_DIMENSION) {
        console.log("deleting dimension....");
        this.$apollo
          .mutate({
            mutation: DELETE_DIMENSION,
            variables: {
              id: this.deleteDialog.id
            }
          })
          .then(({ data }) => {
            console.log("item(s) deleted!", data);
            this.refetchSurveyData();
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
          });
      } else if (this.deleteDialog.type === SurveyDimensionEnum.SURVEY_INDEX) {
        console.log("deleting index....");
        this.$apollo
          .mutate({
            mutation: DELETE_INDEX,
            variables: {
              id: this.deleteDialog.id
            }
          })
          .then(({ data }) => {
            console.log("item(s) deleted!", data);
            this.refetchSurveyData();
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
          });
      }
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
        return this.surveySelect === null;
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
