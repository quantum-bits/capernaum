<template>
  <v-container>
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
                <v-flex v-if="elements.length > 0" xs3 class="text-xs-right">
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
            <h2 class="title font-weight-regular mb-3 mt-3">Content of Letter:</h2>
        </v-flex>
        <v-flex xs10 offset-xs1 class="text-xs-right">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="primary"
                    dark
                    v-on="on"
                    >
                    Add Letter Element
                    </v-btn>
                </template>
                <v-list>
                    <v-list-tile
                    v-for="item in letterElements"
                    :key="item.key"
                    @click="addElement(item.key)"
                    >
                    <v-list-tile-title>{{ item.description }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>

        <v-flex xs10 offset-xs1>
            <!-- https://www.youtube.com/watch?v=Y3S7KShrRX0 -->
            <div class="form-group ma-4" v-for="(element, index) in elements" :key="element.id">
                <component v-bind:is="letterElement(element.key)" 
                :id="element.id" 
                :order="element.order" 
                :initialTextArea="element.text" 
                :initialEditModeOn="element.editModeOn" 
                :numItems="elements.length" 
                :letterElementKey="element.key"
                v-on:move-up="moveUp(index)" 
                v-on:move-down="moveDown(index)" 
                v-on:delete-element="deleteElement(index)"
                ></component>
            </div>
        </v-flex>
        <!--
        <v-flex xs10 offset-xs1 class="text-xs-right">
            <v-btn flat color="orange" @click="addTextArea">Add Paragraph</v-btn>
        </v-flex>
        -->
        <v-flex v-if="elements.length > 0" xs10 offset-xs1 class="text-xs-right">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="primary"
                    dark
                    v-on="on"
                    >
                    Add Letter Element
                    </v-btn>
                </template>
                <v-list>
                    <v-list-tile
                    v-for="item in letterElements"
                    :key="item.key"
                    @click="addElement(item.key)"
                    >
                    <v-list-tile-title>{{ item.description }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>
    </v-layout>

    <!--
        Next:
            - decide on specifics of how to add another text box...do it on the fly?  should probably update it every time the user hits "save"
            - might need to update the db every time a change is made (to the order, too)
            - validation: https://vuejsdevelopers.com/2018/08/27/vue-js-form-handling-vuelidate/
            - add isActive flag to letter
            - add isFrozen flag to letter; controls disappear; explanation appears
            - ordering within categories for letters (order by survey, and then more ordering below this level)
            - Quill to output json instead of html

            - IMPT(?) need to do something to have multiple vue2-editor instances at the same time(!)
    -->
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
export default class Compose extends Vue {

isNew: boolean = false; // true if this is a new letter
editModeOn: boolean = false;
title: string = '';
surveyTitle: string = '';
surveyId: number = -1;
lastUpdate: string = '';
id: number = -1;
elements: LetterElementType[] = [];
letterElements: LetterElementMenuItemType[] = [];

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
    let text: string = "";
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
            text: text,
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
        }); 
    }
  }
}
</script>
