<template>
  <v-card-actions class="mb-4">
    <v-spacer />
    <v-btn text color="primary" :disabled="!editEnabled" @click="enterEditMode">
      Edit
    </v-btn>
    <v-btn text color="warning" :disabled="!saveEnabled"> Save </v-btn>
    <v-btn
      text
      color="error"
      :disabled="!deleteEnabled"
      @click="$emit('remove-element')"
    >
      Delete
    </v-btn>
    <v-btn text :disabled="!cancelEnabled" @click="cancelEditMode">
      Cancel
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ElementButtons",

  data() {
    return {
      editEnabled: true,
      saveEnabled: false,
      cancelEnabled: false,
      deleteEnabled: false,
    };
  },

  methods: {
    enterEditMode() {
      this.editEnabled = false;
      this.saveEnabled = true;
      this.deleteEnabled = true;
      this.cancelEnabled = true;
    },

    cancelEditMode() {
      this.editEnabled = true;
      this.saveEnabled = false;
      this.deleteEnabled = false;
      this.cancelEnabled = false;
    },
  },
});
</script>
