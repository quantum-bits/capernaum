<template>
  <v-card>
    <v-card-title>Image ({{ element.image.title }})</v-card-title>
    <v-card-text>
      <v-img
        v-if="imageDetails"
        :src="imageDetails.url"
        :alt="imageDetails.title"
        max-height="100"
        :width="400"
        aspect-ratio="1"
        :contain="true"
      />
    </v-card-text>
    <element-buttons />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ElementButtons from "@/pages/letters/elements/ElementButtons.vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import { ONE_IMAGE_QUERY } from "@/graphql/images.graphql";
import { OneImage, OneImage_image } from "@/graphql/types/OneImage";

export default Vue.extend({
  name: "ImageElement",

  components: { ElementButtons },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
  },

  data() {
    return {
      imageDetails: {} as OneImage_image,
    };
  },

  async mounted() {
    this.imageDetails = await this.$apollo
      .query<OneImage>({
        query: ONE_IMAGE_QUERY,
        variables: {
          id: this.element.image?.id,
        },
      })
      .then((result) => (this.imageDetails = result.data.image));
  },
});
</script>
