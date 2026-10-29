// Each project gets a card in the work carousel and a page at /work/:slug.
// `cover` is the card's art direction when there is no image yet: two colours and a motif
// (plus an optional accent colour). Set `image` to a path in /public to use a real screenshot instead.
// `approachHeading` is the case study's middle heading: [before, italic accent, after].
export const projects = [
  {
    slug: "enhance",
    title: "Enhance",
    year: "2026",
    status: "Launching soon",
    tags: ["Client website", "Design & build", "Construction"],
    summary:
      "A website for a Leeds technical consultancy in the housebuilding industry, designed in the language of the planning drawings its clients work with every day.",
    role: "Design & development",
    stack: ["Vue 3", "Tailwind CSS", "GSAP", "Lenis"],
    cover: { bg: "#EEEFEB", fg: "#23262B", accent: "#D9381E", motif: "redline" },
    problem:
      "Enhance Technical Consulting's founder brings over 20 years of technical experience from the UK's biggest housebuilders, but the business serves three very different audiences: developers, landowners and homeowners. The site needed to speak clearly to each of them, show the credibility behind the work, and feel at home in an industry of site plans and technical drawings rather than looking like another consultancy template.",
    approachHeading: ["Drawn like a ", "planning", " sheet"],
    approach: [
      "A visual language taken straight from planning drawings: drafting-film backgrounds, graphite type and the red line that marks an application site, used sparingly as the one signal colour.",
      "The home page opens by marking out a real housing parcel in red over an aerial photo, traced in the photo's own pixel space so the line stays on the site at every screen size.",
      "Case studies are presented the way drawings are issued: the image on a sheet, the brief alongside it, and a title block of client, type, scale and planning authority.",
      "Each audience gets its own path. The three stages of a build become a pinned, scroll-driven sequence on desktop and a simple list on smaller screens or with reduced motion.",
    ],
    outcome:
      "A site that looks like it belongs to the industry it serves, where developers, landowners and homeowners can each find their services in a click. All copy and project data live in a single file, so content can change without touching a layout.",
  },
  {
    slug: "markmend",
    title: "Markmend",
    year: "2026",
    status: "In progress",
    tags: ["Product", "Developer tooling", "AI workflow"],
    summary:
      "Website feedback that an AI coding agent can act on. Clients click what they want changed, and the agent gets exactly where it lives in the code.",
    role: "Concept, design & development",
    stack: ["Vanilla JS", "Shadow DOM", "Vite plugin", "Vue"],
    cover: { bg: "#C2EC40", fg: "#150734", motif: "pins" },
    problem:
      "Client feedback on websites arrives as screenshots in emails, vague messages like \"the button near the top\", and long threads. Turning that into code changes means detective work before any real work starts, and an AI coding agent can't do much with \"make it pop\".",
    approachHeading: ["Point, ", "describe", ", hand off"],
    approach: [
      "A drop-in widget lets clients point at the real element on the live site, describe the change, and pin it, with no account and no install.",
      "Every request records a readable selector, the element's text, cleaned HTML and a screenshot, all kept in the browser between visits.",
      "An optional build plugin tags each element with its source file and line, so the export tells the agent exactly where to look.",
      "Everything is exported as one zip: a feedback.md written as instructions for an agent, plus the screenshots.",
    ],
    outcome:
      "Feedback goes from a conversation to a precise, ready-to-run task list. The toolbar's UI lives in its own Shadow DOM, so it never clashes with the client's site.",
  },
  {
    slug: "coming-soon-1",
    title: "Next project",
    year: "2026",
    status: "Coming soon",
    placeholder: true,
    tags: ["In the works"],
    summary: "Something new is being built. Check back soon.",
    cover: { bg: "#D3C5F6", fg: "#150734", motif: "rings" },
  },
];

export const findProject = (slug) => projects.find((p) => p.slug === slug);
