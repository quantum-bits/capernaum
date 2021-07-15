<template>
  <element-card :title="title" :sub-title="element.id" :card-data="cardData">
    <v-row>
      <v-col>
        <v-img
          v-if="selectedImage"
          :src="selectedImage.url"
          :alt="selectedImage.title"
          max-height="100"
          :width="400"
          aspect-ratio="1"
          :contain="true"
      /></v-col>
      <v-col>
        <v-select
          :disabled="!inEditMode"
          label="Choose an image"
          :items="availableImages"
          v-model="selectedImageId"
        />
      </v-col>
    </v-row>

    <template v-slot:actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        @enter-edit-mode="inEditMode = true"
        @leave-edit-mode="inEditMode = false"
        :is-data-valid="selectedImageId !== null"
        :is-data-dirty="selectedImageId !== savedImageId"
        @backup-data="savedImageId = selectedImageId"
        @restore-data="selectedImageId = savedImageId"
        @persist-data="saveImage"
      />
    </template>
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import { ALL_IMAGES_QUERY } from "@/graphql/images.graphql";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";
import * as _ from "lodash";
import { AllImages_imageDetails } from "@/graphql/types/AllImages";
import {
  UpdateLetterElement,
  UpdateLetterElementVariables,
} from "@/graphql/types/UpdateLetterElement";
import { UPDATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";

interface Selection {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "ImageElement",

  components: { EditSaveDeleteCancelButtons, ElementCard },

  apollo: {
    allImages: {
      query: ALL_IMAGES_QUERY,
      update(data) {
        console.log("ALL IMAGES", data);
        return data.imageDetails;
      },
    },
  },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    cardData: { type: Object as () => CardData, required: true },
  },

  data() {
    return {
      inEditMode: false,
      allImages: [] as AllImages_imageDetails[],
      selectedImageId: this.element.image?.id || undefined,
      savedImageId: undefined as number | undefined,
    };
  },

  computed: {
    title(): string {
      const title = this.selectedImage?.title;
      return `Image (${title || "none"})`;
    },

    availableImages(): Selection[] {
      return this.allImages.map((image) => ({
        text: image.title,
        value: image.id,
      }));
    },

    selectedImage(): AllImages_imageDetails | undefined {
      if (this.selectedImageId) {
        return _.find(
          this.allImages,
          (image) => image.id === this.selectedImageId
        );
      } else {
        return undefined;
      }
    },
  },

  methods: {
    saveImage() {
      console.log("Save image", this.selectedImage);
      this.$apollo
        .mutate<UpdateLetterElement, UpdateLetterElementVariables>({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: this.element.id,
              imageId: this.selectedImageId,
            },
          },
        })
        .catch((error) => {
          console.error(`Save failed: ${error}`);
          throw error;
        });
    },
  },
});
</script>
