<template>
  <v-container>
    <template>
      <v-row justify="center">
        <v-dialog v-model="chooseChartTypeDialog" persistent max-width="600">
          <v-form ref="form" v-model="chartSelectionValid" lazy-validation>
            <v-card>
              <v-card-title class="headline">Chart Letter Element</v-card-title>
              <v-card-text>
                Choose a custom type of chart from the list
                <v-select
                  v-model="selectedSurveyDimension"
                  :items="chartElements"
                  :rules="[v => !!v || 'Chart type is required']"
                  label="Type of Chart"
                  return-object
                  required
                  persistent-hint
                  single-line
                />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn
                  color="green darken-1"
                  text
                  @click="cancelChartSelection()"
                  >Cancel
                </v-btn>
                <v-btn
                  color="green darken-1"
                  :disabled="!chartSelectionValid"
                  text
                  @click="submitChartSelection()"
                  >Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </template>
    <v-layout v-if="letterExistsAndIsFrozen" class="mb-3">
      <v-flex xs10 offset-xs1>
        <v-alert :value="true" type="info">
          Note that this letter has been frozen -- it is no longer editable.
        </v-alert>
      </v-flex>
    </v-layout>
    <div v-if="letterExistsAndEditModeOff">
      <v-layout row wrap>
        <v-flex xs7 offset-xs1>
          <!--<h1 class="headline mb-3">{{ name }}</h1>-->
          <h2 class="title font-weight-regular mb-1">
            Letter:
            <span class="font-weight-light">{{ letter.title }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Description:
            <span class="font-weight-light">{{ letter.description }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Survey:
            <span class="font-weight-light">{{
              theLetter.survey.qualtricsName
            }}</span>
          </h2>
          <h2 class="title font-weight-regular mb-1">
            Boolean Association Table:
            <span v-if="predictionTableEntriesExist" class="font-weight-light"
              >{{ theLetter.tableEntries.length }} entries</span
            >
            <span v-else class="font-weight-light"> None </span>
          </h2>
          <h2 class="title font-weight-regular mb-5">
            Last Update:
            <span class="font-weight-light">{{
              letter.updated | dateAndTime
            }}</span>
          </h2>
        </v-flex>
        <v-flex v-if="!surveyLetterIsFrozen" xs3 class="text-xs-right">
          <v-btn color="primary" dark @click="toggleEditMode">
            Edit
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
    <div v-if="letterExistsAndEditModeOn">
      <LetterInfoForm
        :id="letter.id"
        :initialTitle="letter.title"
        :initialDescription="letter.description"
        :initialSurveyId="letter.survey.id"
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

    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <h2 class="title font-weight-regular mb-3 mt-3">Content of Letter:</h2>
      </v-flex>
      <v-flex xs10 offset-xs1 class="text-xs-right">
        <v-btn color="primary" dark @click="viewPDF">
          View PDF
        </v-btn>
        <LetterElementMenu
          v-if="!surveyLetterIsFrozen"
          @click="addElement($event)"
          offset-y
        />
      </v-flex>

      <v-flex xs10 offset-xs1>
        <!-- https://www.youtube.com/watch?v=Y3S7KShrRX0 -->
        <div
          class="form-group ma-4"
          v-for="(element, index) in surveyLetterElements"
          :key="element.id"
        >
          <component
            v-bind:is="letterElement(element.letterElementType.key)"
            :id="element.id"
            :order="element.sequence"
            :initialTextDelta="element.textDelta"
            :initialEditModeOn="element.editModeOn"
            :numItems="surveyLetterElements.length"
            :largestSequenceNumber="largestSequenceNumber"
            :smallestSequenceNumber="smallestSequenceNumber"
            :letterElementKey="element.letterElementType.key"
            :description="element.letterElementType.description"
            :parentIsFrozen="surveyLetterIsFrozen"
            v-on:move-up="moveUp(index)"
            v-on:move-down="moveDown(index)"
            v-on:delete-element="deleteElement(element.id)"
            v-on:refresh-page="refreshPage()"
          ></component>
        </div>
      </v-flex>

      <v-flex xs10 offset-xs1 class="text-xs-right">
        <v-btn
          v-if="surveyLetterElements.length > 0"
          color="primary"
          dark
          @click="viewPDF"
        >
          View PDF
        </v-btn>
        <LetterElementMenu
          v-if="surveyLetterElements.length > 0 && !surveyLetterIsFrozen"
          @click="addElement($event)"
          offset-y
        />
      </v-flex>
    </v-layout>
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
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";

import LetterTextArea from "../components/LetterTextArea.vue";
import StaticLetterElement from "../components/StaticLetterElement.vue";
import LetterInfoForm from "../components/LetterInfoForm.vue";

import { LetterElementEnum } from "../types/letter.types";
//import { BooleanAssociationBriefType } from "../types/association-table.types";
import { LetterElementCreateInput } from "@/graphql/types/globalTypes";

import {
  CREATE_LETTER_ELEMENT_MUTATION,
  DELETE_LETTER_ELEMENT_MUTATION,
  ONE_LETTER_QUERY,
  UPDATE_LETTER_ELEMENT_MUTATION
} from "@/graphql/letters.graphql";
import LetterElementMenu from "@/components/LetterElementMenu.vue";

import {
  OneLetter,
  OneLetter_letter,
  OneLetter_letter_letterElements,
  OneLetter_letter_letterElements_letterElementType
} from "@/graphql/types/OneLetter";
import Delta from "quill-delta/dist/Delta";

interface LetterElement extends OneLetter_letter_letterElements {
  editModeOn: boolean;
  isNew: boolean;
  key: string;
}

@Component({
  components: {
    LetterTextArea,
    StaticLetterElement,
    LetterInfoForm,
    LetterElementMenu
  },
  apollo: {
    theLetter: {
      query: ONE_LETTER_QUERY,
      variables() {
        console.log("route params: ", parseInt(this.$route.params.letterId));
        return {
          letterId: parseInt(this.$route.params.letterId)
        };
      },
      update(data: OneLetter) {
        const elements = data.letter.letterElements as LetterElement[];
        for (let box of elements) {
          box.editModeOn = false;
          box.isNew = false;
        }
        console.log("letter: ", data.letter);
        this.letterExists = true;
        return data.letter;
      },
      skip() {
        if (this.$route.params.letterId === undefined) {
          console.log("skipping fetch for now....");
        }
        return this.$route.params.letterId === undefined;
      }
    }
  }
})
export default class Compose extends Vue {
  isNew: boolean = false; // true if this is a new letter
  editModeOn: boolean = false;
  chooseChartTypeDialog: boolean = false;
  chartSelectionValid: boolean = false;
  selectedSurveyDimension: null | any = null;
  chartTypeElementId: number = -1; //used when creating a chart type of letter element

  name: string = "";
  letterExists: boolean = false;

  theLetter: OneLetter_letter = {
    id: -1,
    title: "",
    description: "",
    scriptureEngagementPractices: [],
    updated: "",
    isFrozen: false,
    tableEntries: [],
    letterElements: [],
    survey: {
      id: -1,
      title: "",
      qualtricsId: "",
      qualtricsName: "",
      surveyDimensions: []
    }
  };

  //booleanAssociation: BooleanAssociationBriefType | null = null;

  get predictionTableEntriesExist() {
    if (this.theLetter) {
      return this.theLetter.tableEntries.length > 0;
    } else {
      return false;
    }
  }

  get letter() {
    if (this.theLetter) {
      return this.theLetter;
    } else {
      throw Error("Survey letter not yet defined.");
    }
  }

  get surveyLetterElements(): LetterElement[] {
    if (this.theLetter) {
      return this.theLetter.letterElements as LetterElement[];
    } else {
      return [];
    }
  }

  get chartElements() {
    return this.theLetter.survey.surveyDimensions.map(surveyDimension => ({
      text: surveyDimension.title,
      value: surveyDimension.id
    }));
  }

  get survey() {
    if (this.theLetter) {
      return this.theLetter.survey;
    } else {
      throw Error("Survey letter not yet defined.");
    }
  }

  get surveyLetterIsFrozen() {
    return this.theLetter && this.theLetter.isFrozen;
  }

  get letterExistsAndIsFrozen() {
    if (this.letterExists) {
      return this.theLetter.isFrozen;
    } else {
      return false;
    }
    // could possibly use return letter !== null && letter.isFrozen, but not sure if this is safe....
  }

  get letterExistsAndEditModeOff() {
    if (this.letterExists) {
      return !this.editModeOn;
    } else {
      return false;
    }
  }

  get letterExistsAndEditModeOn() {
    if (this.letterExists) {
      return this.editModeOn;
    } else {
      return false;
    }
  }

  get letterIsNewAndEditModeOn() {
    return this.isNew && this.editModeOn;
  }

  get largestSequenceNumber() {
    let largestSN: number = -1;
    this.surveyLetterElements.forEach(surveyLetterElement => {
      if (largestSN < surveyLetterElement.sequence) {
        largestSN = surveyLetterElement.sequence;
      }
    });
    return largestSN;
  }

  get smallestSequenceNumber() {
    let smallestSN: number = this.largestSequenceNumber;
    this.surveyLetterElements.forEach(surveyLetterElement => {
      if (smallestSN > surveyLetterElement.sequence) {
        smallestSN = surveyLetterElement.sequence;
      }
    });
    return smallestSN;
  }

  cancelChartSelection() {
    (this.$refs.form as any).resetValidation();
    this.chartSelectionValid = true;
    this.selectedSurveyDimension = null;
    this.chooseChartTypeDialog = false;
    this.chartTypeElementId = -1;
  }

  submitChartSelection() {
    console.log("chart selection: ", this.selectedSurveyDimension);
    if ((this.$refs.form as any).validate()) {
      console.log("form is valid!");
      this.addChartElement();
    } else {
      console.log("form is not valid!");
    }
  }

  // Move code from
  //   https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
  moveUp(index: number) {
    const letterElements = this.surveyLetterElements;
    let element: LetterElement = letterElements[index];
    let previousElement: LetterElement = letterElements[index - 1];
    this.exchangeElements(element, previousElement);
  }

  moveDown(index: number) {
    const letterElements = this.surveyLetterElements;
    let element: LetterElement = letterElements[index];
    let nextElement: LetterElement = letterElements[index + 1];
    this.exchangeElements(element, nextElement);
  }

  exchangeElements(
    letterElement1: LetterElement,
    letterElement2: LetterElement
  ) {
    let newSequence1: number = letterElement2.sequence;
    let newSequence2: number = letterElement1.sequence;
    this.$apollo
      .mutate({
        mutation: UPDATE_LETTER_ELEMENT_MUTATION,
        variables: {
          updateInput: {
            id: letterElement1.id,
            sequence: newSequence1
          }
        }
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
                sequence: newSequence2
              }
            }
          })
          .then(({ data }) => {
            console.log("done second element!", data);
            this.refreshPage();
            //this.$emit("letter-created", data.createLetter.id);
          })
          .catch(error => {
            console.log(
              "there appears to have been an error updating the 2nd element: ",
              error
            );
            //this.errorMessage =
            //  "Sorry, there appears to have been an error.  Please tray again later.";
          });
        //this.$emit("letter-created", data.createLetter.id);
      })
      .catch(error => {
        console.log(
          "there appears to have been an error updating the 1st element: ",
          error
        );
        //this.errorMessage =
        //  "Sorry, there appears to have been an error.  Please tray again later.";
      });
  }

  deleteElement(letterElementId: number) {
    console.log(letterElementId);
    this.$apollo
      .mutate({
        mutation: DELETE_LETTER_ELEMENT_MUTATION,
        variables: {
          id: letterElementId
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
        this.refreshPage();
        //this.$emit("letter-created", data.createLetter.id);
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
        //this.errorMessage =
        //  "Sorry, there appears to have been an error.  Please tray again later.";
      });
  }

  resetSequenceProperty() {
    // cycles through the elements array and resets the 'order' property to reflect
    // the current ordering of the text boxes
    this.surveyLetterElements.forEach((elt, idx) => (elt.sequence = idx));
  }

  addElement(
    letterElementType: OneLetter_letter_letterElements_letterElementType
  ) {
    if (letterElementType.key === LetterElementEnum.CHART) {
      console.log("we have a chart!");
      this.chartTypeElementId = letterElementType.id; //will use this later on, after choosing a particular type of chart in the dialog....
      this.chooseChartTypeDialog = true;
    } else {
      console.log("we do not have a chart!");
      this.addNonChartElement(letterElementType);
    }
  }

  addChartElement() {
    console.log("survey dimension id: ", this.selectedSurveyDimension.value);
    const letterElements = this.surveyLetterElements;
    let maxSequence: number = -1; //assuming the max sequence will be 0 or greater....
    letterElements.forEach(letterElement => {
      if (maxSequence < letterElement.sequence) {
        maxSequence = letterElement.sequence;
      }
    });
    let newSequence: number = maxSequence + 1;
    this.$apollo
      .mutate({
        mutation: CREATE_LETTER_ELEMENT_MUTATION,
        variables: {
          createInput: {
            sequence: newSequence,
            letterId: this.theLetter.id,
            letterElementTypeId: this.chartTypeElementId,
            surveyDimensionId: this.selectedSurveyDimension.value
          }
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
        this.cancelChartSelection();
        this.refreshPage();
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
      });
  }

  addNonChartElement(
    letterElementType: OneLetter_letter_letterElements_letterElementType
  ) {
    const letterElements = this.surveyLetterElements;
    let maxSequence: number = -1; //assuming the max sequence will be 0 or greater....
    letterElements.forEach(letterElement => {
      if (maxSequence < letterElement.sequence) {
        maxSequence = letterElement.sequence;
      }
    });
    let newSequence: number = maxSequence + 1;

    console.log("letter element type: ", letterElementType);
    let createInput: LetterElementCreateInput;
    if (letterElementType.key === LetterElementEnum.BOILERPLATE) {
      const emptyTextDelta = new Delta();
      createInput = {
        sequence: newSequence,
        letterId: this.theLetter.id,
        letterElementTypeId: letterElementType.id,
        textDelta: JSON.stringify(emptyTextDelta)
      };
    } else {
      createInput = {
        sequence: newSequence,
        letterId: this.theLetter.id,
        letterElementTypeId: letterElementType.id
      };
    }

    this.$apollo
      .mutate({
        mutation: CREATE_LETTER_ELEMENT_MUTATION,
        variables: {
          createInput: createInput
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
        this.refreshPage();
        //this.$emit("letter-created", data.createLetter.id);
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
      });
  }

  refreshPage() {
    this.$apollo.queries.theLetter.refetch().then(({ data }) => {
      console.log("letter data refetched! ", data);
    });
  }

  letterElement(key: string) {
    if (key === LetterElementEnum.BOILERPLATE) {
      return "LetterTextArea";
    } else {
      return "StaticLetterElement";
    }
  }

  toggleEditMode() {
    this.editModeOn = true;
  }

  letterInfoUpdated() {
    // letter information has been successfully updated....
    console.log("letter info updated!");
    this.$apollo.queries.theLetter.refetch().then(({ data }) => {
      console.log("survey data refetched! ", data);
    });
    this.editModeOn = false;
  }

  newLetterCreated(id: number) {
    // letter information has been successfully created or updated....reload the page, but now with the appropriate letterId
    console.log("new letter created!");
    console.log("id: ", id);
    //https://www.w3schools.com/jsref/jsref_tostring_number.asp
    let idString: string = id.toString();
    this.editModeOn = false;
    this.isNew = false;
    this.$router.push({ name: "compose", params: { letterId: idString } });
    // now need to refresh the page; this seems to work, but not sure if it's the right way to do this....
    // https://router.vuejs.org/guide/essentials/navigation.html
    //this.$router.go(0);
  }

  viewPDF() {
    console.log("view sample pdf....");
  }

  // https://github.com/vuejs/vue-class-component/issues/270
  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.name = to.params.name;
    next();
  }

  // assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
  mounted() {
    this.name = this.$route.params.name;
    if (this.$route.params.letterId === undefined) {
      // launch form for creating a new letter
      this.editModeOn = true;
      this.isNew = true;
      console.log("new letter....");
    }
  }
}
</script>
