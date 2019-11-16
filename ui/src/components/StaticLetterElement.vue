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
            <v-img
              v-if="theImage"
              :src="theImage.url"
              :alt="theImage.title"
              max-height="100"
              :width="400"
              aspect-ratio="1"
              :contain="true"
            />
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

import { ONE_IMAGE_QUERY } from "@/graphql/images.graphql";

import { OneImage, OneImage_image } from "@/graphql/types/OneImage";

import { LetterElementEnum, LetterElementType } from "../types/letter.types";

@Component({
  apollo: {
    theImage: {
      query: ONE_IMAGE_QUERY,
      variables() {
        return {
          id: this.imageId
        };
      },
      update(data: OneImage) {
        console.log("image fetched! ", data.image);
        return data.image;
      },
      skip() {
        if (this.imageId === -Infinity) {
          console.log("skipping fetch of image....");
        }
        return this.imageId === -Infinity;
      }
    }
  }
})
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
  @Prop({ default: -Infinity }) imageId!: number;

  letterElements: LetterElementType[] = [];
  theImage: OneImage_image | null = null;

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
