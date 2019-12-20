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
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <a @click="addSurveyIndex(item)" v-on="on">
                    <v-icon class="mx-2">
                      {{ "mdi-plus-circle" }}
                    </v-icon>
                  </a>
                </template>
                <span>Add a new survey index for this survey dimension.</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <a @click="editSurveyDimension(item)" v-on="on">
                    <v-icon class="mx-2">
                      {{ "mdi-pencil" }}
                    </v-icon>
                  </a>
                </template>
                <span>Edit this survey dimension.</span>
              </v-tooltip>
              <v-tooltip v-if="item.canDelete" top>
                <template v-slot:activator="{ on }">
                  <a @click="deleteDimension(item)" v-on="on">
                    <v-icon class="mx-2">
                      {{ "mdi-close-circle" }}
                    </v-icon>
                  </a>
                </template>
                <span>
                  Delete this survey dimension and all associated survey
                  indexes.
                </span>
              </v-tooltip>
              <v-tooltip v-else top>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
                    {{ "mdi-close-circle" }}
                  </v-icon>
                </template>
                <span>
                  One or more survey indexes associated with this survey
                  dimension have boolean associations, so it cannot be deleted.
                </span>
              </v-tooltip>
            </span>
            <span v-else-if="item.type === surveyDimensionEnum.SURVEY_INDEX">
              <v-tooltip v-if="item.useForPredictions" top>
                <template v-slot:activator="{ on }">
                  <v-icon class="mx-2" v-on="on">
                    {{ "mdi-table" }}
                  </v-icon>
                </template>
                <span>
                  Items for this index used in Boolean Association Table.
                </span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <a @click="editIndex(item)" v-on="on">
                    <v-icon class="mx-2">
                      {{ "mdi-pencil" }}
                    </v-icon>
                  </a>
                </template>
                <span>
                  Edit this survey index and/or update the associations to
                  survey items.
                </span>
              </v-tooltip>
              <v-tooltip v-if="item.canDelete" top>
                <template v-slot:activator="{ on }">
                  <a @click="deleteIndex(item)" v-on="on">
                    <v-icon class="mx-2">
                      {{ "mdi-close-circle" }}
                    </v-icon>
                  </a>
                </template>
                <span>
                  Delete this survey index and the associations to survey items.
                </span>
              </v-tooltip>
              <v-tooltip v-else top>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" class="mx-2 grey--text text--lighten-1">
                    {{ "mdi-close-circle" }}
                  </v-icon>
                </template>
                <span>
                  This survey index has boolean associations and cannot be
                  deleted.
                </span>
              </v-tooltip>
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

    <v-col>
      <ConfirmDeleteDialog
        v-model="showConfirmDeleteDialog"
        v-on:delete-is-confirmed="deleteIsConfirmed()"
        :customText="deleteDialog.dialogText"
        :customTitle="deleteDialog.dialogTitle"
      />
      <template>
        <div>
          <v-row justify="center">
            <v-dialog
              v-if="surveyData"
              persistent
              v-model="surveyIndexDialog.visible"
              max-width="800"
            >
              <v-card>
                <v-card-title class="headline">
                  {{ surveyIndexDialog.dialogTitle }}
                </v-card-title>
                <v-form ref="indexForm" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-text-field
                      v-model="surveyIndexDialog.text"
                      label="Survey Index"
                      :hint="surveyIndexDialog.dialogHint"
                      :rules="nameRules"
                      outlined
                      persistent-hint
                    />

                    <v-text-field
                      v-model="surveyIndexDialog.abbrev"
                      label="Survey Index Abbreviation"
                      :hint="surveyIndexDialog.abbrevHint"
                      :rules="abbrevRules"
                      outlined
                      persistent-hint
                    />

                    <span v-if="canTurnOffPredictions">
                      <v-switch
                        v-model="surveyIndexDialog.useForPredictions"
                        label="Use For Predictions in Boolean Association Table"
                      ></v-switch>
                    </span>
                    <span v-else>
                      <v-tooltip left max-width="300">
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            <v-switch
                              v-model="surveyIndexDialog.useForPredictions"
                              disabled
                              label="Use for predictions in Boolean association table"
                            ></v-switch>
                          </span>
                        </template>
                        <span>
                          One or more survey indexes associated with this survey
                          dimension have boolean associations, so this setting
                          cannot be turned off.
                        </span>
                      </v-tooltip>
                    </span>

                    <template>
                      <v-container fluid>
                        <v-row align="center">
                          <v-col cols="12" sm="12">
                            <v-select
                              v-model="selectedSurveyItems"
                              :items="surveyItems"
                              :item-text="'name'"
                              :item-value="'id'"
                              label="Choose Survey Items"
                              return-object
                              multiple
                              chips
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-container>
                    </template>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="success" text @click="cancelIndexDialog()">
                      Cancel
                    </v-btn>

                    <v-btn
                      :disabled="!valid"
                      color="success"
                      text
                      @click="submitSurveyIndex()"
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-dialog
              persistent
              v-model="surveyDimensionDialog.visible"
              max-width="800"
            >
              <v-card>
                <v-card-title class="headline">
                  {{ surveyDimensionDialog.dialogTitle }}
                </v-card-title>
                <v-form ref="dimensionForm" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-text-field
                      v-model="surveyDimensionDialog.text"
                      label="Survey Dimension"
                      :hint="surveyDimensionDialog.dialogHint"
                      :rules="nameRules"
                      outlined
                      persistent-hint
                    />
                    <div v-if="serverError" class="red--text text-center">
                      Sorry, there appears to have been an error. Please try
                      again later.
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      color="success"
                      text
                      @click="cancelDimensionDialog()"
                    >
                      Cancel
                    </v-btn>

                    <v-btn
                      :disabled="!valid"
                      color="success"
                      text
                      @click="submitSurveyDimension()"
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-row>
        </div>
      </template>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue";

import {
  ADD_DIMENSION_MUTATION,
  ADD_INDEX_MUTATION,
  ALL_SURVEYS_QUERY,
  DELETE_DIMENSION,
  DELETE_INDEX,
  ONE_SURVEY_QUERY,
  UPDATE_DIMENSION_MUTATION,
  UPDATE_INDEX_MUTATION
} from "@/graphql/surveys.graphql";

import {
  WhichItems,
  SurveyDimensionEnum,
  SurveyDimensionView,
  SurveyIndexView,
  SurveyItemView,
  SurveySelection
} from "./survey.types";

import {
  OneSurvey_survey as Survey,
  OneSurvey_survey_surveyDimensions as SurveyDimension,
  OneSurvey_survey_surveyDimensions_surveyIndices as SurveyIndex
} from "@/graphql/types/OneSurvey";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "SurveyDimensions",

  components: {
    ConfirmDeleteDialog
  },

  data() {
    return {
      surveyDimensionEnum: SurveyDimensionEnum, // Grant access to enum from within template
      showConfirmDeleteDialog: false,
      serverError: false,
      surveyData: (null as any) as Survey,
      canTurnOffPredictions: true, // used to control whether the "turn off predictions slider" is disabled or not in the edit dimensions dialog

      deleteDialog: {
        id: NaN, // id of the dimension or index to be deleted
        type: "", // will be set to the type of element that will be deleted (e.g., surveyDimensionEnum.SURVEY_INDEX)
        dialogTitle: "", // custom title sent to the confirm delete dialog
        dialogText: "" // custom text sent to the confirm delete dialog
      },

      surveyDimensionDialog: {
        id: NaN, //id of the survey dimension currently being edited
        editOn: false, // true when editing a survey dimension (as opposed to adding a new one)
        visible: false,
        text: "",
        dialogTitle: "",
        dialogHint: ""
      },

      surveyIndexDialog: {
        editOn: false, // true when editing a survey index (as opposed to adding a new one)
        visible: false,
        text: "",
        abbrev: "",
        useForPredictions: true, // editable in the form
        dialogTitle: "",
        dialogHint: "",
        abbrevHint: ""
      },

      surveyIndex: (null as any) as SurveyIndexView, //survey index currently being edited
      selectedSurveyItems: [] as SurveyItemView[],
      surveys: [] as Survey[],

      valid: true,
      //FIXME: make surveySelect of the appropriate type
      surveySelect: (null as any) as SurveySelection,

      nameRules: [(v: any) => !!v || "Title is required"],
      abbrevRules: [(v: any) => !!v || "Abbreviation is required"]
    };
  },

  methods: {
    // Check all indices for this survey dimension
    // to see if any of them have prediction table entries;
    // if not, the dimension may be deleted.
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
    },

    addSurveyDimension() {
      this.surveyDimensionDialog.visible = true;
      this.surveyDimensionDialog.text = "";
      this.surveyDimensionDialog.dialogTitle = "Add a New Survey Dimension";
      this.surveyDimensionDialog.dialogHint = "e.g., 'Focal Dimension'";
      console.log("valid? ", this.valid);
      this.canTurnOffPredictions = true;
      if (this.$refs.dimensionForm) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.dimensionForm as any).resetValidation();
      }
    },

    editSurveyDimension(dimension: SurveyDimensionView) {
      console.log("dimension: ", dimension);
      this.surveyDimensionDialog.visible = true;
      this.surveyDimensionDialog.editOn = true;
      this.surveyDimensionDialog.id = dimension.id;
      this.surveyDimensionDialog.text = dimension.name;
      this.surveyDimensionDialog.dialogTitle = "Edit Survey Dimension";
      this.surveyDimensionDialog.dialogHint = "e.g., 'Focal Dimension'";
      this.canTurnOffPredictions = dimension.canDelete;
    },

    deleteDimension(dimension: SurveyDimensionView) {
      console.log("delete dimension!", dimension);
      this.deleteDialog.dialogTitle =
        "Really delete the dimension " + "'" + dimension.name + "'?";
      this.deleteDialog.dialogText =
        "Doing so will also delete any associated indexes.";
      this.showConfirmDeleteDialog = true;
      this.deleteDialog.type = SurveyDimensionEnum.SURVEY_DIMENSION;
      this.deleteDialog.id = dimension.id;
    },

    cancelDimensionDialog() {
      this.surveyDimensionDialog.visible = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.dimensionForm as any).resetValidation();
      this.serverError = false;
      this.surveyDimensionDialog.editOn = false;
    },

    submitSurveyDimension() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.dimensionForm as any).validate()) {
        console.log("save info");
        if (!this.surveyDimensionDialog.editOn) {
          //adding a new dimension
          console.log("adding a new dimension");
          console.log("survey ID: ", this.surveySelect.value);
          console.log("title: ", this.surveyDimensionDialog.text);

          this.$apollo
            .mutate({
              mutation: ADD_DIMENSION_MUTATION,
              variables: {
                surveyId: this.surveySelect.value,
                title: this.surveyDimensionDialog.text,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.dimensionForm as any).resetValidation();
              this.serverError = true;
            });
        } else {
          //editing an existing dimension
          console.log("updating....");
          this.$apollo
            .mutate({
              mutation: UPDATE_DIMENSION_MUTATION,
              variables: {
                id: this.surveyDimensionDialog.id,
                title: this.surveyDimensionDialog.text,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.dimensionForm as any).resetValidation();
              this.serverError = true;
            });
        }
      } else {
        console.log("there appears to be a problem with the form....");
      }
    },

    addSurveyIndex(dimension: any) {
      this.surveyDimensionDialog.id = dimension.id; // will use this when saving the new survey index
      this.surveyIndexDialog.visible = true;
      this.surveyIndexDialog.text = "";
      this.surveyIndexDialog.abbrev = "";
      this.surveyIndexDialog.useForPredictions = true;
      this.selectedSurveyItems = [];
      this.surveyIndexDialog.dialogTitle =
        "Add a New Survey Index for " + "'" + dimension.name + "'";
      this.surveyIndexDialog.dialogHint = "e.g., 'A Focus on Others'";
      this.surveyIndexDialog.abbrevHint = "e.g., 'FOO'";
      if (this.$refs.indexForm) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.indexForm as any).resetValidation();
      }
    },

    editIndex(indexItem: SurveyIndexView) {
      // specify the type(!)
      console.log("edit index!", indexItem);
      this.surveyIndexDialog.editOn = true;
      this.surveyIndex = indexItem;
      console.log("index being edited: ", this.surveyIndex);
      this.surveyDimensionDialog.id = indexItem.parentId;
      this.selectedSurveyItems = [];
      indexItem.children.forEach(surveyItem => {
        this.selectedSurveyItems.push({
          id: surveyItem.id,
          name: surveyItem.name
        });
      });
      this.surveyIndexDialog.visible = true;
      this.surveyIndexDialog.text = indexItem.name;
      this.surveyIndexDialog.abbrev = indexItem.abbrev;
      this.surveyIndexDialog.useForPredictions = indexItem.useForPredictions;

      this.surveyIndexDialog.dialogTitle =
        "Edit Survey Index for " + "'" + indexItem.parentName + "'";
      this.surveyIndexDialog.dialogHint = "e.g., 'A Focus on Others'";
      this.surveyIndexDialog.abbrevHint = "e.g., 'FOO'";
      console.log(
        "selected survey items inside edit index: ",
        this.selectedSurveyItems
      );
    },

    deleteIndex(indexItem: any) {
      console.log("delete index!", indexItem);
      this.deleteDialog.dialogTitle =
        "Really delete the index " + "'" + indexItem.name + "'?";
      this.deleteDialog.dialogText = "This action is not reversible.";
      this.showConfirmDeleteDialog = true;
      this.deleteDialog.type = SurveyDimensionEnum.SURVEY_INDEX;
      this.deleteDialog.id = indexItem.id;
      // can use the parentId to make sure things are done correctly
    },

    cancelIndexDialog() {
      this.surveyIndexDialog.visible = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.indexForm as any).resetValidation();
      this.serverError = false;
      this.surveyIndexDialog.editOn = false;
    },

    submitSurveyIndex() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.indexForm as any).validate()) {
        console.log("save info");

        if (!this.surveyIndexDialog.editOn) {
          //adding a new index
          console.log("adding a new index");
          console.log("selected survey items: ", this.selectedSurveyItems);
          console.log(
            "use for predictions:",
            this.surveyIndexDialog.useForPredictions
          );

          this.$apollo
            .mutate({
              mutation: ADD_INDEX_MUTATION,
              variables: {
                dimensionId: this.surveyDimensionDialog.id,
                abbreviation: this.surveyIndexDialog.abbrev,
                title: this.surveyIndexDialog.text,
                useForPredictions: this.surveyIndexDialog.useForPredictions,
                itemIds: this.selectedSurveyItems.map(
                  surveyItem => surveyItem.id
                )
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelIndexDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.indexForm as any).resetValidation();
              this.serverError = true;
            });
        } else {
          //editing an existing dimension
          console.log("updating....");
          console.log("index being edited: ", this.surveyIndex);
          console.log("selected survey items: ", this.selectedSurveyItems);
          this.$apollo
            .mutate({
              mutation: UPDATE_INDEX_MUTATION,
              variables: {
                id: this.surveyIndex.id,
                abbreviation: this.surveyIndexDialog.abbrev,
                title: this.surveyIndexDialog.text,
                useForPredictions: this.surveyIndexDialog.useForPredictions,
                itemIds: this.selectedSurveyItems.map(
                  surveyItem => surveyItem.id
                )
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelIndexDialog();
              this.refetchSurveyData();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.indexForm as any).resetValidation();
              this.serverError = true;
            });
        }
      } else {
        console.log("there appears to be a problem with the form....");
      }
      console.log("save: ", this.surveyIndexDialog.text);
      console.log("survey items: ", this.selectedSurveyItems);
      this.selectedSurveyItems.forEach(sI => {
        console.log(typeof sI);
      });
      // save to db, etc.
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
          parentId: dim.id,
          parentName: dim.title,
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
    },

    surveyItems(): SurveyItemView[] {
      console.log("survey index being edited: ", this.surveyIndex);
      let returnArray: SurveyItemView[] = [];
      if (this.surveyIndex) {
        this.surveyIndex.children.forEach(item => {
          returnArray.push({
            id: item.id,
            name: item.name
          });
        });
      }
      this.surveyData.surveyItems.forEach(item => {
        returnArray.push({
          id: item.id,
          name: item.qualtricsText
        });
      });
      console.log("return array: ", returnArray);
      return returnArray;
    }
  }
});
</script>
