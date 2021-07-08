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
    <v-btn text :disabled="!enableCancelButton" @click="cancelEditMode">
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

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
      this.$emit("enterEditMode");
      this.$emit("backupData");
      this.inEditMode = true;
    },

    cancelEditMode(): void {
      this.$emit("leaveEditMode");
      this.$emit("restoreData");
      this.inEditMode = false;
    },

    saveChanges(): void {
      this.$emit("persistData");
      this.$emit("backupData");
      this.$emit("leaveEditMode");
      this.inEditMode = false;
    },
  },
});
</script>
