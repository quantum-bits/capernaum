import "./class-component-hooks";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import apolloProvider from "./plugins/apollo";
import { DateTime } from "luxon";
import { truncateWords } from "@/helpers";

Vue.config.productionTip = false;

Vue.filter("standardDate", function (value: string) {
  return DateTime.fromISO(value).toFormat("y-MM-dd");
});

Vue.filter("standardDateTime", function (value: string) {
  return DateTime.fromISO(value).toFormat("y-MM-dd tt");
});

Vue.filter("truncate", function (value: string, maxLength = 100) {
  return value.length > maxLength
    ? `${value.substring(0, maxLength)}...`
    : value;
});

Vue.filter("truncateWords", truncateWords);

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
