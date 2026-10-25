<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/projects.js";
import { useReveal, prefersReducedMotion } from "../composables/motion.js";
import ProjectCover from "./ProjectCover.vue";

// Each slide stays up for SLIDE_SECONDS; the bar under it shows how long until the next one.
// Hovering the carousel pauses it, and the timer only runs while the carousel is on screen.
const SLIDE_SECONDS = 6;

const root = ref(null);
const track = ref(null);
const cards = ref([]);
const fills = ref([]);
const active = ref(0);

let timer = null;
let hovering = false;
let inView = false;
let trigger;

useReveal(root);

const moveTrack = (instant = false) => {
  const card = cards.value[active.value];
  gsap.to(track.value, {
    x: -(card.offsetLeft - cards.value[0].offsetLeft),
    duration: instant || prefersReducedMotion() ? 0 : 1.1,
    ease: "expo.inOut",
  });
};

const syncTimer = () => {
  if (!timer) return;
  if (inView && !hovering) timer.play();
  else timer.pause();
};

const goTo = (i) => {
  active.value = (i + projects.length) % projects.length;
  moveTrack();

  timer?.kill();
  fills.value.forEach((f, n) => gsap.set(f, { scaleX: n < active.value ? 1 : 0 }));
  timer = gsap.to(fills.value[active.value], {
    scaleX: 1,
    duration: SLIDE_SECONDS,
    ease: "none",
    paused: true,
    onComplete: () => goTo(active.value + 1),
  });
  syncTimer();
};

const setHover = (v) => {
  hovering = v;
  syncTimer();
};

const onResize = () => moveTrack(true);

onMounted(() => {
  trigger = ScrollTrigger.create({
    trigger: root.value,
    start: "top 70%",
    end: "bottom 30%",
    onToggle: (self) => {
      inView = self.isActive;
      syncTimer();
    },
  });
  goTo(0);
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  timer?.kill();
  trigger?.kill();
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <section id="work" ref="root" class="overflow-hidden bg-ink py-24 text-paper md:py-36">
    <div class="mb-14 grid gap-6 px-5 md:mb-20 md:grid-cols-12 md:px-10">
      <p class="label text-lilac md:col-span-3">(03) Selected work</p>
      <h2 class="display text-[16vw] md:col-span-6 md:text-[8.5vw]" data-reveal="lines">
        Things I've <span class="accent text-lime">made</span>
      </h2>
      <div class="flex items-end gap-2 md:col-span-3 md:justify-end" data-reveal="fade">
        <button
          class="pill size-12 justify-center border border-paper/25 p-0 hover:bg-lime hover:text-ink"
          aria-label="Previous project"
          @click="goTo(active - 1)"
        >
          ←
        </button>
        <button
          class="pill size-12 justify-center border border-paper/25 p-0 hover:bg-lime hover:text-ink"
          aria-label="Next project"
          @click="goTo(active + 1)"
        >
          →
        </button>
      </div>
    </div>

    <div class="px-5 md:px-10" @pointerenter="setHover(true)" @pointerleave="setHover(false)">
      <div ref="track" class="flex gap-4 md:gap-6">
        <article
          v-for="(p, i) in projects"
          :key="p.slug"
          ref="cards"
          class="w-[88%] shrink-0 transition-opacity duration-700 md:w-[74%]"
          :class="i === active ? 'opacity-100' : 'opacity-35'"
          :aria-hidden="i !== active"
        >
          <component
            :is="p.placeholder ? 'div' : 'RouterLink'"
            :to="p.placeholder ? undefined : `/work/${p.slug}`"
            class="group block"
            :data-cursor="p.placeholder ? 'Soon' : 'View'"
            :tabindex="i === active ? 0 : -1"
          >
            <div class="aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/8] md:rounded-3xl">
              <ProjectCover :project="p" />
            </div>
            <div class="mt-5 grid gap-3 md:grid-cols-12 md:items-start">
              <div class="flex items-center gap-3 md:col-span-4">
                <h3 class="text-2xl font-semibold tracking-tight">{{ p.title }}</h3>
                <span
                  class="label rounded-full px-2.5 py-1"
                  :class="p.placeholder ? 'bg-paper/10 text-paper/60' : 'bg-lime text-ink'"
                >
                  {{ p.status }}
                </span>
              </div>
              <p class="text-paper/70 md:col-span-5">{{ p.summary }}</p>
              <p class="label text-lilac md:col-span-3 md:text-right">{{ p.tags.join(" · ") }}</p>
            </div>
          </component>
        </article>
      </div>

      <!-- Progress timers: one per project, the active one fills until the carousel moves on -->
      <div class="mt-12 grid gap-4 md:mt-16" :style="{ gridTemplateColumns: `repeat(${projects.length}, 1fr)` }">
        <button
          v-for="(p, i) in projects"
          :key="p.slug"
          class="group text-left"
          :aria-label="`Show ${p.title}`"
          :aria-current="i === active"
          @click="goTo(i)"
        >
          <span class="block h-[3px] overflow-hidden rounded-full bg-paper/15">
            <span ref="fills" class="block h-full origin-left scale-x-0 bg-lime"></span>
          </span>
          <span
            class="label mt-3 flex justify-between transition-colors"
            :class="i === active ? 'text-paper' : 'text-paper/40 group-hover:text-paper/70'"
          >
            <span>{{ p.title }}</span>
            <span class="hidden md:inline">0{{ i + 1 }}</span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
