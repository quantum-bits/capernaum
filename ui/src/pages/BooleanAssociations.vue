<template>
  <v-container v-if="oneLetter">
    <v-layout v-if="oneLetter.isFrozen" class="mb-3">
      <v-flex xs12>
        <v-alert :value="true" type="info">
          Note that this association table has been frozen -- it is no longer
          editable.
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8>
        <h1 class="headline mb-3">Boolean Association Table</h1>
        <h2 class="title font-weight-regular mb-1">
          Survey:
          <span class="font-weight-light">{{ oneLetter.survey.title }}</span>
        </h2>
        <h2 class="title font-weight-regular mb-1">
          Letter:
          <span class="font-weight-light">{{ oneLetter.title }}</span>
        </h2>
        <h2 class="title font-weight-regular mb-5">
          Last Update:
          <span class="font-weight-light">{{
            oneLetter.updated | dateAndTime
          }}</span>
        </h2>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <AssociationTable
          :letterId="oneLetter.id"
          :allowHideTable="allowHideTable"
        ></AssociationTable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AssociationTable from "../components/AssociationTable.vue";
import { LetterTypeEnum } from "../types/letter.types";

import { ONE_LETTER_QUERY } from "@/graphql/letters.graphql";

import { OneLetter, OneLetter_letter } from "@/graphql/types/OneLetter";

@Component({
  components: { AssociationTable },
  apollo: {
    oneLetter: {
      query: ONE_LETTER_QUERY,
      variables() {
        return {
          letterId: parseInt(this.$route.params.letterId),
        };
      },
      update(oneLetter: OneLetter) {
        console.log("inside update; letter data: ", oneLetter);
        return oneLetter.letter; // return oneLetter
      },
      skip() {
        console.log("skipping fetch of letter data....");
        return this.$route.params.letterId === undefined;
      },
    },
  },
})
export default class BooleanAssociations extends Vue {
  oneLetter: OneLetter_letter | null = null;
  allowHideTable = false;
}
</script>
