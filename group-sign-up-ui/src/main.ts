import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import apolloProvider from "./plugins/apollo";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider,
  vuetify,
  render: h => h(App)
}).$mount('#app')
