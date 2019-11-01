import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./pages/About.vue")
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
      component: () => import("./pages/AssociationTable.vue")
    },
    {
      path: "/about-more",
      name: "about-more",
      component: () => import("./pages/About.vue")
    },
    {
      path: "/about-even-more",
      name: "about-even-more",
      component: () => import("./pages/About.vue")
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
