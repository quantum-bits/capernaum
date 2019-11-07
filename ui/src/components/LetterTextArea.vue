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
          <vue-editor
            ref="editor"
            v-model="htmlForEditor"
            :editor-toolbar="customToolbar"
          ></vue-editor>
        </v-card-text>
        <v-card-actions v-if="!parentIsFrozen">
          <v-btn text color="orange" @click="cancelEdits">Cancel</v-btn>
          <v-btn text color="orange" @click="save">Save</v-btn>
          <v-btn v-if="!isEmailText" text color="orange" @click="deleteElement">Delete</v-btn>
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
          <v-btn v-if="!isEmailText" text color="orange" @click="deleteElement">Delete</v-btn>
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
import Quill from "quill";
import cloneDeep from "lodash/cloneDeep";

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
  @Prop({ default: false }) isEmailText!: boolean;

  letterElements: LetterElementType[] = [];

  // https://github.com/KillerCodeMonkey/ngx-quill/issues/295
  // https://www.vue2editor.com/examples/#custom-toolbar
  // https://quilljs.com/docs/formats/
  // https://github.com/davidroyer/vue2-editor/issues/106
  customToolbar: any = [
    [{ header: [1, 2, false] }],
    ["bold", "italic"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" }
    ],
    //[{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ list: "ordered" }, { list: "bullet" }],
    //[{ header: [1, 2, false] }],
    ["link"]
  ];

  // used with QuillDeltaToHtmlConverter; for more configuration options, see: https://github.com/nozer/quill-delta-to-html
  // might possibly want to set allowBackgroundClasses or classPrefix to non-default values in order to mess with the css styling
  // inside the boilerplate text area
  cfg: any = {
    multiLineParagraph: false
  };

  // Authoritative source for the boilerplate content.
  // Initialize from the prop. Update with each edit.
  textDelta = JSON.parse(this.initialTextDelta);

  // The vue2-editor component is an HTML editor. This value is used as the v-model
  // for the editor, as well as the v-html for the "not editing" state.
  htmlForEditor = "";

  // Current value of textDelta while the editor is open. Used to restore the previous
  // value when edit is canceled.
  savedTextDelta = [];

  // Grab a copy of the current content so we can support canceling and edit.
  saveTextDelta() {
    this.savedTextDelta = cloneDeep(this.textDelta);
  }

  // Restore the content from the saved version.
  restoreTextDelta() {
    this.textDelta = cloneDeep(this.savedTextDelta);
  }

  // Update the HTML version of the content for use by the editor and by the non-editing display.
  updateHtmlFromTextDelta() {
    this.htmlForEditor = new QuillDeltaToHtmlConverter(
      this.textDelta.ops,
      this.cfg
    ).convert();
  }

  // Make sure to initialize the HTML version of the content.
  mounted() {
    console.log("parsed text delta: ", this.textDelta);
    console.log("initial text delta: ", this.initialTextDelta);
    console.log("json parse: ", JSON.parse(this.initialTextDelta));
    this.updateHtmlFromTextDelta();
  }

  @Emit("move-up")
  moveUp() {}

  @Emit("move-down")
  moveDown() {}

  @Emit("delete-element")
  deleteElement() {}

  editModeOn: boolean = this.initialEditModeOn;

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

  // User canceled the edit. Restore the content and the HTML to their values
  // prior to editing.
  cancelEdits() {
    this.editModeOn = false;
    this.restoreTextDelta();
    this.updateHtmlFromTextDelta();
  }

  // User wants to save the edit. Update content and HTML to their new values.
  // Send a mutation to the server to update the database.
  save() {
    this.editModeOn = false;
    this.textDelta = this.quillEditor.getContents();
    this.updateHtmlFromTextDelta();
    if (!this.isEmailText) {
      this.$apollo
        .mutate({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: this.id,
              textDelta: JSON.stringify(this.textDelta)
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
    } else {
      console.log('this is an email!  save it....');
    }
  }

  // Open the editor. Hang on to the current content for a possible cancellation.
  // Update the editor to contain the content.
  openEditor() {
    this.editModeOn = true;
    this.saveTextDelta();
    this.quillEditor.setContents(this.textDelta);
  }
}
</script>
