<template>
  <v-menu offset-x left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">
        {{ label }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, idx) in menuItems"
        :key="idx"
        @click="$emit('add-element', crackPosition, item.value)"
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { ElementCardMenuItem } from "@/pages/letters/elements/ElementCardMenu.vue";

/**
 * Simple add button for creating the first element in a letter.
 * See `ElementCardMenu` for the fancier version.
 */
export default Vue.extend({
  name: "ElementAddButton",

  props: {
    label: { type: String, required: true },
    menuItems: { type: Array as () => ElementCardMenuItem[], required: true },
    crackPosition: { type: Number, default: 0 },
  },
});
</script>
