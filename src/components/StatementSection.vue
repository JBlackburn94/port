<script setup>
import { ref } from "vue";
import { useReveal } from "../composables/motion.js";

const root = ref(null);
useReveal(root);

const facts = [
  { k: "Starts with", v: "The problem, not the stack" },
  { k: "Works across", v: "Product, interface & front-end" },
  { k: "Builds with", v: "Vue, JavaScript, GSAP & AI tooling" },
];
</script>

<template>
  <section ref="root" class="rounded-t-[2rem] bg-lilac px-5 py-24 md:rounded-t-[3rem] md:px-10 md:py-36">
    <div class="grid gap-10 md:grid-cols-12">
      <p class="label md:col-span-3">(01) About</p>
      <p
        class="text-3xl leading-[1.12] font-medium tracking-tight md:col-span-9 md:text-[3.4rem]"
        data-reveal="words"
      >
        I'm a developer who starts with the problem, not the code. I dig into what's really in the way, sketch a few
        routes around it, then build the one that works: clear, quick and a pleasure to use.
      </p>
    </div>

    <dl class="mt-20 grid gap-px overflow-hidden rounded-2xl bg-ink/15 md:col-span-9 md:mt-28 md:grid-cols-3">
      <div v-for="(f, i) in facts" :key="f.k" class="bg-lilac p-6 md:p-8" data-reveal="fade" :data-reveal-delay="i * 0.1">
        <dt class="label mb-6 text-ink/70">{{ f.k }}</dt>
        <dd class="text-2xl font-medium tracking-tight">{{ f.v }}</dd>
      </div>
    </dl>
  </section>
</template>
