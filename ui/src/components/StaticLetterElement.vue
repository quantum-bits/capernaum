<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{ description }}</h3>
            <!-- https://github.com/vuetifyjs/vuetify-loader/issues/12 -->
            <v-img
              v-if="displayChart"
              :src="require('@/images/spiritual-foci.png')"
              :width="400"
            ></v-img>
          </div>
        </v-card-title>
        <v-card-text>
          <span v-if="displaySEStrategies">
            Auto-generated list of Scripture Engagement strategies that the user
            may find to be helpful.
          </span>
        </v-card-text>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" text color="orange" @click="moveUp">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" text color="orange" @click="moveDown">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import Delta from "quill-delta";

import { LetterElementEnum, LetterElementType } from "../types/letter.types";

@Component({})
export default class StaticLetterElement extends Vue {
  /** Non-boilerplate letter element */
  @Prop() id!: number;
  @Prop() order!: number;
  @Prop() largestSequenceNumber!: number;
  @Prop() smallestSequenceNumber!: number;
  @Prop() initialTextDelta!: Delta; // not actually used in this component, but need to mirror the props of  LetterTextArea.vue
  @Prop({ default: false }) initialEditModeOn!: boolean; // not actually used in this component
  @Prop() letterElementKey!: string;
  @Prop() description!: string;
  @Prop() parentIsFrozen!: boolean;

  letterElements: LetterElementType[] = [];

  @Emit("move-up")
  moveUp() {}

  @Emit("move-down")
  moveDown() {}

  @Emit("delete-element")
  deleteElement() {}

  get showMoveDown() {
    return this.order < this.largestSequenceNumber;
  }

  get showMoveUp() {
    return this.order > this.smallestSequenceNumber;
  }

  get displayChart() {
    return this.letterElementKey === LetterElementEnum.CHART;
  }

  get displaySEStrategies() {
    return (
      this.letterElementKey === LetterElementEnum.BOOLEAN_CALCULATION_RESULTS
    );
  }
}
</script>
