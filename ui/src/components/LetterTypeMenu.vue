<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">
        Add Letter
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in readLetterTypes"
        :key="item.key"
        @click="emitLetterType(item)"
      >
        <v-list-item-title>{{ item.description }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_LETTER_TYPES_QUERY } from "@/graphql/letters.graphql";
import { ReadLetterTypes_readLetterTypes } from "@/graphql/types/ReadLetterTypes";

export default Vue.extend({
  name: "LetterTypeMenu",

  apollo: {
    readLetterTypes: {
      query: ALL_LETTER_TYPES_QUERY,
    },
  },

  data() {
    return {
      letterElementTypes: [],
    };
  },

  methods: {
    emitLetterType(
      readLetterType: ReadLetterTypes_readLetterTypes
    ) {
      this.$emit("click", readLetterType);
    },
  },
});
</script>
