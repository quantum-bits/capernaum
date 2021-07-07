import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import { Login_login as Response } from "@/graphql/types/Login";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    user: {}, // Details of logged-in user
    darkMode: true, // UI in dark mode?
    accessToken: "",
  },

  getters: {
    isLoggedIn(state) {
      return state.accessToken.length > 0;
    },
  },

  mutations: {
    logIn(state, response: Response) {
      state.accessToken = response.accessToken;
      state.user = response.user;
    },

    logOut(state) {
      state.accessToken = "";
      state.user = {};
    },

    setDarkMode(state, newValue: boolean) {
      state.darkMode = newValue;
    },
  },
});
