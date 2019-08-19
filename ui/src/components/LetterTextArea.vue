<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card v-show="editModeOn">
        <v-card-title primary-title>
          <div>
            <h3 class="title font-weight-regular mb-2">{{ description }}</h3>
            <vue-editor ref="editor" v-model="textArea"></vue-editor>
          </div>
        </v-card-title>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="save">Save</v-btn>
          <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" text color="orange" @click="moveUp">
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
          <div v-html="textArea"></div>
        </v-card-text>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="openEditor">Edit</v-btn>
          <v-btn text color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" text color="orange" @click="moveUp">
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

import axios, { AxiosResponse } from "axios";

import { LetterElementMenuItemType } from "@/pages/letter-element.types";
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
  @Prop() numItems!: number;
  @Prop() initialTextDelta!: Delta;
  @Prop({ default: false }) initialEditModeOn!: boolean;
  @Prop() letterElementKey!: string;
  @Prop() parentIsFrozen!: boolean;

  letterElements: LetterElementMenuItemType[] = [];
  description: string = "";

  textDelta: any = this.initialTextDelta;

  cfg: any = {};
  converter: any = new QuillDeltaToHtmlConverter(this.textDelta.ops, this.cfg);
  textArea: string = this.converter.convert();

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
    return this.order < this.numItems - 1;
  }

  // Fetch a properly typed Quill.
  // FIXME: Refactor this egregious type hack.
  get quillEditor() {
    return (this.$refs.editor as Vue & { quill: Quill }).quill;
  }

  save() {
    // save
    this.editModeOn = false;
    let delta: Delta = this.quillEditor.getContents();
    console.log("delta object to save: ", delta);
  }

  openEditor() {
    this.editModeOn = true;
    // don't need to use setContents, since the editor is already tied to this.textArea via v-model....
    /*
                            this works, in case we ever need to use setContents directly:
                            this.$refs.editor.quill.setContents({
                              ops: [
                                {insert: "some text"}
                              ]
                            });
                            */
  }

  mounted() {
    axios
      .get("http://localhost:4000/letter-elements/")
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
