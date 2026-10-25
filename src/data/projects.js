// Each project gets a card in the work carousel and a page at /work/:slug.
// `cover` is the card's art direction when there is no image yet: two colours and a motif.
// Set `image` to a path in /public to use a real screenshot instead.
export const projects = [
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
  {
    slug: "coming-soon-2",
    title: "Another one",
    year: "2026",
    status: "Coming soon",
    placeholder: true,
    tags: ["In the works"],
    summary: "Another problem, another solution. Details soon.",
    cover: { bg: "#24154D", fg: "#C2EC40", motif: "grid" },
  },
];

export const findProject = (slug) => projects.find((p) => p.slug === slug);
