<template>
  <v-card v-if="surveyLetter">
    <v-card-title>
      {{ surveyLetter.letter.title }}
      <v-spacer />
      <letter-element-menu
        :letterType="surveyLetter.letterType"
        @click="addElement($event)"
        offset-y
      />
    </v-card-title>

    <v-row>
      <v-col>
        <draggable v-model="letterElements" @change="dragChange">
          <div v-for="element in letterElements" :key="element.id">
            <component
              :is="letterElementToComponent(element)"
              :element="element"
            />
          </div>
        </draggable>
      </v-col>
    </v-row>

    <choose-chart-dialog :survey-letter="surveyLetter" />
    <choose-image-dialog :letter="surveyLetter.letter" />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  SurveyLetters_surveyLetters,
  SurveyLetters_surveyLetters_letter_letterElements as LetterElement,
  SurveyLetters_surveyLetters_letter_letterElements_letterElementType,
} from "@/graphql/types/SurveyLetters";
import LetterElementMenu from "@/pages/letters/LetterElementMenu.vue";
import {
  CREATE_LETTER_ELEMENT_MUTATION,
  DELETE_LETTER_ELEMENT_MUTATION,
} from "@/graphql/letters.graphql";
import { LetterElementCreateInput } from "@/graphql/types/globalTypes";
import Delta from "quill-delta";
import StaticLetterElement from "@/pages/letters/StaticLetterElement.vue";
import ChooseChartDialog from "@/pages/letters/ChooseChartDialog.vue";
import ChooseImageDialog from "@/pages/letters/ChooseImageDialog.vue";
import * as _ from "lodash";
import BoilerplateElement from "./elements/BoilerplateElement.vue";
import SEPredictionElement from "@/pages/letters/elements/SEPredictionElement.vue";
import DimensionChartElement from "@/pages/letters/elements/DimensionChartElement.vue";
import ImageElement from "@/pages/letters/elements/ImageElement.vue";
import SECountElement from "@/pages/letters/elements/SECountElement.vue";
import DemographicsElement from "@/pages/letters/elements/DemographicsElement.vue";
import draggable from "vuedraggable";

const letterElementToComponentMap = new Map<string, string>([
  ["boilerplate-text", "BoilerplateElement"],
  ["scripture-engagement-prediction", "SEPredictionElement"],
  ["dimension-chart", "DimensionChartElement"],
  ["image", "ImageElement"],
  ["scripture-engagement-count", "SECountElement"],
  ["demographics", "DemographicsElement"],
]);

interface ChangeEvent<T> {
  added?: {
    newIndex: number;
    element: T;
  };
  removed?: {
    oldIndex: number;
    element: T;
  };
  moved?: {
    newIndex: number;
    oldIndex: number;
    element: T;
  };
}

export default Vue.extend({
  name: "LetterContentTab",

  components: {
    LetterElementMenu,
    StaticLetterElement,
    ChooseChartDialog,
    ChooseImageDialog,
    BoilerplateElement,
    SEPredictionElement,
    DimensionChartElement,
    ImageElement,
    SECountElement,
    DemographicsElement,
    draggable,
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      letterElements: [] as LetterElement[],
      isNew: false, // true if this is a new letter
    };
  },

  mounted() {
    this.letterElements = _.sortBy(
      this.surveyLetter.letter.letterElements,
      (elt) => elt.sequence
    );
  },

  methods: {
    dragChange(event: ChangeEvent<LetterElement>) {
      console.log("DRAG CHANGE", event);
      if (event.moved) {
        const moved = event.moved;
        console.log(
          `MOVED ${moved.element.letterElementType.key} ${moved.element.id} ${moved.element.sequence} from ${moved.oldIndex} to ${moved.newIndex}`
        );
        console.log(
          this.letterElements.map((elt, idx) => ({
            idx,
            id: elt.id,
            type: elt.letterElementType.key,
            sequence: elt.sequence,
          }))
        );
      }
    },

    letterElementToComponent(letterElement: LetterElement) {
      return letterElementToComponentMap.get(
        letterElement.letterElementType.key
      );
    },

    letterElementDescription(element: LetterElement): string {
      if (
        // FIXME - element.letterElementType.key === LetterElementEnum.CHART &&
        element.surveyDimension !== null
      ) {
        return (
          element.letterElementType.description +
          " -- " +
          element.surveyDimension.title
        );
      } else if (
        // FIXME - element.letterElementType.key === LetterElementEnum.IMAGE &&
        element.image !== null
      ) {
        return (
          element.letterElementType.description + " -- " + element.image.title
        );
      } else {
        return element.letterElementType.description;
      }
    },

    deleteElement(letterElementId: number): void {
      console.log(letterElementId);
      this.$apollo
        .mutate({
          mutation: DELETE_LETTER_ELEMENT_MUTATION,
          variables: {
            id: letterElementId,
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          // FIXME --- this.refreshPage();
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
          //this.errorMessage =
          //  "Sorry, there appears to have been an error.  Please tray again later.";
        });
    },

    resetSequenceProperty(): void {
      // cycles through the elements array and resets the 'order' property to reflect
      // the current ordering of the text boxes
      // this.letterElements.forEach((elt, idx) => (elt.sequence = idx));
    },

    addElement(
      letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    ): void {
      // if (letterElementType.key === LetterElementEnum.CHART) {
      //   console.log("we have a chart!");
      //   //////////// FIXME
      //   // this.chartTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of chart in the dialog....
      //   // this.chooseChartTypeDialog = true;
      // } else if (letterElementType.key === LetterElementEnum.IMAGE) {
      //   console.log("we have an image!");
      //   //////////// FIXME
      //   // this.imageTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of image in the dialog....
      //   // this.chooseImageDialog = true;
      // } else {
      //   console.log("we do not have a chart!");
      //   this.addNonChartElement(letterElementType);
      // }
    },

    addNonChartElement(
      letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    ): void {
      const nextSequence = 42;

      console.log("letter element type: ", letterElementType);
      let createInput: LetterElementCreateInput;
      if (letterElementType.key) {
        /// FIXME- === LetterElementEnum.BOILERPLATE) {
        const emptyTextDelta = new Delta();
        createInput = {
          sequence: nextSequence,
          letterId: this.surveyLetter.letter.id,
          letterElementTypeId: letterElementType.id,
          textDelta: JSON.stringify(emptyTextDelta),
        };
      } else {
        createInput = {
          sequence: nextSequence,
          letterId: this.surveyLetter.letter.id,
          letterElementTypeId: letterElementType.id,
        };
      }

      this.$apollo
        .mutate({
          mutation: CREATE_LETTER_ELEMENT_MUTATION,
          variables: {
            createInput: createInput,
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          // FIXME --------- this.refreshPage();
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    imageId(element: LetterElement): number {
      if (
        // FIXME -- element.letterElementType.key === LetterElementEnum.IMAGE &&
        element.image !== null
      ) {
        return element.image.id;
      } else {
        return -Infinity;
      }
    },
  },
});
</script>
