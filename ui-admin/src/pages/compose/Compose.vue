<template>
  <v-container>
    <page-header title="Compose Letter" />
    <v-row justify="center">
      <choose-chart-dialog
        :visible="isChartDialogVisible"
        :survey-letter="surveyLetter"
      />
    </v-row>

    <v-row justify="center">
      <choose-image-dialog :the-letter="surveyLetter.letter" />
    </v-row>

    <div v-if="surveyLetter.letter">
      <v-row row wrap>
        <v-col xs7 offset-xs1>
          <!--<h1 class="headline mb-3">{{ name }}</h1>-->
          <h2 class="title font-weight-regular mb-1">
            Letter:
            <span class="font-weight-light">{{
              surveyLetter.letter.title
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Description:
            <span class="font-weight-light">{{
              surveyLetter.letter.description
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Letter Type:
            <span class="font-weight-light">{{
              surveyLetter.letterType.description
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Survey:
            <span class="font-weight-light">
              {{ surveyLetter.survey.qualtricsName }}
            </span>
          </h2>
          <h2 class="title font-weight-regular mb-5">
            Last Update:
            <span class="font-weight-light">
              {{ surveyLetter.letter.updated | standardDateTime }}
            </span>
          </h2>
        </v-col>
        <v-col class="text-xs-right">
          <v-btn color="primary" dark @click="toggleEditMode"> Edit </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-if="surveyLetter && editModeOn">
      <LetterInfoForm
        :id="surveyLetter.letter.id"
        :surveyId="surveyLetter.letter.survey.id"
        :initialTitle="surveyLetter.letter.title"
        :initialDescription="surveyLetter.letter.description"
        :letterTypeDescription="surveyLetter.letterType.description"
        :isNew="isNew"
        v-on:letter-info-updated="letterInfoUpdated"
      >
      </LetterInfoForm>
    </div>
    <div v-if="letterIsNewAndEditModeOn">
      <LetterInfoForm
        :isNew="isNew"
        v-on:letter-created="newLetterCreated($event)"
      >
      </LetterInfoForm>
    </div>
    <div v-if="surveyLetter">
      <v-row>
        <v-col>
          <h2 class="title font-weight-regular mb-1">
            Boolean Association Table: NOT HERE ANY LONGER
            <!-- FIXME --->
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2 class="title font-weight-regular mb-3 mt-4">Text for Email:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <LetterTextArea
            :letterId="surveyLetter.letter.id"
            :initialTextDelta="surveyLetter.letter.emailMessage"
            :description="emailDescription"
            :isEmailText="'true'"
            v-on:edit-mode-on="setEmailEditModeOn()"
            v-on:edit-mode-off="setEmailEditModeOff()"
          />
        </v-col>
      </v-row>
    </div>

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
    <!--
          Next:
              - decide on specifics of how to add another text box...do it on the fly?  should probably update it every time the user hits "save"
              - might need to update the db every time a change is made (to the order, too)
    
              - ordering within categories for letters (order by survey, and then more ordering below this level)
    
              - IMPT(?) need to do something to have multiple vue2-editor instances at the same time(!)
    
              - if the letter contains the "SE strategies for user" element, and the boolean association
              table is dropped for that letter, then the "SE strategies for user" element should also be dropped (or maybe
              the user should get a warning message or something)
          -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Route, RawLocation } from "vue-router";
import LetterTextArea from "../../components/LetterTextArea.vue";
import StaticLetterElement from "../../components/StaticLetterElement.vue";
import LetterInfoForm from "../../components/LetterInfoForm.vue";
import { LetterElementEnum, LetterTypeEnum } from "@/types/letter.types";
import { LetterElementCreateInput } from "@/graphql/types/globalTypes";
import {
  CREATE_LETTER_ELEMENT_MUTATION,
  DELETE_LETTER_ELEMENT_MUTATION,
  UPDATE_LETTER_ELEMENT_MUTATION,
} from "@/graphql/letters.graphql";
import LetterElementMenu from "@/components/LetterElementMenu.vue";
import AssociationTable from "../surveys/PredictionTableTab.vue";
import SpinnerBtn from "@/components/buttons/SpinnerButton.vue";
import Delta from "quill-delta/dist/Delta";
import PageHeader from "@/pages/PageHeader.vue";
import {
  SurveyLetters,
  SurveyLetters_surveyLetters,
  SurveyLetters_surveyLetters_letter,
  SurveyLetters_surveyLetters_letter_letterElements,
  SurveyLetters_surveyLetters_letter_letterElements_letterElementType,
} from "@/graphql/types/SurveyLetters";
import { SURVEY_LETTERS_QUERY } from "@/graphql/surveys.graphql";
import ChooseChartDialog from "@/pages/compose/ChooseChartDialog.vue";
import ChooseImageDialog from "@/pages/compose/ChooseImageDialog.vue";

interface LetterElement
  extends SurveyLetters_surveyLetters_letter_letterElements {
  editModeOn: boolean;
  isNew: boolean;
  key: string;
}

export interface SelectedItem {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "ComposePage",

  components: {
    ChooseChartDialog,
    ChooseImageDialog,
    LetterTextArea,
    StaticLetterElement,
    LetterInfoForm,
    LetterElementMenu,
    AssociationTable,
    SpinnerBtn,
    PageHeader,
  },

  created() {
    const surveyLetterId = this.$route.params.surveyLetterId;
    if (!surveyLetterId) {
      throw new Error("No survey letter ID supplied in URL");
    }

    this.$apollo
      .query<SurveyLetters>({
        query: SURVEY_LETTERS_QUERY,
        variables: {
          id: parseInt(surveyLetterId),
        },
      })
      .then((result) => {
        this.surveyLetter = result.data.surveyLetters[0];
        console.info(
          "SURVEY LETTER LOADED",
          this.surveyLetter.letter.title,
          this.surveyLetter.survey.qualtricsName
        );
      })
      .catch((err) => {
        throw err;
      });
  },

  data() {
    return {
      isChartDialogVisible: false,
      isImageDialogVisible: false,

      surveyLetter: {} as SurveyLetters_surveyLetters,

      // OLD STUFF
      allowHideTable: true,
      tableIsHidden: true,
      isNew: false, // true if this is a new letter
      editModeOn: false,
      confirmDialog: null,
      emailEditModeOn: false,

      name: "",
      generatingPDF: false,
    };
  },

  computed: {
    surveyLetterElements(): LetterElement[] {
      if (this.surveyLetter.letter) {
        return this.surveyLetter.letter.letterElements as LetterElement[];
      } else {
        return [];
      }
    },

    emailDescription(): string {
      return this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
        ? "Email message to Group Admin"
        : "Email message to respondent";
    },

    letterContentHeading(): string {
      return this.surveyLetter.letterType.key === LetterTypeEnum.GROUP
        ? "Content of Group Letter"
        : "Content of Individual Letter";
    },

    letterIsNewAndEditModeOn(): boolean {
      return this.isNew && this.editModeOn;
    },

    largestSequenceNumber(): number {
      let largestSN = -1;
      this.surveyLetterElements.forEach(
        (surveyLetterElement: LetterElement) => {
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
        (surveyLetterElement: LetterElement) => {
          if (smallestSN > surveyLetterElement.sequence) {
            smallestSN = surveyLetterElement.sequence;
          }
        }
      );
      return smallestSN;
    },

    allEditsSaved(): boolean {
      console.log("email edit mode on:", this.emailEditModeOn);
      let editsSaved = !this.emailEditModeOn;
      // FIXME - no edit mode in letterElement
      // this.surveyLetter.letter.letterElements.forEach((letterElement) => {
      // if (letterElement.editModeOn) {
      //   editsSaved = false;
      // }
      // });
      console.log("edits saved?", editsSaved);
      return editsSaved;
    },
  },

  methods: {
    showTable(): void {
      this.tableIsHidden = false;
    },

    hideTable(): void {
      this.tableIsHidden = true;
    },

    // Move code from
    moveUp(index: number): void {
      const letterElements = this.surveyLetterElements;
      let element: LetterElement = letterElements[index];
      let previousElement: LetterElement = letterElements[index - 1];
      this.exchangeElements(element, previousElement);
    },

    moveDown(index: number): void {
      const letterElements = this.surveyLetterElements;
      let element: LetterElement = letterElements[index];
      let nextElement: LetterElement = letterElements[index + 1];
      this.exchangeElements(element, nextElement);
    },

    exchangeElements(
      letterElement1: LetterElement,
      letterElement2: LetterElement
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
              this.refreshPage();
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
          this.refreshPage();
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
    nextSequenceNumber(letterElements: LetterElement[]): number {
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
          this.refreshPage();
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    refreshPage(): void {
      /////////// FIX ME
      console.error("REFRESH PAGE");
      // this.$apollo.queries.surveyLetter.letter.refetch().then(({ data }) => {
      //   console.log("letter data refetched! ", data);
      // });
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

    setEditModeOn(element: LetterElement): void {
      element.editModeOn = true;
      console.log("edit mode on!", this.surveyLetter.letter.letterElements);
    },

    setEditModeOff(element: LetterElement): void {
      element.editModeOn = false;
      console.log("edit mode off!");
    },

    setEmailEditModeOn(): void {
      this.emailEditModeOn = true;
    },

    setEmailEditModeOff(): void {
      this.emailEditModeOn = false;
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

    toggleEditMode(): void {
      this.editModeOn = true;
    },

    letterInfoUpdated(): void {
      // letter information has been successfully updated....
      console.log("FIX ME ----- letter info updated!");
      //////////// FIXME
      // this.$apollo.queries.surveyLetter.letter.refetch().then(({ data }) => {
      //   console.log("survey data refetched! ", data);
      // });
      this.editModeOn = false;
    },

    newLetterCreated(id: number): void {
      // letter information has been successfully created or updated....reload the page, but now with the appropriate letterId
      console.log("new letter created!");
      console.log("id: ", id);
      let idString: string = id.toString();
      this.editModeOn = false;
      this.isNew = false;
      this.$router.push({ name: "compose", params: { letterId: idString } });
      // now need to refresh the page; this seems to work, but not sure if it's the right way to do this....
      //this.$router.go(0);
    },

    beforeRouteUpdate(
      to: Route,
      from: Route,
      next: (
        to?: RawLocation | false | ((vm: Vue.Component) => any) | void
      ) => void
    ): void {
      console.log("before route update!");
      this.name = to.params.name;
      next();
    },

    beforeRouteLeave(
      to: Route,
      from: Route,
      next: (
        to?: RawLocation | false | ((vm: Vue.Component) => any) | void
      ) => void
    ): void {
      console.log("inside before route leave!");
      if (!this.allEditsSaved) {
        const answer = window.confirm(
          "Do you really want to leave? You have unsaved changes in Boilerplate elements and/or the email message!"
        );
        if (answer) {
          next();
        } else {
          next(false);
        }
      } else {
        next();
      }
    },

    // assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
    mounted(): void {
      this.name = this.$route.params.name;
      if (this.$route.params.letterId === undefined) {
        // launch form for creating a new letter
        this.editModeOn = true;
        this.isNew = true;
        console.log("new letter....");
      }
    },
  },
});

// Credits:
//   https://github.com/kaorun343/vue-property-decorator/issues/38
//   https://jsfiddle.net/jjloneman/e5a6L27u/26/
//   https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
//   https://stackoverflow.com/questions/52109471/typescript-in-vue-property-validate-does-not-exist-on-type-vue-element/52109899
//   https://stackoverflow.com/questions/52109471/typescript-in-vue-property-validate-does-not-exist-on-type-vue-element/52109899
//   https://stackoverflow.com/questions/56901736/vue-router-hooks-not-triggered-in-component-using-typescript
//   https://stackoverflow.com/questions/56901736/vue-router-hooks-not-triggered-in-component-using-typescript
//   https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
//   https://www.w3schools.com/jsref/jsref_tostring_number.asp
//   https://www.youtube.com/watch?v=Y3S7KShrRX0
</script>
