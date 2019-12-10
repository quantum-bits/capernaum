<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Log in to Capernaum</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="text"
              />

              <v-text-field
                v-model="password"
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="logIn" color="primary">Log In</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { LOGIN_MUTATION } from "../graphql/users.graphql";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },

  methods: {
    logIn() {
      this.$apollo
        .mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            credentials: {
              email: this.email,
              plainTextPassword: this.password
            }
          }
        })
        .then(response => {
          this.$store.commit("logIn", response.data.login);
          this.$router.push({ name: "home" });
        })
        .catch(err => {
          this.$store.commit("logOut");
        });
    }
  }
};
</script>
