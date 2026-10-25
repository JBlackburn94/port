<script setup>
import { useId } from "vue";

// Text set on a circle around an arrow, spinning slowly (slower still when motion is reduced)
defineProps({ text: { type: String, required: true } });
const pathId = `badge-${useId()}`;
</script>

<template>
  <div class="relative size-28 shrink-0">
    <svg viewBox="0 0 100 100" class="size-full animate-[spin_14s_linear_infinite] motion-reduce:animate-none">
      <defs>
        <path :id="pathId" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <text class="fill-current font-mono text-[9.5px] tracking-[0.12em] uppercase">
        <textPath :href="`#${pathId}`">{{ text }}</textPath>
      </text>
    </svg>
    <span class="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-lime text-xl text-ink">
      ↓
    </span>
  </div>
</template>
