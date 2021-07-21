<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          {{ description }}
        </v-card-title>

        <vue-editor
          v-if="inEditMode"
          ref="editor"
          v-model="htmlForEditor"
          :editor-toolbar="customToolbar"
        />

        <div v-else v-html="htmlForEditor" />

        <v-card-actions>
          <v-spacer />
          <edit-save-delete-cancel-buttons
            :is-data-dirty="isDirty"
            :is-data-valid="isValid"
            @enter-edit-mode="inEditMode = true"
            @leave-edit-mode="inEditMode = false"
            @backup-data="saveTextDelta"
            @restore-data="restoreTextDelta"
            @persist-data="save"
          />
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
import * as _ from "lodash";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";

export default Vue.extend({
  name: "LetterTextArea",

  components: {
    VueEditor,
    EditSaveDeleteCancelButtons,
  },

  props: {
    initialTextDelta: { type: String, default: "" },
    description: { type: String, default: "" },

    letterId: { type: Number, default: -Infinity },
    letterElementId: { type: Number, default: -Infinity },
    isEmailText: { type: Boolean, default: false },
  },

  // Initialize the HTML version of the content.
  mounted() {
    this.updateHtmlFromTextDelta();
  },

  data() {
    return {
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

      inEditMode: false,

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

  computed: {
    // Call it valid if there is some text.
    isValid(): boolean {
      return this.textDelta.length > 0;
    },

    isDirty(): boolean {
      return !_.isEqual(this.textDelta, this.saveTextDelta);
    },

    // Fetch a properly typed Quill.
    // FIXME: Refactor this egregious type hack.
    // FIXME: function needs a return type
    quillEditor(): Quill {
      console.log("quill editor: ", this.$refs.editor);
      return (this.$refs.editor as Vue & { quill: Quill }).quill;
    },
  },

  methods: {
    // Grab a copy of the current content so we can support canceling and edit.
    saveTextDelta() {
      this.savedTextDelta = _.cloneDeep(this.textDelta);
    },

    // Restore the content from the saved version.
    restoreTextDelta() {
      this.textDelta = _.cloneDeep(this.savedTextDelta);
    },

    enterEditMode(): void {
      this.inEditMode = true;
      this.quillEditor.setContents(this.textDelta);
    },

    // Update the HTML version of the content for use by the editor and by the non-editing display.
    updateHtmlFromTextDelta() {
      this.htmlForEditor = new QuillDeltaToHtmlConverter(this.textDelta.ops, {
        multiLineParagraph: false,
      }).convert();
    },

    // User wants to save the edit. Update content and HTML to their new values.
    // Send a mutation to the server to update the database.
    save(): void {
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
  },

  // Credits:
  // https://github.com/KillerCodeMonkey/ngx-quill/issues/295
  // https://www.vue2editor.com/examples/#custom-toolbar
  // https://quilljs.com/docs/formats/
  // https://github.com/davidroyer/vue2-editor/issues/106
});
</script>
