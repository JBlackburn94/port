<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { site } from "../data/site.js";

// Hides on the way down, comes back on the way up
const hidden = ref(false);
let lastY = 0;

const onScroll = () => {
  const y = window.scrollY;
  hidden.value = y > 200 && y > lastY;
  lastY = y;
};

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 transition-transform duration-500 ease-out-expo focus-within:translate-y-0! md:p-6"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <RouterLink
      to="/"
      class="pill bg-ink/85 font-semibold text-paper backdrop-blur-md hover:bg-ink"
      aria-label="Jason Blackburn, home"
    >
      <span class="size-2 rounded-full bg-lime"></span>
      {{ site.name }}
    </RouterLink>

    <nav class="flex items-center gap-2" aria-label="Main">
      <div class="hidden rounded-full bg-paper/70 p-1 backdrop-blur-md md:flex">
        <RouterLink :to="{ path: '/', hash: '#work' }" class="pill py-2 hover:bg-ink hover:text-paper">Work</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#approach' }" class="pill py-2 hover:bg-ink hover:text-paper"
          >Approach</RouterLink
        >
      </div>
      <a :href="`mailto:${site.email}`" class="pill bg-lime font-semibold text-ink hover:bg-ink hover:text-lime">
        Let's talk
      </a>
    </nav>
  </header>
</template>
