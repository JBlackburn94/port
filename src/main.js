import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import HomeView from "./views/HomeView.vue";
// Bundled with the app (it's ~4KB) rather than lazy-loaded: loading it separately left the
// footer at the top of an empty page until it arrived, then shoved it down (a big layout shift)
import ProjectView from "./views/ProjectView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/work/:slug", name: "project", component: ProjectView },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  // Scrolling (top of page, #hash targets) is handled in App.vue so it goes through Lenis
  scrollBehavior: () => false,
});

createApp(App).use(router).mount("#app");
