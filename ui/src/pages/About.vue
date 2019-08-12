<template>
  <v-container>
    <h1 class="display-4">About</h1>
    <p class="body-1" v-for="i in count" :key="i">{{ content }}</p>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";

@Component
export default class About extends Vue {
  count = 4;
  content = "This is an about page.";
  //info: AxiosResponse;
  mounted() {
    axios
      //.get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .get("http://localhost:4000/scripture-engagement-practices")
      .then((response: AxiosResponse) => {
        console.log(response);
      });
  }
}
</script>
