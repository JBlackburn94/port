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
  // The track holds two copies, so sliding it half its width loops seamlessly
  tween = gsap.to(track.value, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });

  // Scrolling speeds the band up briefly, and scrolling up reverses it
  trigger = ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4);
      gsap.to(tween, { timeScale: boost * self.direction, duration: 0.2, overwrite: true });
      gsap.to(tween, { timeScale: self.direction, duration: 1.2, delay: 0.2 });
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
