<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { projects, findProject } from "../data/projects.js";
import { useReveal } from "../composables/motion.js";
import ProjectCover from "../components/ProjectCover.vue";

const route = useRoute();
const root = ref(null);
useReveal(root);

const project = computed(() => findProject(route.params.slug));

// The next real project, wrapping round; null when this is the only one
const next = computed(() => {
  const live = projects.filter((p) => !p.placeholder);
  const i = live.findIndex((p) => p.slug === project.value?.slug);
  const candidate = live[(i + 1) % live.length];
  return candidate && candidate.slug !== project.value?.slug ? candidate : null;
});
</script>

<template>
  <article v-if="project && !project.placeholder" ref="root" class="pt-32 md:pt-40">
    <header class="px-5 md:px-10">
      <RouterLink :to="{ path: '/', hash: '#work' }" class="label inline-flex items-center gap-2 hover:text-ink/60">
        ← All work
      </RouterLink>
      <!-- Sized from the title's length so any name fits the width: Anton capitals run up to
           about 0.55em each (M and W are wide), so chars × 0.6em never exceeds the space -->
      <h1
        class="display mt-10 text-[min(24vw,calc((100vw-2.5rem)/(var(--chars)*0.6)))] md:text-[min(17vw,calc((100vw-5rem)/(var(--chars)*0.6)))]"
        :style="{ '--chars': project.title.length }"
        data-reveal="lines"
      >
        {{ project.title }}
      </h1>
      <p class="mt-8 max-w-3xl text-2xl leading-snug font-medium tracking-tight md:text-4xl" data-reveal="fade">
        {{ project.summary }}
      </p>

      <dl class="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/15 md:grid-cols-4" data-reveal="fade">
        <div class="bg-paper p-5">
          <dt class="label mb-3 text-ink/70">Role</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div class="bg-paper p-5">
          <dt class="label mb-3 text-ink/70">Year</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div class="bg-paper p-5">
          <dt class="label mb-3 text-ink/70">Status</dt>
          <dd>{{ project.status }}</dd>
        </div>
        <div class="bg-paper p-5">
          <dt class="label mb-3 text-ink/70">Stack</dt>
          <dd>{{ project.stack.join(", ") }}</dd>
        </div>
      </dl>
    </header>

    <div class="mt-14 px-3 md:mt-20 md:px-6" data-reveal="fade">
      <div class="aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/8] md:rounded-[2rem]">
        <ProjectCover :project="project" />
      </div>
    </div>

    <section class="grid gap-8 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
      <p class="label md:col-span-3">(01) The problem</p>
      <p class="text-3xl leading-[1.15] font-medium tracking-tight md:col-span-9 md:text-5xl" data-reveal="words">
        {{ project.problem }}
      </p>
    </section>

    <section class="rounded-t-[2rem] bg-lilac px-5 py-24 md:rounded-t-[3rem] md:px-10 md:py-36">
      <div class="grid gap-8 md:grid-cols-12">
        <p class="label md:col-span-3">(02) The approach</p>
        <h2 class="display text-[14vw] md:col-span-9 md:text-[7vw]" data-reveal="lines">
          {{ project.approachHeading[0] }}<span class="accent">{{ project.approachHeading[1] }}</span
          >{{ project.approachHeading[2] }}
        </h2>
      </div>
      <ol class="mt-14 grid gap-4 md:grid-cols-2">
        <li
          v-for="(step, i) in project.approach"
          :key="i"
          class="rounded-2xl bg-paper p-6 md:p-8"
          data-reveal="fade"
          :data-reveal-delay="(i % 2) * 0.1"
        >
          <span class="label inline-flex size-8 items-center justify-center rounded-full bg-ink text-lime">{{ i + 1 }}</span>
          <p class="mt-6 text-xl leading-snug">{{ step }}</p>
        </li>
      </ol>
    </section>

    <section class="grid gap-8 bg-ink px-5 py-24 text-paper md:grid-cols-12 md:px-10 md:py-36">
      <p class="label text-lilac md:col-span-3">(03) The outcome</p>
      <p class="text-3xl leading-[1.15] font-medium tracking-tight md:col-span-9 md:text-5xl" data-reveal="words">
        {{ project.outcome }}
      </p>
    </section>

    <RouterLink
      v-if="next"
      :to="`/work/${next.slug}`"
      class="group block bg-ink px-5 pb-20 text-paper md:px-10 md:pb-32"
      data-cursor="Next"
    >
      <p class="label text-lilac">Next project</p>
      <p class="display mt-4 text-[18vw] transition-colors group-hover:text-lime md:text-[12vw]">{{ next.title }} →</p>
    </RouterLink>
    <div v-else class="h-20 bg-ink md:h-32"></div>
  </article>

  <section v-else class="flex min-h-[80svh] flex-col items-start justify-center px-5 pt-32 md:px-10">
    <p class="label">Coming soon</p>
    <h1 class="display mt-6 text-[18vw] md:text-[10vw]">Still <span class="accent">cooking</span></h1>
    <RouterLink to="/" class="pill mt-10 bg-ink text-paper hover:bg-lime hover:text-ink">← Back home</RouterLink>
  </section>
</template>
