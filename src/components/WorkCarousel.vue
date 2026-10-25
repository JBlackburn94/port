<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { projects } from "../data/projects.js";
import { useReveal, prefersReducedMotion } from "../composables/motion.js";
import ProjectCover from "./ProjectCover.vue";

gsap.registerPlugin(Draggable);

// Each slide stays up for SLIDE_SECONDS; the bar under it shows how long until the next one.
// The timer runs while the carousel is on screen, and pauses only while the active card is
// hovered or the track is being dragged.
const SLIDE_SECONDS = 6;

const root = ref(null);
const track = ref(null);
const cards = ref([]);
const fills = ref([]);
const active = ref(0);

let timer = null;
let hoveringActive = false;
let dragging = false;
let justDragged = false;
let inView = false;
let trigger;
let draggable;

useReveal(root);

const clamp = (i) => Math.max(0, Math.min(projects.length - 1, i));

// Track position that lines card i up with the left edge
const offsetFor = (i) => -(cards.value[i].offsetLeft - cards.value[0].offsetLeft);

const moveTrack = (instant = false) => {
  gsap.to(track.value, {
    x: offsetFor(active.value),
    duration: instant || prefersReducedMotion() ? 0 : 1.1,
    ease: "expo.inOut",
    overwrite: true,
  });
};

const syncTimer = () => {
  if (!timer) return;
  if (inView && !hoveringActive && !dragging) timer.play();
  else timer.pause();
};

const goTo = (i) => {
  active.value = (i + projects.length) % projects.length;
  hoveringActive = false;
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

const hoverCard = (i, over) => {
  hoveringActive = over && i === active.value;
  syncTimer();
};

// After a drag, swallow the click so the card's link doesn't open. A click on a side card
// brings it to the front instead of following its link.
const onTrackClick = (e) => {
  const card = e.target.closest("article");
  const i = cards.value.indexOf(card);
  if (justDragged || (i !== -1 && i !== active.value)) {
    e.preventDefault();
    e.stopPropagation();
    if (!justDragged && i !== -1) goTo(i);
  }
};

const cursorFor = (p, i) => {
  if (i < active.value) return "Prev";
  if (i > active.value) return "Next";
  return p.placeholder ? "Soon" : "View";
};

const onResize = () => moveTrack(true);

onMounted(() => {
  trigger = ScrollTrigger.create({
    trigger: root.value,
    start: "top 80%",
    end: "bottom 20%",
    onToggle: (self) => {
      inView = self.isActive;
      syncTimer();
    },
  });

  [draggable] = Draggable.create(track.value, {
    type: "x",
    dragClickables: true,
    minimumMovement: 6,
    edgeResistance: 0.85,
    allowNativeTouchScrolling: true,
    onPress() {
      justDragged = false;
      this.applyBounds({ minX: offsetFor(projects.length - 1), maxX: 0 });
    },
    onDragStart() {
      dragging = true;
      justDragged = true;
      syncTimer();
    },
    onDragEnd() {
      dragging = false;
      // Settle on the card nearest to where the drag let go; a short flick still moves one card
      const nearest = cards.value.reduce(
        (best, _, i) => (Math.abs(offsetFor(i) - this.x) < Math.abs(offsetFor(best) - this.x) ? i : best),
        0
      );
      const moved = this.x - offsetFor(active.value);
      const flick = Math.abs(moved) > 60 ? (moved < 0 ? 1 : -1) : 0;
      const target = nearest !== active.value ? nearest : clamp(active.value + flick);
      if (target !== active.value) goTo(target);
      else {
        moveTrack();
        syncTimer();
      }
    },
  });

  goTo(0);
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  timer?.kill();
  trigger?.kill();
  draggable?.kill();
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <!-- overflow-x-clip (not hidden) so the sticky controls below still stick to the viewport -->
  <section id="work" ref="root" class="overflow-x-clip bg-ink pt-24 text-paper md:pt-28">
    <div class="mb-10 grid gap-6 px-5 md:mb-14 md:grid-cols-12 md:px-10">
      <p class="label text-lilac md:col-span-3">(03) Selected work</p>
      <h2 class="display text-[16vw] md:col-span-9 md:text-[7.5vw]" data-reveal="lines">
        Things I've <span class="accent text-lime">made</span>
      </h2>
    </div>

    <div class="px-5 md:px-10">
      <div ref="track" class="flex cursor-grab gap-4 select-none active:cursor-grabbing md:gap-6" @click.capture="onTrackClick">
        <article
          v-for="(p, i) in projects"
          :key="p.slug"
          ref="cards"
          class="w-[86%] shrink-0 transition-opacity duration-700 md:w-[64%] xl:w-[58%]"
          :class="i === active ? 'opacity-100' : 'opacity-35 hover:opacity-60'"
          :aria-hidden="i !== active"
          @pointerenter="hoverCard(i, true)"
          @pointerleave="hoverCard(i, false)"
        >
          <component
            :is="p.placeholder ? 'div' : 'RouterLink'"
            :to="p.placeholder ? undefined : `/work/${p.slug}`"
            class="group block"
            :data-cursor="cursorFor(p, i)"
            :tabindex="i === active ? 0 : -1"
            draggable="false"
          >
            <div class="aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/9] md:rounded-3xl">
              <ProjectCover :project="p" />
            </div>
            <!-- Stacked so it reads cleanly however narrow the card gets -->
            <div class="mt-5">
              <div class="flex flex-wrap items-center gap-3">
                <h3 class="text-2xl font-semibold tracking-tight">{{ p.title }}</h3>
                <span
                  class="label rounded-full px-2.5 py-1 whitespace-nowrap"
                  :class="p.placeholder ? 'bg-paper/10 text-paper/60' : 'bg-lime text-ink'"
                >
                  {{ p.status }}
                </span>
              </div>
              <p class="mt-3 max-w-2xl text-paper/70">{{ p.summary }}</p>
              <ul class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="t in p.tags"
                  :key="t"
                  class="label rounded-full border border-lilac/40 px-3 py-1.5 whitespace-nowrap text-lilac"
                >
                  {{ t }}
                </li>
              </ul>
            </div>
          </component>
        </article>
      </div>
    </div>

    <!-- Controls: progress timers plus prev/next. Sticks to the bottom of the screen while the
         carousel is in view, so manual navigation is always in reach. -->
    <div class="sticky bottom-0 z-10 mt-10 bg-ink/85 px-5 pt-5 pb-6 backdrop-blur-md md:mt-14 md:px-10">
      <div class="flex items-center gap-5 md:gap-8">
        <div class="grid min-w-0 flex-1 gap-3 md:gap-4" :style="{ gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))` }">
          <button
            v-for="(p, i) in projects"
            :key="p.slug"
            class="group min-w-0 py-1 text-left"
            :aria-label="`Show ${p.title}`"
            :aria-current="i === active"
            @click="goTo(i)"
          >
            <span class="block h-[3px] overflow-hidden rounded-full bg-paper/15">
              <span ref="fills" class="block h-full origin-left scale-x-0 bg-lime"></span>
            </span>
            <span
              class="label mt-3 hidden justify-between gap-2 transition-colors sm:flex"
              :class="i === active ? 'text-paper' : 'text-paper/40 group-hover:text-paper/70'"
            >
              <span class="truncate">{{ p.title }}</span>
              <span class="hidden md:inline">0{{ i + 1 }}</span>
            </span>
          </button>
        </div>

        <div class="flex shrink-0 gap-2">
          <button
            class="pill size-11 justify-center border border-paper/25 p-0 hover:bg-lime hover:text-ink md:size-12"
            aria-label="Previous project"
            @click="goTo(active - 1)"
          >
            ←
          </button>
          <button
            class="pill size-11 justify-center border border-paper/25 p-0 hover:bg-lime hover:text-ink md:size-12"
            aria-label="Next project"
            @click="goTo(active + 1)"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
