<template>
  <v-container>
    <h2 class="mb-6">
      Request Group Administration of the Christian Life Survey
    </h2>
    <v-form ref="form" v-model="isValid">
      <v-stepper v-model="formStep" vertical non-linear>
        <v-stepper-step
          editable
          :complete="formStep > 1"
          step="1"
          color="#4e2b4d"
          class="white--text"
        >
          Overview
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card class="mb-6 pa-6">
            <p>
              This form allows you to request an administration of the Christian
              Life Survey for your group. Upon submission of this form you will
              receive an email with instructions that you can forward to members
              of your group. This email will include a
              <strong>group code</strong> that members of your group will need
              to enter before they start the survey.
            </p>

            <p>
              After completion of the survey, members of your group will each
              receive an individualized response by email, suggesting which
              scripture engagement practices might be helpful for them. In
              addition, after the closing date of the survey, you as a group
              administrator will receive a summary of group characteristics such
              as....
            </p>
          </v-card>
          <v-btn color="#4e2b4d" class="white--text" @click="formStep = 2">
            Continue
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :editable="stepTwoValid()"
          :complete="formStep > 2"
          step="2"
          color="#4e2b4d"
          class="white--text"
        >
          Your information
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card class="mb-6 pa-6">
            <!-- add ref to the element: https://forum.vuejs.org/t/how-do-you-access-this-refs-form-validate-in-a-form-inside-of-a-menu/79406/5 -->
            <v-col sm="12" md="10">
              <p class="note-colour rounded font-weight-bold elevation-1 pa-2">
                Note: Your first and last name will be shown to your group when
                they go to take the survey.
              </p>
              <v-text-field
                color="#4e2b4d"
                v-model="email"
                ref="email"
                label="Your Email"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                :rules="[rules.required, rules.email]"
                required
              />
              <!-- https://stackoverflow.com/questions/56642635/how-to-add-password-matching-validation-in-vuetify/56642723 -->
              <v-text-field
                color="#4e2b4d"
                v-model="email2"
                label="Confirm Your Email"
                ref="email2"
                name="email2"
                prepend-icon="mdi-email"
                type="text"
                :rules="[email === email2 || 'Emails must match']"
                required
              />
              <v-text-field
                color="#4e2b4d"
                v-model="adminFirstName"
                label="Your First Name"
                ref="adminFirstName"
                name="adminFirstName"
                prepend-icon="mdi-pencil"
                type="text"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                color="#4e2b4d"
                v-model="adminLastName"
                label="Your Last Name"
                ref="adminLastName"
                name="adminLastName"
                prepend-icon="mdi-pencil"
                type="text"
                :rules="[rules.required]"
                required
              />
            </v-col>
          </v-card>
          <v-btn
            color="#4e2b4d"
            class="white--text"
            :disabled="!stepTwoValid()"
            @click="formStep = 3"
          >
            Continue
          </v-btn>
          <v-btn text @click="formStep = 1"> Back </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :editable="stepThreeValid()"
          :complete="formStep > 3"
          step="3"
          color="#4e2b4d"
          class="white--text"
        >
          Information about your group
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card class="mb-6 pa-6">
            <v-col sm="12" md="10">
              <p class="note-colour rounded font-weight-bold elevation-1 pa-2">
                "Description of Group" will be shown to members of your group
                when they go to take the survey.
              </p>

              <v-text-field
                color="#4e2b4d"
                v-model="descriptionOfGroup"
                label="Description of Group"
                ref="descriptionOfGroup"
                name="descriptionOfGroup"
                prepend-icon="mdi-pencil"
                type="text"
                hint="E.g., First Baptist Youth Group"
                persistent-hint
                :rules="[rules.required]"
                required
              />

              <p class="text-left mt-10">Type of Group:</p>
              <v-radio-group class="pl-4" v-model="groupTypeSelectedId" column>
                <v-radio
                  v-for="type in groupTypes"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                  color="#4e2b4d"
                />
              </v-radio-group>

              <v-text-field
                color="#4e2b4d"
                class="pl-10 mt-n5"
                v-show="isOtherGroupSelected"
                v-model="groupTypeOtherName"
                label="Please Specify Other Type"
                name="groupTypeOtherId"
                prepend-icon="mdi-pencil"
                type="text"
              />
            </v-col>
          </v-card>
          <v-btn
            color="#4e2b4d"
            class="white--text"
            :disabled="!stepThreeValid()"
            @click="formStep = 4"
          >
            Continue
          </v-btn>
          <v-btn text @click="formStep = 2"> Back </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :editable="stepThreeValid() && stepThreeValid()"
          :complete="formStep > 4"
          step="4"
          color="#4e2b4d"
          class="white--text"
        >
          Closing date for the survey
          <small>
            This is the day when your group's access will end and your group
            results will be sent to you
          </small>
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-card class="mb-6 pa-6">
            <v-col sm="12" md="10">
              <v-dialog
                color="#4e2b4d"
                ref="dialog"
                v-model="modal"
                :return-value.sync="closingDate"
                persistent
                width="290px"
                required
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    color="#4e2b4d"
                    v-model="closingDate"
                    label="Survey Closing Date"
                    prepend-icon="mdi-calendar-range"
                    hint="Recommended 4-6 wks"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="#4e2b4d"
                  v-model="closingDate"
                  :max="maxClosingDateString"
                  :min="minClosingDateString"
                  scrollable
                >
                  <v-spacer />
                  <v-btn text color="#4e2b4d" @click="modal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="#4e2b4d"
                    @click="$refs.dialog.save(closingDate)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-card>

          <v-btn color="#4e2b4d" class="white--text" @click="formStep = 5">
            Continue
          </v-btn>
          <v-btn text @click="formStep = 3"> Back </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :editable="stepTwoValid() && stepThreeValid()"
          step="5"
          color="#4e2b4d"
          class="white--text"
        >
          Select a survey
          <small>Choose from one of the following available surveys</small>
        </v-stepper-step>
        <v-stepper-content step="5">
          <v-card class="mb-6 pa-6">
            <v-col sm="12">
              <v-radio-group
                v-model="selectedSurveyId"
                :rules="[rules.required]"
                required
                :mandatory="allSurveys.length === 1"
              >
                <v-radio
                  v-for="survey of allSurveys"
                  :key="survey.id"
                  :value="survey.id"
                  color="#4e2b4d"
                >
                  <template v-slot:label>
                    <div
                      class="rounded elevation-1 grey lighten-3 mt-2 mb-2 pa-2"
                    >
                      <h4>{{ survey.publicName }}</h4>
                      <span>
                        {{ survey.detailedDescription }}
                      </span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>

              <p class="mt-5">
                If one of the above surveys works for you, select it and click
                Submit!
              </p>
            </v-col>
          </v-card>

          <v-btn
            @click="submit"
            color="#4e2b4d"
            class="white--text"
            :disabled="!isValid"
            >Submit</v-btn
          >
          <v-btn text @click="formStep = 4"> Back </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { ADD_GROUP_MUTATION, ALL_GROUP_TYPES } from "@/graphql/groups.graphql";
import { partition } from "lodash";
import {
  // eslint-disable-next-line no-unused-vars
  AllGroupTypes,
  // eslint-disable-next-line no-unused-vars
  AllGroupTypes_groupTypes,
} from "@/graphql/types/AllGroupTypes";

// TODO: use the automatically generated type AllSurveys_surveys (generated using yarn gen:types);
//import { AllSurveys_surveys } from "../graphql/types/AllSurveys";

// for some reason if I change the selectedSurvey type from SelectedSurvey to AllSurveys_surveys, I get a compilation error
// (error: 'AllSurveys_surveys' is defined but never used  no-unused-vars)
interface SelectedSurvey {
  id: number;
  qualtricsId: string;
  qualtricsName: string;
  qualtricsModDate: string;
  okayForGroup: boolean;
  publicName: string;
  detailedDescription: string;
}

interface InputFieldValidationHack extends Vue {
  valid: boolean;
}

export default Vue.extend({
  name: "GroupSignUp",
  // TODO -- assign the type (not sure why AllSurveys_surveys isn't being recognized....)
  //allSurveys: AllSurveys_surveys[] = []; // All surveys, listed in drop-down.

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

  data() {
    return {
      allSurveys: [],
      isValid: true,
      formStep: 1,

      groupTypes: [] as AllGroupTypes_groupTypes[], // All group types
      groupTypeSelectedId: -1,
      groupTypeOtherId: -Infinity, // ID of the "other" group type, if any.
      groupTypeOtherName: "", // Name for "other" group entered by user

      email: "",
      email2: "",
      descriptionOfGroup: "",
      adminFirstName: "",
      adminLastName: "",
      selectedSurveyId: null, // number | null = null,

      closingDate: new Date().toISOString().substr(0, 10),
      minClosingDateString: new Date().toISOString().substr(0, 10),
      maxClosingDate: new Date(),
      maxClosingDateString: new Date().toISOString().substr(0, 10),
      modal: false,

      // https://vuetifyjs.com/en/components/text-fields/#text-fields
      rules: {
        required: (value: string): boolean | string => !!value || "Required.",
        email: (value: string): boolean | string => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },

  computed: {
    isOtherGroupSelected(): boolean {
      return (
        this.groupTypeOtherId >= 0 &&
        this.groupTypeSelectedId === this.groupTypeOtherId
      );
    },
  },

  methods: {
    async loadGroupTypes() {
      const queryResult = await this.$apollo.query<AllGroupTypes>({
        query: ALL_GROUP_TYPES,
      });

      const [[is_other], not_other] = partition(
        queryResult.data.groupTypes,
        (grp) => grp.code === "OTHER"
      );

      if (is_other) {
        this.groupTypeOtherId = is_other.id;
      }

      not_other.push(is_other);
      this.groupTypes = not_other;
    },

    stepTwoValid() {
      if (
        this.$refs.email &&
        this.$refs.email2 &&
        this.$refs.adminFirstName &&
        this.$refs.adminLastName
      ) {
        // console.log("admin info refs seem to exist....");
        return (
          (this.$refs.email as InputFieldValidationHack).valid &&
          (this.$refs.email2 as InputFieldValidationHack).valid &&
          (this.$refs.adminFirstName as InputFieldValidationHack).valid &&
          (this.$refs.adminLastName as InputFieldValidationHack).valid
        );
      } else {
        // console.log("admin info refs do not seem to exist....");
        return false;
      }
    },

    stepThreeValid() {
      if (this.$refs.descriptionOfGroup) {
        // console.log("group info ref seems to exist....");
        return (this.$refs.descriptionOfGroup as InputFieldValidationHack)
          .valid;
      } else {
        // console.log("group info ref does not seem to exist....");
        return false;
      }
    },

    submit() {
      console.log("submit! ", this.email, this.closingDate);

      // descriptionOfGroup gets mapped to Group.name
      // need to add in the codeWord and use first name/last name for admin

      if (
        (
          this.$refs.form as Vue & {
            validate: () => boolean;
          }
        ).validate() &&
        this.selectedSurveyId !== null
      ) {
        this.$apollo
          .mutate({
            mutation: ADD_GROUP_MUTATION,
            variables: {
              createInput: {
                name: this.descriptionOfGroup,
                typeId: this.groupTypeSelectedId,
                closedAfter: this.closingDate,
                adminFirstName: this.adminFirstName,
                adminLastName: this.adminLastName,
                adminEmail: this.email,
                surveyId: this.selectedSurveyId,
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
    },
  },

  mounted(): void {
    console.log("inside mounted");
    console.log("this.$refs: ", this.$refs);

    this.loadGroupTypes();

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    // https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    let closingDateObject = new Date();
    closingDateObject.setDate(closingDateObject.getDate() + 28); // set the default closing date to be four weeks from now
    this.closingDate = closingDateObject.toISOString().substr(0, 10);
    this.maxClosingDate.setDate(this.maxClosingDate.getDate() + 42); // sets the max closing date to be six weeks from now
    this.maxClosingDateString = this.maxClosingDate.toISOString();
    console.log("max date: ", this.maxClosingDateString);
  },
});
</script>

<style scoped lang="scss">
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

.button-colour {
  color: #4e2b4d;
}

.note-colour {
  background: #806e81;
  color: white;
}
</style>
