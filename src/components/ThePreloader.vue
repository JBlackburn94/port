<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ready, prefersReducedMotion, getLenis } from "../composables/motion.js";

// Full intro on the first visit of a browser session, then skipped
const SEEN_KEY = "jb-preloader-seen";
const seen = (() => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
})();

const show = ref(!seen && !prefersReducedMotion());
const root = ref(null);
const count = ref(0);

onMounted(() => {
  if (!show.value) {
    ready.value = true;
    return;
  }

  getLenis()?.stop();
  const counter = { v: 0 };

  gsap
    .timeline({
      onComplete: () => {
        show.value = false;
        getLenis()?.start();
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      },
    })
    .from(".preloader-word", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0)
    .to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => (count.value = Math.round(counter.v)),
    }, 0)
    .to(".preloader-bar", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
    .add(() => (ready.value = true), "+=0.05")
    .to(root.value, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "<");
});
</script>

<template>
  <div
    v-if="show"
    ref="root"
    class="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 text-paper md:p-8"
    aria-hidden="true"
  >
    <div class="label flex justify-between text-lilac">
      <span>Portfolio · Vol. 01</span>
      <span>Loading</span>
    </div>

    <div class="overflow-hidden">
      <p class="display text-[16vw] md:text-[11vw]">
        <span class="preloader-word inline-block">Problem</span>
        <span class="preloader-word accent inline-block text-lime">&amp;</span>
        <span class="preloader-word inline-block">Solved</span>
      </p>
    </div>

    <div>
      <div class="flex items-end justify-between">
        <span class="display text-7xl tabular-nums md:text-9xl">{{ count }}%</span>
        <span class="label text-lilac">Jason Blackburn</span>
      </div>
      <div class="preloader-bar mt-4 h-px origin-left scale-x-0 bg-lime"></div>
    </div>
  </div>
</template>
