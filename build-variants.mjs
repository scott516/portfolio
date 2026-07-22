// Generates accent-color variants of the site for side-by-side comparison.
//   node build-variants.mjs   ->   versions/<slug>/ per variant + versions.html
//
// Layout, grid, and typography are untouched in every variant — the Figma
// template match stays exact. Only --red (the site's sole interactive
// accent: brand mark, nav/footer/card hover states) changes per variant.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";
import { site } from "./data/site.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));

const variants = [
  { slug: "cobalt", label: "Cobalt", accent: "#2C4BA0", note: "A confident indigo-blue accent." },
  { slug: "amber", label: "Amber", accent: "#B7791F", note: "A warm, museum-label gold accent." },
  { slug: "verdant", label: "Verdant", accent: "#1F6F5C", note: "A deep, refined teal-emerald accent." },
];

async function copyStatic(outDir) {
  await mkdir(join(outDir, "css"), { recursive: true });
  await mkdir(join(outDir, "js"), { recursive: true });
  await mkdir(join(outDir, "assets"), { recursive: true });
  await copyFile(join(ROOT, "css/styles.css"), join(outDir, "css/styles.css"));
  await copyFile(join(ROOT, "css/case-study.css"), join(outDir, "css/case-study.css"));
  await copyFile(join(ROOT, "js/main.js"), join(outDir, "js/main.js"));
  await copyFile(join(ROOT, "assets/wordmark.png"), join(outDir, "assets/wordmark.png"));
}

function swatchCard({ label, accent, note, href }) {
  return `<a class="variant-card" href="${href}">
    <span class="variant-card__swatch" style="background:${accent}"></span>
    <span class="variant-card__label">${label}</span>
    <span class="variant-card__note">${note}</span>
  </a>`;
}

async function buildVersionsPage() {
  const cards = [
    swatchCard({ label: "Default — Figma exact", accent: "#ff0000", note: "The original template match: red accent.", href: "index.html" }),
    ...variants.map((v) => swatchCard({ label: v.label, accent: v.accent, note: v.note, href: `versions/${v.slug}/index.html` })),
  ].join("\n      ");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Design variants — ${site.name}</title>
  <meta name="description" content="Accent-color variants of the ${site.name} portfolio, for side-by-side comparison.">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23ff0000'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Instrument+Sans:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .variants-shell { padding-top: clamp(32px, 6vw, 72px); padding-bottom: clamp(48px, 8vw, 96px); }
    .variants-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px; margin-top: 28px;
    }
    .variant-card {
      display: flex; flex-direction: column; gap: 10px;
      background: var(--card); padding: 22px; text-decoration: none; color: inherit;
      transition: transform .15s ease;
    }
    .variant-card:hover { transform: translateY(-3px); }
    .variant-card__swatch { width: 40px; height: 40px; border-radius: 50%; display: block; }
    .variant-card__label { font-family: var(--sans); font-weight: 700; font-size: 16px; color: var(--ink); }
    .variant-card__note { font-family: var(--sans); font-size: 14px; color: var(--muted); }
  </style>
</head>
<body>
  <main class="shell variants-shell">
    <a class="cs-back" style="padding-top:0" href="index.html">← Back to portfolio</a>
    <header style="margin-top:24px">
      <h1 class="wordmark" style="font-size:clamp(36px,6vw,64px)">Design variants</h1>
      <p style="font-family:var(--sans); color:var(--muted); font-size:16px; max-width:52ch; margin-top:12px;">
        Same layout, grid, and typography throughout — only the interactive accent colour changes
        (brand mark, nav/footer/card hover states).
      </p>
    </header>
    <div class="variants-grid">
      ${cards}
    </div>
  </main>
</body>
</html>
`;
  await writeFile(join(ROOT, "versions.html"), html, "utf8");
}

async function main() {
  for (const v of variants) {
    const outDir = join(ROOT, "versions", v.slug);
    await copyStatic(outDir);
    await build({ outDir, accent: v.accent });
  }
  await buildVersionsPage();
  console.log(`Built ${variants.length} variants + versions.html gallery.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
