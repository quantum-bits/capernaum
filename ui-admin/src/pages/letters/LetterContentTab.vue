<template>
  <v-container>
    <v-card v-if="surveyLetter" elevation="0">
      <v-card-title>
        <v-container>
          <v-row align="baseline" justify="space-between">
            <v-col cols="auto">
              {{ surveyLetter.letter.title }}
            </v-col>
            <v-col cols="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-switch
                    v-model="showContent"
                    label="Show Content"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>Drag-and-drop is easier with content hidden.</span>
              </v-tooltip>
            </v-col>
            <v-col cols="auto">
              <letter-element-menu
                :letterType="surveyLetter.letterType"
                @click="addElement($event)"
                offset-y
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <v-row>
        <v-col>
          <draggable v-model="letterElements" @change="dragChange">
            <div v-for="(element, idx) in letterElements" :key="element.id">
              <component
                :is="letterElementToComponent(element)"
                :element="element"
                :showContent="showContent"
                :showTopFab="idx === 0"
                :menu-items="fabMenuItems"
              />
            </div>
          </draggable>
        </v-col>
      </v-row>

      <choose-chart-dialog :survey-letter="surveyLetter" />
      <choose-image-dialog :letter="surveyLetter.letter" />
    </v-card>
  </v-container>
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
  LETTER_ELEMENTS_BY_TYPE,
  RESEQUENCE_LETTER_ELEMENTS,
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
import { Resequence, ResequenceVariables } from "@/graphql/types/Resequence";
import { LetterElementsByType_elementsByLetterType } from "@/graphql/types/LetterElementsByType";
import { FabMenuItem } from "@/pages/letters/elements/ElementFab.vue";

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

  apollo: {
    elementsByLetterType: {
      query: LETTER_ELEMENTS_BY_TYPE,
    },
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      elementsByLetterType: [] as LetterElementsByType_elementsByLetterType[],
      fabMenuItems: [] as FabMenuItem[],
      letterElements: [] as LetterElement[],
      showContent: true,
      isNew: false, // true if this is a new letter
    };
  },

  watch: {
    elementsByLetterType(newVal) {
      const letterElements = _.find(newVal, [
        "key",
        this.surveyLetter.letterType.key,
      ]);
      if (!letterElements) {
        throw new Error(
          `Can't find elements for letter type '${this.surveyLetter.letterType.key}'`
        );
      }
      this.fabMenuItems = _.map(
        _.sortBy(letterElements.letterElementTypes, ["description"]),
        (elementTypes) => ({
          text: elementTypes.description,
          value: elementTypes.key,
        })
      );
    },
  },

  mounted() {
    this.letterElements = _.sortBy(
      this.surveyLetter.letter.letterElements,
      (elt) => elt.sequence
    );
  },

  methods: {
    dragChange(event: ChangeEvent<LetterElement>) {
      if (event.moved) {
        console.log(
          this.letterElements.map((elt, idx) => ({
            idx,
            id: elt.id,
            type: elt.letterElementType.key,
            sequence: elt.sequence,
          }))
        );

        this.$apollo
          .mutate<Resequence, ResequenceVariables>({
            mutation: RESEQUENCE_LETTER_ELEMENTS,
            variables: {
              letterElementIds: _.map(this.letterElements, (elt) => elt.id),
            },
          })
          .then((result) => {
            console.log("result", result.data?.resequenceLetterElements);
          })
          .catch((err) => {
            console.error(`Something went wrong: ${err}`);
            throw err;
          });
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
