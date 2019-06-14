<template>
  <v-container>
    <h1 class="headline mb-3">{{ surveyLetter.title }}</h1>

    <h2 class="title font-weight-regular mb-1"> Survey: <span class="font-weight-light">{{ surveyLetter.surveyTitle }}</span></h2>
    <h2 class="title font-weight-regular mb-5">Last Update: <span class="font-weight-light">{{ surveyLetter.lastUpdate }}</span></h2>
    <h2 class="title font-weight-regular mb-3">Paragraphs: </h2>

    <v-layout row wrap>
        <v-flex xs8 offset-xs2>
            <!-- https://www.youtube.com/watch?v=Y3S7KShrRX0 -->
            <div class="form-group" v-for="textBox in surveyLetter.textBoxes" :key="textBox.id">
                <v-textarea 
                    name="'input_'+textBox.id"
                    box
                    v-model="textBox.text"
                    hint="Hint text"
                ></v-textarea>
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

    <LetterTextArea :id="id" :order="order" :textArea="textArea" />

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import { AxiosResponse } from 'axios';

import LetterTextArea from "@/components/LetterTextArea.vue";

@Component({
  components: { LetterTextArea }
})
export default class Compose extends Vue {

letterTitle: String = '';

id: Number = 1;
order: Number = 1;
textArea: any = '';

surveyLetter: any = {
    title: '',
    surveyTitle: '',
    lastUpdate: '',
    id: '',
    textBoxes: []
};

mounted () {
    axios
      .get('http://localhost:3000/letter-data/'+this.$route.params.id)
      .then((response: AxiosResponse) => {
        console.log(response);
        let textBoxes: any = [];
        response.data.textBoxes.forEach((element: any) => {
            textBoxes.push(element);
        });
        this.surveyLetter = {
            title: response.data.title,
            surveyTitle: response.data.surveyTitle,
            lastUpdate: response.data.lastUpdate,
            id: response.data.id,
            textBoxes: textBoxes
        };
    }); 
    }
}
</script>