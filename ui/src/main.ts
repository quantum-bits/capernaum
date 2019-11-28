import "./class-component-hooks";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import apolloProvider from "./plugins/apollo";
import { DateTime } from "luxon";

Vue.config.productionTip = false;

Vue.filter("sensibleDate", function(value: string) {
  const dt = DateTime.fromISO(value);
  return dt.toFormat("y-MM-dd");
});

Vue.filter("dateAndTime", function(value: string) {
  const dt = DateTime.fromISO(value);
  return dt.toFormat("y-M-d tt");
});

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
