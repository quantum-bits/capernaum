<template>
  <element-card
    :title="`Image (${element.image.title})`"
    :show-content="showContent"
    :sub-title="element.id"
    :show-top-fab="showTopFab"
    :menu-items="menuItems"
  >
    <v-img
      v-if="imageDetails"
      :src="imageDetails.url"
      :alt="imageDetails.title"
      max-height="100"
      :width="400"
      aspect-ratio="1"
      :contain="true"
    />
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";
import { ONE_IMAGE_QUERY } from "@/graphql/images.graphql";
import { OneImage, OneImage_imageDetails } from "@/graphql/types/OneImage";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { FabMenuItem } from "@/pages/letters/elements/ElementFab.vue";

export default Vue.extend({
  name: "ImageElement",

  // eslint-disable-next-line vue/no-unused-components
  components: { ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    showContent: { type: Boolean, default: true },
    showTopFab: { type: Boolean, default: false },
    menuItems: { type: Array as () => FabMenuItem[], required: true },
  },

  data() {
    return {
      imageDetails: {} as OneImage_imageDetails,
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
      .then((result) => (this.imageDetails = result.data.imageDetails));
  },
});
</script>
