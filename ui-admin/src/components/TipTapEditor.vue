<template>
  <v-card :elevation="elevation">
    <v-card-title v-if="title">{{ title }}</v-card-title>

    <div class="prose-mirror-wrapper" :class="classBindings">
      <v-row class="mb-1" align="baseline">
        <v-col>
          <v-btn-toggle class="mr-4" dense multiple v-model="blockType">
            <v-btn
              :value="style.Heading1"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            >
              <v-icon>mdi-format-header-1</v-icon>
            </v-btn>
            <v-btn
              :value="style.Heading2"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              <v-icon>mdi-format-header-2</v-icon>
            </v-btn>
            <v-btn
              :value="style.Paragraph"
              @click="editor.chain().focus().setParagraph().run()"
            >
              <v-icon>mdi-format-pilcrow</v-icon>
            </v-btn>
            <v-btn
              :value="style.ListBullet"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              :value="style.ListNumber"
              @click="editor.chain().focus().toggleOrderedList().run()"
            >
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle class="ml-4" dense multiple v-model="fontStyle">
            <v-btn
              :value="style.Bold"
              @click="editor.chain().focus().toggleBold().run()"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>
            <v-btn
              :value="style.Italic"
              @click="editor.chain().focus().toggleItalic().run()"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col v-if="debugEnable">
          <v-checkbox label="Debug" v-model="debugContent"></v-checkbox>
        </v-col>
      </v-row>

      <editor-content v-if="editor" :editor="editor" />

      <v-row v-if="debugEnable && debugContent">
        <v-col>
          <h2>Current Content</h2>
          <pre><code>{{ currentContent }}</code></pre>
        </v-col>
        <v-col>
          <h2>Saved Content</h2>
          <pre><code>{{ savedContent }}</code></pre>
        </v-col>
      </v-row>
    </div>

    <v-card-actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        :is-data-dirty="isDirty"
        :is-data-valid="true"
        @enter-edit-mode="setEditMode(true)"
        @leave-edit-mode="setEditMode(false)"
        @backup-data="backupContent"
        @restore-data="restoreContent"
        @persist-data="persistContent"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Editor, EditorContent, JSONContent } from "@tiptap/vue-2";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/vue-2";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";
import {
  isQuillDeltaString,
  quillDeltaToTipTapJson,
  emptyTipTapDocument,
  isTipTapJsonString,
} from "@/helpers";
import * as _ from "lodash";

enum Style {
  Heading1,
  Heading2,
  Paragraph,
  ListBullet,
  ListNumber,
  Bold,
  Italic,
}

export default Vue.extend({
  name: "TipTapEditor",

  components: {
    EditorContent,
    EditSaveDeleteCancelButtons,
  },

  props: {
    title: { type: String },
    initialContent: { type: String, required: true },
    flat: { type: Boolean, default: false },
  },

  data() {
    return {
      editor: {} as Editor,
      inEditMode: false,
      currentContent: {} as JSONContent,
      savedContent: {} as JSONContent,

      blockType: [2],
      fontStyle: [] as number[],
      style: Style,

      debugEnable: true,
      debugContent: false,
    };
  },

  computed: {
    // Decode the initial content.
    tipTapJson(): JSONContent {
      console.log("Initial content", this.initialContent);
      let content = undefined;
      if (isQuillDeltaString(this.initialContent)) {
        console.log("Quill Delta");
        content = quillDeltaToTipTapJson(this.initialContent);
      } else if (isTipTapJsonString(this.initialContent)) {
        console.log("Tip Tap JSON");
        content = JSON.parse(this.initialContent);
      } else {
        console.log("Empty");
        content = emptyTipTapDocument();
      }
      console.log("Content", content);
      return content;
    },

    elevation(): number | undefined {
      return this.flat ? 0 : undefined;
    },

    isDirty(): boolean {
      return !_.isEqual(this.currentContent, this.savedContent);
    },

    isValid(): boolean {
      return !this.editor.isEmpty;
    },

    classBindings(): Record<string, unknown> {
      return {
        "prose-mirror-active": this.inEditMode,
        "prose-mirror-inactive": !this.inEditMode,
      };
    },
  },

  watch: {
    editor: {
      handler(newVal) {
        console.log("THIS IS THE EDITOR", newVal);
      },
    },
  },

  methods: {
    setEditMode(enabled: boolean) {
      console.log(`Set edit mode to ${enabled}`);
      this.inEditMode = enabled;
      this.editor.setEditable(enabled);
    },

    retrieveCurrentContent() {
      this.currentContent = this.editor.getJSON() as JSONContent;
    },

    backupContent() {
      console.log("Back up content");
      this.savedContent = _.cloneDeep(this.currentContent);
    },

    restoreContent() {
      console.log("Restore content");
      this.currentContent = _.cloneDeep(this.savedContent);
      this.editor.commands.setContent(this.currentContent, false);
    },

    persistContent() {
      console.log("Persist content");
      const content = this.editor.getJSON();
      this.$emit("save-content", content);
    },

    wrapIsActive(
      name: string,
      attributes?: { [key: string]: unknown }
    ): boolean {
      const rtn: boolean = this.editor.isActive(name, attributes);
      if (rtn) {
        console.info(
          `'${name}' ${JSON.stringify(attributes)} ${
            rtn ? "IS ACTIVE" : "is not active"
          }`
        );
      }
      return rtn;
    },

    updateFontStyleButtons() {
      const updatedStyle = [];
      if (this.wrapIsActive("bold")) {
        updatedStyle.push(Style.Bold);
      }
      if (this.wrapIsActive("italic")) {
        updatedStyle.push(Style.Italic);
      }
      this.fontStyle = updatedStyle;
    },

    updateBlockTypeButtons() {
      const updatedStyle = [];
      if (this.wrapIsActive("heading", { level: 1 })) {
        updatedStyle.push(Style.Heading1);
      }
      if (this.wrapIsActive("heading", { level: 2 })) {
        updatedStyle.push(Style.Heading2);
      }
      if (this.wrapIsActive("paragraph")) {
        updatedStyle.push(Style.Paragraph);
      }
      if (this.wrapIsActive("bulletList")) {
        updatedStyle.push(Style.ListBullet);
      }
      if (this.wrapIsActive("orderedList")) {
        updatedStyle.push(Style.ListNumber);
      }
      this.blockType = updatedStyle;
    },

    updateStyleButtons() {
      this.updateFontStyleButtons();
      this.updateBlockTypeButtons();
    },
  },

  created() {
    const extensions = [StarterKit, Placeholder];

    const emitUpdateEvent = () => {
      this.$emit("html-updated", generateHTML(this.currentContent, extensions));
    };

    this.editor = new Editor({
      extensions,
      content: this.tipTapJson,
      editable: false,
      autofocus: true,
      onCreate: () => {
        this.retrieveCurrentContent();
        emitUpdateEvent();
      },
      onUpdate: () => {
        this.retrieveCurrentContent();
        this.updateStyleButtons();
        emitUpdateEvent();
      },
      onSelectionUpdate: () => {
        this.updateStyleButtons();
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
});
</script>

<style>
/* Style the placeholder text. */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.prose-mirror-wrapper {
  padding: 1em;
}

.prose-mirror-active {
  border: #1976d2 solid 1px;
}

.prose-mirror-inactive {
  border: gray dashed 1px;
}
</style>
