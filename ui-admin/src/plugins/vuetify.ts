import Vue from "vue";
import Vuetify from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";

// Fix per https://github.com/vuetifyjs/vuetify/issues/12224#issuecomment-703061437
Vue.use(Vuetify, {
  directives: { Ripple },
});

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
});
