<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <ConfirmDeleteDialog
          v-model="showConfirmDeleteDialog"
          v-on:delete-is-confirmed="deleteIsConfirmed()"
          :customText="deleteItemDialogText"
          :customTitle="deleteItemDialogTitle"
        ></ConfirmDeleteDialog>
        <template>
          <div>
            <v-row justify="center">
              <v-dialog
                v-if="surveyData"
                persistent
                v-model="surveyIndexDialog"
                max-width="800"
              >
                <v-card>
                  <v-card-title class="headline">
                    {{ surveyIndexDialogTitle }}
                  </v-card-title>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                      <v-text-field
                        v-model="surveyIndexText"
                        label="Survey Index"
                        :hint="surveyIndexDialogHint"
                        :rules="nameRules"
                        outlined
                        persistent-hint
                      ></v-text-field>
                      <v-text-field
                        v-model="surveyIndexAbbrev"
                        label="Survey Index Abbreviation"
                        :hint="surveyIndexAbbrevHint"
                        :rules="abbrevRules"
                        outlined
                        persistent-hint
                      ></v-text-field>

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
                v-model="surveyDimensionDialog"
                max-width="800"
              >
                <v-card>
                  <v-card-title class="headline">
                    {{ surveyDimensionDialogTitle }}
                  </v-card-title>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                      <v-text-field
                        v-model="surveyDimensionText"
                        label="Survey Dimension"
                        :hint="surveyDimensionDialogHint"
                        :rules="nameRules"
                        outlined
                        persistent-hint
                      ></v-text-field>
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
      </v-flex>
      <v-flex xs10 offset-xs1>
        <h1 class="headline mb-5">Survey Dimensions</h1>
      </v-flex>
      <v-flex xs7 offset-xs1>
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
      </v-flex>
    </v-layout>
    <v-layout v-if="surveySelect" row wrap>
      <v-flex xs10 offset-xs1 class="text-right">
        <v-btn color="primary" @click="addSurveyDimension()"
          >Add Survey Dimension</v-btn
        >
      </v-flex>
      <v-flex v-if="surveyData" xs10 offset-xs1>
        <template>
          <v-treeview dense rounded hoverable :items="surveyDimensions">
            <template v-slot:label="{ item }">
              <div v-html="item.name"></div>
            </template>
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.type == surveyDimensionEnum.SURVEY_ITEM">
                {{ "mdi-comment-outline" }}
              </v-icon>
            </template>
            <template v-slot:append="{ item, open }">
              <span v-if="item.type == surveyDimensionEnum.SURVEY_INDEX">
                <a @click="editIndex(item)">
                  <v-icon>
                    {{ "mdi-pencil" }}
                  </v-icon>
                </a>
                <a @click="deleteIndex(item)">
                  <v-icon>
                    {{ "mdi-close-circle" }}
                  </v-icon>
                </a>
              </span>
              <span
                v-else-if="item.type == surveyDimensionEnum.SURVEY_DIMENSION"
              >
                <a @click="addSurveyIndex(item)">
                  <v-icon>
                    {{ "mdi-plus-circle" }}
                  </v-icon>
                </a>
                <a @click="editSurveyDimension(item)">
                  <v-icon>
                    {{ "mdi-pencil" }}
                  </v-icon>
                </a>
                <a @click="deleteDimension(item)">
                  <v-icon>
                    {{ "mdi-close-circle" }}
                  </v-icon>
                </a>
              </span>
            </template>
          </v-treeview>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import axios, { AxiosResponse } from "axios";
import Vue from "vue";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue";

import {
  ONE_SURVEY_QUERY,
  ADD_DIMENSION_MUTATION,
  UPDATE_DIMENSION_MUTATION,
  ADD_INDEX_MUTATION,
  UPDATE_INDEX_MUTATION,
  ALL_SURVEYS_QUERY,
  DELETE_DIMENSION,
  DELETE_INDEX
} from "@/graphql/surveys.graphql";

import {
  SurveyItem,
  SurveySelection,
  SurveyDimensionEnum
} from "./survey-dimension.types";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "SurveyDimensions",

  props: {},
  components: {
    ConfirmDeleteDialog
  },
  data() {
    return {
      showConfirmDeleteDialog: false,
      deleteItemType: "" as string, // will be set to the type of element that will be deleted (e.g., surveyDimensionEnum.SURVEY_INDEX)
      deleteItemId: null as number, // id of the dimension or index to be deleted
      deleteItemDialogTitle: "" as string, // custom title sent to the confirm delete dialog
      deleteItemDialogText: "" as string, // custom text sent to the confirm delete dialog
      serverError: false as boolean,
      surveyData: null as any,
      surveyDimensionEnum: SurveyDimensionEnum,
      surveyDimensionEditOn: false, // true when editing a survey dimension (as opposed to adding a new one)
      surveyDimensionDialog: false,
      surveyDimensionText: "" as string,
      surveyDimensionDialogTitle: "" as string,
      surveyDimensionDialogHint: "" as string,
      surveyDimensionId: null as number, //id of the survey dimension currently being edited
      surveyIndexEditOn: false, // true when editing a survey index (as opposed to adding a new one)
      surveyIndexDialog: false,
      surveyIndexText: "" as string,
      surveyIndexAbbrev: "" as string,
      surveyIndexDialogTitle: "" as string,
      surveyIndexDialogHint: "" as string,
      surveyIndexAbbrevHint: "" as string,
      surveyIndexId: null as number, //id of the survey index currently being edited
      selectedSurveyItems: [] as any,
      surveys: [] as SurveyItem[],
      //title: this.initialTitle,
      valid: true,
      //FIXME: make surveySelect of the appropriate type
      surveySelect: null as any,
      //select: null as any,
      //name: "",
      nameRules: [(v: any) => !!v || "Title is required"],
      abbrevRules: [(v: any) => !!v || "Abbreviation is required"]
    };
  },

  methods: {
    deleteIsConfirmed() {
      console.log("delete is confirmed!");
      if (this.deleteItemType === this.surveyDimensionEnum.SURVEY_DIMENSION) {
        console.log('deleting dimension....');
        this.$apollo
          .mutate({
            mutation: DELETE_DIMENSION,
            variables: {
              id: this.deleteItemId
            }
          })
          .then(({ data }) => {
            console.log("item(s) deleted!", data);
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
          });
      } else if (this.deleteItemType === this.surveyDimensionEnum.SURVEY_INDEX) {
        console.log('deleting index....');
        this.$apollo
          .mutate({
            mutation: DELETE_INDEX,
            variables: {
              id: this.deleteItemId
            }
          })
          .then(({ data }) => {
            console.log("item(s) deleted!", data);
          })
          .catch(error => {
            console.log("there appears to have been an error: ", error);
          });
      }
      console.log('There appears to be a problem -- it is not clear which type of item to delete....');
    },
    addSurveyDimension() {
      this.surveyDimensionDialog = true;
      this.surveyDimensionText = "";
      this.surveyDimensionDialogTitle = "Add a New Survey Dimension";
      this.surveyDimensionDialogHint = "e.g., 'Focal Dimension'";
      console.log("valid? ", this.valid);
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
    },
    editSurveyDimension(dimension: any) {
      this.surveyDimensionDialog = true;
      this.surveyDimensionEditOn = true;
      this.surveyDimensionId = dimension.id;
      this.surveyDimensionText = dimension.name;
      this.surveyDimensionDialogTitle = "Edit Survey Dimension";
      this.surveyDimensionDialogHint = "e.g., 'Focal Dimension'";
    },
    deleteDimension(dimension: any) {
      console.log("delete dimension!", dimension);
      this.deleteItemDialogTitle = "Really delete the dimension "+"'"+dimension.name+"'?";
      this.deleteItemDialogText = "Doing so will also delete any associated indexes.";
      this.showConfirmDeleteDialog = true;
      this.deleteItemType = this.surveyDimensionEnum.SURVEY_DIMENSION;
      this.deleteItemId = dimension.id;
    },
    cancelDimensionDialog() {
      this.surveyDimensionDialog = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.form as any).resetValidation();
      this.serverError = false;
      this.surveyDimensionEditOn = false;
    },
    submitSurveyDimension() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("save info");
        if (!this.surveyDimensionEditOn) {
          //adding a new dimension
          console.log("adding a new dimension");
          console.log("survey ID: ", parseInt(this.surveySelect.value, 10));
          console.log("title: ", this.surveyDimensionText);
          this.$apollo
            .mutate({
              mutation: ADD_DIMENSION_MUTATION,
              variables: {
                surveyId: parseInt(this.surveySelect.value, 10),
                title: this.surveyDimensionText,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.form as any).resetValidation();
              this.serverError = true;
              //this.serverError = true
            });
        } else {
          //editing an existing dimension
          console.log("updating....");
          this.$apollo
            .mutate({
              mutation: UPDATE_DIMENSION_MUTATION,
              variables: {
                id: this.surveyDimensionId,
                title: this.surveyDimensionText,
                // FIXME: sequence should not be hard-coded
                sequence: 10
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDimensionDialog();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.form as any).resetValidation();
              this.serverError = true;
              //this.serverError = true
            });
        }
      } else {
        console.log("there appears to be a problem with the form....");
      }
    },
    addSurveyIndex(dimension: any) {
      this.surveyDimensionId = dimension.id; // will use this when saving the new survey index
      this.surveyIndexDialog = true;
      this.surveyIndexText = "";
      this.surveyIndexAbbrev = "";
      this.selectedSurveyItems = [];
      this.surveyIndexDialogTitle =
        "Add a New Survey Index for " + "'" + dimension.name + "'";
      this.surveyIndexDialogHint = "e.g., 'A Focus on Others'";
      this.surveyIndexAbbrevHint = "e.g., 'FOO'";
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
    },
    editIndex(indexItem: any) {
      // specify the type(!)
      console.log("edit index!", indexItem);
      this.surveyIndexEditOn = true;
      this.surveyIndexId = indexItem.id;
      this.surveyDimensionId = indexItem.parentId;
      this.selectedSurveyItems = [];
      indexItem.children.forEach(surveyItem => {
        this.selectedSurveyItems.push({
          id: surveyItem.id,
          name: surveyItem.name
        });
      });
      this.surveyIndexDialog = true;
      this.surveyIndexText = indexItem.name;
      this.surveyIndexAbbrev = indexItem.abbrev;
      this.surveyIndexDialogTitle =
        "Edit Survey Index for " + "'" + indexItem.parentName + "'";
      this.surveyIndexDialogHint = "e.g., 'A Focus on Others'";
      this.surveyIndexAbbrevHint = "e.g., 'FOO'";
    },
    deleteIndex(indexItem: any) {
      console.log("delete index!", indexItem);
      this.deleteItemDialogTitle = "Really delete the index "+"'"+indexItem.name+"'?";
      this.deleteItemDialogText = "This action is not reversible.";
      this.showConfirmDeleteDialog = true;
      this.deleteItemType = this.surveyDimensionEnum.SURVEY_INDEX;
      this.deleteItemId = indexItem.id;
      // can use the parentId to make sure things are done correctly
    },
    cancelIndexDialog() {
      this.surveyIndexDialog = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.form as any).resetValidation();
      this.serverError = false;
      this.surveyIndexEditOn = true;
    },
    submitSurveyIndex() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("save info");

        if (!this.surveyIndexEditOn) {
          //adding a new index
          console.log("adding a new index");
          this.$apollo
            .mutate({
              mutation: ADD_INDEX_MUTATION,
              variables: {
                dimensionId: this.surveyDimensionId,
                abbreviation: this.surveyIndexAbbrev,
                title: this.surveyIndexText,
                itemIds: this.selectedSurveyItems
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelIndexDialog();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.form as any).resetValidation();
              this.serverError = true;
              //this.serverError = true
            });
        } else {
          //editing an existing dimension
          console.log("updating....");
          this.$apollo
            .mutate({
              mutation: UPDATE_INDEX_MUTATION,
              variables: {
                id: this.surveyIndexId,
                abbreviation: this.surveyIndexAbbrev,
                title: this.surveyIndexText,
                itemIds: this.selectedSurveyItems
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelIndexDialog();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.form as any).resetValidation();
              this.serverError = true;
              //this.serverError = true
            });
        }
      } else {
        console.log("there appears to be a problem with the form....");
      }
      //this.surveyIndexDialog = false;
      console.log("save: ", this.surveyIndexText);
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
    // the following query runs automatically when this.surveySelect is updates (i.e., when something is chosen from the drop-down)
    surveyData: {
      query: ONE_SURVEY_QUERY,
      variables() {
        console.log("survey select: ", this.surveySelect);
        console.log(
          "qualtricsId (to use fetch survey dimension data): ",
          this.surveySelect.value
        );
        return {
          surveyId: this.surveySelect.value
        };
      },
      update(data) {
        console.log("data: ", data);
        return data.survey;
      },
      skip() {
        return this.surveySelect === null;
      }
    }
  },

  computed: {
    selections(): SurveySelection[] {
      return this.surveys.map(survey => ({
        text: survey.title,
        value: survey.id
      }));
    },
    surveyDimensions() {
      return this.surveyData.surveyDimensions.map(dimension => ({
        id: dimension.id,
        name: dimension.title,
        //abbrev: dimension.abbreviation,
        type: "survey-dimension",
        children: dimension.surveyIndices.map(index => ({
          id: index.id,
          parentId: dimension.id,
          parentName: dimension.title,
          name: index.title,
          abbrev: index.abbreviation,
          type: "survey-index",
          children: index.surveyItems.map(surveyItem => ({
            id: surveyItem.id,
            name: surveyItem.qualtricsText,
            type: "survey-item"
          }))
        }))
      }));
    },
    surveyItems() {
      return this.surveyData.surveyItems.map(item => ({
        id: item.id,
        name: item.qualtricsText
      }));
    }
  },

  mounted() {
    console.log("mounted....");
  }
});
</script>
