<template>
  <v-card :elevation="elevation">
    <v-card-title v-if="title">{{ title }}</v-card-title>

    <div class="prose-mirror-wrapper" :class="classBindings">
      <v-row class="mb-1">
        <v-col>
          <v-btn-toggle class="mr-4" dense mandatory v-model="blockType">
            <v-btn
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            >
              <v-icon>mdi-format-header-1</v-icon>
            </v-btn>
            <v-btn
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            >
              <v-icon>mdi-format-header-2</v-icon>
            </v-btn>
            <v-btn
              @click="editor.chain().focus().setParagraph().run()"
              :class="{ 'is-active': editor.isActive('paragraph') }"
            >
              <v-icon>mdi-format-pilcrow</v-icon>
            </v-btn>
            <v-btn
              @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editor.isActive('bulletList') }"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              @click="editor.chain().focus().toggleOrderedList().run()"
              :class="{ 'is-active': editor.isActive('orderedList') }"
            >
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle class="ml-4" dense multiple model="fontStyles">
            <v-btn
              @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>
            <v-btn
              @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <editor-content v-if="editor" :editor="editor" />

      <h2>Saved Content</h2>
      <pre><code>{{ savedContent }}</code></pre>
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
import { Content, Editor, EditorContent, JSONContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";
import * as _ from "lodash";
import { isQuillDeltaString, quillDeltaToTipTapJson } from "@/helpers";

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
      content: {} as JSONContent,
      savedContent: {} as JSONContent,

      blockType: 2,
      fontStyles: [],
    };
  },

  computed: {
    // Decode the initial content.
    tipTapJson(): JSONContent {
      console.log("Initial content", this.initialContent);
      if (isQuillDeltaString(this.initialContent)) {
        console.log("Quill Delta");
        return quillDeltaToTipTapJson(this.initialContent);
      } else {
        console.log("Tip Tap JSON");
        return JSON.parse(this.initialContent);
      }
    },

    elevation(): number | undefined {
      return this.flat ? 0 : undefined;
    },

    isDirty(): boolean {
      return !_.isEqual(this.content, this.savedContent);
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

  methods: {
    setEditMode(enabled: boolean) {
      console.log(`Set edit mode to ${enabled}`);
      this.inEditMode = enabled;
      this.editor.setEditable(enabled);
    },

    backupContent() {
      console.log("Back up content");
      this.savedContent = this.editor.getJSON() as JSONContent;
    },

    restoreContent() {
      console.log("Restore content");
      this.editor.commands.setContent(this.savedContent as Content, false);
    },

    persistContent() {
      console.log("Persist content");
      const content = this.editor.getJSON();
      this.$emit("contentUpdated", content);
    },
  },

  created() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.tipTapJson,
      editable: false,
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
});
</script>

<style>
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
