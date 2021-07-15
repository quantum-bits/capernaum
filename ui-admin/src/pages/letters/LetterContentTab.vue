<template>
  <v-container>
    <v-card v-if="surveyLetter" elevation="0">
      <v-card-title>
        <v-container>
          <v-row align="baseline" justify="space-between">
            <v-col>
              {{ surveyLetter.letter.title }}
            </v-col>
            <v-col>
              <element-add-button
                v-if="letterElements.length === 0"
                label="Add First Element"
                :menu-items="cardMenuItems"
                :crack-position="0"
                @add-element="addElement"
              />
            </v-col>
            <v-col>
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
import prettyFormat from "pretty-format";
import {
  CreateLetterElement,
  CreateLetterElementVariables,
} from "@/graphql/types/CreateLetterElement";
import {
  DeleteLetterElement,
  DeleteLetterElementVariables,
} from "@/graphql/types/DeleteLetterElement";
import ElementAddButton from "@/pages/letters/elements/ElementAddButton.vue";
import { ElementCardMenuItem } from "@/pages/letters/elements/ElementCardMenu.vue";

// Map letter element key (e.g., `image`) to both the component name to be rendered
// and the PK of the corresponding letter element in the database.
const letterElementKeyToDetails = new Map<
  string,
  {
    componentName: string;
    pk: number; // Fetched from server.
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
    ([key, componentName]) => [key, { componentName, pk: -Infinity }]
  )
);

// Declarations of types returned by the vuedraggable "change" event.
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

// Props passed to the ElementCard component behind all type-specific elements.
export interface CardData {
  positionInList: number;
  cardMenuItems: ElementCardMenuItem[];
  showContent: boolean;
  surveyLetter: SurveyLetters_surveyLetters;
}

export default Vue.extend({
  name: "LetterContentTab",

  components: {
    ElementAddButton,
    LetterElementMenu,
    StaticLetterElement,
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
        for (const letterType of result.allLetterTypes) {
          const details = letterElementKeyToDetails.get(letterType.key);
          if (details) {
            details.pk = letterType.id;
          } else {
            throw new Error(`No letterElement ${letterType.key}`);
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

      cardMenuItems: [] as ElementCardMenuItem[],
      showContent: true,
    };
  },

  watch: {
    // Extract details for this letter once they arrive from the server.
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
      this.cardMenuItems = _.map(
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
    // Construct the data to be passed into each of the letter element cards.
    cardData(idx: number): CardData {
      return {
        cardMenuItems: this.cardMenuItems,
        showContent: this.showContent,
        positionInList: idx,
        surveyLetter: this.surveyLetter,
      };
    },

    // Map a letter element to its corresponding component name.
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

    // An element has been moved via drag-and-drop.
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

      // Issue the request to resequence all the elements in the database.
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

    // A letter element has been added to the displayed list.
    handleAddedElement(event: AddedEvent<LetterElement>) {
      console.log(`Added at ${event.newIndex}:`, prettyFormat(event.element));
    },

    // A letter element has been removed from the displayed list.
    handleRemovedElement(event: RemovedEvent<LetterElement>) {
      console.log(
        `Removed from ${event.oldIndex}:`,
        prettyFormat(event.element)
      );
    },

    // `vuedraggable` things something has changed.
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

    // Add a new element of the given type the letter in the appropriate "crack"
    // between/around existing elements.
    addElement(crackPosition: number, elementTypeKey: string): void {
      console.log(`Add ${elementTypeKey} at position ${crackPosition}`);
      const letterElementTypeId =
        letterElementKeyToDetails.get(elementTypeKey)?.pk;
      if (!letterElementTypeId) {
        throw new Error(`Type ${elementTypeKey} not found`);
      }

      // Construct the request to the server for a new element of the proper type.
      const newLetterElement: LetterElementCreateInput = {
        sequence: crackPosition,
        letterId: this.surveyLetter.letter.id,
        letterElementTypeId,
      };

      // Ask the server to add it.
      this.$apollo
        .mutate<CreateLetterElement, CreateLetterElementVariables>({
          mutation: CREATE_LETTER_ELEMENT_MUTATION,
          variables: {
            createInput: newLetterElement,
          },
        })
        .then((result) => {
          // Insert the returned data into the letter element list, which will
          // cause the UI to update reactively.
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

    // Remove an element from the letter.
    removeElement(positionInList: number): void {
      const letterElementId = this.letterElements[positionInList].id;
      console.log(
        `Remove element ${letterElementId} at position ${positionInList}`
      );

      // Send the request to the server.
      this.$apollo
        .mutate<DeleteLetterElement, DeleteLetterElementVariables>({
          mutation: DELETE_LETTER_ELEMENT_MUTATION,
          variables: { id: letterElementId },
        })
        .then((result) => {
          if (result.data?.deleteLetterElement === 1) {
            // Get rid of it from the UI.
            this.letterElements.splice(positionInList, 1);
            console.log("Delete successful");
          } else {
            console.log("Unexpected result", result);
          }
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
