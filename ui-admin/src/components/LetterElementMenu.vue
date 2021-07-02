<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on"> Add Letter Element </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="item in filteredLetterElementTypes"
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
import {
  OneLetter_letter_letterElements_letterElementType,
  OneLetter_letter_surveyLetters_letterType,
  OneLetter_letter_surveyLetters_letterType_letterElementTypes,
} from "@/graphql/types/OneLetter";

export default Vue.extend({
  name: "ComposeMenu",

  props: {
    letterType: Object as () => OneLetter_letter_surveyLetters_letterType,
  },

  computed: {
    filteredLetterElementTypes(): OneLetter_letter_surveyLetters_letterType_letterElementTypes[] {
      console.log("inside computed!", this.letterType);
      //let returnArray: OneLetter_letter_letterType_letterElementTypes;
      if (this.letterType === undefined) {
        console.log("no letter type yet!");
        return [];
      } else {
        console.log("we got letters!");
        return this.letterType.letterElementTypes;
      }
    },
  },

  data() {
    return {
      letterElementTypes: [],
    };
  },

  methods: {
    emitLetterElementType(
      letterElementType: OneLetter_letter_letterElements_letterElementType
    ) {
      this.$emit("click", letterElementType);
    },
  },

  mounted: function () {
    console.log("mounted!", this.letterType);
  },
});
</script>
