<script setup>
import HeroSection from "../components/HeroSection.vue";
import StatementSection from "../components/StatementSection.vue";
import MarqueeBand from "../components/MarqueeBand.vue";
import ApproachSection from "../components/ApproachSection.vue";
import WorkCarousel from "../components/WorkCarousel.vue";

const marquee = ["Problem solving", "Interface design", "Front-end", "Creative development", "Motion"];
</script>

<template>
  <HeroSection />
  <StatementSection />
  <MarqueeBand :items="marquee" />
  <ApproachSection />
  <WorkCarousel />
  <div class="h-8 bg-ink"></div>
</template>
