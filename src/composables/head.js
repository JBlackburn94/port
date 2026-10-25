import { site } from "../data/site.js";
import { findProject } from "../data/projects.js";

// Keeps <title>, the description, canonical link and social-preview tags in step with the
// current page. index.html carries the home page's values for crawlers that don't run JS.

const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

// What each route should say about itself
const headFor = (route) => {
  if (route.name === "project") {
    const project = findProject(route.params.slug);
    if (project && !project.placeholder) {
      return {
        title: `${project.title}: ${project.status === "In progress" ? "work in progress" : "case study"} | ${site.name}`,
        description: project.summary,
      };
    }
    // Placeholder and unknown project pages exist but shouldn't be indexed
    return { title: `Coming soon | ${site.name}`, description: site.description, noindex: true };
  }
  return { title: `${site.name}: ${site.role}`, description: site.description };
};

export function updateHead(route) {
  const { title, description, noindex } = headFor(route);
  const url = site.url + route.path;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("name", "robots", noindex ? "noindex" : "index, follow");
  setCanonical(url);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
}
