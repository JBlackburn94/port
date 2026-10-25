<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startSmoothScroll, scrollToTop, getLenis } from "./composables/motion.js";
import ThePreloader from "./components/ThePreloader.vue";
import TheCursor from "./components/TheCursor.vue";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";

const router = useRouter();

// Scrolls to the route's #hash target (smoothly when staying on the same page), or to the top
async function scrollForRoute(to, samePage) {
  await nextTick();
  // Web fonts change heights, so wait for them before measuring where anything is
  await document.fonts.ready;
  // New page content changes the layout; let triggers and Lenis re-measure
  ScrollTrigger.refresh();
  getLenis()?.resize();

  const target = to.hash && document.querySelector(to.hash);
  if (target) {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -20, immediate: !samePage, duration: 1.4, force: true });
    else target.scrollIntoView({ behavior: samePage ? "smooth" : "auto" });
  } else if (!samePage) {
    scrollToTop();
  }
}

onMounted(async () => {
  startSmoothScroll();
  await router.isReady();
  // A direct visit to /#work: give the page a frame to lay out, then jump
  if (router.currentRoute.value.hash) requestAnimationFrame(() => scrollForRoute(router.currentRoute.value, false));

  router.afterEach((to, from) => scrollForRoute(to, to.path === from.path));
});
</script>

<template>
  <ThePreloader />
  <TheCursor />
  <SiteHeader />
  <main>
    <RouterView :key="$route.path" />
  </main>
  <SiteFooter />
</template>
