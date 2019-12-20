<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">{{ customTitle }}</v-card-title>
        <v-card-text>{{ customText }}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="cancel()">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="confirmDelete()"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  /** dialog for confirming delete */
  // see: https://stackoverflow.com/questions/48035310/open-a-vuetify-dialog-from-a-component-template-in-vuejs
  //      (under "No event bus needed and v-model")
  name: "ConfirmDeleteDialog",

  props: {
    value: Boolean, // Whether dialog is visible
    customTitle: String,
    customText: String
  },

  data() {
    return {
      serverError: false as boolean,
      surveyData: null as any
    };
  },

  methods: {
    cancel() {
      this.show = false;
    },
    confirmDelete() {
      this.$emit("delete-is-confirmed");
      this.show = false;
    }
  },

  computed: {
    show: {
      get(): boolean {
        return this.value;
      },
      set(newValue: boolean): void {
        this.$emit("input", newValue);
      }
    }
  }
});
</script>
