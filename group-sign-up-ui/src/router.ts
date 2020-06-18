import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: { name: "take-survey" },
    },
    {
      path: "/group-sign-up",
      name: "group-sign-up",
      component: () => import("./pages/GroupSignUp.vue"),
    },
    {
      path: "/take-survey",
      name: "take-survey",
      component: () => import("./pages/RedirectToSurvey.vue"),
    },
  ],
});

export default router;