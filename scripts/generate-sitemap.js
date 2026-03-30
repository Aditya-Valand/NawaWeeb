/**
 * Sitemap Generator
 * Fetches active products from the backend and writes /public/sitemap.xml
 *
 * Usage:  node scripts/generate-sitemap.js
 * Add to package.json:  "build": "node scripts/generate-sitemap.js && vite build"
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://www.nawaweeb.in";
const API_URL = "https://backend-1089363263041.us-central1.run.app/api";
const OUTPUT = join(__dirname, "../public/sitemap.xml");

const staticPages = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/ourstory", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
];

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const json = await res.json();
    return (json?.data?.products || []).filter((p) => p.is_active);
  } catch (err) {
    console.warn("[sitemap] Could not fetch products:", err.message);
    return [];
  }
}

function buildEntry({ loc, changefreq, priority, imageUrl, imageTitle }) {
  const imageBlock =
    imageUrl
      ? `\n    <image:image>\n      <image:loc>${imageUrl}</image:loc>${imageTitle ? `\n      <image:title>${imageTitle}</image:title>` : ""}\n    </image:image>`
      : "";
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${imageBlock}\n  </url>`;
}

async function generate() {
  const products = await fetchProducts();

  const staticEntries = staticPages.map(({ path, changefreq, priority }) =>
    buildEntry({ loc: `${BASE_URL}${path}`, changefreq, priority })
  );

  const productEntries = products.map((p) =>
    buildEntry({
      loc: `${BASE_URL}/product/${p.id}`,
      changefreq: "weekly",
      priority: "0.9",
      imageUrl: p.images?.[0] || "",
      imageTitle: p.title || "",
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${[...staticEntries, ...productEntries].join("\n\n")}

</urlset>`;

  writeFileSync(OUTPUT, xml, "utf8");
  console.log(`[sitemap] Written ${1 + products.length} URLs to ${OUTPUT}`);
}

generate();
