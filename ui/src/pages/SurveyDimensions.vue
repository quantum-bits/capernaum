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
            <v-flex xs12 sm12>
                <template>


                    <v-treeview
                        rounded
                        hoverable
                        activatable
                        :items="items"
                    ></v-treeview>
                </template>

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
          name: 'Applications :',
          children: [
            { id: 2, name: 'Calendar : app' },
            { id: 3, name: 'Chrome : app' },
            { id: 4, name: 'Webstorm : app' },
          ],
        },
        {
          id: 5,
          name: 'Documents :',
          children: [
            {
              id: 6,
              name: 'vuetify :',
              children: [
                {
                  id: 7,
                  name: 'src :',
                  children: [
                    { id: 8, name: 'index : ts' },
                    { id: 9, name: 'bootstrap : ts' },
                  ],
                },
              ],
            },
            {
              id: 10,
              name: 'material2 :',
              children: [
                {
                  id: 11,
                  name: 'src :',
                  children: [
                    { id: 12, name: 'v-btn : ts' },
                    { id: 13, name: 'v-card : ts' },
                    { id: 14, name: 'v-window : ts' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 15,
          name: 'Downloads :',
          children: [
            { id: 16, name: 'October : pdf' },
            { id: 17, name: 'November : pdf' },
            { id: 18, name: 'Tutorial : html' },
          ],
        },
        {
          id: 19,
          name: 'Videos :',
          children: [
            {
              id: 20,
              name: 'Tutorials :',
              children: [
                { id: 21, name: 'Basic layouts : mp4' },
                { id: 22, name: 'Advanced techniques : mp4' },
                { id: 23, name: 'All about app : dir' },
              ],
            },
            { id: 24, name: 'Intro : mov' },
            { id: 25, name: 'Conference introduction : avi' },
          ],
        },
      ]
    };
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
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
