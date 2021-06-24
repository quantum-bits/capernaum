<template>
  <v-navigation-drawer
    app
    clipped
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
  >
    <!-- Heading -->
    <v-list v-for="item in navItems" :key="item.route" dense>
      <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>

      <v-list-item :to="{ name: item.route }" :disabled="!isLoggedIn">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-divider v-if="item.divider"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

interface NavItem {
  heading?: string;
  title: string;
  route: string;
  icon: string;
  divider?: boolean;
}

export default Vue.extend({
  props: ["value"],

  computed: {
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    },
  },

  data: function () {
    const navItems: NavItem[] = [
      {
        heading: "SURVEYS",
        title: "Surveys",
        route: "surveys",
        icon: "mdi-comment-question",
      },
      {
        title: "Dimensions",
        route: "survey-dimensions",
        icon: "mdi-file-tree",
      },
      {
        title: "Practices",
        route: "scripture-engagement-practices",
        icon: "mdi-book-open",
        divider: true,
      },
      {
        heading: "LETTERS",
        title: "Letters",
        route: "letters",
        icon: "mdi-email",
      },
      {
        title: "Images",
        route: "images",
        icon: "mdi-image",
        divider: true,
      },
      {
        heading: "RESPONSES",
        title: "Individual",
        route: "responses",
        icon: "mdi-account",
      },
      {
        title: "Group",
        route: "groups",
        icon: "mdi-account-group",
        divider: true,
      },
      {
        heading: "SYS ADMIN",
        title: "Qualtrics",
        route: "surveys",
        icon: "mdi-comment-question",
      },
      {
        title: "Events",
        route: "events",
        icon: "mdi-alarm",
      },
      {
        title: "Web Hooks",
        route: "web-hooks",
        icon: "mdi-pipe",
      },
    ];
    return {
      navItems,
    };
  },
});
</script>
