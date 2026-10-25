<script setup>
import { ref } from "vue";
import { site } from "../data/site.js";
import { projects } from "../data/projects.js";
import { useLocalTime } from "../composables/clock.js";
import { useReveal, getLenis } from "../composables/motion.js";

const root = ref(null);
const time = useLocalTime();
const year = new Date().getFullYear();
const liveProjects = projects.filter((p) => !p.placeholder);

useReveal(root);

const backToTop = () => {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer ref="root" id="contact" class="relative overflow-hidden rounded-t-[2rem] bg-ink text-paper md:rounded-t-[3rem]">
    <!-- Call to action -->
    <section class="px-5 pt-24 pb-16 md:px-10 md:pt-36">
      <p class="label mb-8 text-lilac">(04) Contact</p>
      <h2 class="display text-[17vw] md:text-[10.5vw]" data-reveal="lines">
        Got a problem<br />
        <span class="accent text-lime">worth</span> solving?
      </h2>
      <div class="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between" data-reveal="fade">
        <p class="max-w-md text-lg text-lilac">
          Tell me what's in the way. I'll help you work out what to build, then build it properly.
        </p>
        <a
          :href="`mailto:${site.email}`"
          class="group pill bg-lime py-4 text-lg font-semibold text-ink hover:bg-paper"
          data-cursor="Say hi"
        >
          {{ site.email }}
          <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>

    <!-- Link columns -->
    <section class="grid grid-cols-2 gap-10 border-t border-paper/15 px-5 py-12 md:grid-cols-4 md:px-10">
      <div>
        <p class="label mb-4 text-lime">Navigate</p>
        <ul class="space-y-2">
          <li><RouterLink to="/" class="hover:text-lime">Home</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#work' }" class="hover:text-lime">Work</RouterLink></li>
          <li><RouterLink :to="{ path: '/', hash: '#approach' }" class="hover:text-lime">Approach</RouterLink></li>
        </ul>
      </div>
      <div>
        <p class="label mb-4 text-lime">Work</p>
        <ul class="space-y-2">
          <li v-for="p in liveProjects" :key="p.slug">
            <RouterLink :to="`/work/${p.slug}`" class="hover:text-lime">{{ p.title }}</RouterLink>
          </li>
          <li class="text-paper/40">More soon</li>
        </ul>
      </div>
      <div>
        <p class="label mb-4 text-lime">Elsewhere</p>
        <ul class="space-y-2">
          <li v-for="s in site.socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener" class="hover:text-lime">{{ s.label }} ↗</a>
          </li>
        </ul>
      </div>
      <div>
        <p class="label mb-4 text-lime">Based in</p>
        <p>{{ site.location }}</p>
        <p class="label mt-1 text-paper/60">{{ time }} local time</p>
      </div>
    </section>

    <!-- Pill navigation bar -->
    <section class="flex flex-wrap items-center justify-between gap-3 px-5 pb-6 md:px-10">
      <nav class="flex rounded-full bg-ink-soft p-1">
        <RouterLink to="/" class="pill py-2 hover:bg-paper hover:text-ink">Home</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#work' }" class="pill py-2 hover:bg-paper hover:text-ink">Work</RouterLink>
        <a :href="`mailto:${site.email}`" class="pill py-2 hover:bg-paper hover:text-ink">Contact</a>
      </nav>
      <button class="pill bg-ink-soft py-2 hover:bg-lime hover:text-ink" @click="backToTop">Back to top ↑</button>
    </section>

    <!-- Giant wordmark -->
    <div class="px-3 select-none md:px-6" aria-hidden="true">
      <p class="display translate-y-[12%] text-center text-[13vw] whitespace-nowrap text-lilac">
        Jason <span class="accent text-lime">Blackburn</span>
      </p>
    </div>

    <div class="label relative flex justify-between bg-ink px-5 py-4 text-paper/50 md:px-10">
      <span>© {{ year }} {{ site.name }}</span>
      <span>Built with Vue &amp; GSAP</span>
    </div>
  </footer>
</template>
