# Jason Blackburn — Portfolio

Vue 3 + Vite + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis smooth scroll. Deploys to Vercel as a static SPA.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Positioning

**Creative developer & problem solver.** Every section should answer "what problem, what did I do about it, what changed", not only "what I built".

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

Projects live in `src/data/projects.js`. Add a project there and it shows up in the carousel and gets its own `/work/:slug` page. It is also added to the sitemap automatically, and its page gets its own title and description.

Site-wide details (name, live URL, email, socials) live in `src/data/site.js`. **Update `url` when the custom domain goes live**, because canonical links, social previews, `robots.txt` and `sitemap.xml` are all built from it.

## SEO, accessibility and security

- **SEO:** `index.html` carries the home page's title, description, Open Graph/Twitter tags and Person structured data, all filled in from `site.js` at build time by the `site-meta` plugin in `vite.config.js`. The same plugin generates `robots.txt` and `sitemap.xml`. `src/composables/head.js` updates the tags on each route change. The social preview image is `public/og.png` (1200×630).
- **Accessibility:** the site targets WCAG 2.2 AA. Nothing moves on its own for more than 5 seconds: the carousel has a pause button, and the marquee and badge only move while you scroll. All motion is off with `prefers-reduced-motion`. Text meets 4.5:1 contrast, including the word-reveal paragraphs at their faintest. There's a skip link and a visible focus ring on every background.
- **Security:** headers (CSP, HSTS, `X-Frame-Options`, `nosniff`, referrer and permissions policies) are set in `vercel.json`. `npm run preview` sends the same headers, so test any new third-party script or embed there first, because the CSP only allows the site's own scripts, fonts and images.
