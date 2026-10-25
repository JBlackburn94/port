import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/site.js";
import { projects } from "./src/data/projects.js";

const title = `${site.name}: ${site.role}`;

// Person structured data, so search engines know who the site is about
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: site.location.split(",")[0] },
  sameAs: site.socials.map((s) => s.href),
};

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Fills the %SITE_*% placeholders in index.html from src/data/site.js, preloads the hero's
// display font, and writes robots.txt and sitemap.xml (home plus every finished project).
function siteMeta() {
  const tokens = {
    "%SITE_URL%": site.url,
    "%SITE_NAME%": escapeAttr(site.name),
    "%SITE_ROLE%": escapeAttr(site.role),
    "%SITE_TITLE%": escapeAttr(title),
    "%SITE_DESCRIPTION%": escapeAttr(site.description),
    "%SITE_EMAIL%": escapeAttr(site.email),
    "%SITE_JSON_LD%": JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  };

  return {
    name: "site-meta",
    transformIndexHtml: {
      // After Vite's own pass, so the built (hashed) font filename is known
      order: "post",
      handler(html, ctx) {
        let out = html;
        for (const [token, value] of Object.entries(tokens)) out = out.replaceAll(token, value);

        // Start the hero font download alongside the JS rather than after it renders
        const anton = ctx.bundle && Object.keys(ctx.bundle).find((f) => /anton-latin-400-normal.*\.woff2$/.test(f));
        if (!anton) return out;
        return {
          html: out,
          tags: [
            {
              tag: "link",
              attrs: { rel: "preload", href: `/${anton}`, as: "font", type: "font/woff2", crossorigin: "" },
              injectTo: "head",
            },
          ],
        };
      },
    },
    generateBundle() {
      const paths = ["/", ...projects.filter((p) => !p.placeholder).map((p) => `/work/${p.slug}`)];
      const today = new Date().toISOString().slice(0, 10);
      const urls = paths
        .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`)
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      });
    },
  };
}

// `vite preview` sends the same security headers as Vercel, so they can be tested locally
const vercelHeaders = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"))
  .headers.find((h) => h.source === "/(.*)")
  .headers.reduce((all, { key, value }) => ({ ...all, [key]: value }), {});

export default defineConfig({
  plugins: [vue(), tailwindcss(), siteMeta()],
  preview: { headers: vercelHeaders },
});
