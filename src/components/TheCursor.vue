<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";

// A lime dot that trails the pointer. Over anything with data-cursor="Label" it grows into a
// circle showing that label; over other links and buttons it just swells a little.
// It never takes the colour of what's underneath it, including an element's hover colour.
const dot = ref(null);
const label = ref("");
const enabled = ref(false);

// Cursor colours in order of preference; the first that clashes with nothing beneath wins
const SWATCHES = [
  { rgb: [194, 236, 64], classes: "bg-lime text-ink" },
  { rgb: [21, 7, 52], classes: "bg-ink text-lime" },
  { rgb: [246, 243, 252], classes: "bg-paper text-ink" },
];
const swatch = ref(SWATCHES[0]);

// The circle is drawn at full label size and shrunk at rest, so the label stays crisp
const REST = 0.16;
let xTo, yTo;
let lastX = -1;
let lastY = -1;
let scrollFrame = 0;
let hovered = null;

const parseColour = (css) => {
  const [r, g, b, a = 1] = (css?.match(/[\d.]+/g) || []).map(Number);
  return a > 0.5 ? [r, g, b] : null;
};

// Every colour that can show behind the pointer: the first opaque background up the tree,
// plus both ends of any background transition under way on the way up. Hover styles start
// such a transition as the pointer enters (e.g. "Let's talk" easing from lime to indigo),
// so this catches an element's hover colour as well as its resting one.
const backgroundsAt = (el) => {
  const colours = [];
  for (; el && el !== document.documentElement; el = el.parentElement) {
    // Reading the computed style first flushes styles, so hover transitions have started
    const own = parseColour(getComputedStyle(el).backgroundColor);
    for (const anim of el.getAnimations()) {
      if (anim.transitionProperty !== "background-color") continue;
      for (const frame of anim.effect.getKeyframes()) {
        const colour = parseColour(frame.backgroundColor);
        if (colour) colours.push(colour);
      }
    }
    if (own) {
      colours.push(own);
      break;
    }
  }
  return colours;
};

const clashes = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 70;

const checkBackground = (el) => {
  hovered = el;
  const beneath = backgroundsAt(el);
  swatch.value = SWATCHES.find((s) => !beneath.some((c) => clashes(s.rgb, c))) || SWATCHES[0];
};

// A hover transition can begin a moment after pointerover; re-check when one starts beneath us
const onTransitionRun = (e) => {
  if (e.propertyName === "background-color" && hovered && e.target.contains(hovered)) checkBackground(hovered);
};

const onMove = (e) => {
  lastX = e.clientX;
  lastY = e.clientY;
  xTo(e.clientX);
  yTo(e.clientY);
  gsap.to(dot.value, { autoAlpha: 1, duration: 0.3 });
};

const onOver = (e) => {
  const labelled = e.target.closest("[data-cursor]");
  const clickable = e.target.closest("a, button, [role='button']");
  label.value = labelled?.dataset.cursor || "";
  const scale = labelled ? 1 : clickable ? 0.4 : REST;
  gsap.to(dot.value, { scale, duration: 0.45, ease: "expo.out" });
  checkBackground(e.target);
};

// Scrolling moves the page under a still pointer, so re-check what's beneath it
const onScroll = () => {
  if (lastX < 0 || scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    checkBackground(document.elementFromPoint(lastX, lastY));
  });
};

const onLeaveWindow = () => gsap.to(dot.value, { autoAlpha: 0, duration: 0.3 });

onMounted(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  enabled.value = true;
  document.documentElement.classList.add("has-cursor");

  requestAnimationFrame(() => {
    gsap.set(dot.value, { xPercent: -50, yPercent: -50, scale: REST, autoAlpha: 0 });
    xTo = gsap.quickTo(dot.value, "x", { duration: 0.35, ease: "power3.out" });
    yTo = gsap.quickTo(dot.value, "y", { duration: 0.35, ease: "power3.out" });
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("transitionrun", onTransitionRun);
  });
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove("has-cursor");
  window.removeEventListener("pointermove", onMove);
  document.removeEventListener("pointerover", onOver);
  document.removeEventListener("pointerleave", onLeaveWindow);
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("transitionrun", onTransitionRun);
  cancelAnimationFrame(scrollFrame);
});
</script>

<template>
  <div
    v-if="enabled"
    ref="dot"
    class="pointer-events-none fixed top-0 left-0 z-[90] flex size-24 items-center justify-center rounded-full transition-colors duration-300"
    :class="swatch.classes"
    aria-hidden="true"
  >
    <span
      class="font-mono text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-opacity duration-200"
      :class="label ? 'opacity-100' : 'opacity-0'"
      >{{ label }}</span
    >
  </div>
</template>
