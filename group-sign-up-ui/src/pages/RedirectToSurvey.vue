<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <!--<v-card>-->
        <!--<v-toolbar color="#5c335a" dark flat>
            <v-toolbar-title
              >-->
        <h2>Take the Christian Life Survey</h2>

        <v-row>
          <v-col cols="12" md="6" lg="4">
            <v-card elevation="2" outlined shaped tile>
              <v-card-title> Take Individual Survey </v-card-title>
              <v-card-text class="text-sm-left">
                Take the Christian Life Survey on your own.
                This will be the option for most people.
                Once you have completed the survey you will
                receive an email with a summary of results
                and recommendations for scripture engagement
                practices that may be helpful to you.
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn class="button-colour" text @click="takeIndividualSurvey">
                  Go to survey
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-card elevation="2" outlined shaped tile>
              <v-card-title> Take Group Survey </v-card-title>
              <v-card-text class="text-sm-left">
                Take the Christian Life Survey as part of a group.
                Select this option if you are part of a group,
                and your group leader has provided you with a code.
                
                <v-text-field class="mt-4"
                color="#4e2b4d"
                v-model="groupCode"
                ref="groupCode"
                label="Your Group Code"
                name="groupCode"
                type="text"
                hint="Provided to you by your leader"
                persistent-hint
                required
                outlined
              />

              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn class="button-colour" text :disabled="!codeValid()" @click="takeGroupSurvey">
                  Go to survey
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-card elevation="2" outlined shaped tile>
              <v-card-title> Register Your Group </v-card-title>
              <v-card-text class="text-sm-left">
                Register your group to take the Christian Life Survey.
                You will receive summary data about your group 
                after they have completed the survey.
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn class="button-colour" text @click="registerGroup">
                  Register Group
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!--
        <div v-if="showChooseGroupOrNot">
          <p class="mt-2">Do you have a <strong>group code</strong>?</p>
          <v-btn @click="haveGroupCode" color="#5c335a" class="white--text mr-1"
            >Yes</v-btn
          >
          <v-btn
            @click="redirectToSurveyNoCode"
            color="#5c335a"
            class="white--text ml-1"
            >No</v-btn
          >
          <p class="mt-5">
            (A group code would have been sent to you by a group administrator.)
          </p>
        </div>

        <div v-if="showGroupCodeForm">
          <p class="mt-2">Please enter your group code.</p>
          <v-form v-model="isValid">
            <v-row justify="center">
              <v-col sm="12" md="8">
                <v-text-field
                  v-model="descriptionOfGroup"
                  label="Group Code"
                  name="groupCode"
                  prepend-icon="mdi-pencil"
                  type="text"
                  hint="6-8 letter code, sent to you by a group admin"
                  persistent-hint
                  :rules="[rules.required]"
                  required
                />
                <v-btn
                  @click="submitGroupCode"
                  color="#5c335a"
                  :disabled="!isValid"
                  class="white--text mr-1 mt-2"
                  >Submit Code</v-btn
                >
                <v-btn
                  @click="cancel"
                  color="#5c335a"
                  class="white--text ml-1 mt-2"
                  >Cancel</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </div>

        <div v-if="showFoundGroup">
          <p class="mt-2">
            We think we found your group:
            <strong>First Baptist Youth Group</strong>
          </p>
          <p class="mt-2">
            If this is your group, click <strong>Continue</strong> to proceed to
            the survey.
          </p>
          <v-btn
            @click="redirectToSurveyWithCode"
            color="#5c335a"
            class="white--text mr-1 mt-2"
            >Continue</v-btn
          >
          <v-btn
            @click="cancelAfterReceivingCode"
            color="#5c335a"
            class="white--text ml-1 mt-2"
            >Cancel</v-btn
          >
        </div>

        <div v-if="showGroupCodeInvalid">
          <p class="mt-2">
            <strong>Oops!</strong> Looks like your group code was not valid.
          </p>
          <p class="mt-n1">
            This could mean that your group survey has expired or that you
            mistyped the code.
          </p>
          <v-btn
            @click="groupCodeIncorrectRedirect"
            color="#5c335a"
            class="white--text mr-1"
            >Got It</v-btn
          >
        </div>
        
        <p>
          If you don't have a group code, click the button below to get started
          on the survey.
        </p>
        <v-spacer />
        <v-btn @click="submit" color="#5c335a">Take the Survey</v-btn>

        </v-card-actions>
        </v-card>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RedirectToSurvey extends Vue {
  //@Prop() private msg!: string;

  groupCode: string = "";
  groupCodeRand: number = 1;
  showChooseGroupOrNot: boolean = true;
  showGroupCodeForm: boolean = false;
  showFoundGroup: boolean = false;
  showGroupCodeInvalid: boolean = false;
  descriptionOfGroup: string = "";

  isValid: boolean = true;

  // https://vuetifyjs.com/en/components/text-fields/#text-fields
  rules = {
    required: (value: string): boolean | string => !!value || "Required.",
  };

  submitGroupCode() {
    console.log("submitted group code: ", this.groupCode);
    this.showGroupCodeForm = false;
    this.groupCodeRand = -this.groupCodeRand;
    if (this.groupCodeRand > 0) {
      // success
      this.showFoundGroup = true;
    } else {
      // group code not valid
      this.showGroupCodeInvalid = true;
    }
  }

  codeValid() {
    return this.groupCode !== '';
  }

  takeIndividualSurvey() {
    console.log('go to individual survey');
  }

  takeGroupSurvey() {
    console.log('go to group survey');
  }

  registerGroup() {
    console.log('register');
    this.$router.push({ name: "group-sign-up" });
  }

  cancel() {
    this.showGroupCodeForm = false;
    this.showGroupCodeInvalid = false;
    this.showChooseGroupOrNot = true;
  }

  cancelAfterReceivingCode() {
    this.showGroupCodeForm = true;
    this.showGroupCodeInvalid = false;
    this.showChooseGroupOrNot = false;
    this.showFoundGroup = false;
  }

  haveGroupCode() {
    this.showGroupCodeForm = true;
    this.showChooseGroupOrNot = false;
  }

  groupCodeIncorrectRedirect() {
    this.showGroupCodeForm = true;
    this.showGroupCodeInvalid = false;
    this.showChooseGroupOrNot = false;
  }

  redirectToSurveyNoCode() {
    console.log("redirect to survey with no code....");
  }

  redirectToSurveyWithCode() {
    console.log("redirect to survey with code....");
  }

  mounted(): void {
    console.log("inside mounted");
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

/*
p {
  text-align: left;
}
*/

.button-colour {
  color: #4e2b4d;
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