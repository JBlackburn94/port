# Jason Blackburn — Portfolio

Vue 3 + Vite + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis smooth scroll. Deploys to Vercel as a static SPA.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Positioning

**Creative problem solver & developer.** Every section should answer "what problem, what did I do about it, what changed", not only "what I built".

## Design direction

What each reference contributes:

| Reference | What we take |
| --- | --- |
| kstoimenov.com | Page flow: hero → statement → approach/services → selected work → contact. Dual fonts: big grotesk headlines with *italic serif* words dropped in. |
| orionix.framer.website | Sleekness: generous whitespace, small mono labels (`(01)`, local time, status), soft rounded cards, restraint. |
| crency.agency | Colour (deep indigo ink, lilac, acid lime) and huge condensed display type. Custom cursor. |
| mad-creative-agency.com | Project cards in a carousel with progress-bar timers showing when it'll advance. Pill-style navigation in the footer. |
| jaeco.fr | Motion: preloader counter, line-by-line text reveals, scroll-driven transitions, big structured footer. |

### Tokens

- **Ink** `#150734`, deep indigo, used for dark sections and text on light
- **Lilac** `#D3C5F6`, light sections and soft surfaces
- **Lime** `#C2EC40`, the single accent (cursor, highlights, CTAs)
- **Paper** `#F6F3FC`, the off-white base

### Type

- **Display:** Anton, a condensed, uppercase, very large typeface
- **Serif accent:** Instrument Serif Italic, for the "dual font" moments inside headlines
- **Body:** Inter Tight
- **Labels:** JetBrains Mono, small and uppercase

All fonts are self-hosted through Fontsource, so there are no third-party font requests.

## Content

Projects live in `src/data/projects.js`. Add a project there and it shows up in the carousel and gets its own `/work/:slug` page.
