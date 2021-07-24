<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color">
    {{ content }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="visible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Snackbar",

  props: {
    timeout: { type: Number, required: false },
  },

  data() {
    return {
      content: "",
      color: "primary",
      visible: false,
    };
  },

  methods: {
    trigger(
      content: string,
      color: "primary" | "warning" | "error" = "primary"
    ) {
      this.content = content;
      this.color = color;
      this.visible = true;
    },
  },
});
</script>
