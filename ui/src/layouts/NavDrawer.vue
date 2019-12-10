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

      <!-- No children -->
      <v-list-item v-if="!item.children" :to="{ name: item.route }">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <!-- With children -->
      <v-list-group v-else :prepend-icon="item.icon" no-action>
        <template v-slot:activator>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </template>

        <v-list-item
          v-for="child in item.children"
          :key="child.route"
          :to="{ name: child.route }"
        >
          <v-list-item-icon>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ child.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-divider v-if="item.divider"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

interface NavChild {
  title: string;
  route: string;
  icon: string;
}

interface NavItem extends NavChild {
  heading?: string;
  divider?: boolean;
  children?: NavChild[];
}

export default Vue.extend({
  props: ["value"],

  data: function() {
    const navItems: NavItem[] = [
      {
        title: "Home",
        route: "home",
        icon: "mdi-home",
        divider: true
      },
      {
        heading: "PRACTICES",
        title: "Scripture Engagement Practices",
        route: "scripture-engagement-practices",
        icon: "mdi-book-open",
        divider: true
      },
      {
        heading: "SURVEYS",
        title: "Survey Dimensions",
        route: "survey-dimensions",
        icon: "mdi-file-tree"
      },
      {
        title: "Uploaded Images",
        route: "images",
        icon: "mdi-image"
      },
      {
        title: "Letters",
        route: "letters",
        icon: "mdi-email",
        divider: true
      },
      {
        heading: "RESPONSES",
        title: "Imported Surveys",
        route: "imported-surveys",
        icon: "mdi-download"
      },
      {
        title: "Responses",
        route: "responses",
        icon: "mdi-message-outline"
      }
    ];
    return {
      navItems
    };
  }
});
</script>
