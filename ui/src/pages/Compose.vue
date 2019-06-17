<template>
  <v-container>
    <h1 class="headline mb-3">{{ title }}</h1>

    <h2 class="title font-weight-regular mb-1"> Survey: <span class="font-weight-light">{{ surveyTitle }}</span></h2>
    <h2 class="title font-weight-regular mb-5">Last Update: <span class="font-weight-light">{{ lastUpdate }}</span></h2>
    <h2 class="title font-weight-regular mb-3">Paragraphs: </h2>

    <v-layout row wrap>
        <v-flex xs10 offset-xs1>
            <!-- https://www.youtube.com/watch?v=Y3S7KShrRX0 -->
            <div class="form-group" v-for="(textBox, index) in textBoxes" :key="textBox.id">
                <LetterTextArea :id="textBox.id" :order="textBox.order" :initialTextArea="textBox.text" :initialEditModeOn="false" :numItems="textBoxes.length" v-on:move-up="moveUp(index)" v-on:move-down="moveDown(index)"/>
            </div>
        </v-flex>
    </v-layout>

    <!--
        Next:
            - refactor the text areas into their own components
            - make it so the text areas are not editable at first; an "edit" button makes them editable
            - have an "add another" button
            - eventually need the textarea to have some controls (bold face, italics, add link, etc.)
    -->

    


    

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import { AxiosResponse } from 'axios';
import _ from "lodash";

import LetterTextArea from "@/components/LetterTextArea.vue";

@Component({
  components: { LetterTextArea }
})
export default class Compose extends Vue {

title: string = '';
surveyTitle: string = '';
lastUpdate: string = '';
id: number = 0;
textBoxes: any = [];

//https://stackoverflow.com/questions/40512585/vue-js-cant-orderby-in-v-for/40512856
//get orderedTextBoxes(): any{
//    return _.orderBy(this.textBoxes,'order');
//}

moveUp(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log('move up!', index);
    let textBox = this.textBoxes[index];
    this.textBoxes.splice(index,1);
    this.textBoxes.splice(index-1,0,textBox);
    this.resetOrderProperty();
    console.log(this.textBoxes);
}

moveDown(index: number) {
    //https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
    console.log('move down!', index);
    let textBox = this.textBoxes[index+1];
    this.textBoxes.splice(index+1,1);
    this.textBoxes.splice(index,0,textBox);
    this.resetOrderProperty();
    console.log(this.textBoxes);
}

resetOrderProperty() {
    // cycles through the textBox array and resets the 'order' property to reflect the current ordering of the text boxes
    for (let i = 0; i < this.textBoxes.length; i++ ){
        this.textBoxes[i].order = i;
    }
}

// assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
mounted () {
    axios
      .get('http://localhost:3000/letter-data/'+this.$route.params.id)
      .then((response: AxiosResponse) => {
        console.log(response);
        let localTextBoxes: any = [];
        response.data.textBoxes.forEach((element: any) => {
            localTextBoxes.push(element);
        });
        this.textBoxes = _.orderBy(localTextBoxes,'order');
        this.resetOrderProperty();
        this.title = response.data.title;
        this.surveyTitle = response.data.surveyTitle;
        this.lastUpdate = response.data.lastUpdate;
        this.id = response.data.id;
    }); 
    }
}
</script>