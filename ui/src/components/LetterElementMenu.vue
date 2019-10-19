<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">
        Add Letter Element
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in letterElementTypes"
        :key="item.key"
        @click="emitLetterElementType(item)"
      >
        <v-list-item-title>{{ item.description }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_LETTER_ELEMENT_TYPES_QUERY } from "@/graphql/letters.graphql";
import { OneLetter_letter_letterElements_letterElementType } from "@/graphql/types/OneLetter";

export default Vue.extend({
  name: "ComposeMenu",

  apollo: {
    letterElementTypes: {
      query: ALL_LETTER_ELEMENT_TYPES_QUERY
    }
  },

  data() {
    return {
      letterElementTypes: []
    };
  },

  methods: {
    emitLetterElementType(
      letterElementType: OneLetter_letter_letterElements_letterElementType
    ) {
      this.$emit("click", letterElementType);
    }
  }
});
</script>
