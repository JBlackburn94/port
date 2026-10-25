import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/work/:slug", name: "project", component: () => import("./views/ProjectView.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  // Scrolling (top of page, #hash targets) is handled in App.vue so it goes through Lenis
  scrollBehavior: () => false,
});

createApp(App).use(router).mount("#app");
