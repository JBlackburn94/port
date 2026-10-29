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

        <!-- Enhance: a planning drawing sheet, with the application site marked in red.
             Everything sits inside y 48–252 so it survives the 16:9 crop on wide cards. -->
        <g v-else-if="project.cover.motif === 'redline'" fill="none" stroke="currentColor">
          <rect x="16" y="48" width="368" height="204" stroke-width="1" opacity="0.5" />
          <rect x="22" y="54" width="356" height="192" stroke-width="0.6" opacity="0.25" />
          <!-- Estate road and house plots either side of it -->
          <path d="M22 168 C 110 158 190 186 378 140" stroke-width="9" opacity="0.12" />
          <g stroke-width="0.8" opacity="0.4">
            <rect v-for="i in 7" :key="`n${i}`" :x="40 + i * 26" :y="132 + (i % 2) * 4" width="18" height="14" />
            <rect v-for="i in 6" :key="`s${i}`" :x="70 + i * 30" :y="190 - i * 3" width="20" height="15" />
          </g>
          <!-- The red line: the application site boundary -->
          <polygon
            points="168,70 292,62 312,112 262,128 178,122"
            :stroke="project.cover.accent"
            :fill="project.cover.accent"
            fill-opacity="0.07"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <!-- North arrow -->
          <g transform="translate(350 78)" stroke-width="1" opacity="0.7">
            <line x1="0" y1="14" x2="0" y2="-12" />
            <path d="M0 -14 L-5 -2 L0 -5 L5 -2 Z" fill="currentColor" />
          </g>
          <!-- Title block -->
          <g stroke-width="0.8" opacity="0.5">
            <rect x="292" y="206" width="86" height="40" />
            <line x1="292" y1="220" x2="378" y2="220" />
            <line x1="292" y1="233" x2="378" y2="233" />
            <line x1="335" y1="220" x2="335" y2="246" />
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
