import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Flips to true once the preloader has finished, so page intros can wait for it
export const ready = ref(false);

let lenis = null;

export function startSmoothScroll() {
  if (prefersReducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/**
 * Scroll-triggered reveals for everything inside `root` with a data-reveal attribute:
 *   data-reveal="lines"  headline lines slide up from behind a mask
 *   data-reveal="fade"   fades and rises in
 *   data-reveal="words"  words brighten one by one as you scroll through it
 * Add data-reveal-delay="0.2" to offset one element.
 */
export function useReveal(root) {
  let ctx;

  const setup = () => {
    ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      root.value.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "reveal-line" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          delay: Number(el.dataset.revealDelay || 0),
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      root.value.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          delay: Number(el.dataset.revealDelay || 0),
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      root.value.querySelectorAll('[data-reveal="words"]').forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );
      });
    }, root.value);
  };

  onMounted(() => {
    // Wait for fonts so SplitText measures lines with the real typeface
    document.fonts.ready.then(() => {
      if (ready.value) setup();
      else watch(ready, (v) => v && setup(), { once: true });
    });
  });

  onBeforeUnmount(() => ctx?.revert());
}
