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

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

import axios from "axios";
import { AxiosResponse } from "axios";

interface SurveyItemType {
  id: number; // id of the survey in our db
  title: string; // e.g., "Christian Life Survey"
}

@Component({
  components: {}
})
export default class LetterInfoForm extends Vue {
  /** Form to create/update Letter Info (e.g., title, etc.) */
  @Prop() id!: number;
  @Prop() initialTitle!: string;
  @Prop() initialSurveyId!: number;
  @Prop() isNew!: boolean;

  surveys: SurveyItemType[] = [];
  title: string = this.initialTitle;

  valid: boolean = true;
  name: string = "";
  nameRules: any = [
    (v: any) => !!v || "Title is required",
    (v: any) =>
      (v && v.length <= 80) || "Title of letter must be less than 80 characters"
  ];

  select: any = null;

  submit() {
    if (this.$refs.form.validate()) {
      console.log("save info");
      this.saveInfo();
    }
  }

  @Emit("save-info")
  saveInfo() {
    // need to redirect or something, depending on if this is a new letter....
  }

  mounted() {
    axios
      .get("http://localhost:3000/survey-data/")
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
}
</script>
