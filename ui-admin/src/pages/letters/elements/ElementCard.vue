<template>
  <v-card outlined class="my-2" elevation="2">
    <v-card-title>
      <v-icon class="mr-2">mdi-drag-vertical</v-icon>
      <span class="blue--text mr-2" v-if="subTitle">{{ subTitle }}</span>
      {{ title }}
      <v-spacer />
      <element-card-menu
        :position-in-list="cardData.positionInList"
        :menu-items="cardData.cardMenuItems"
        @add-element="bubbleAddEvent"
        @remove-element="bubbleRemoveEvent"
      />
    </v-card-title>
    <v-card-text v-if="cardData.showContent">
      <slot />
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import ElementCardMenu from "@/pages/letters/elements/ElementCardMenu.vue";

export default Vue.extend({
  name: "ElementCard",

  components: { ElementCardMenu },

  props: {
    title: { type: String, required: true },
    subTitle: { type: [Number, String] },
    cardData: { type: Object as () => CardData, required: true },
  },

  methods: {
    bubbleAddEvent(crackPosition: number, elementTypeKey: string): void {
      console.log(`BUBBLE: Add ${elementTypeKey} at position ${crackPosition}`);
      this.$parent.$emit("add-element", crackPosition, elementTypeKey);
    },

    bubbleRemoveEvent(positionInList: number) {
      console.log(`BUBBLE: Remove element at position ${positionInList}`);
      this.$parent.$emit("remove-element", positionInList);
    },
  },
});
</script>
