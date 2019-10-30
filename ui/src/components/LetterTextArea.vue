<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card v-show="editModeOn">
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{ description }}</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <vue-editor ref="editor" v-model="htmlForEditor"></vue-editor>
        </v-card-text>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="cancelEdits">Cancel</v-btn>
          <v-btn text color="orange" @click="save">Save</v-btn>
          <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="showMoveUp" text color="orange" @click="moveUp">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" text color="orange" @click="moveDown">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="!editModeOn">
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{ description }}</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <div v-html="htmlForEditor"></div>
        </v-card-text>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="openEditor">Edit</v-btn>
          <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="showMoveUp" text color="orange" @click="moveUp">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" text color="orange" @click="moveDown">
            <v-icon>mdi-arrow-down</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import { LetterElementType } from "@/types/letter.types";
import { UPDATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";

import Delta from "quill-delta/dist/Delta";
import Quill from "quill";

@Component({
  components: {
    VueEditor
  }
})
export default class LetterTextArea extends Vue {
  /** Item to display */
  @Prop() id!: number;
  @Prop() order!: number;
  @Prop() largestSequenceNumber!: number;
  @Prop() smallestSequenceNumber!: number;
  @Prop() initialTextDelta!: string;
  @Prop({ default: false }) initialEditModeOn!: boolean;
  @Prop() letterElementKey!: string;
  @Prop() description!: string;
  @Prop() parentIsFrozen!: boolean;

  letterElements: LetterElementType[] = [];

  textDelta = JSON.parse(this.initialTextDelta);
  htmlForEditor = new QuillDeltaToHtmlConverter(this.textDelta.ops).convert();
  //uneditedTextDelta = this.textDelta;

  @Emit("move-up")
  moveUp() {}

  @Emit("move-down")
  moveDown() {}

  @Emit("delete-element")
  deleteElement() {}

  editModeOn: boolean = this.initialEditModeOn;

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
    return this.order < this.largestSequenceNumber;
  }

  get showMoveUp() {
    return this.order > this.smallestSequenceNumber;
  }

  // Fetch a properly typed Quill.
  // FIXME: Refactor this egregious type hack.
  get quillEditor() {
    return (this.$refs.editor as Vue & { quill: Quill }).quill;
  }

  cancelEdits() {
    this.editModeOn = false;
    this.textDelta = JSON.parse(this.initialTextDelta);
    //this.textDelta = this.uneditedTextDelta; // revert to the former text delta
    this.htmlForEditor = new QuillDeltaToHtmlConverter(this.textDelta.ops).convert();
  }

  save() {
    this.editModeOn = false;
    let delta = this.quillEditor.getContents();
    console.log("delta object to save: ", delta);

    this.$apollo
      .mutate({
        mutation: UPDATE_LETTER_ELEMENT_MUTATION,
        variables: {
          updateInput: {
            id: this.id,
            textDelta: JSON.stringify(delta)
          }
        }
      })
      .then(({ data }) => {
        console.log("done!", data);
        //this.$emit("refresh-page");
        //this.refreshPage();
        //this.$emit("letter-created", data.createLetter.id);
      })
      .catch(error => {
        console.log("there appears to have been an error: ", error);
        //this.errorMessage =
        //  "Sorry, there appears to have been an error.  Please tray again later.";
      });
  }

  openEditor() {
    this.editModeOn = true;
    console.log('text delta: ', this.textDelta);
    //this.uneditedTextDelta = this.textDelta; // save for later, in case the user decides to cancel.... 
    this.quillEditor.setContents(this.textDelta);
  }
}
</script>
