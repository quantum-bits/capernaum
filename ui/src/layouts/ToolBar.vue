<template>
  <div>
    <NavDrawer ref="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon v-on:click="toggleNavDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="headline text-uppercase">
        <span>Capernaum</span>
        <span class="font-weight-light">Admin</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        text
        href="https://github.com/quantum-bits/capernaum"
        target="_blank"
      >
        <v-icon color="grey">mdi-github-circle</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import NavDrawer from "./NavDrawer";

export default {
  components: {
    NavDrawer
  },
  methods: {
    toggleNavDrawer() {
      this.$refs.drawer.toggle();
    }
  }
};
</script>
