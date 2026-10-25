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
    const name = SplitText.create(".hero-name", { type: "chars", mask: "chars", charsClass: "split-char" });
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(name.chars, { yPercent: 120, duration: 1.3, stagger: 0.035 })
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

    // The badge's ring turns as you scroll rather than spinning by itself
    gsap.to(".hero-badge .spin-badge-ring", {
      rotate: 540,
      ease: "none",
      scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: 0.6 },
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
  <!-- Fills the screen on desktop; on phones it's content-height so the name sits near the top -->
  <section
    ref="root"
    class="relative flex flex-col overflow-hidden px-5 pt-24 pb-12 md:min-h-svh md:justify-end md:px-10 md:pt-24 md:pb-8"
  >
    <div class="label hero-fade mb-auto grid grid-cols-2 gap-4 pt-6 md:grid-cols-4 md:pt-2">
      <span>(00) Portfolio · {{ new Date().getFullYear() }}</span>
      <span class="hidden md:block">{{ site.location }}</span>
      <span class="hidden md:block">{{ time }} local time</span>
      <span v-if="site.available" class="flex items-center justify-end gap-2 md:justify-start">
        <span class="relative flex size-2">
          <!-- Pings four times then rests, so it never animates for longer than 5s (WCAG 2.2.2) -->
          <span
            class="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-75 [animation-iteration-count:4] motion-reduce:animate-none"
          ></span>
          <span class="relative inline-flex size-2 rounded-full bg-[#8fb81a]"></span>
        </span>
        Open to projects
      </span>
    </div>

    <h1 class="sr-only">{{ site.name }}, {{ site.role }}</h1>
    <div aria-hidden="true" class="hero-name display mt-10 text-[19.5vw] whitespace-nowrap md:mt-6 md:text-[21.5vw]">
      <div class="hero-name-a">Jason</div>
      <div class="hero-name-b text-right">Blackburn</div>
    </div>

    <div class="mt-8 grid items-end gap-8 md:mt-6 md:grid-cols-12">
      <!-- Full width on tablets so the tagline keeps to two lines; side by side from lg -->
      <p class="hero-fade text-4xl leading-[1.05] font-medium tracking-tight md:col-span-12 md:text-6xl lg:col-span-6">
        Creative developer<br />
        &amp; <span class="accent text-5xl md:text-7xl">problem solver</span>.
      </p>
      <!-- Paragraph and badge share one flex row so the badge can never sit on top of the text -->
      <div class="flex items-end justify-between gap-8 md:col-span-12 lg:col-span-6 lg:col-start-7">
        <p class="hero-fade max-w-sm text-lg text-ink/70">
          I find what's really getting in the way, design a way through it, and build it into something fast and
          enjoyable to use.
        </p>
        <div class="hero-badge hidden shrink-0 lg:block">
          <SpinBadge text="Scroll · Scroll · Scroll · " />
        </div>
      </div>
    </div>
  </section>
</template>
