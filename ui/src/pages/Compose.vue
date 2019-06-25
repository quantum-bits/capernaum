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
                    <span class="font-weight-light">{{ survey.title }}</span>
                    </h2>
                    <h2 class="title font-weight-regular mb-1">
                    Boolean Association Table:
                    <span v-if="booleanAssociation !== null" class="font-weight-light">{{ booleanAssociation.title }}</span>
                    <span v-else class="font-weight-light"> None </span>
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
            :initialSurveyId="survey.id"
            :initialBooleanAssociation="booleanAssociation"
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
            <v-btn
                color="primary"
                dark
                @click="viewPDF"
                >
                View PDF
            </v-btn>
            <v-menu v-if="!isFrozen" offset-y>
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
                    :disabled="itemDisabled(item.key)"
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
                :initialTextDelta="element.textDelta" 
                :initialEditModeOn="element.editModeOn" 
                :numItems="elements.length" 
                :letterElementKey="element.key"
                :parentIsFrozen="isFrozen"
                v-on:move-up="moveUp(index)" 
                v-on:move-down="moveDown(index)" 
                v-on:delete-element="deleteElement(index)"
                ></component>
            </div>
        </v-flex>
        <v-flex xs10 offset-xs1 class="text-xs-right">
            <v-btn v-if="elements.length > 0"
                color="primary"
                dark
                @click="viewPDF"
                >
                View PDF
            </v-btn>
            <v-menu v-if="elements.length > 0 && !isFrozen" offset-y>
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
import axios from "axios";
import { AxiosResponse } from "axios";
import _ from "lodash";

import LetterTextArea from "../components/LetterTextArea.vue";
import StaticLetterElement from "../components/StaticLetterElement.vue";
import LetterInfoForm from "../components/LetterInfoForm.vue";

import { LetterElementMenuItemType, LetterElementType, LetterElementEnum } from "./letter-element.types";
import { BooleanAssociationBriefType } from "./association-table.types";

// brief format, for data returned from the db
interface SurveyTypeBrief {
    id: number | null;
    title: string;
}

@Component({
  components: { LetterTextArea, StaticLetterElement, LetterInfoForm }
})
export default class Compose extends Vue {

isNew: boolean = false; // true if this is a new letter
editModeOn: boolean = false;
title: string = '';
survey: SurveyTypeBrief = {
    id: null,
    title: ""
}
lastUpdate: string = '';
id: number | null = null;
elements: LetterElementType[] = [];
letterElements: LetterElementMenuItemType[] = [];
isFrozen: boolean = false;
booleanAssociation: BooleanAssociationBriefType | null = null;

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

itemDisabled(key: string) {
    console.log("key: ",key);
    return (key === LetterElementEnum.BOOLEAN_CALCULATION_RESULTS) && (this.booleanAssociation === null);
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
            this.survey = {
                id: response.data.survey.id,
                title: response.data.survey.title
            };
            this.lastUpdate = response.data.lastUpdate;
            this.id = response.data.id;
            this.isFrozen = response.data.isFrozen;
            this.booleanAssociation = response.data.booleanAssociation;
        }); 
    }
  }
}
</script>
