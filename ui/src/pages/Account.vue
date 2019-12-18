<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Update your account</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="account.firstName"
                label="First Name"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                v-model="account.lastName"
                label="Last Name"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                v-model="account.currentPassword"
                label="Current Password"
                prepend-icon="mdi-lock"
                type="password"
              />
              <v-text-field
                v-model="account.newPasswordOne"
                label="New password"
                prepend-icon="mdi-lock"
                type="password"
              />

              <v-text-field
                v-model="account.newPasswordTwo"
                label="Repeat new password"
                prepend-icon="mdi-lock"
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
import { LOGIN_MUTATION, ONE_USER_QUERY } from "../graphql/users.graphql";

export default {
  name: "Account",

  apollo: {
    account: {
      query: ONE_USER_QUERY,
      variables: {
        userId: 1
      },
      update: data => {
        return {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName
        };
      }
    }
  },

  data() {
    return {
      account: {
        id: NaN,
        firstName: "",
        lastName: "",
        currentPassword: "",
        newPasswordOne: "",
        newPasswordTwo: ""
      },

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
          mutation: LOGIN_MUTATION,
          variables: {
            credentials: {
              email: this.email,
              password: this.password
            }
          }
        })
        .then(response => {
          this.$store.commit("logIn", response.data.login);
          this.$router.push({ name: "letters" });
        })
        .catch(() => {
          this.$store.commit("logOut");
          this.showSnackbar("Invalid credentials; please try again.");
        });
    }
  }
};
</script>
