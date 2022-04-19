<template>
  <div>
    <v-btn
      text
      color="primary"
      :disabled="!enableEditButton"
      @click="enterEditMode"
      data-cy="edit-save-cancel-edit-btn"
    >
      Edit
    </v-btn>

    <v-btn
      text
      color="warning"
      :disabled="!enableSaveButton"
      @click="saveChanges"
      data-cy="edit-save-cancel-save-btn"
    >
      Save
    </v-btn>

    <v-btn
      text
      :disabled="!enableCancelButton"
      @click="cancelEditMode"
      data-cy="edit-save-cancel-cancel-btn"
    >
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

/* Template:
  <edit-save-cancel-buttons
   :is-data-valid=""
   :is-data-dirty=""
   @enter-edit-mode=""
   @leave-edit-mode=""
   @backup-data=""
   @restore-data=""
   @persist-data=""/>
*/

export default Vue.extend({
  name: "EditSaveCancelButtons",

  props: {
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

    cancelEditMode(): void {
      this.$emit("restore-data");
      this.$emit("leave-edit-mode");
      this.inEditMode = false;
    },
  },
});
</script>
