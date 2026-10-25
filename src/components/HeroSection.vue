<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { site } from "../data/site.js";
import { useLocalTime } from "../composables/clock.js";
import { ready, prefersReducedMotion } from "../composables/motion.js";
import SpinBadge from "./SpinBadge.vue";

const root = ref(null);
const time = useLocalTime();
let ctx;

const intro = () => {
  ctx = gsap.context(() => {
    if (prefersReducedMotion()) return;
    const name = SplitText.create(".hero-name", { type: "chars", mask: "chars" });
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(name.chars, { yPercent: 105, duration: 1.3, stagger: 0.035 })
      .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.4)
      .from(".hero-badge", { scale: 0, rotate: -90, duration: 1.4 }, 0.5);

    // The name drifts apart slightly as the hero scrolls away
    gsap.to(".hero-name-a", {
      xPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-name-b", {
      xPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: true },
    });
  }, root.value);
};

onMounted(() => {
  document.fonts.ready.then(() => {
    if (ready.value) intro();
    else watch(ready, (v) => v && intro(), { once: true });
  });
});

onBeforeUnmount(() => ctx?.revert());
</script>

<template>
  <section ref="root" class="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pt-28 pb-8 md:px-10">
    <div class="label hero-fade mb-auto grid grid-cols-2 gap-4 pt-6 md:grid-cols-4">
      <span>(00) Portfolio · {{ new Date().getFullYear() }}</span>
      <span class="hidden md:block">{{ site.location }}</span>
      <span class="hidden md:block">{{ time }} local time</span>
      <span v-if="site.available" class="flex items-center justify-end gap-2 md:justify-start">
        <span class="relative flex size-2">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-75"></span>
          <span class="relative inline-flex size-2 rounded-full bg-[#8fb81a]"></span>
        </span>
        Open to projects
      </span>
    </div>

    <h1 class="sr-only">{{ site.name }}, {{ site.role }}</h1>
    <div aria-hidden="true" class="hero-name display mt-16 text-[19.5vw] leading-[0.8] whitespace-nowrap md:text-[21.5vw]">
      <div class="hero-name-a">Jason</div>
      <div class="hero-name-b text-right">Blackburn</div>
    </div>

    <div class="mt-8 grid items-end gap-8 md:grid-cols-12">
      <p class="hero-fade text-4xl leading-[1.05] font-medium tracking-tight md:col-span-6 md:text-6xl">
        Creative <span class="accent text-5xl md:text-7xl">problem solver</span><br />
        &amp; developer.
      </p>
      <p class="hero-fade max-w-sm text-lg text-ink/70 md:col-span-4 md:col-start-8">
        I find what's really getting in the way, design a way through it, and build it into something fast and
        enjoyable to use.
      </p>
      <div class="hero-badge hidden justify-end md:col-span-1 md:col-start-12 md:flex">
        <SpinBadge text="Scroll · Explore · Scroll · Explore · " />
      </div>
    </div>
  </section>
</template>
