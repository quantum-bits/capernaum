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
          <v-btn v-if="!isEmailText" text color="orange" @click="deleteElement"
            >Delete</v-btn
          >
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
          <v-btn v-if="!isEmailText" text color="orange" @click="deleteElement"
            >Delete</v-btn
          >
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import { LetterElementType } from "@/types/letter.types";
import {
  UPDATE_LETTER_MUTATION,
  UPDATE_LETTER_ELEMENT_MUTATION,
} from "@/graphql/letters.graphql";
import Quill from "quill";
import cloneDeep from "lodash/cloneDeep";

export interface Cfg {
  multiLineParagraph: boolean;
}

@Component({
  components: {
    VueEditor,
  },
})
export default class LetterTextArea extends Vue {
  /** Item to display */
  @Prop({ default: -1 }) letterElementId!: number;
  @Prop({ default: -1 }) letterId!: number;
  @Prop({ default: 0 }) order!: number;
  @Prop({ default: 0 }) largestSequenceNumber!: number;
  @Prop({ default: 0 }) smallestSequenceNumber!: number;
  @Prop() initialTextDelta!: string;
  @Prop({ default: false }) initialEditModeOn!: boolean;
  @Prop({ default: "" }) letterElementKey!: string;
  @Prop() description!: string;
  @Prop() parentIsFrozen!: boolean;
  @Prop({ default: false }) isEmailText!: boolean;
  @Prop({ default: -Infinity }) imageId!: number;

  letterElements: LetterElementType[] = [];

  // https://github.com/KillerCodeMonkey/ngx-quill/issues/295
  // https://www.vue2editor.com/examples/#custom-toolbar
  // https://quilljs.com/docs/formats/
  // https://github.com/davidroyer/vue2-editor/issues/106
  customToolbar = [
    [{ header: [1, 2, false] }],
    ["bold", "italic"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],
    //[{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ list: "ordered" }, { list: "bullet" }],
    //[{ header: [1, 2, false] }],
    ["link"],
  ];

  // used with QuillDeltaToHtmlConverter; for more configuration options, see: https://github.com/nozer/quill-delta-to-html
  // might possibly want to set allowBackgroundClasses or classPrefix to non-default values in order to mess with the css styling
  // inside the boilerplate text area
  cfg: Cfg = {
    multiLineParagraph: false,
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
  private saveTextDelta() {
    this.savedTextDelta = cloneDeep(this.textDelta);
  }

  // Restore the content from the saved version.
  private restoreTextDelta() {
    this.textDelta = cloneDeep(this.savedTextDelta);
  }

  // Update the HTML version of the content for use by the editor and by the non-editing display.
  private updateHtmlFromTextDelta() {
    this.htmlForEditor = new QuillDeltaToHtmlConverter(
      this.textDelta.ops,
      this.cfg
    ).convert();
  }

  // Make sure to initialize the HTML version of the content.
  private mounted() {
    console.log("parsed text delta: ", this.textDelta);
    console.log("initial text delta: ", this.initialTextDelta);
    console.log("json parse: ", JSON.parse(this.initialTextDelta));
    this.updateHtmlFromTextDelta();
  }

  //@Emit("move-up")
  moveUp(): void {
    this.$emit("move-up");
  }

  //@Emit("move-down")
  moveDown(): void {
    this.$emit("move-down");
  }

  //@Emit("delete-element")
  deleteElement(): void {
    this.$emit("delete-element");
  }

  editModeOn: boolean = this.initialEditModeOn;

  get showMoveDown(): boolean {
    return this.order < this.largestSequenceNumber;
  }

  get showMoveUp(): boolean {
    return this.order > this.smallestSequenceNumber;
  }

  // Fetch a properly typed Quill.
  // FIXME: Refactor this egregious type hack.
  // FIXME: function needs a return type
  get quillEditor(): Quill {
    console.log("quill editor: ", this.$refs.editor);
    return (this.$refs.editor as Vue & { quill: Quill }).quill;
  }

  // User canceled the edit. Restore the content and the HTML to their values
  // prior to editing.
  cancelEdits(): void {
    this.editModeOn = false;
    this.$emit("edit-mode-off");
    this.restoreTextDelta();
    this.updateHtmlFromTextDelta();
  }

  // User wants to save the edit. Update content and HTML to their new values.
  // Send a mutation to the server to update the database.
  save(): void {
    this.editModeOn = false;
    this.textDelta = this.quillEditor.getContents();
    this.updateHtmlFromTextDelta();
    console.log("letter element id: ", this.letterElementId);
    if (!this.isEmailText) {
      this.$apollo
        .mutate({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: this.letterElementId,
              textDelta: JSON.stringify(this.textDelta),
            },
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          this.$emit("edit-mode-off");
          //this.$emit("refresh-page");
          //this.refreshPage();
          //this.$emit("letter-created", data.createLetter.id);
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
          //this.errorMessage =
          //  "Sorry, there appears to have been an error.  Please tray again later.";
        });
    } else {
      this.$apollo
        .mutate({
          mutation: UPDATE_LETTER_MUTATION,
          variables: {
            letterData: {
              id: this.letterId,
              emailMessage: JSON.stringify(this.textDelta),
            },
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          this.$emit("edit-mode-off");
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    }
  }

  // Open the editor. Hang on to the current content for a possible cancellation.
  // Update the editor to contain the content.
  openEditor(): void {
    this.editModeOn = true;
    this.$emit("edit-mode-on");
    this.saveTextDelta();
    this.quillEditor.setContents(this.textDelta);
  }
}
</script>
