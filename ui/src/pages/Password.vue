<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Change your password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
              />

              <v-text-field
                v-model="newPassword"
                label="New password"
                type="password"
              />

              <v-text-field
                v-model="repeatedPassword"
                label="Repeat new password"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="update" color="primary">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import Vue from "vue";
import { PASSWORD_MUTATION } from "../graphql/users.graphql";

export default Vue.extend({
  name: "Password",

  data() {
    return {
      currentPassword: "",
      newPassword: "",
      repeatedPassword: "",

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  methods: {
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    update() {
      this.$apollo
        .mutate({
          mutation: PASSWORD_MUTATION,
          variables: {
            passwordInput: {
              userId: this.$store.state.user.id,
              currentPassword: this.currentPassword,
              newPassword: this.newPassword
            }
          }
        })
        .then(response => this.showSnackbar(response.data.changePassword))
        .catch(err => this.showSnackbar(`Error: ${err}`));
    }
  }
});
</script>
