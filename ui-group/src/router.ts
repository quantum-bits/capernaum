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
      component: () => import("./pages/RegisterGroup.vue"),
    },
    {
      path: "/registration-complete",
      name: "registration-complete",
      component: () => import("./pages/Complete.vue"),
    },
    {
      path: "/new-stepper",
      name: "new-stepper",
      component: () => import("./pages/NewStepper.vue"),
    },
  ],
});

export default router;
