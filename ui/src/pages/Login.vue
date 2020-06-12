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

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { LOGIN_MUTATION } from "../graphql/users.graphql";

interface SnackbarData {
  show: boolean;
  text: string;
}

interface UserData {
  email: string;
  password: string;
  snackbar: SnackbarData;
}

export default {
  data(): UserData {
    return {
      email: "",
      password: "",

      snackbar: {
        show: false,
        text: "",
      },
    };
  },

  methods: {
    showSnackbar(text: string): void {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    logIn(): void {
      this.$apollo
        .mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            credentials: {
              email: this.email,
              password: this.password,
            },
          },
        })
        .then((response) => {
          this.$store.commit("logIn", response.data.login);
          this.$router.push({ name: "letters" });
        })
        .catch(() => {
          this.$store.commit("logOut");
          this.showSnackbar("Invalid credentials; please try again.");
        });
    },
  },
};
</script>
