// ---------------------------------------------------------------------------
// Assembles what GitHub Pages serves into _site/, according to live-site.json.
//   node publish.mjs
//
// live-site.json → "homepage" picks which design is served at the site root:
//
//   "original"   the original site at /            (as before)
//                the editorial design at /versions/editorial/
//
//   "editorial"  the editorial design at /
//                the original site, unchanged, at /original/
//                (with its variants gallery at /original/versions.html)
//
// Nothing in the repo is moved or rewritten either way — both designs keep
// living in their own folders, and swapping is a one-word change.
// ---------------------------------------------------------------------------
import { cp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "_site");

// Never published (upload-pages-artifact also skips .git/.github by default).
const SKIP = new Set([".git", ".github", "_site", "node_modules"]);

// Designs that can be the homepage → their folder (null = the repo root site).
const DESIGNS = { original: null, editorial: "versions/editorial" };

async function copyRepoSite(dest) {
  await mkdir(dest, { recursive: true });
  for (const name of await readdir(ROOT)) {
    if (SKIP.has(name)) continue;
    await cp(join(ROOT, name), join(dest, name), { recursive: true });
  }
}

async function main() {
  const { homepage = "original" } = JSON.parse(await readFile(join(ROOT, "live-site.json"), "utf8"));
  if (!Object.hasOwn(DESIGNS, homepage)) {
    throw new Error(
      `live-site.json: "homepage" must be one of ${Object.keys(DESIGNS).map((d) => `"${d}"`).join(", ")} — got "${homepage}".`
    );
  }

  await rm(OUT, { recursive: true, force: true });

  if (homepage === "original") {
    await copyRepoSite(OUT);
    console.log("Published: original at /, editorial at /versions/editorial/.");
  } else {
    await copyRepoSite(join(OUT, "original"));
    await cp(join(ROOT, DESIGNS[homepage]), OUT, { recursive: true });
    console.log(`Published: ${homepage} at /, original at /original/.`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
