<template>
  <v-list>
    <v-list-item two-line v-for="(item, idx) in info" :key="idx">
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export interface StaticInfoItem {
  name: string;
  value: string;
}

export default Vue.extend({
  name: "StaticInfoList",

  props: {
    info: {
      type: Array as () => StaticInfoItem[],
      required: true,
    },
  },
});
</script>
