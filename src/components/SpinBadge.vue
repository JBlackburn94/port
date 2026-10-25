<script setup>
import { computed } from "vue";

// Text around a circle with an arrow in the middle. The ring (.spin-badge-ring) is turned by
// the parent as the page scrolls rather than spinning on its own (WCAG 2.2.2).
// Every character gets an equal slice of the circle, so with the monospace font the spacing is
// identical everywhere, including where the text wraps back to its start.
const props = defineProps({
  text: { type: String, required: true },
});

const chars = computed(() => {
  const list = [...props.text.toUpperCase()];
  return list.map((char, i) => ({ char, angle: (i * 360) / list.length }));
});
</script>

<template>
  <div class="relative size-28 shrink-0" aria-hidden="true">
    <svg viewBox="0 0 100 100" class="spin-badge-ring size-full">
      <text
        v-for="(c, i) in chars"
        :key="i"
        x="50"
        y="16"
        text-anchor="middle"
        :transform="`rotate(${c.angle} 50 50)`"
        class="fill-current font-mono text-[10px] font-medium"
      >
        {{ c.char }}
      </text>
    </svg>
    <span class="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-lime text-xl text-ink">
      ↓
    </span>
  </div>
</template>
