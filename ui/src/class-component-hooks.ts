import Component from "vue-class-component";

// Register the router hooks with their names
// https://github.com/vuejs/vue-class-component/blob/master/README.md#adding-custom-hooks
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate" // for vue-router 2.2+
]);
