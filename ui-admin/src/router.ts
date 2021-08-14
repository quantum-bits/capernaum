import Vue from "vue";
import VueRouter from "vue-router";
import vuexStore from "./store";
import NotFound from "../src/pages/NotFound.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: { name: "surveys" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./pages/Login.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("./pages/EventsPage.vue"),
    },
    {
      path: "/password",
      name: "password",
      component: () => import("./pages/Password.vue"),
    },
    {
      path: "/letters",
      name: "letters",
      component: () => import("./pages/letters/LettersPage.vue"),
    },
    {
      path: "/qualtrics",
      name: "qualtrics",
      component: () => import("./pages/QualtricsPage.vue"),
    },
    {
      path: "/surveys/:surveyId?",
      name: "surveys",
      component: () => import("./pages/surveys/SurveysPage.vue"),
    },
    {
      path: "/compose/:surveyLetterId?",
      name: "compose",
      component: () => import("./pages/letters/ComposePage.vue"),
    },
    {
      path: "/responses/:surveyId?/:groupId?",
      name: "responses",
      component: () => import("./pages/ResponsesPage.vue"),
    },
    {
      path: "/scripture-engagement-practices",
      name: "scripture-engagement-practices",
      component: () => import("./pages/Practices.vue"),
    },
    {
      path: "/images",
      name: "images",
      component: () => import("./pages/ImagesPage.vue"),
    },
    {
      path: "/groups",
      name: "groups",
      component: () => import("./pages/GroupsPage.vue"),
    },
    {
      path: "/web-hooks",
      name: "web-hooks",
      component: () => import("./pages/WebHooksPage.vue"),
    },
    {
      // See https://router.vuejs.org/guide/essentials/history-mode.html#caveat
      path: "*",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (vuexStore.getters.isLoggedIn) {
    // Already logged in.
    next();
  } else if (to.name === "login") {
    // Avoid infinite loop
    next();
  } else {
    // Force login.
    next({ name: "login" });
  }
});

export default router;
