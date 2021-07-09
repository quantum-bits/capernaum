<template>
  <v-container>
    <tip-tap-editor title="Email Cover Letter" :tip-tap-json="emailMessage" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TipTapEditor from "@/components/TipTapEditor.vue";

export default Vue.extend({
  name: "LetterDetailsCoverLetter",

  components: {
    TipTapEditor,
  },

  props: {
    emailMessage: {
      type: Object,
      required: true,
    },
  },
});
</script>
