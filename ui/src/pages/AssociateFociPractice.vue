<template>
  <v-container>
      <v-layout v-if="isFrozen" class="mb-3">
        <v-flex xs10 offset-xs1>
                <v-alert
                    :value="true"
                    type="info"
                >
                    Note that this letter has been frozen -- it is no longer editable.
                </v-alert>
        </v-flex>
      </v-layout>
        <div v-if="!editModeOn">
            <v-layout row wrap>
                <v-flex xs7 offset-xs1>
                    <h1 class="headline mb-3">{{ title }}</h1>
                    <h2 class="title font-weight-regular mb-1">
                    Survey:
                    <span class="font-weight-light">{{ surveyTitle }}</span>
                    </h2>
                    <h2 class="title font-weight-regular mb-5">
                    Last Update:
                    <span class="font-weight-light">{{ lastUpdate }}</span>
                    </h2>
                </v-flex>
                <v-flex v-if="!isFrozen" xs3 class="text-xs-right">
                    <v-btn
                        color="primary"
                        dark
                        @click="toggleEditMode"
                        >
                        Edit
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>
        <div v-else>
            <LetterInfoForm
            :id="id"
            :initialTitle="title"
            :initialSurveyId="surveyId"
            :isNew="isNew"
            v-on:save-info="saveInfo" 
            >
            </LetterInfoForm>
        </div>

    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
            <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
        </v-flex>
        
    
    </v-layout>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";
import _ from "lodash";

import LetterTextArea from "../components/LetterTextArea.vue";
import StaticLetterElement from "../components/StaticLetterElement.vue";
import LetterInfoForm from "../components/LetterInfoForm.vue";

import { LetterElementMenuItemType, LetterElementType, LetterElementEnum } from "./letter-element.types";

@Component({
  components: { LetterTextArea, StaticLetterElement, LetterInfoForm }
})
export default class AssociateFociPractice extends Vue {

isNew: boolean = false; // true if this is a new letter
editModeOn: boolean = false;
title: string = '';
surveyTitle: string = '';
surveyId: number = -1;
lastUpdate: string = '';
id: number = -1;
elements: LetterElementType[] = [];
letterElements: LetterElementMenuItemType[] = [];
isFrozen: boolean = false;

moveUp(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log("move up!", index);
    let element: LetterElementType = this.elements[index];
    this.elements.splice(index,1);
    this.elements.splice(index - 1,0,element);
    this.resetOrderProperty();
    console.log(this.elements);
}

moveDown(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log("move down!", index);
    let element: LetterElementType = this.elements[index+1];
    this.elements.splice(index + 1,1);
    this.elements.splice(index,0,element);
    this.resetOrderProperty();
    console.log(this.elements);
}

deleteElement(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log('delete!', index);
    this.elements.splice(index,1);
    this.resetOrderProperty();
    console.log(this.elements);
}

resetOrderProperty() {
    // cycles through the elements array and resets the 'order' property to reflect the current ordering of the text boxes
    for (let i = 0; i < this.elements.length; i++ ){
        this.elements[i].order = i;
    }
  }

addElement(key: string) {
    console.log("add: ", key);
    let numElements: number = this.elements.length;
    let maxId: number = 0;
    // set the (temporary) id of the new element to be greater than the id's of all the other ones; it is used as a key, so it needs to be unique
    for (let box of this.elements) {
        if (box.id > maxId) {
            maxId = box.id;
        }
    }
    maxId = maxId + 1;
    this.elements.push(
        {
            id: maxId,//will eventually get assigned a value by the server, but use this value as a key for now....
            order: numElements,
            textDelta: {
                        ops: [
                            {
                              insert: ""
                            }
                        ]
                    },
            key: key,
            isNew: true,
            editModeOn: true
        }
    );
    this.resetOrderProperty();
    console.log(this.elements);
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

saveInfo() {
    // save the letter info (title, etc....maybe do this in the child component and reload the page?)
    this.editModeOn = false;
}

viewPDF() {
    console.log('view sample pdf....');
}
  // assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
mounted() {
    axios
      .get("http://localhost:3000/letter-elements/")
      .then((response: AxiosResponse) => {
        console.log(response);
        this.letterElements = response.data;
      });
    console.log("route param: ", this.$route.params.id);
    if (this.$route.params.id === undefined) {
      // launch form for creating a new letter
        this.editModeOn = true;
        this.isNew = true;
    } else {
      axios
        .get("http://localhost:3000/letter-data/" + this.$route.params.id)
        .then((response: AxiosResponse) => {
            console.log(response);
            let localElements: LetterElementType[] = [];
            response.data.elements.forEach((element: any) => {
                localElements.push(element);
            });
            this.elements = _.orderBy(localElements,"order");
            // add two convenience properties to the elements....
            for (let box of this.elements) {
                box.editModeOn = false;
                box.isNew = false;
            }
            this.resetOrderProperty();
            this.title = response.data.title;
            this.surveyTitle = response.data.surveyTitle;
            this.lastUpdate = response.data.lastUpdate;
            this.id = response.data.id;
            this.surveyId = response.data.surveyId;
            this.isFrozen = response.data.isFrozen;
        }); 
    }
  }
}
</script>
