<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="title font-weight-regular mb-2">{{ description }}</h3>
        <v-img
          v-if="displayChart"
          :src="require('@/images/spiritual-foci.png')"
          :width="400"
        />
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
        Auto-generated list of Scripture Engagement strategies that the user may
        find to be helpful.
      </span>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
      <v-btn v-if="showMoveUp" text color="orange" @click="moveUp">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
      <v-btn v-if="showMoveDown" text color="orange" @click="moveDown">
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ONE_IMAGE_QUERY } from "@/graphql/images.graphql";
import { OneImage, OneImage_imageDetails } from "@/graphql/types/OneImage";

import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";

export default Vue.extend({
  name: "StaticLetterElement",
  apollo: {
    theImage: {
      query: ONE_IMAGE_QUERY,
      variables() {
        return { id: this.imageId };
      },
      update(data: OneImage) {
        console.log("image fetched! ", data.imageDetails);
        return data.imageDetails;
      },
      skip() {
        if (this.imageId === -Infinity) {
          console.log("skipping fetch of image....");
        }
        return this.imageId === -Infinity;
      },
    },
  },

  props: {
    description: { type: String, default: "" },
    id: { type: Number },
    imageId: { type: Number, default: -Infinity },
    initialEditModeOn: { type: Boolean, default: false },
    initialTextDelta: { type: String },
    largestSequenceNumber: { type: Number, default: 0 },
    letterElementKey: { type: String, default: "" },
    order: { type: Number, default: 0 },
    smallestSequenceNumber: { type: Number, default: 0 },
  },

  data() {
    return {
      letterElements: [] as SurveyLetters_surveyLetters_letter_letterElements[],
      theImage: null as OneImage_imageDetails | null,
    };
  },

  methods: {
    moveUp() {
      this.$emit("move-up");
    },

    moveDown() {
      this.$emit("move-down");
    },

    deleteElement() {
      this.$emit("delete-element");
    },
  },

  computed: {
    showMoveDown(): boolean {
      return this.order < this.largestSequenceNumber;
    },

    showMoveUp(): boolean {
      return this.order > this.smallestSequenceNumber;
    },

    displayChart(): boolean {
      return true;
      // FIXME (
      //   this.letterElementKey === LetterElementEnum.CHART ||
      //   this.letterElementKey === LetterElementEnum.DEMOGRAPHICS_CHART
      // );
    },

    displaySEStrategies(): boolean {
      return true;
      // FIXME  - this.letterElementKey === LetterElementEnum.BOOLEAN_CALCULATION_RESULTS
    },
  },
});
</script>
