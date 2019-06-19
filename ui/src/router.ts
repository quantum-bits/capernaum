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
      path: "/compose/:id?",
      name: "compose",
      component: () => import("./pages/Compose.vue")
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
    }
  ]
});
