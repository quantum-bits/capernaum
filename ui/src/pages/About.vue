<template>
  <v-container>
    <h1 class="display-4">About</h1>
    <p class="body-1" v-for="i in count" :key="i">{{ content }}</p>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
  count = 4;
  content = "This is an about page.";
}
</script>
