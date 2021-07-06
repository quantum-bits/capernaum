<template>
  <v-card outlined class="my-2" elevation="2">
    <element-fab v-if="showTopFab" :top="true" :menu-items="menuItems" />
    <v-card-title>
      <v-icon class="mr-2">mdi-drag-vertical</v-icon>
      <span class="blue--text mr-2" v-if="moreData">{{ moreData }}</span>
      {{ title }}
    </v-card-title>
    <v-card-text v-if="showContent">
      <slot></slot>
    </v-card-text>
    <element-buttons v-if="showContent" />
    <element-fab :menu-items="menuItems" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ElementButtons from "@/pages/letters/elements/ElementButtons.vue";
import ElementFab, {
  FabMenuItem,
} from "@/pages/letters/elements/ElementFab.vue";

export default Vue.extend({
  name: "ElementCard",

  components: { ElementButtons, ElementFab },

  props: {
    title: { type: String, required: true },
    moreData: { type: String, required: false },
    showContent: { type: Boolean, default: true },
    showTopFab: { type: Boolean, default: false },
    menuItems: { type: Array as () => FabMenuItem[], required: true },
  },
});
</script>
