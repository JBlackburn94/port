<script setup>
// Placeholder art for a project until it has real imagery: the project's colours,
// a simple motif, and its title. Uses `project.image` instead when that's set.
defineProps({ project: { type: Object, required: true } });
</script>

<template>
  <div
    class="relative size-full overflow-hidden"
    :style="{ background: project.cover.bg, color: project.cover.fg }"
  >
    <img
      v-if="project.image"
      :src="project.image"
      :alt="`${project.title} screenshot`"
      class="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
    />

    <template v-else>
      <svg
        class="absolute inset-0 size-full transition-transform duration-1000 ease-out-expo group-hover:scale-105"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <!-- Markmend-style feedback pins on dashed selection boxes -->
        <!-- Scaled in around the centre so the pins survive the 16:9 crop on wide cards -->
        <g
          v-if="project.cover.motif === 'pins'"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          transform="translate(200 150) scale(0.8) translate(-200 -150)"
        >
          <rect x="40" y="40" width="200" height="54" rx="8" stroke-dasharray="6 5" />
          <rect x="190" y="130" width="170" height="120" rx="10" stroke-dasharray="6 5" />
          <rect x="60" y="150" width="96" height="34" rx="17" stroke-dasharray="6 5" />
          <g v-for="(p, i) in [[240, 40], [360, 130], [156, 150]]" :key="i">
            <circle :cx="p[0]" :cy="p[1]" r="14" fill="currentColor" />
            <text
              :x="p[0]"
              :y="p[1] + 4.5"
              text-anchor="middle"
              :fill="project.cover.bg"
              stroke="none"
              class="font-mono text-[13px] font-bold"
            >
              {{ i + 1 }}
            </text>
          </g>
        </g>

        <g v-else-if="project.cover.motif === 'rings'" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle v-for="r in 8" :key="r" cx="300" cy="80" :r="r * 26" opacity="0.6" />
        </g>

        <g v-else fill="currentColor">
          <template v-for="x in 16" :key="x">
            <circle v-for="y in 12" :key="`${x}-${y}`" :cx="x * 25 - 12" :cy="y * 25 - 12" r="1.6" opacity="0.55" />
          </template>
        </g>
      </svg>

      <p class="display absolute bottom-4 left-5 text-[clamp(3rem,9vw,8rem)] md:bottom-6 md:left-8">
        {{ project.title }}
      </p>
    </template>
  </div>
</template>
