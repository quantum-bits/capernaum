<template>
  <v-app>
    <nav-drawer v-model="drawerVisible" />
    <app-bar @toggleDrawer="toggleNavDrawer" />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "./AppBar.vue";
import NavDrawer from "./NavDrawer.vue";

export default Vue.extend({
  components: {
    AppBar,
    NavDrawer,
  },

  data() {
    return {
      drawerVisible: false,
    };
  },

  methods: {
    toggleNavDrawer(): void {
      this.drawerVisible = !this.drawerVisible;
    },
  },
});
</script>
