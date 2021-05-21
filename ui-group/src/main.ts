import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import apolloProvider from "./plugins/apollo";

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
