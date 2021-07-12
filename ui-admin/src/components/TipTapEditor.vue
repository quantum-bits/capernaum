<template>
  <v-card :elevation="elevation">
    <v-card-title v-if="title">{{ title }}</v-card-title>

    <v-card-text>
      <editor-content
        v-if="editor"
        :editor="editor"
        class="prose-mirror-wrapper"
        :class="classBindings"
      />
    </v-card-text>

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
      this.inEditMode = enabled;
      this.editor.setEditable(enabled);
    },

    backupContent() {
      this.savedContent = this.editor.getJSON() as JSONContent;
    },

    restoreContent() {
      this.editor.commands.setContent(this.savedContent as Content, false);
    },

    persistContent() {
      const content = this.editor.getJSON();
      this.$emit("contentUpdated", content);
    },
  },

  created() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.tipTapJson,
      editable: false,
      onUpdate: () => {
        this.content = this.editor.getJSON() as JSONContent;
      },
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
