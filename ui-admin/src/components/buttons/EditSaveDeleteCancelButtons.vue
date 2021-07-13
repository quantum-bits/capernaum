<template>
  <div>
    <v-btn
      text
      color="primary"
      :disabled="!enableEditButton"
      @click="enterEditMode"
    >
      Edit
    </v-btn>

    <v-btn
      text
      color="warning"
      :disabled="!enableSaveButton"
      @click="saveChanges"
    >
      Save
    </v-btn>

    <v-btn
      text
      color="error"
      v-if="allowDelete"
      :disabled="!enableDeleteButton"
      @click="deleteData"
    >
      Delete
    </v-btn>

    <v-btn text :disabled="!enableCancelButton" @click="cancelEditMode">
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "EditSaveDeleteCancelButtons",

  props: {
    allowDelete: {
      type: Boolean,
      default: false,
    },

    isDataDirty: {
      type: Boolean,
      required: true,
    },

    isDataValid: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      inEditMode: false,
    };
  },

  computed: {
    enableEditButton(): boolean {
      return !this.inEditMode;
    },

    enableSaveButton(): boolean {
      return this.inEditMode && this.isDataDirty && this.isDataValid;
    },

    enableDeleteButton(): boolean {
      return this.inEditMode;
    },

    enableCancelButton(): boolean {
      return this.inEditMode;
    },
  },

  methods: {
    enterEditMode(): void {
      this.$emit("backup-data");
      this.$emit("enter-edit-mode");
      this.inEditMode = true;
    },

    saveChanges(): void {
      this.$emit("persist-data");
      this.$emit("backup-data");
      this.$emit("leave-edit-mode");
      this.inEditMode = false;
    },

    deleteData(): void {
      this.$emit("delete-data");
      this.$emit("leave-edit-mode");
      this.inEditMode = false;
    },

    cancelEditMode(): void {
      this.$emit("restore-data");
      this.$emit("leave-edit-mode");
      this.inEditMode = false;
    },
  },
});
</script>
