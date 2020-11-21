<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="12">
        <!--<v-card>-->
        <!--<v-toolbar color="primary" dark flat>
            <v-toolbar-title
              >-->
        <h2>Request Group Administration of the Christian Life Survey</h2>
        <p>
          This form allows you to request an administration of the Christian
          Life Survey for your group. Upon submission of this form you will
          receive an email with instructions that you can forward to members of
          your group. This email will include a <strong>group code</strong> that
          members of your group will need to enter before they start the survey.
        </p>

        <p>
          After completion of the survey, members of your group will each
          receive an individualized response by email, suggesting which
          scripture engagement practices might be helpful for them. In addition,
          after the closing date of the survey, you as a group administrator
          will receive a summary of group characteristics such as....
        </p>
        <!--</v-toolbar-title>
          </v-toolbar>
          <v-card-text>-->
        <!-- https://medium.com/js-dojo/form-validation-with-vuetify-in-a-vue-app-d72e3d9b65db -->
        <v-form ref="form" v-model="isValid">
          <v-row justify="center">
            <v-col sm="12" md="10">
              <v-text-field
                v-model="email"
                label="Your Email"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                :rules="[rules.required, rules.email]"
                required
              />
              <v-text-field
                v-model="adminFirstName"
                label="Your First Name"
                name="adminFirstName"
                prepend-icon="mdi-pencil"
                type="text"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="adminLastName"
                label="Your Last Name"
                name="adminLastName"
                prepend-icon="mdi-pencil"
                type="text"
                :rules="[rules.required]"
                required
              />
              <p class="text-left">Type of Group:</p>
              <v-radio-group class="pl-4" v-model="typeOfGroup" column>
                <v-radio
                  label="Spiritual growth group (e.g., small group, Sunday school class)"
                  color="indigo darken-3"
                  value="SPIRITUAL_GROWTH_GROUP"
                ></v-radio>
                <v-radio
                  label="College spiritual life assessment"
                  color="indigo darken-3"
                  value="COLLEGE_SPIRITUAL_LIFE_ASSESSMENT"
                ></v-radio>
                <v-radio
                  label="Other"
                  color="indigo darken-3"
                  value="OTHER"
                ></v-radio>
              </v-radio-group>

              <v-text-field
                class="pl-10 mt-n5"
                v-show="typeOfGroup === 'OTHER'"
                v-model="typeOfGroupFreeFormText"
                label="Pleae Specify Other Type"
                name="typeOfGroup"
                prepend-icon="mdi-pencil"
                type="text"
              />

              <v-text-field
                v-model="descriptionOfGroup"
                label="Description of Group"
                name="descriptionOfGroup"
                prepend-icon="mdi-pencil"
                type="text"
                hint="E.g., First Baptist Youth Group (your participants will see this description)"
                persistent-hint
                :rules="[rules.required]"
                required
              />

              <!--<v-col cols="12" sm="6" md="4">-->
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="closingDate"
                persistent
                width="290px"
                required
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="mt-10"
                    v-model="closingDate"
                    label="Survey Closing Date (this is the day when the group access will end and your group results will be sent to you)"
                    prepend-icon="mdi-calendar-range"
                    hint="Recommended 4-6 wks"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="closingDate"
                  :max="maxClosingDateString"
                  :min="minClosingDateString"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(closingDate)"
                    >OK</v-btn
                  >
                </v-date-picker> </v-dialog
              ><!--
                  </v-card-text>
          <v-card-actions>-->
              <v-spacer />

              <h2>Choose a Survey</h2>
              <p>You may choose from the following survey(s):</p>

              <div v-for="survey in allSurveys" :key="survey.id">
                <h4>{{ survey.qualtricsName }}</h4>
                <!--<p>{{survey.detailedDescription}}</p>-->
                <p>
                  {{ survey.detailedDescription }}
                </p>
              </div>

              <v-select
                v-model="selectedSurvey"
                :items="allSurveys"
                item-text="qualtricsName"
                item-value="id"
                persistent-hint
                return-object
                filled
                label="Survey"
                :rules="[rules.required]"
                required
              ></v-select>

              <v-spacer />

              <v-btn @click="submit" color="primary" :disabled="!isValid"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <!--</v-card-actions>
        </v-card>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import {
  ALL_SURVEYS_QUERY,
  ADD_GROUP_MUTATION,
} from "../graphql/surveys.graphql";
//import { AllSurveys_surveys } from "../graphql/types/AllSurveys";

// TODO: use the automatically generated type AllSurveys_surveys (generated using yarn gen:types);
// for some reason if I change the selectedSurvey type from SelectedSurvey to AllSurveys_surveys, I get a compilation error
// (error: 'AllSurveys_surveys' is defined but never used  no-unused-vars)
interface SelectedSurvey {
  id: number;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  okayForGroup: boolean;
  detailedDescription: string;
}

@Component({
  components: {},
  apollo: {
    allSurveys: {
      query: ALL_SURVEYS_QUERY,
      update: (data) => {
        console.log("surveys! ", data);
        return data.surveys.filter(
          (survey: SelectedSurvey) => survey.okayForGroup
        );
      },
    },
  },
})
export default class GroupSignUp extends Vue {
  //@Prop() private msg!: string;

  // TODO -- assign the type (not sure why AllSurveys_surveys isn't being recognized....)
  //allSurveys: AllSurveys_surveys[] = []; // All surveys, listed in drop-down.

  selectedSurvey: SelectedSurvey | null = null;
  //https://stackoverflow.com/questions/64116145/vuetify-multiple-v-select-required-rules-dont-work
  //surveySelectRules = {
  //  required: [(v) => !!v || "Please choose a survey."]
  //};
  /*{
    id: -Infinity,
    qualtricsId: "",
    qualtricsName: "",
    qualtricsModDate: "",
  };*/
  email: string = "";
  typeOfGroup: string = "";
  typeOfGroupFreeFormText: string = "";
  descriptionOfGroup: string = "";
  adminFirstName: string = "";
  adminLastName: string = "";

  isValid: boolean = true;

  closingDate: string = new Date().toISOString().substr(0, 10);

  minClosingDateString: string = new Date().toISOString().substr(0, 10); //set to today

  maxClosingDate = new Date();
  maxClosingDateString: string = new Date().toISOString().substr(0, 10);

  modal: boolean = false;

  // https://vuetifyjs.com/en/components/text-fields/#text-fields
  rules = {
    required: (value: string): boolean | string => !!value || "Required.",
    email: (value: string): boolean | string => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Invalid e-mail.";
    },
  };

  submit() {
    console.log("submit! ", this.email, this.closingDate);

    // typeOfGroup gets mapped to Group.type; if typeOfGroup==="OTHER", then use the value of typeOfGroupFreeFormText instead(!)
    // descriptionOfGroup gets mapped to Group.name
    // need to add in the codeWord and use first name/last name for admin

    if (
      (this.$refs.form as Vue & {
        validate: () => boolean;
      }).validate() && (this.selectedSurvey !== null)
    ) {
      this.$apollo
        .mutate({
          mutation: ADD_GROUP_MUTATION,
          variables: {
            createInput: {
              name: this.descriptionOfGroup,
              type:
                this.typeOfGroup === "OTHER"
                  ? this.typeOfGroupFreeFormText
                  : this.typeOfGroup,
              closedAfter: this.closingDate,
              adminFirstName: this.adminFirstName,
              adminLastName: this.adminLastName,
              adminEmail: this.email,
              codeWord: "asdfadsf", //TODO: this should not be part of createInput (should be created by the server)....
              surveyId: this.selectedSurvey.id,
            },
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
          //this.errorMessage =
          //  "Sorry, there appears to have been an error.  Please tray again later.";
        });
    }
  }

  mounted(): void {
    console.log("inside mounted");
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    // https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    let closingDateObject = new Date();
    closingDateObject.setDate(closingDateObject.getDate() + 28); // set the default closing date to be four weeks from now
    this.closingDate = closingDateObject.toISOString().substr(0, 10);
    this.maxClosingDate.setDate(this.maxClosingDate.getDate() + 42); // sets the max closing date to be six weeks from now
    this.maxClosingDateString = this.maxClosingDate.toISOString();
    console.log("max date: ", this.maxClosingDateString);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/*
.group-form-container {
  width: 80%;
}
*/

p {
  text-align: left;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
