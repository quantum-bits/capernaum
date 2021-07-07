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
                :card-data="cardData(idx)"
                @add-element="addElement"
                @remove-element="removeElement"
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
} from "@/graphql/types/SurveyLetters";
import LetterElementMenu from "@/pages/letters/LetterElementMenu.vue";
import {
  CREATE_LETTER_ELEMENT_MUTATION,
  DELETE_LETTER_ELEMENT_MUTATION,
  LETTER_ELEMENT_DETAILS,
  RESEQUENCE_LETTER_ELEMENTS,
} from "@/graphql/letters.graphql";
import { LetterElementCreateInput } from "@/graphql/types/globalTypes";
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
import {
  LetterElementsByType,
  LetterElementsByType_elementsByLetterType,
} from "@/graphql/types/LetterElementsByType";
import { FabMenuItem } from "@/pages/letters/elements/ElementFab.vue";
import prettyFormat from "pretty-format";
import {
  CreateLetterElement,
  CreateLetterElementVariables,
} from "@/graphql/types/CreateLetterElement";

const letterElementKeyToDetails = new Map<
  string,
  {
    componentName: string;
    id: number; // Fetched from server.
  }
>(
  _.map(
    [
      ["boilerplate-text", "BoilerplateElement"],
      ["scripture-engagement-prediction", "SEPredictionElement"],
      ["dimension-chart", "DimensionChartElement"],
      ["image", "ImageElement"],
      ["scripture-engagement-count", "SECountElement"],
      ["demographics", "DemographicsElement"],
    ],
    ([key, componentName]) => [key, { componentName, id: -Infinity }]
  )
);

interface AddedEvent<T> {
  newIndex: number;
  element: T;
}

interface RemovedEvent<T> {
  oldIndex: number;
  element: T;
}

interface MovedEvent<T> {
  newIndex: number;
  oldIndex: number;
  element: T;
}

interface ChangeEvent<T> {
  added?: AddedEvent<T>;
  removed?: RemovedEvent<T>;
  moved?: MovedEvent<T>;
}

export interface CardData {
  positionInList: number;
  fabMenuItems: FabMenuItem[];
  showContent: boolean;
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
    letterElementDetails: {
      query: LETTER_ELEMENT_DETAILS,
      update(result: LetterElementsByType) {
        // Hang on to the elements in the current letter.
        this.elementsByLetterType = result.elementsByLetterType;

        // Update the lookup table with PKs from the database.
        for (const lt of result.allLetterTypes) {
          const details = letterElementKeyToDetails.get(lt.key);
          if (details) {
            details.id = lt.id;
          } else {
            throw new Error(`No letterElement ${lt.key}`);
          }
        }
        console.log(prettyFormat(letterElementKeyToDetails));
      },
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
      letterElements: [] as LetterElement[],
      isNew: false,

      fabMenuItems: [] as FabMenuItem[],
      showContent: true,
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
    cardData(idx: number): CardData {
      return {
        fabMenuItems: this.fabMenuItems,
        showContent: this.showContent,
        positionInList: idx,
      };
    },

    handleMovedElement(event: MovedEvent<LetterElement>) {
      console.log(
        `Moved ${event.oldIndex} to ${event.newIndex}:`,
        prettyFormat(event.element)
      );
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
    },

    handleAddedElement(event: AddedEvent<LetterElement>) {
      console.log(`Added at ${event.newIndex}:`, prettyFormat(event.element));
    },

    handleRemovedElement(event: RemovedEvent<LetterElement>) {
      console.log(
        `Removed from ${event.oldIndex}:`,
        prettyFormat(event.element)
      );
    },

    dragChange(event: ChangeEvent<LetterElement>) {
      if (event.moved) {
        this.handleMovedElement(event.moved);
      } else if (event.added) {
        this.handleAddedElement(event.added);
      } else if (event.removed) {
        this.handleRemovedElement(event.removed);
      } else {
        throw new Error(`Invalid event: ${event}`);
      }
    },

    addElement(crackPosition: number, elementTypeKey: string): void {
      console.log(`Add ${elementTypeKey} at position ${crackPosition}`);
      const letterElementTypeId =
        letterElementKeyToDetails.get(elementTypeKey)?.id;
      if (!letterElementTypeId) {
        throw new Error(`Type ${elementTypeKey} not found`);
      }
      const newLetterElement: LetterElementCreateInput = {
        sequence: crackPosition,
        letterId: this.surveyLetter.letter.id,
        letterElementTypeId,
      };

      this.$apollo
        .mutate<CreateLetterElement, CreateLetterElementVariables>({
          mutation: CREATE_LETTER_ELEMENT_MUTATION,
          variables: {
            createInput: newLetterElement,
          },
        })
        .then((result) => {
          console.log("RESULT", result);
          if (result.data?.createLetterElement) {
            this.letterElements.splice(
              crackPosition,
              0,
              result.data?.createLetterElement
            );
          } else {
            throw new Error("Failed to retrieve new letter element");
          }
        });
    },

    removeElement(positionInList: number): void {
      console.log(`Remove element at position ${positionInList}`);
      this.letterElements.splice(positionInList, 1);
    },

    letterElementToComponent(letterElement: LetterElement) {
      const details = letterElementKeyToDetails.get(
        letterElement.letterElementType.key
      );
      if (details) {
        return details.componentName;
      } else {
        throw new Error(`Can't find letter element ${letterElement}`);
      }
    },

    // letterElementDescription(element: LetterElement): string {
    //   if (
    //     // FIXME - element.letterElementType.key === LetterElementEnum.CHART &&
    //     element.surveyDimension !== null
    //   ) {
    //     return (
    //       element.letterElementType.description +
    //       " -- " +
    //       element.surveyDimension.title
    //     );
    //   } else if (
    //     // FIXME - element.letterElementType.key === LetterElementEnum.IMAGE &&
    //     element.image !== null
    //   ) {
    //     return (
    //       element.letterElementType.description + " -- " + element.image.title
    //     );
    //   } else {
    //     return element.letterElementType.description;
    //   }
    // },

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

    // resetSequenceProperty(): void {
    //   // cycles through the elements array and resets the 'order' property to reflect
    //   // the current ordering of the text boxes
    //   // this.letterElements.forEach((elt, idx) => (elt.sequence = idx));
    // },

    // addElement(
    //   letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    // ): void {
    //   // if (letterElementType.key === LetterElementEnum.CHART) {
    //   //   console.log("we have a chart!");
    //   //   //////////// FIXME
    //   //   // this.chartTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of chart in the dialog....
    //   //   // this.chooseChartTypeDialog = true;
    //   // } else if (letterElementType.key === LetterElementEnum.IMAGE) {
    //   //   console.log("we have an image!");
    //   //   //////////// FIXME
    //   //   // this.imageTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of image in the dialog....
    //   //   // this.chooseImageDialog = true;
    //   // } else {
    //   //   console.log("we do not have a chart!");
    //   //   this.addNonChartElement(letterElementType);
    //   // }
    // },

    // addNonChartElement(
    //   letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    // ): void {
    //   const nextSequence = 42;
    //
    //   console.log("letter element type: ", letterElementType);
    //   let createInput: LetterElementCreateInput;
    //   if (letterElementType.key) {
    //     /// FIXME- === LetterElementEnum.BOILERPLATE) {
    //     const emptyTextDelta = new Delta();
    //     createInput = {
    //       sequence: nextSequence,
    //       letterId: this.surveyLetter.letter.id,
    //       letterElementTypeId: letterElementType.id,
    //       textDelta: JSON.stringify(emptyTextDelta),
    //     };
    //   } else {
    //     createInput = {
    //       sequence: nextSequence,
    //       letterId: this.surveyLetter.letter.id,
    //       letterElementTypeId: letterElementType.id,
    //     };
    //   }
    //
    //   this.$apollo
    //     .mutate({
    //       mutation: CREATE_LETTER_ELEMENT_MUTATION,
    //       variables: {
    //         createInput: createInput,
    //       },
    //     })
    //     .then(({ data }) => {
    //       console.log("done!", data);
    //       // FIXME --------- this.refreshPage();
    //       //this.$emit("letter-created", data.createLetter.id);
    //     })
    //     .catch((error) => {
    //       console.log("there appears to have been an error: ", error);
    //     });
    // },

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
