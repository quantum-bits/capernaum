<template>
  <v-row v-if="surveyLetter">
    <v-col xs10 offset-xs1>
      <h2 class="title font-weight-regular mb-3 mt-5">
        {{ letterContentHeading }}:
      </h2>
    </v-col>
    <v-col xs10 offset-xs1 class="text-xs-right">
      <LetterElementMenu
        :letterType="surveyLetter.letterType"
        @click="addElement($event)"
        offset-y
      />
    </v-col>

    <v-col xs10 offset-xs1>
      <div
        class="form-group ma-4"
        v-for="(element, index) in surveyLetterElements"
        :key="element.id"
      >
        <component
          v-bind:is="letterElement(element.letterElementType.key)"
          :letterElementId="element.id"
          :imageId="imageId(element)"
          :order="element.sequence"
          :initialTextDelta="element.textDelta"
          :largestSequenceNumber="largestSequenceNumber"
          :smallestSequenceNumber="smallestSequenceNumber"
          :letterElementKey="element.letterElementType.key"
          :description="letterElementDescription(element)"
          v-on:move-up="moveUp(index)"
          v-on:move-down="moveDown(index)"
          v-on:delete-element="deleteElement(element.id)"
          v-on:refresh-page="refreshPage()"
          v-on:edit-mode-on="setEditModeOn(element)"
          v-on:edit-mode-off="setEditModeOff(element)"
        />
      </div>
    </v-col>
    <v-col xs10 offset-xs1 class="text-xs-right">
      <LetterElementMenu
        v-if="surveyLetterElements.length > 0"
        :letterType="surveyLetter.letterType"
        @click="addElement($event)"
        offset-y
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {
  SurveyLetters_surveyLetters,
  SurveyLetters_surveyLetters_letter_letterElements,
  SurveyLetters_surveyLetters_letter_letterElements_letterElementType,
} from "@/graphql/types/SurveyLetters";
import LetterElementMenu from "@/pages/compose/LetterElementMenu.vue";
import {
  CREATE_LETTER_ELEMENT_MUTATION,
  DELETE_LETTER_ELEMENT_MUTATION,
  UPDATE_LETTER_ELEMENT_MUTATION,
} from "@/graphql/letters.graphql";
import { LetterElementEnum, LetterTypeEnum } from "@/types/letter.types";
import { LetterElementCreateInput } from "@/graphql/types/globalTypes";
import Delta from "quill-delta";

export default Vue.extend({
  name: "LetterContentTab",

  components: {
    LetterElementMenu,
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      isNew: false, // true if this is a new letter
    };
  },

  computed: {
    surveyLetterElements(): SurveyLetters_surveyLetters_letter_letterElements[] {
      if (this.surveyLetter.letter) {
        return this.surveyLetter.letter
          .letterElements as SurveyLetters_surveyLetters_letter_letterElements[];
      } else {
        return [];
      }
    },

    emailDescription(): string {
      return this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
        ? "Email message to Group Admin"
        : "Email message to respondent";
    },

    largestSequenceNumber(): number {
      let largestSN = -1;
      this.surveyLetterElements.forEach(
        (
          surveyLetterElement: SurveyLetters_surveyLetters_letter_letterElements
        ) => {
          if (largestSN < surveyLetterElement.sequence) {
            largestSN = surveyLetterElement.sequence;
          }
        }
      );
      return largestSN;
    },

    smallestSequenceNumber(): number {
      let smallestSN: number = this.largestSequenceNumber;
      this.surveyLetterElements.forEach(
        (
          surveyLetterElement: SurveyLetters_surveyLetters_letter_letterElements
        ) => {
          if (smallestSN > surveyLetterElement.sequence) {
            smallestSN = surveyLetterElement.sequence;
          }
        }
      );
      return smallestSN;
    },

  },

  methods: {
    // Move code from
    moveUp(index: number): void {
      const letterElements = this.surveyLetterElements;
      let element: SurveyLetters_surveyLetters_letter_letterElements =
        letterElements[index];
      let previousElement: SurveyLetters_surveyLetters_letter_letterElements =
        letterElements[index - 1];
      this.exchangeElements(element, previousElement);
    },

    moveDown(index: number): void {
      const letterElements = this.surveyLetterElements;
      let element: SurveyLetters_surveyLetters_letter_letterElements =
        letterElements[index];
      let nextElement: SurveyLetters_surveyLetters_letter_letterElements =
        letterElements[index + 1];
      this.exchangeElements(element, nextElement);
    },

    letterElementDescription(
      element: SurveyLetters_surveyLetters_letter_letterElements
    ): string {
      if (
        element.letterElementType.key === LetterElementEnum.CHART &&
        element.surveyDimension !== null
      ) {
        return (
          element.letterElementType.description +
          " -- " +
          element.surveyDimension.title
        );
      } else if (
        element.letterElementType.key === LetterElementEnum.IMAGE &&
        element.image !== null
      ) {
        return (
          element.letterElementType.description + " -- " + element.image.title
        );
      } else {
        return element.letterElementType.description;
      }
    },

    exchangeElements(
      letterElement1: SurveyLetters_surveyLetters_letter_letterElements,
      letterElement2: SurveyLetters_surveyLetters_letter_letterElements
    ): void {
      let newSequence1: number = letterElement2.sequence;
      let newSequence2: number = letterElement1.sequence;
      this.$apollo
        .mutate({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: letterElement1.id,
              sequence: newSequence1,
            },
          },
        })
        .then(({ data }) => {
          console.log("done first element!", data);
          // now update second element....
          this.$apollo
            .mutate({
              mutation: UPDATE_LETTER_ELEMENT_MUTATION,
              variables: {
                updateInput: {
                  id: letterElement2.id,
                  sequence: newSequence2,
                },
              },
            })
            .then(({ data }) => {
              console.log("done second element!", data);
              // FIXME ---- this.refreshPage();
              //this.$emit("letter-created", data.createLetter.id);
            })
            .catch((error) => {
              console.log(
                "there appears to have been an error updating the 2nd element: ",
                error
              );
              //this.errorMessage =
              //  "Sorry, there appears to have been an error.  Please tray again later.";
            });
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log(
            "there appears to have been an error updating the 1st element: ",
            error
          );
          //this.errorMessage =
          //  "Sorry, there appears to have been an error.  Please tray again later.";
        });
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
      this.surveyLetterElements.forEach((elt, idx) => (elt.sequence = idx));
    },

    addElement(
      letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    ): void {
      if (letterElementType.key === LetterElementEnum.CHART) {
        console.log("we have a chart!");
        //////////// FIXME
        // this.chartTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of chart in the dialog....
        // this.chooseChartTypeDialog = true;
      } else if (letterElementType.key === LetterElementEnum.IMAGE) {
        console.log("we have an image!");
        //////////// FIXME
        // this.imageTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of image in the dialog....
        // this.chooseImageDialog = true;
      } else {
        console.log("we do not have a chart!");
        this.addNonChartElement(letterElementType);
      }
    },

    // Return the next sequence number larger than those in existing letter elements.
    // If the list of letter elements is empty, return 1.
    nextSequenceNumber(
      letterElements: SurveyLetters_surveyLetters_letter_letterElements[]
    ): number {
      const existingNumbers = letterElements.map((elt) => elt.sequence);
      return Math.max(0, ...existingNumbers) + 1;
    },

    addNonChartElement(
      letterElementType: SurveyLetters_surveyLetters_letter_letterElements_letterElementType
    ): void {
      const nextSequence = this.nextSequenceNumber(this.surveyLetterElements);

      console.log("letter element type: ", letterElementType);
      let createInput: LetterElementCreateInput;
      if (letterElementType.key === LetterElementEnum.BOILERPLATE) {
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

    letterContentHeading(): string {
      return this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
        ? "Content of Group Letter"
        : "Content of Individual Letter";
    },

    letterElement(key: string): string {
      if (key === LetterElementEnum.BOILERPLATE) {
        return "LetterTextArea";
      } else {
        return "StaticLetterElement";
      }
    },

    imageId(
      element: SurveyLetters_surveyLetters_letter_letterElements
    ): number {
      if (
        element.letterElementType.key === LetterElementEnum.IMAGE &&
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
