<template>
  <v-menu offset-x left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        color="primary"
        x-small
        right
        absolute
        :top="top"
        :bottom="!top"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, idx) in menuItems"
        :key="idx"
        @click="$emit(item.value)"
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export interface FabMenuItem {
  text: string;
  value: string;
}

export default Vue.extend({
  name: "ElementFab",

  props: {
    top: { type: Boolean, default: false },
    menuItems: { type: Array as () => FabMenuItem[], required: true },
  },
});
</script>
