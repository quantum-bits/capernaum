import Vue from "vue";
import VueRouter from "vue-router";
import vuexStore from "./store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: { name: "letters" }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./pages/Login.vue")
    },
    {
      path: "/letters",
      name: "letters",
      component: () => import("./pages/Letters.vue")
    },
    {
      path: "/survey-dimensions",
      name: "survey-dimensions",
      component: () => import("./pages/SurveyDimensions.vue")
    },
    {
      path: "/import-qualtrics-survey",
      name: "import-qualtrics-survey",
      component: () => import("./pages/ImportQualtricsSurvey.vue")
    },
    {
      path: "/imported-surveys",
      name: "imported-surveys",
      component: () => import("./pages/ImportedSurveys.vue")
    },
    {
      path: "/compose/:letterId?",
      name: "compose",
      component: () => import("./pages/Compose.vue")
    },
    {
      path: "/association-table/:letterId",
      name: "association-table",
      component: () => import("./pages/BooleanAssociations.vue")
    },
    {
      path: "/responses",
      name: "responses",
      component: () => import("./pages/Responses.vue")
    },
    {
      path: "/scripture-engagement-practices",
      name: "scripture-engagement-practices",
      component: () => import("./pages/ScriptureEngagementPractices.vue")
    },
    {
      path: "/images",
      name: "images",
      component: () => import("./pages/Images.vue")
    }
  ]
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
