<!--
<template>
  <v-layout row wrap>
    <v-flex xs12 sm12>
      <h2 class="title font-weight-regular mb-3">
        Association Table Information:
      </h2>
    </v-flex>
    <v-flex xs12 sm8 offset-sm1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="title"
          :counter="80"
          :rules="nameRules"
          label="Title of Association Table"
          required
        ></v-text-field>
        <v-select
          v-model="select"
          :items="surveys"
          item-text="surveyTitle"
          item-value="id"
          :rules="[v => !!v || 'Survey is required']"
          label="Survey"
          required
          persistent-hint
          return-object
          single-line
        />
        <v-btn :disabled="!valid" color="success" @click="submit">
          Submit
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>
-->

<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <template>
              <div>
                <v-row justify="center">
                    <v-dialog
                        persistent
                        v-model="surveyIndexDialog"
                        max-width="800"
                    >
                        <v-card>

                            <v-card-title class="headline">
                              {{surveyIndexDialogTitle}}
                            </v-card-title>

                            <v-card-text>
                              <v-text-field
                                v-model="surveyIndexText"
                                label="Survey Index"
                                :hint="surveyIndexDialogHint"
                                outlined
                                persistent-hint
                              ></v-text-field>
                            </v-card-text>
                          
                            <v-card-text>
                            Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="green darken-1"
                                text
                                @click="cancelIndexDialog()"
                            >
                                Cancel
                            </v-btn>

                            <v-btn
                                color="green darken-1"
                                text
                                @click="submitNewSurveyIndex()"
                            >
                                Submit
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog
                        persistent
                        v-model="surveyDimensionDialog"
                        max-width="800"
                    >
                        <v-card>
                            <v-card-title class="headline">
                              {{surveyDimensionDialogTitle}}
                            </v-card-title>

                            <v-card-text>
                              <v-text-field
                                v-model="surveyDimensionText"
                                label="Survey Dimension"
                                :hint="surveyDimensionDialogHint"
                                outlined
                                persistent-hint
                              ></v-text-field>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="green darken-1"
                                text
                                @click="cancelDimensionDialog()"
                            >
                                Cancel
                            </v-btn>

                            <v-btn
                                color="green darken-1"
                                text
                                @click="submitNewSurveyDimension()"
                            >
                                Submit
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>


                </v-row>
              </div>
            </template>


      </v-flex>
      <v-flex xs12 sm12>
        <h2 class="title font-weight-regular mb-3">
          Survey Dimensions:
        </h2>
      </v-flex>
      <v-flex xs12 sm12>
        <template>
          <v-treeview 
            dense 
            rounded 
            hoverable 
            :items="items">

            
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.type == surveyDimensionEnum.SURVEY_ITEM">
                    {{'mdi-comment-outline'}}
                </v-icon>
            </template>
            <template v-slot:append="{ item, open }">
                <span v-if="item.type == surveyDimensionEnum.SURVEY_INDEX">
                    <a @click=editIndex(item.id)>
                        <v-icon> 
                            {{ 'mdi-pencil' }}
                        </v-icon>
                    </a>
                    <a @click=deleteIndex(item.id)>
                        <v-icon> 
                            {{ 'mdi-close-circle' }}
                        </v-icon>
                    </a>
                </span>
                <span v-else-if="item.type == surveyDimensionEnum.SURVEY_DIMENSION">
                    <a @click=addSurveyIndex(item.id)>
                        <v-icon> 
                            {{ 'mdi-plus-circle' }}
                        </v-icon>
                    </a>
                    <a @click=editSurveyDimension(item.id)>
                        <v-icon> 
                            {{ 'mdi-pencil' }}
                        </v-icon>
                    </a>
                    <a @click=deleteDimension(item.id)>
                        <v-icon> 
                            {{ 'mdi-close-circle' }}
                        </v-icon>
                    </a>
                </span>  
              </template>
            </v-treeview>
        </template>
      </v-flex>
      <v-flex xs12 sm12>
        <v-btn color="primary" @click="addSurveyDimension()">Add Survey Dimension</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import axios, { AxiosResponse } from "axios";
import Vue from "vue";

interface SurveyItemType {
  id: number; // id of the survey in our db
  title: string; // e.g., "Christian Life Survey"
}

import {
  SurveyDimensionEnum
} from "./survey-dimension.types";

export default Vue.extend({
  /** Form to create/update Letter Info (e.g., title, etc.) */
  name: "SurveyDimensions",

  props: {
    id: Number,
    initialTitle: String,
    initialSurveyId: Number,
    isNew: Boolean
  },

  data() {
    return {
      surveyDimensionEnum: SurveyDimensionEnum,
      surveyIndexDialog: false,
      surveyDimensionDialog: false,
      surveyDimensionText: '' as string,
      surveyDimensionDialogTitle: '' as string,
      surveyDimensionDialogHint: '' as string,
      surveyIndexText: '' as string,
      surveyIndexDialogTitle: '' as string,
      surveyIndexDialogHint: '' as string,
      surveys: [] as SurveyItemType[],
      title: this.initialTitle,
      valid: true,
      select: null as any,
      name: "",
      nameRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 80) ||
          "Title of letter must be less than 80 characters"
      ],
      items: [
        {
          id: 1,
          name: "Focal Dimension:",
          type: "survey-dimension",
          children: [
            { 
                id: 2, 
                name: "A Focus on Others:",
                type: "survey-index",
                children: [
                    {
                        id: 20,
                        name: "I live in ways that help others as much as myself",
                        type: "survey-item"
                    },
                    {
                        id: 21,
                        name: "I go out of my way to discover the people in need around me that I normally wouldn’t see",
                        type: "survey-item"
                    },
                    {
                        id: 22,
                        name: "I have tremendous love for people I don’t know",
                        type: "survey-item"
                    },
                    {
                        id: 23,
                        name: "I think about strangers’ well-being and want what is best for them",
                        type: "survey-item"
                    },
                ]
            },
            { 
                id: 3, 
                name: "A Focus on the Bible:",
                type: "survey-index",
                children: [
                    {
                        id: 30,
                        name: "I believe the Bible has decisive authority over what I say and do",
                        type: "survey-item"
                    },
                    {
                        id: 31,
                        name: "As I go through the normal day I think of Bible passages relevant to what I am doing",
                        type: "survey-item"
                    },
                    {
                        id: 32,
                        name: "I talk about Bible passages with my friends",
                        type: "survey-item"
                    },
                ]},
            { 
                id: 4, 
                name: "A Focus on God:",
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
          name: "Orientation Dimension:",
          type: "survey-dimension",
          children: [
          ]
        },
        {
          id: 15,
          name: "Scripture Engagement Dimension:",
          type: "survey-dimension",
          children: [
          ]
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
      },
      editSurveyDimension(dimensionId: number) {
        this.surveyDimensionDialog = true;
        this.surveyDimensionText = "Focal Dimension";
      },
      deleteDimension(dimensionId: number) {
          console.log('delete dimension!', dimensionId);
          console.log(typeof(dimensionId));
      },
      cancelDimensionDialog() {
        this.surveyDimensionDialog = false;
      },
      submitNewSurveyDimension() {
        this.surveyDimensionDialog = false;
        console.log('save: ', this.surveyDimensionText);
        // save to db, etc.
      },
      addSurveyIndex(dimensionId: number) {
        this.surveyIndexDialog = true;
        this.surveyIndexText = "";
        this.surveyIndexDialogTitle = "Add a New Survey Index";
        this.surveyIndexDialogHint = "e.g., 'A Focus on Others'";
      },
      editIndex(indexId: number) {
          console.log('edit index!', indexId);
          console.log(typeof(indexId));
          this.surveyIndexDialog = true;
          this.surveyIndexText = "A Focus on God";
          console.log(this.dialog);
      },
      deleteIndex(indexId: number) {
          console.log('delete index!', indexId);
          console.log(typeof(indexId));
      },
      cancelIndexDialog() {
        this.surveyIndexDialog = false;
      },
      submitNewSurveyIndex() {
        this.surveyIndexDialog = false;
        console.log('save: ', this.surveyIndexText);
        // save to db, etc.
      },

    submit() {
      // FIXME: Replace the `as any` hack.
      if ((this.$refs.form as any).validate()) {
        console.log("save info");
        this.saveInfo();
      }
    },

    saveInfo() {
      // need to redirect or something, depending on if this is a new letter....
    }
  },

  mounted() {
    axios
      .get("http://localhost:4000/survey-data/")
      .then((response: AxiosResponse) => {
        console.log(response);
        this.surveys = response.data;
        if (!this.isNew) {
          for (let survey of this.surveys) {
            if (survey.id === this.initialSurveyId) {
              this.select = survey;
            }
          }
        }
      });
  }
});
</script>
