<template>
  <v-card outlined class="my-2" elevation="2">
    <element-fab
      v-if="showTopFab"
      :top="true"
      :crack-position="0"
      :menu-items="cardData.fabMenuItems"
      @add-element="bubbleAddEvent"
    />
    <v-card-title>
      <v-icon class="mr-2">mdi-drag-vertical</v-icon>
      <span class="blue--text mr-2" v-if="subTitle">{{ subTitle }}</span>
      {{ title }}
    </v-card-title>
    <v-card-text v-if="cardData.showContent">
      <slot></slot>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        v-if="cardData.showContent"
        :allow-delete="true"
        @delete-data="bubbleRemoveEvent(cardData.positionInList)"
      />
    </v-card-actions>
    <element-fab
      v-if="cardData.showContent"
      :crack-position="cardData.positionInList + 1"
      :menu-items="cardData.fabMenuItems"
      @add-element="bubbleAddEvent"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ElementFab from "@/pages/letters/elements/ElementAddFab.vue";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";

export default Vue.extend({
  name: "ElementCard",

  components: { EditSaveDeleteCancelButtons, ElementFab },

  props: {
    title: { type: String, required: true },
    subTitle: { type: [Number, String] },
    cardData: { type: Object as () => CardData, required: true },
  },

  computed: {
    showTopFab(): boolean {
      return this.cardData.showContent && this.cardData.positionInList === 0;
    },
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
