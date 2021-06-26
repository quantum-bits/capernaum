<template>
  <v-container>
    <page-header title="Surveys">
      <v-switch v-model="showAllSurveys" label="Show All" />
    </page-header>
    <v-row>
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PageHeader from "@/pages/PageHeader.vue";

export default Vue.extend({
  name: "Surveys",

  components: { PageHeader },

  data() {
    return {
      showInactive: false,
    };
  },
});
</script>
