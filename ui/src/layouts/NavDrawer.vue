<template>
  <v-navigation-drawer app v-model="drawerVisible">
    <!-- Heading -->
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Admin
        </v-list-item-title>
        <v-list-item-subtitle>
          Capernaum
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list v-for="item in navItems" :key="item.route" dense nav>
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
  divider?: boolean;
  children?: NavChild[];
}

export default Vue.extend({
  props: {
    initialVisibility: {
      type: Boolean,
      default: null
    }
  },
  data: function() {
    let navItems: NavItem[] = [
      {
        title: "Home",
        route: "home",
        icon: "mdi-home",
        divider: true
      },
      {
        title: "About",
        route: "about",
        icon: "mdi-school",
        children: [
          {
            title: "This project",
            route: "about-more",
            icon: "mdi-autorenew"
          },
          {
            title: "The Center for Scripture Engagement",
            route: "about-even-more",
            icon: "mdi-view-dashboard"
          }
        ]
      },
      {
        title: "Responses",
        route: "responses",
        icon: "mdi-message-outline"
      },
      {
        title: "Letters",
        route: "letters",
        icon: "mdi-email",
        divider: true
      },
      {
        title: "Survey Dimensions",
        route: "survey-dimensions",
        icon: "mdi-file-tree",
        divider: true
      },
      {
        title: "Imported Surveys",
        route: "imported-surveys",
        icon: "mdi-download",
        divider: true
      }
    ];
    return {
      drawerVisible: this.initialVisibility,
      navItems
    };
  },

  methods: {
    toggle: function() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
});
</script>
