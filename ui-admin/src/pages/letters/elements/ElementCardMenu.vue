<template>
  <v-menu v-model="menuVisible" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-group v-if="positionInList > 0" v-model="showAddBefore" no-action>
        <template v-slot:prependIcon>
          <v-icon color="primary">mdi-arrow-up-circle-outline</v-icon>
        </template>
        <template v-slot:activator>
          <v-list-item-title> Add Before </v-list-item-title>
        </template>
        <v-list-item
          v-for="(item, idx) in menuItems"
          :key="idx"
          @click="addElement(positionInList, item.value)"
        >
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-item @click="removeElement(positionInList)">
        <v-list-item-icon>
          <v-icon color="error">mdi-minus-circle-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Remove</v-list-item-title>
      </v-list-item>

      <v-list-group v-model="showAddAfter" no-action>
        <template v-slot:prependIcon>
          <v-icon color="primary">mdi-arrow-down-circle-outline</v-icon>
        </template>
        <template v-slot:activator>
          <v-list-item-title> Add After </v-list-item-title>
        </template>
        <v-list-item
          v-for="(item, idx) in menuItems"
          :key="idx"
          @click="addElement(positionInList + 1, item.value)"
        >
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export interface ElementCardMenuItem {
  text: string;
  value: string;
}

export default Vue.extend({
  name: "ElementCardMenu",

  props: {
    menuItems: { type: Array as () => ElementCardMenuItem[], required: true },
    positionInList: { type: Number, required: true },
  },

  data() {
    return {
      menuVisible: false,
      showAddBefore: false,
      showAddAfter: false,
    };
  },

  methods: {
    resetMenu() {
      this.menuVisible = false;
      this.showAddBefore = this.showAddAfter = false;
    },

    // Add element in "crack" between elements. For an `n`-element list:
    //   0 = before first
    //   1 = after first
    //   n = after last
    addElement(crackPosition: number, itemValue: string) {
      console.log(`Add ${itemValue} at ${crackPosition}`);
      this.$emit("add-element", crackPosition, itemValue);
      this.resetMenu();
    },

    removeElement(positionInList: number) {
      console.log(`Remove at ${positionInList}`);
      this.$emit("remove-element", positionInList);
      this.resetMenu();
    },
  },
});
</script>
