<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <template>
          <div>
            <v-row justify="center">
              <v-dialog persistent v-model="surveyIndexDialog" max-width="800">
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
                      <v-text-field
                        v-model="surveyDimensionAbbrev"
                        label="Survey Dimension Abbreviation"
                        :hint="surveyDimensionAbbrevHint"
                        :rules="abbrevRules"
                        outlined
                        persistent-hint
                      ></v-text-field>
                      <div v-if="serverError" class="red--text text-center">
                        Sorry, there appears to have been an error.  Please try again later.
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
      <v-flex xs10 offset-xs1>
        <template>
          <v-treeview dense rounded hoverable :items="surveyDimensionData">
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

import { ADD_DIMENSION_MUTATION, ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { ONE_LETTER_QUERY } from "@/graphql/letters.graphql"; // won't need this, eventually...just using it now for testing purposes

//FIXME: delete Letter stuff once we no longer need it....
import {
  Letter,
  LetterElementEnum,
  LetterElementMenuItemType,
  LetterElementType
} from "./letter-element.types";

import {
  SurveyItem,
  SurveySelection,
  SurveyDimensionEnum
} from "./survey-dimension.types";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "SurveyDimensions",

  props: {},

  data() {
    return {
      serverError: false as boolean,
      letter: null as Letter | null,
      surveyDimensionEnum: SurveyDimensionEnum,
      surveyIndexDialog: false,
      surveyDimensionDialog: false,
      surveyDimensionText: "" as string,
      surveyDimensionAbbrev: "" as string,
      surveyDimensionDialogTitle: "" as string,
      surveyDimensionDialogHint: "" as string,
      surveyDimensionAbbrevHint: "" as string,
      surveyDimensionId: null as number, //id of the survey dimension currently being edited
      surveyIndexText: "" as string,
      surveyIndexDialogTitle: "" as string,
      surveyIndexDialogHint: "" as string,
      surveyIndexId: null as number, //id of the survey index currently being edited
      selectedSurveyItems: [] as any,
      surveys: [] as SurveyItem[],
      //title: this.initialTitle,
      valid: true,
      //FIXME: make surveySelect of the appropriate type
      surveySelect: null as any,
      //select: null as any,
      //name: "",
      nameRules: [
        (v: any) => !!v || "Title is required" //,
        //(v: any) =>
        //  (v && v.length <= 80) ||
        //  "Title of letter must be less than 80 characters"
      ],
      abbrevRules: [
        (v: any) => !!v || "Abbreviation is required" //,
      ],
      surveyItems: [
        {
          id: 20,
          name: "I live in ways that help others as much as myself"
        },
        {
          id: 21,
          name:
            "I go out of my way to discover the people in need around me that I normally wouldn’t see"
        },
        {
          id: 22,
          name: "I have tremendous love for people I don’t know"
        },
        {
          id: 23,
          name:
            "I think about strangers’ well-being and want what is best for them"
        },
        {
          id: 30,
          name:
            "I believe the Bible has decisive authority over what I say and do"
        },
        {
          id: 31,
          name:
            "As I go through the normal day I think of Bible passages relevant to what I am doing"
        },
        {
          id: 32,
          name: "I talk about Bible passages with my friends"
        },
        {
          id: 40,
          name: "What God says is what is true, right, and good"
        }
      ],
      surveyDimensionData: [
        {
          id: 1,
          name: "Focal Dimension",
          type: "survey-dimension",
          children: [
            {
              id: 2,
              parentId: 1,
              name: "A Focus on Others",
              type: "survey-index",
              children: [
                {
                  id: 20,
                  name: "I live in ways that help others as much as myself",
                  type: "survey-item"
                },
                {
                  id: 21,
                  name:
                    "I go out of my way to discover the people in need around me that I normally wouldn’t see",
                  type: "survey-item"
                },
                {
                  id: 22,
                  name: "I have tremendous love for people I don’t know",
                  type: "survey-item"
                },
                {
                  id: 23,
                  name:
                    "I think about strangers’ well-being and want what is best for them",
                  type: "survey-item"
                }
              ]
            },
            {
              id: 3,
              parentId: 1,
              name: "A Focus on the Bible",
              type: "survey-index",
              children: [
                {
                  id: 30,
                  name:
                    "I believe the Bible has decisive authority over what I say and do",
                  type: "survey-item"
                },
                {
                  id: 31,
                  name:
                    "As I go through the normal day I think of Bible passages relevant to what I am doing",
                  type: "survey-item"
                },
                {
                  id: 32,
                  name: "I talk about Bible passages with my friends",
                  type: "survey-item"
                }
              ]
            },
            {
              id: 4,
              parentId: 1,
              name: "A Focus on God",
              type: "survey-index",
              children: [
                {
                  id: 40,
                  name: "What God says is what is true, right, and good",
                  type: "survey-item"
                }
              ]
            }
          ]
        },
        {
          id: 5,
          name: "Orientation Dimension",
          type: "survey-dimension",
          children: []
        },
        {
          id: 15,
          name: "Scripture Engagement Dimension",
          type: "survey-dimension",
          children: []
        }
      ]
    };
  },

  methods: {
    addSurveyDimension() {
      this.surveyDimensionDialog = true;
      this.surveyDimensionText = "";
      this.surveyDimensionDialogTitle = "Add a New Survey Dimension";
      this.surveyDimensionDialogHint = "e.g., 'Focal Dimension'";
      this.surveyDimensionAbbrevHint = "e.g., 'FD'";
      console.log("valid? ", this.valid);
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
    },
    editSurveyDimension(dimension: any) {
      this.surveyDimensionDialog = true;
      this.surveyDimensionText = dimension.name;
      this.surveyDimensionDialogTitle = "Edit Survey Dimension";
      this.surveyDimensionDialogHint = "e.g., 'Focal Dimension'";
      this.surveyDimensionAbbrevHint = "e.g., 'FD'";
    },
    deleteDimension(dimension: any) {
      console.log("delete dimension!", dimension);
      // delete....
    },
    cancelDimensionDialog() {
      this.surveyDimensionDialog = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.form as any).resetValidation();
      console.log(this.$refs.form);
      console.log("valid? ", this.valid);
      this.serverError = false;
    },
    submitSurveyDimension() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("save info");

        this.$apollo
          .mutate({
            mutation: ADD_DIMENSION_MUTATION,
            variables: {
              surveyId: parseInt(this.surveySelect.value, 10),
              abbreviation: this.surveyDimensionAbbrev,
              title: this.surveyDimensionText,
              // FIXME: sequence should not be hard-coded
              sequence: 10
            }
          })
          .then(({ data }) => {
            console.log('done!', data);
             // FIXME: Replace the `as any` hack.
            (this.$refs.form as any).resetValidation();
            this.surveyDimensionDialog = false;
          })
          .catch((error) => {
            console.log('there appears to have been an error: ', error);
            (this.$refs.form as any).resetValidation();
            this.serverError = true;
            //this.serverError = true

          });

       


        //save info
        //if all is well, reset validation on form, close dialog (or maybe just call the cancel method)
      }
      //this.surveyDimensionDialog = false;
      
      // save to db, etc.
    },
    addSurveyIndex(dimension: any) {
      this.surveyDimensionId = dimension.id; // will use this when saving the new survey index
      this.surveyIndexDialog = true;
      this.surveyIndexText = "";
      this.selectedSurveyItems = [];
      this.surveyIndexDialogTitle = "Add a New Survey Index";
      this.surveyIndexDialogHint = "e.g., 'A Focus on Others'";
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
    },
    editIndex(indexItem: any) {
      // specify the type(!)
      console.log("edit index!", indexItem);
      this.surveyIndexId = indexItem.id;
      this.dimensionIndexId = indexItem.parentId;
      this.selectedSurveyItems = [];
      indexItem.children.forEach(surveyItem => {
        this.selectedSurveyItems.push({
          id: surveyItem.id,
          name: surveyItem.name
        });
      });
      this.surveyIndexDialog = true;
      this.surveyIndexText = indexItem.name;
      this.surveyIndexDialogTitle = "Edit Survey Index";
      this.surveyIndexDialogHint = "e.g., 'A Focus on Others'";
    },
    deleteIndex(indexItem: any) {
      console.log("delete index!", indexItem);
      // can use the parentId to make sure things are done correctly
    },
    cancelIndexDialog() {
      this.surveyIndexDialog = false;
      //this.valid = true;
      // FIXME: Replace the `as any` hack.
      (this.$refs.form as any).resetValidation();
      this.serverError = false;
    },
    submitSurveyIndex() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("save info");
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
        //save info
        //if all is well, reset validation on form, close dialog (or maybe just call the cancel method)
      }
      //this.surveyIndexDialog = false;
      console.log("save: ", this.surveyIndexText);
      console.log("survey items: ", this.selectedSurveyItems);
      // save to db, etc.
    },

    saveInfo() {
      // need to redirect or something, depending on if this is a new letter....
    }
  },

  apollo: {
    surveys: {
      query: ALL_SURVEYS_QUERY
    },
    /**
     * the following query will eventually be used to get survey dimension data, not letter data;
     * I was just putting the structure in place to make sure that it was reactive in the right way;
     * seems to work!
     */
    // the following query runs automatically when this.surveySelect is updates (i.e., when something is chosen from the drop-down)
    letter: {
      query: ONE_LETTER_QUERY,
      variables() {
        console.log('survey select: ',this.surveySelect);
        console.log('qualtricsId (to use fetch survey dimension data): ', this.surveySelect.value);
        /*
        if (this.$route.params.id !== undefined) {
          return {
            letterId: 3
          };
        }
        */
        return {
          letterId: 3
        };
      },
      update(data) {
        console.log('data: ', data);
        return data.letter;
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
    }
  },

  mounted() {
    console.log("mounted....");
  }
});
</script>
