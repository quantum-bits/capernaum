<template>
  <v-container>
    <h1 class="headline mb-3">{{ title }}</h1>

    <h2 class="title font-weight-regular mb-1">
      Survey:
      <span class="font-weight-light">{{ surveyTitle }}</span>
    </h2>
    <h2 class="title font-weight-regular mb-5">
      Last Update:
      <span class="font-weight-light">{{ lastUpdate }}</span>
    </h2>
    <h2 class="title font-weight-regular mb-3">Content of Letter:</h2>

    <v-layout row wrap>
      <v-flex xs10 offset-xs1 class="text-xs-right">
        <v-btn v-if="textBoxes.length > 0" flat color="orange" @click="addTextArea">Add Paragraph</v-btn>
      </v-flex>

      <v-flex xs10 offset-xs1 class="text-xs-right">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Add Letter Element</v-btn>
          </template>
          <v-list>
            <v-list-tile v-for="item in letterElements" :key="item.key" @click="addTextArea">
              <v-list-tile-title>{{ item.description }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>

      <v-flex xs10 offset-xs1>
        <!-- https://www.youtube.com/watch?v=Y3S7KShrRX0 -->
        <div class="form-group ma-4" v-for="(textBox, index) in textBoxes" :key="textBox.id">
          <LetterTextArea
            :id="textBox.id"
            :order="textBox.order"
            :initialTextArea="textBox.text"
            :initialEditModeOn="textBox.editModeOn"
            :numItems="textBoxes.length"
            v-on:move-up="moveUp(index)"
            v-on:move-down="moveDown(index)"
            v-on:delete-paragraph="deleteTextBox(index)"
          />
        </div>
      </v-flex>
      <v-flex xs10 offset-xs1 class="text-xs-right">
        <v-btn flat color="orange" @click="addTextArea">Add Paragraph</v-btn>
      </v-flex>
    </v-layout>

    <!--
        Next:
            - decide on specifics of how to add another text box...do it on the fly?  should probably update it every time the user hits "save"
            - might need to update the db every time a change is made (to the order, too)
            - validation: https://vuejsdevelopers.com/2018/08/27/vue-js-form-handling-vuelidate/
            - key: 'boilerplate', description: 'asdfasdfasdfasdf'
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
import { TextBoxItemType } from "./text-box.types";
import { LetterElementItemType } from "./letter-element.types";

@Component({
  components: { LetterTextArea }
})
export default class Compose extends Vue {
  title: string = "";
  surveyTitle: string = "";
  lastUpdate: string = "";
  id: number = 0;
  textBoxes: TextBoxItemType[] = [];
  letterElements: LetterElementItemType[] = [];

  moveUp(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log("move up!", index);
    let textBox: TextBoxItemType = this.textBoxes[index];
    this.textBoxes.splice(index, 1);
    this.textBoxes.splice(index - 1, 0, textBox);
    this.resetOrderProperty();
    console.log(this.textBoxes);
  }

  moveDown(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log("move down!", index);
    let textBox: TextBoxItemType = this.textBoxes[index + 1];
    this.textBoxes.splice(index + 1, 1);
    this.textBoxes.splice(index, 0, textBox);
    this.resetOrderProperty();
    console.log(this.textBoxes);
  }

  deleteTextBox(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log("delete!", index);
    this.textBoxes.splice(index, 1);
    this.resetOrderProperty();
    console.log(this.textBoxes);
  }

  resetOrderProperty() {
    // cycles through the textBox array and resets the 'order' property to reflect the current ordering of the text boxes
    for (let i = 0; i < this.textBoxes.length; i++) {
      this.textBoxes[i].order = i;
    }
  }

  addTextArea() {
    console.log("add one");
    let numTextBoxes: number = this.textBoxes.length;
    let maxId: number = 0;
    // set the (temporary) id of the new textBox to be greater than the id's of all the other ones; it is used as a key, so it needs to be unique
    for (let box of this.textBoxes) {
      if (box.id > maxId) {
        maxId = box.id;
      }
    }
    maxId = maxId + 1;
    this.textBoxes.push({
      id: maxId, //will eventually get assigned a value by the server, but use this value as a key for now....
      order: numTextBoxes,
      text: "",
      isNew: true,
      editModeOn: true
    });
    this.resetOrderProperty();
    console.log(this.textBoxes);
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
      // do something
    } else {
      axios
        .get("http://localhost:3000/letter-data/" + this.$route.params.id)
        .then((response: AxiosResponse) => {
          console.log(response);
          let localTextBoxes: TextBoxItemType[] = [];
          response.data.textBoxes.forEach((element: any) => {
            localTextBoxes.push(element);
          });
          this.textBoxes = _.orderBy(localTextBoxes, "order");
          // add two convenience properties to the textBoxes....
          for (let box of this.textBoxes) {
            box.editModeOn = false;
            box.isNew = false;
          }
          this.resetOrderProperty();
          this.title = response.data.title;
          this.surveyTitle = response.data.surveyTitle;
          this.lastUpdate = response.data.lastUpdate;
          this.id = response.data.id;
        });
    }
  }
}
</script>
