<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../composables/motion.js";

const props = defineProps({
  items: { type: Array, required: true },
});

const track = ref(null);
let tween, trigger;

onMounted(() => {
  if (prefersReducedMotion()) return;
  // The track holds two copies, so sliding it half its width loops seamlessly. It only moves
  // while the page scrolls (faster scrolling, faster band; scrolling up reverses it) and eases
  // to a stop shortly after, so nothing moves on its own for more than a moment (WCAG 2.2.2).
  tween = gsap.to(track.value, { xPercent: -50, duration: 28, ease: "none", repeat: -1 }).timeScale(0);

  trigger = ScrollTrigger.create({
    onUpdate: (self) => {
      const speed = 1 + Math.min(Math.abs(self.getVelocity()) / 200, 6);
      gsap.to(tween, { timeScale: speed * self.direction, duration: 0.2, overwrite: true });
      gsap.to(tween, { timeScale: 0, duration: 1.2, delay: 0.2 });
    },
  });
});

onBeforeUnmount(() => {
  tween?.kill();
  trigger?.kill();
});
</script>

<template>
  <div class="overflow-hidden bg-lime py-5 text-ink md:py-7" aria-hidden="true">
    <div ref="track" class="flex w-max">
      <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <template v-for="item in props.items" :key="`${copy}-${item}`">
          <span class="display px-6 text-6xl md:text-8xl">{{ item }}</span>
          <span class="text-4xl md:text-6xl">✺</span>
        </template>
      </div>
    </div>
  </div>
</template>
