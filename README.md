# Lucia Scott — Portfolio

A responsive product-design portfolio built to match the Figma template
[**PORTFOLIO-SITE**](https://www.figma.com/design/eFnDGsopk26njJBB0JTWbl/PORTFOLIO-SITE?node-id=7-1352)
— same 8-column grid, colours, and typography (sizes + weights transcribed
from the source file). Case study content is drawn from the eight
VoucherCodes case studies.

## What's here

- **`index.html`** — the homepage: sticky nav, `Lucia Scott` hero + bio, eight
  case-study cards (full-width cards carry device mockups, half-width cards are
  text tiles — mirroring the template's rhythm), a stats band, a testimonial,
  and the footer.
- **`work/*.html`** — a detail page per case study (overview, problem, process,
  outcome + metrics table, reflections, prev/next paging).
- **`css/styles.css`** — design tokens + homepage styles.
- **`css/case-study.css`** — detail-page styles.
- **`js/main.js`** — scroll-spy nav highlighting + reveal-on-scroll (progressive
  enhancement; the site is fully readable with JS disabled).

Everything is **static HTML/CSS/JS** — no framework, no runtime dependencies.
Open `index.html` in a browser, or deploy the folder to any static host
(GitHub Pages, Netlify, Vercel, S3…).

## Editing content

All copy lives in one place: **`data/site.mjs`**. Edit it, then regenerate the
pages:

```bash
node build.mjs
```

This rewrites `index.html` and every `work/<slug>.html` from the data + the
templates in `build.mjs`. Add a case study by appending an object to the
`caseStudies` array (`layout: "full"` gives it device mockups; `"half"` makes it
a text tile). No build tooling or `npm install` required — plain Node ≥ 18.

## Preview locally

```bash
npx http-server -p 8123 -c-1      # then open http://127.0.0.1:8123
```

## Typography note

The template uses **Apple Garamond** (a proprietary Apple typeface, not
available on the web) for the serif and **Instrument Sans** for the sans.

- `Instrument Sans` loads from Google Fonts — an exact match.
- For the serif, the CSS variable `--serif` prefers `"Apple Garamond"` first
  (used automatically if the viewer has it installed or you self-host it) and
  falls back to **EB Garamond** from Google Fonts — the closest freely-available
  Garamond — so the site renders consistently everywhere. To use the licensed
  Apple Garamond, self-host the font files and add an `@font-face` rule; no other
  changes are needed.

Type sizes, weights, letter-spacing and the colour palette
(`#edf1f0`, `#787878`, `#474747`, `#585858`, `#6a6a6a`, black, red mark) are
taken directly from the Figma file.

## Device mockups

The app screens shown inside the phone frames are lightweight, illustrative
recreations built in HTML/CSS (the Figma template's raster screenshots aren't
redistributed here). Swap in real product screenshots by replacing the
`phoneScreen()` markup in `build.mjs`, or drop `<img>` tags into the
`.card__stage` if you'd rather use images.
