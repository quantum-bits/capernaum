<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <editor-content v-if="editor" :editor="editor" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        :is-data-dirty="isDirty"
        :is-data-valid="isValid"
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
import { Content, Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";
import * as _ from "lodash";

type TipTapContent = Record<string, string | number>;

export default Vue.extend({
  name: "TipTapEditor",

  components: {
    EditorContent,
    EditSaveDeleteCancelButtons,
  },

  props: {
    title: { type: String, required: true },
    tipTapJson: { type: Object, required: true },
  },

  data() {
    return {
      editor: {} as Editor,
      inEditMode: false,
      content: {} as TipTapContent,
      savedContent: {} as TipTapContent,
    };
  },

  computed: {
    isDirty(): boolean {
      return !_.isEqual(this.content, this.savedContent);
    },

    isValid(): boolean {
      return !this.editor.isEmpty;
    },
  },

  methods: {
    setEditMode(enabled: boolean) {
      this.inEditMode = enabled;
      this.editor.setEditable(enabled);
    },

    backupContent() {
      this.savedContent = this.editor.getJSON();
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
        this.content = this.editor.getJSON();
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
});
</script>
