<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon v-on:click="toggleDrawer" />

    <v-toolbar-title class="headline text-uppercase">
      <span>Capernaum</span>
      <span class="font-weight-light">Admin</span>
    </v-toolbar-title>

    <v-spacer />

    <v-menu v-if="isLoggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon dark>mdi-account</v-icon>
          <span>{{ $store.state.user.firstName }}</span>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item :to="{ name: 'password' }">
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logOut">
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      text
      href="https://github.com/quantum-bits/capernaum"
      target="_blank"
    >
      <v-icon color="grey">mdi-github-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ToolBar",

  methods: {
    toggleDrawer() {
      this.$emit("toggleDrawer");
    },
    logOut() {
      this.$store.commit("logOut");
      this.$router.push({ name: "login" });
    },
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
});
</script>
