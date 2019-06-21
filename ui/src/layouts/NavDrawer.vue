<template>
  <v-navigation-drawer app v-model="drawerVisible">
    <v-list>
      <NavItem v-for="item in menuItems" :key="item.route" :item="item" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import NavItem from "./NavItem.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { NavItemType } from "./layout.types";

@Component({
  components: { NavItem }
})
export default class NavDrawer extends Vue {
  @Prop({ default: false }) initialVisibility!: boolean;

  drawerVisible: boolean = this.initialVisibility;

  get menuItems(): NavItemType[] {
    return [
      {
        title: "Home",
        route: "home",
        icon: "home",
        divider: true
      },
      {
        title: "About",
        route: "about",
        icon: "school",
        children: [
          {
            title: "This project",
            route: "about-more",
            icon: "autorenew"
          },
          {
            title: "The Center for Scripture Engagement",
            route: "about-even-more",
            icon: "dashboard"
          }
        ]
      },
      {
        title: "Letters",
        route: "letters",
        icon: "email",
        divider: true
      },
      {
        title: "Boolean Association Tables",
        route: "boolean-associations",
        icon: "book",
        divider: true
      }
    ];
  }

  toggle() {
    this.drawerVisible = !this.drawerVisible;
  }
}
</script>
