<template>
  <v-container>
    <div class="image-container">
      <img
        alt="Center for Scripture Engagement Logo"
        src="../assets/Cls+results+letter+banner+2+half+size.png"
      />
    </div>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title
              >Request Group Administration of a Survey</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <!-- https://medium.com/js-dojo/form-validation-with-vuetify-in-a-vue-app-d72e3d9b65db -->
            <v-form v-model="isValid">
              <v-text-field
                v-model="email"
                label="E-mail"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                :rules="[rules.required, rules.email]"
                required
              />
              <v-text-field
                v-model="adminName"
                label="Name"
                name="adminName"
                prepend-icon="mdi-pencil"
                type="text"
              />
              <v-text-field
                v-model="typeOfGroup"
                label="Type of Group"
                name="typeOfGroup"
                prepend-icon="mdi-pencil"
                type="text"
                hint="E.g., church, youth group, college"
              />

              <v-text-field
                v-model="descriptionOfGroup"
                label="Description of Group"
                name="descriptionOfGroup"
                prepend-icon="mdi-pencil"
                type="text"
                hint="E.g., First Baptist Youth Group (your respondents will see this description)"
                persistent-hint
                :rules="[rules.required]"
                required
              />

              <v-col cols="12" sm="6" md="4">
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
                      v-model="closingDate"
                      label="Survey Closing Date"
                      prepend-icon="mdi-calendar-range"
                      hint="Recommend 4-6 wks"
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
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="submit" color="primary" :disabled="!isValid"
              >Submit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    date: {{ closingDate }}
  </v-container>
</template>






<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class GroupSignUp extends Vue {
  //@Prop() private msg!: string;

  email: string = "";
  typeOfGroup: string = "";
  descriptionOfGroup: string = "";
  adminName: string = "";

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
    }
  };

  emailRules = [
    (v: string): boolean | string => !!v || "E-mail is required",
    (v: string): boolean | string =>
      /.+@.+\..+/.test(v) || "E-mail must be valid"
  ];

  submit() {
    console.log("submit! ", this.email, this.closingDate);
  }

  mounted(): void {
    console.log("inside mounted");
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    // https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    this.maxClosingDate.setDate(this.maxClosingDate.getDate() + 42); // sets the max closing date to be six weeks from now
    this.maxClosingDateString = this.maxClosingDate.toISOString();
    console.log("max date: ", this.maxClosingDateString);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.group-form-container {
  width: 100%;
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