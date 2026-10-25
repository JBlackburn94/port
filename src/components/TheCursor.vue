<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";

// A lime dot that trails the pointer. Over anything with data-cursor="Label" it grows into a
// circle showing that label; over other links and buttons it just swells a little.
const dot = ref(null);
const label = ref("");
const enabled = ref(false);

// The circle is drawn at full label size and shrunk at rest, so the label stays crisp
const REST = 0.16;
let xTo, yTo;

const onMove = (e) => {
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
  });
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove("has-cursor");
  window.removeEventListener("pointermove", onMove);
  document.removeEventListener("pointerover", onOver);
  document.removeEventListener("pointerleave", onLeaveWindow);
});
</script>

<template>
  <div
    v-if="enabled"
    ref="dot"
    class="pointer-events-none fixed top-0 left-0 z-[90] flex size-24 items-center justify-center rounded-full bg-lime"
    aria-hidden="true"
  >
    <span
      class="font-mono text-xs font-semibold tracking-wide whitespace-nowrap text-ink uppercase transition-opacity duration-200"
      :class="label ? 'opacity-100' : 'opacity-0'"
      >{{ label }}</span
    >
  </div>
</template>
