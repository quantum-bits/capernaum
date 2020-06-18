import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: { name: "group-sign-up" },
    },
    {
      path: "/group-sign-up",
      name: "group-sign-up",
      component: () => import("./pages/GroupSignUp.vue"),
    },
  ],
});

export default router;