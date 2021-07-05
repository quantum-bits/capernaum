<template>
  <v-dialog v-model="chooseImageDialog" persistent max-width="600">
    <v-form ref="form" v-model="imageSelectionValid" lazy-validation>
      <v-card>
        <v-card-title class="headline">Image Letter Element</v-card-title>
        <v-card-text>
          Choose an image from the list
          <v-select
            v-model="selectedImage"
            :items="imageElements"
            :rules="[(v) => !!v || 'Image is required']"
            label="Image"
            return-object
            required
            persistent-hint
            single-line
          />
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="cancelImageSelection()"
            >Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            :disabled="!imageSelectionValid"
            text
            @click="submitImageSelection()"
            >Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { AllImages_imageDetails } from "@/graphql/types/AllImages";
import { ALL_IMAGES_QUERY } from "@/graphql/images.graphql";
import { SelectedItem } from "@/pages/letters/ComposePage.vue";
import { CREATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";
import { SurveyLetters_surveyLetters_letter } from "@/graphql/types/SurveyLetters";

export default Vue.extend({
  name: "ChooseImageDialog",

  props: {
    letter: {
      type: Object as () => SurveyLetters_surveyLetters_letter,
      required: true,
    },
  },

  apollo: {
    imageDetails: {
      query: ALL_IMAGES_QUERY,
      update(data) {
        console.log("ALL IMAGES LOADED");
        return data;
      },
    },
  },

  data() {
    return {
      imageDetails: [] as AllImages_imageDetails[],
      imageSelectionValid: false,
      chooseImageDialog: false,
      selectedImage: null as null | SelectedItem,
      imageTypeElementId: -Infinity, //used when creating an image type of letter element
    };
  },

  computed: {
    imageElements(): SelectedItem[] {
      // FIXME - Refactor to remove this check.
      if (!_.isArray(this.imageDetails)) {
        return [];
      }
      return this.imageDetails.map((image: AllImages_imageDetails) => ({
        text: image.title,
        value: image.id,
      }));
    },
  },

  methods: {
    addImageElement(): void {
      if (this.selectedImage !== null) {
        // selectedImage should not be null, since it is a required element in the form, but
        // typescript was giving an error
        console.log("image id: ", this.selectedImage.value);
        /////////// FIXME const nextSequence = this.nextSequenceNumber(this.surveyLetterElements);

        this.$apollo
          .mutate({
            mutation: CREATE_LETTER_ELEMENT_MUTATION,
            variables: {
              createInput: {
                sequence: 1, //////////// FIXME nextSequence,
                letterId: this.letter.id,
                letterElementTypeId: this.imageTypeElementId,
                imageId: this.selectedImage.value,
              },
            },
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.cancelImageSelection();
            //////////////////// FIXME this.refreshPage();
          })
          .catch((error) => {
            console.log("there appears to have been an error: ", error);
          });
      }
    },

    cancelImageSelection(): void {
      console.log("inside cancel image...", this.$refs.form);
      if (this.$refs.form) {
        (
          this.$refs.form as Vue & {
            resetValidation: () => boolean;
          }
        ).resetValidation();
        (
          this.$refs.form as Vue & {
            reset: () => boolean;
          }
        ).reset();
      } else {
        console.log("no form! ", this.$refs.form);
      }
      this.imageSelectionValid = true;
      this.selectedImage = null;
      this.chooseImageDialog = false;
      this.imageTypeElementId = -Infinity;
    },

    submitImageSelection(): void {
      console.log("image selection: ", this.selectedImage);
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        console.log("form is valid!");
        this.addImageElement();
      } else {
        console.log("form is not valid!");
      }
    },
  },
});
</script>
