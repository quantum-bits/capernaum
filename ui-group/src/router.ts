import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("./pages/Landing.vue"),
    },
    {
      path: "/register-group",
      name: "group-sign-up",
      component: () => import("./pages/GroupSignUp.vue"),
    },
  ],
});

export default router;
