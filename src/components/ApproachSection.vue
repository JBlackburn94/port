<script setup>
import { ref } from "vue";
import { useReveal } from "../composables/motion.js";

const root = ref(null);
useReveal(root);

const steps = [
  {
    title: "Understand",
    body: "Ask the awkward questions early. Who's stuck, where, and what does fixed actually look like?",
    tags: ["Discovery", "Research", "Scoping"],
  },
  {
    title: "Explore",
    body: "Sketch more than one way through. Quick prototypes beat long debates about what might work.",
    tags: ["Ideation", "Prototyping", "UX"],
  },
  {
    title: "Build",
    body: "Turn the winning idea into real, maintainable code that's fast, accessible and with motion that means something.",
    tags: ["Vue", "Front-end", "Animation"],
  },
  {
    title: "Refine",
    body: "Ship it, watch how it's used, and keep sanding the rough edges until it feels obvious.",
    tags: ["Testing", "Iteration", "Support"],
  },
];
</script>

<template>
  <section id="approach" ref="root" class="px-5 py-24 md:px-10 md:py-36">
    <div class="mb-16 grid gap-6 md:mb-24 md:grid-cols-12">
      <p class="label md:col-span-3">(02) Approach</p>
      <h2 class="display text-[16vw] md:col-span-9 md:text-[8.5vw]" data-reveal="lines">
        How I <span class="accent">solve</span> things
      </h2>
    </div>

    <ol class="border-t border-ink/15">
      <li
        v-for="(s, i) in steps"
        :key="s.title"
        class="group relative overflow-hidden border-b border-ink/15"
        data-reveal="fade"
      >
        <!-- Fills up from the bottom on hover -->
        <span
          class="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
        ></span>
        <!-- Stacked below lg; from lg it's one row with everything sitting on the heading's bottom edge.
             The heading scales with the viewport so the longest word ("Understand") fits its 5 columns. -->
        <div
          class="relative grid gap-4 py-8 transition-colors duration-500 group-hover:text-paper md:py-10 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:px-4"
        >
          <div class="lg:col-span-5 lg:flex lg:items-end lg:gap-6">
            <span class="label block lg:pb-1.5">0{{ i + 1 }}</span>
            <h3
              class="display mt-4 text-6xl transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:text-8xl lg:mt-0 lg:text-[min(6.6vw,6rem)]"
            >
              {{ s.title }}
            </h3>
          </div>
          <p class="max-w-md text-lg lg:col-span-4">{{ s.body }}</p>
          <ul class="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end">
            <li
              v-for="t in s.tags"
              :key="t"
              class="label rounded-full border border-current px-3 py-1.5 group-hover:border-lime group-hover:text-lime"
            >
              {{ t }}
            </li>
          </ul>
        </div>
      </li>
    </ol>
  </section>
</template>
