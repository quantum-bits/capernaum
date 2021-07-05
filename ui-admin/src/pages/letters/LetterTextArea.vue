<template>
  <v-row>
    <v-col xs12 sm12>
      <v-card v-show="editModeOn">
        <v-card-title v-if="description" primary-title>
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { VueEditor } from "vue2-editor";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import {
  UPDATE_LETTER_MUTATION,
  UPDATE_LETTER_ELEMENT_MUTATION,
} from "@/graphql/letters.graphql";
import Quill from "quill";
import cloneDeep from "lodash/cloneDeep";
import { SurveyLetters_surveyLetters_letter_letterElements } from "@/graphql/types/SurveyLetters";

export interface QuillConfig {
  multiLineParagraph: boolean;
}

export default Vue.extend({
  name: "LetterTextArea",

  components: {
    VueEditor,
  },

  props: {
    letterElementId: { type: Number, default: -1 },
    letterId: { type: Number, default: -1 },
    order: { type: Number, default: 0 },
    largestSequenceNumber: { type: Number, default: 0 },
    smallestSequenceNumber: { type: Number, default: 0 },
    initialTextDelta: { type: String },
    initialEditModeOn: { type: Boolean, default: false },
    letterElementKey: { type: String, default: "" },
    description: { type: String, default: "" },
    parentIsFrozen: { type: Boolean },
    isEmailText: { type: Boolean, default: false },
    imageId: { type: Number, default: -Infinity },
  },

  // Initialize the HTML version of the content.
  mounted() {
    this.updateHtmlFromTextDelta();
  },

  data() {
    return {
      letterElements: [] as SurveyLetters_surveyLetters_letter_letterElements[],

      customToolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
      ],

      // Used with QuillDeltaToHtmlConverter; for more configuration options,
      // see: https://github.com/nozer/quill-delta-to-html
      // Might want to set `allowBackgroundClasses` or `classPrefix`
      // to non-default values in order to mess with the CSS
      // inside the boilerplate text area.
      quillConfig: {
        multiLineParagraph: false,
      } as QuillConfig,

      editModeOn: this.initialEditModeOn,

      // Authoritative source for the boilerplate content.
      // Initialize from the prop. Update with each edit.
      textDelta: JSON.parse(this.initialTextDelta),

      // Current value of textDelta while the editor is open. Used to restore the previous
      // value when edit is canceled.
      savedTextDelta: [],

      // The vue2-editor component is an HTML editor. This value is used as the v-model
      // for the editor, as well as the v-html for the "not editing" state.
      htmlForEditor: "",
    };
  },

  methods: {
    // Grab a copy of the current content so we can support canceling and edit.
    saveTextDelta() {
      this.savedTextDelta = cloneDeep(this.textDelta);
    },

    // Restore the content from the saved version.
    restoreTextDelta() {
      this.textDelta = cloneDeep(this.savedTextDelta);
    },

    // Update the HTML version of the content for use by the editor and by the non-editing display.
    updateHtmlFromTextDelta() {
      this.htmlForEditor = new QuillDeltaToHtmlConverter(
        this.textDelta.ops,
        this.quillConfig
      ).convert();
    },

    moveUp(): void {
      this.$emit("move-up");
    },

    moveDown(): void {
      this.$emit("move-down");
    },

    deleteElement(): void {
      this.$emit("delete-element");
    },

    // User canceled the edit. Restore the content and the HTML to their values
    // prior to editing.
    cancelEdits(): void {
      this.editModeOn = false;
      this.$emit("edit-mode-off");
      this.restoreTextDelta();
      this.updateHtmlFromTextDelta();
    },

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
    },

    // Open the editor. Hang on to the current content for a possible cancellation.
    // Update the editor to contain the content.
    openEditor(): void {
      this.editModeOn = true;
      this.$emit("edit-mode-on");
      this.saveTextDelta();
      this.quillEditor.setContents(this.textDelta);
    },
  },

  computed: {
    showMoveDown(): boolean {
      return this.order < this.largestSequenceNumber;
    },

    showMoveUp(): boolean {
      return this.order > this.smallestSequenceNumber;
    },

    // Fetch a properly typed Quill.
    // FIXME: Refactor this egregious type hack.
    // FIXME: function needs a return type
    quillEditor(): Quill {
      console.log("quill editor: ", this.$refs.editor);
      return (this.$refs.editor as Vue & { quill: Quill }).quill;
    },
  },

  // Credits:
  // https://github.com/KillerCodeMonkey/ngx-quill/issues/295
  // https://www.vue2editor.com/examples/#custom-toolbar
  // https://quilljs.com/docs/formats/
  // https://github.com/davidroyer/vue2-editor/issues/106
});
</script>
