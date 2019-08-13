<template>
  <v-app>
    <ToolBar />

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ToolBar from "./ToolBar.vue";

@Component({
  components: {
    ToolBar
  }
})
export default class DefaultLayout extends Vue {}
</script>
