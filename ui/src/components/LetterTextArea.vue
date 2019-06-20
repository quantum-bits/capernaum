<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card v-if="editModeOn">
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{description}}</h3>
            <vue-editor ref="editor" @text-change="onTextChange" v-model="textArea"></vue-editor>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toggleEditMode">Save</v-btn>
          <v-btn flat color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" flat color="orange" @click="moveUp">
            <v-icon>arrow_upward</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" flat color="orange" @click="moveDown">
            <v-icon>arrow_downward</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{description}}</h3>
            <div v-html="textArea"></div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toggleEditMode">Edit</v-btn>
          <v-btn flat color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" flat color="orange" @click="moveUp">
            <v-icon>arrow_upward</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" flat color="orange" @click="moveDown">
            <v-icon>arrow_downward</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";
import Delta from "quill-delta";

import axios from "axios";
import { AxiosResponse } from "axios";

import { LetterElementMenuItemType, LetterElementEnum } from "../pages/letter-element.types";

@Component({
  components: {
    VueEditor
  }
})
export default class LetterTextArea extends Vue {
  /** Item to display */
  @Prop() id!: number;
  @Prop() order!: number;
  @Prop() numItems!: number;
  @Prop({ default: "" }) initialTextArea!: string;
  @Prop({ default: false }) initialEditModeOn!: boolean;
  @Prop() letterElementKey!: string;

  letterElements: LetterElementMenuItemType[] = [];
  description: string = "";

  @Emit("move-up")
  moveUp() {}

  @Emit("move-down")
  moveDown() {}

  @Emit("delete-element")
  deleteElement() {}

  editModeOn: boolean = this.initialEditModeOn;
  textArea: string = this.initialTextArea;

  //delta = this.$refs;

  // https://quilljs.com/docs/modules/toolbar/
  /*
  customToolbar: any = [
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          [{'align': []}],
          ['clean']
  ];
  */

  get showMoveDown() {
    return this.order < this.numItems - 1;
  }

  onTextChange(delta: Delta, oldDelta: Delta, source: string) {
    console.log(delta, oldDelta, source); //this is an Observer....
  }

  toggleEditMode() {
    this.editModeOn = !this.editModeOn;
    //this.$refs.editor.quill.editor.delta;
  }
  mounted() {
    axios
        .get("http://localhost:3000/letter-elements/")
        .then((response: AxiosResponse) => {
          console.log(response);
          this.letterElements = response.data;
          for (let letterElement of this.letterElements) {
              if (letterElement.key === this.letterElementKey) {
                  this.description = letterElement.description;
              }
          }
        });
  }

}
</script>
