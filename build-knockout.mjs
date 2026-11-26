// ---------------------------------------------------------------------------
// "Knockout" design variant: a dark, editorial redesign of the portfolio.
//   node build-knockout.mjs   ->   versions/knockout/index.html + work/<slug>.html
//
// The name is cut out of a black band so the hero video shows through the
// letters. Content comes from data/site.mjs, the same source as the original
// site, so both stay in sync. Only HTML is generated here; the variant's
// stylesheet, script and media are hand-authored files that live in
// versions/knockout/{css,js,assets}. The original site is never touched.
// ---------------------------------------------------------------------------
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { site, caseStudies } from "./data/site.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
export const KNOCKOUT_DIR = join(ROOT, "versions", "knockout");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad2 = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ wordmark
 * Heavy, wide grotesk letterforms on a 1280-unit canvas (cap height 143.84 →
 * 288, round overshoot 139 → 293). U is the O's lower bowl carried up into two
 * stems; I and T reuse the L's 58-unit stem and the E's 34.76-unit top bar. */
const GLYPHS = {
  S: { x0: 7, x1: 197, c: ["M105.12 293Q105.46 293 105.8 293Q106.23 293 106.66 293Q107 293 107.34 293Q107.77 293 108.19 293Q108.54 293 108.88 293Q109.3 293 109.73 293Q134.67 293 154.41 287.7Q174.14 282.4 185.57 270.94Q197 259.47 197 241.09Q197 229.41 191.81 221.41Q186.61 213.4 177.72 208.21Q168.83 203.02 157.87 200.1Q146.9 197.18 135.13 195.56Q123.35 193.94 112.39 192.86Q101.42 191.78 92.53 190.59Q83.65 189.4 78.45 187.23Q73.26 185.07 73.26 181.18Q73.26 178.58 76.84 176.31Q80.41 174.04 87.8 172.74Q94.31 171.6 103.68 171.46Q113.14 171.64 119.2 173.5Q125.89 175.55 128.9 178.91Q131.9 182.26 131.9 186.58V187.45H191.69V184.85Q191.69 172.31 184.76 163.55Q177.84 154.79 165.72 149.38Q153.6 143.97 137.78 141.49Q121.97 139 103.96 139Q103.58 139 103.21 139Q102.82 139 102.42 139Q102.05 139 101.67 139Q101.28 139 100.88 139Q100.51 139 100.13 139Q99.74 139 99.35 139Q81.8 139 65.64 141.6Q49.48 144.19 37.01 149.81Q24.55 155.44 17.27 164.52Q10 173.61 10 186.58Q10 198.7 15.2 207.13Q20.39 215.57 29.28 220.97Q38.17 226.38 49.13 229.52Q60.1 232.65 71.87 234.38Q83.65 236.12 94.61 237.2Q105.58 238.28 114.47 239.47Q123.35 240.66 128.55 242.82Q133.74 244.98 133.74 248.88Q133.74 251.69 131.55 253.53Q129.36 255.37 125.78 256.45Q122.2 257.53 117.7 258.07Q113.2 258.61 108.46 258.72Q105.15 258.79 102.02 258.82Q92.36 258.72 84.8 257.64Q76.49 256.45 71.87 252.99Q67.26 249.53 67.26 243.04V241.63Q67.26 240.87 67.49 240.01H7.23Q7 240.87 7 241.63V242.82Q7 257.74 14.62 267.59Q22.24 277.43 35.63 282.94Q49.02 288.46 66.79 290.73Q84.57 293 105.12 293Z"] },
  O: { x0: 199, x1: 389, c: ["M291.89 293Q292.23 293 292.57 293Q292.91 293 293.24 293Q293.58 293 293.92 293Q294.26 293 294.59 293Q294.93 293 295.27 293Q295.61 293 295.94 293Q324.79 293 345.55 283.7Q366.31 274.4 377.66 257.2Q389 240.01 389 216.1Q389 191.99 377.66 174.69Q366.31 157.38 345.55 148.19Q324.79 139 295.94 139Q295.61 139 295.27 139Q294.94 139 294.59 139Q294.26 139 293.92 139Q293.59 139 293.24 139Q292.91 139 292.57 139Q292.23 139 291.89 139Q263.51 139 242.6 148.19Q221.69 157.38 210.34 174.69Q199 191.99 199 216.1Q199 240.01 210.34 257.2Q221.69 274.4 242.6 283.7Q263.51 293 291.89 293Z", "M294 176.02Q302.32 176.28 309.19 178.69Q316.89 181.39 322.36 186.37Q327.83 191.34 330.66 198.2Q333.5 205.05 333.5 213.19V218.38Q333.5 226.56 330.66 233.5Q327.83 240.44 322.36 245.52Q316.89 250.61 309.19 253.31Q302.32 255.72 294 255.98Q285.68 255.72 278.81 253.31Q271.11 250.61 265.64 245.52Q260.17 240.44 257.34 233.5Q254.5 226.56 254.5 218.38V213.19Q254.5 205.05 257.34 198.2Q260.17 191.34 265.64 186.37Q271.11 181.39 278.81 178.69Q285.68 176.28 294 176.02Z"] },
  C: { x0: 582, x1: 773, c: ["M679.15 293Q679.49 293 679.84 293Q680.23 293 680.61 293Q680.96 293 681.3 293Q681.69 293 682.08 293Q682.43 293 682.77 293Q683.16 293 683.54 293Q711.68 293 731.68 284.98Q751.68 276.96 762.34 262.84Q773 248.73 773 230.76H772.98Q773 229.91 773 229.05H717.39Q717.39 236.75 712.67 242.52Q707.94 248.3 699.04 251.51Q690.99 254.41 679.97 254.68Q667.71 254.33 659.59 249.58Q650.8 244.45 646.51 236Q642.22 227.55 642.22 217.71V214.07Q642.22 203.81 646.51 195.47Q650.8 187.12 659.92 182.21Q668.3 177.68 680.86 177.32Q690.73 177.62 698.27 180.71Q706.62 184.13 711.24 190.12Q715.85 196.11 715.85 203.81H773Q773 202.95 772.98 202.1H773Q773 183.49 761.68 169.27Q750.36 155.04 730.36 147.02Q710.36 139 683.98 139Q683.59 139 683.2 139Q682.86 139 682.52 139Q682.12 139 681.73 139Q681.39 139 681.05 139Q680.66 139 680.27 139Q679.93 139 679.59 139Q631.67 139 606.84 158.78Q582 178.57 582 215.14Q582 215.58 582 216.02Q582 216.44 582 216.86Q582 241.88 592.66 258.78Q603.32 275.68 624.86 284.34Q646.4 293 679.15 293Z"] },
  A: { x0: 763.47, x1: 962.54, c: ["M821.45 143.84L903.93 143.84L962.54 288L908.32 288L897.48 261.34L827.94 261.34L817.22 288L763.47 288Z", "M861.87 178.2L863.95 178.2L884.84 229.65L841.15 229.65Z"] },
  L: { x0: 964, x1: 1104.02, c: ["M964 143.84L1022 143.84L1022 249.84L1104.02 249.84L1104.02 288L964 288Z"] },
  E: { x0: 1107.75, x1: 1265.01, c: ["M1107.75 143.84L1259.01 143.84L1259.01 178.6L1165 178.6L1165 195L1251.01 195L1251.01 230.01L1165 230.01L1165 252.51L1265.01 252.51L1265.01 288L1107.75 288Z"] },
  U: { x0: 199, x1: 389, c: ["M199 143.84V216.1Q199 240.01 210.34 257.2Q221.69 274.4 242.6 283.7Q263.51 293 291.89 293H295.94Q324.79 293 345.55 283.7Q366.31 274.4 377.66 257.2Q389 240.01 389 216.1V143.84H333.5V218.38Q333.5 226.56 330.66 233.5Q327.83 240.44 322.36 245.52Q316.89 250.61 309.19 253.31Q302.32 255.72 294 255.98Q285.68 255.72 278.81 253.31Q271.11 250.61 265.64 245.52Q260.17 240.44 257.34 233.5Q254.5 226.56 254.5 218.38V143.84Z"] },
  I: { x0: 0, x1: 58, c: ["M0 143.84H58V288H0Z"] },
  T: { x0: 0, x1: 156, c: ["M0 143.84H156V178.6H107V288H49V178.6H0Z"] },
};

function transformContour(d, f) {
  const n = (v) => +v.toFixed(2);
  let out = "", cmd = null, buf = [];
  for (const t of d.match(/[MQLHVZ]|-?\d*\.?\d+/g)) {
    if (/[A-Z]/.test(t)) { cmd = t; buf = []; if (t === "Z") out += "Z"; continue; }
    buf.push(+t);
    if ((cmd === "M" || cmd === "L") && buf.length === 2) { const [x, y] = f(buf[0], buf[1]); out += `${cmd}${n(x)} ${n(y)}`; buf = []; }
    else if (cmd === "Q" && buf.length === 4) { const [a, b] = f(buf[0], buf[1]); const [x, y] = f(buf[2], buf[3]); out += `Q${n(a)} ${n(b)} ${n(x)} ${n(y)}`; buf = []; }
    else if (cmd === "H") { out += `H${n(f(buf[0], 0)[0])}`; buf = []; }
    else if (cmd === "V") { out += `V${n(f(0, buf[0])[1])}`; buf = []; }
  }
  return out;
}

// Sets `text` across x 7 → 1266 of a 1280-wide canvas. squash 0 keeps the
// letters' proportions (shorter strip); 1 keeps a 190-tall strip and narrows
// the letters; 0.5 sits halfway.
export function wordmark(text, { squash = 0.5, gap = 4, space = 48, left = 7, right = 1266 } = {}) {
  const run = []; let pen = 0;
  for (const ch of text) {
    if (ch === " ") { pen += space - gap; continue; }
    const g = GLYPHS[ch];
    if (!g) throw new Error(`build-knockout: no wordmark glyph for "${ch}" — add it to GLYPHS.`);
    run.push({ g, at: pen }); pen += g.x1 - g.x0 + gap;
  }
  const sx = (right - left) / (pen - gap);
  const sy = 1 + (sx - 1) * (1 - squash);
  const r = (v) => +v.toFixed(2);
  const map = (g, at) => (x, y) => [left + (x - g.x0 + at) * sx, (y - 120) * sy];
  const vbH = r(190 * sy);
  const letters = run.map(({ g, at }) => g.c.map((c) => transformContour(c, map(g, at))).join("")).join("");
  const lids = run.map(({ g, at }) => ({ x: r(left + at * sx - 1), y: r(16 * sy), w: r((g.x1 - g.x0) * sx + 2), h: r(160 * sy) }));
  return {
    vbH, letters, lids,
    knockout: `M-4 -4H1284V${r(vbH + 4)}H-4Z${letters}`,
    crop: `${left} ${r(19 * sy)} ${right - left} ${r(154 * sy)}`, // tight box around the letters
  };
}

const WM = wordmark(site.name.toUpperCase());

/* ------------------------------------------------------------- variant copy */
const SHORT_STAT = { "+14.2%": "YoY app revenue", "+447%": "profile completions", "+117%": "YoY push opt-ins" };
const COPY = {
  tagline: site.role,
  cta: "Get in touch",
  headline: site.intro.split(" — ")[0],
  proofWord: "Selected impact",
  proof: site.stats.map((s) => [s.value, SHORT_STAT[s.value] || s.label]),
  available: "Available for senior product design roles.",
  aboutLead: site.bio.split(/(?<=\.)\s+/)[0].replace(/\.$/, ""),
  aboutRest: site.bio.split(/(?<=\.)\s+/).slice(1).join(" "),
};
const navCols = (home) => [
  [
    { label: "Work", href: home ? "#work" : "../index.html#work", ls: -1.966 },
    { label: "About", href: home ? "#about" : "../index.html#about", ls: -1.399 },
    { label: "Contact", href: "#contact", ls: -1.3 },
  ],
  [
    { label: "LinkedIn", href: site.linkedinUrl, ext: true, ls: -1.139 },
    { label: "Email", href: `mailto:${site.email}`, ls: -1.471 },
  ],
];

/* ---------------------------------------------------------------- partials */
const ICON_CORNER = `<svg viewBox="0 0 9 9" aria-hidden="true"><path d="M1.6 .4V6H6.2" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M5.6 3.6 8.6 6 5.6 8.4Z" fill="currentColor"/></svg>`;
const ext = (l) => (l.ext ? ` target="_blank" rel="noopener"` : "");

function head({ title, description, base = "", gate = false }) {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#000000">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(site.name)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23DEC1FC'/%3E%3C/svg%3E">
<link rel="preload" href="${base}assets/hanken-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/jb-mono-variable.woff2" as="font" type="font/woff2" crossorigin>
<script>
/* .is-entering only when the hero entrance can run (failsafe 2.6 s); .rv-on only when scroll reveals can run (failsafe 3 s) */
(function(d){try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;${gate ? `if(!r&&'animate' in Element.prototype){d.classList.add('is-entering');setTimeout(function(){if(!window.__kxEntrance)d.classList.remove('is-entering')},2600);}` : ""}if(!r&&'IntersectionObserver' in window){d.classList.add('rv-on');setTimeout(function(){if(!window.__kxReveal)d.classList.remove('rv-on')},3000);}}catch(e){}})(document.documentElement);
</script>
<style>:root{--wm-h:${WM.vbH}}</style>
<link rel="stylesheet" href="${base}css/knockout.css">`;
}

const solidMark = (cls = "") =>
  `<svg class="${cls}" viewBox="${WM.crop}" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${WM.letters}"/></svg>`;

function footer({ base = "", home = false }) {
  return `<footer class="kx-foot" id="contact">
  <div class="kx-head"><span class="kx-label">Contact</span><span class="kx-mono">(${home ? "03" : "↘"})</span></div>
  <div class="kx-foot-grid">
    <p class="kx-foot-lead" data-rv>${esc(COPY.available)}</p>
    <a class="kx-foot-mail" href="mailto:${esc(site.email)}" data-rv>${esc(site.email)}</a>
    <ul class="kx-foot-links" data-rv>
      <li><a href="${esc(site.linkedinUrl)}" target="_blank" rel="noopener">${esc(site.linkedinLabel)} <span aria-hidden="true">↗</span></a></li>
      <li><a href="${home ? "#top" : "../index.html"}">${home ? "Back to top" : "Home"} <span aria-hidden="true">${home ? "↑" : "↖"}</span></a></li>
    </ul>
  </div>
  <svg class="kx-foot-wm" viewBox="${WM.crop}" role="img" aria-label="${esc(site.name)}" data-rv>
    <defs><clipPath id="kx-wm-clip"><path clip-rule="evenodd" d="${WM.letters}"/></clipPath></defs>
    <g clip-path="url(#kx-wm-clip)">
      <image href="${base}assets/hero-poster.jpg" x="-953" y="-525" width="2400" height="1350" preserveAspectRatio="xMidYMid slice"/>
      <rect x="0" y="0" width="1280" height="${WM.vbH}" fill="rgb(150,118,104)" fill-opacity=".3" style="mix-blend-mode:screen"/>
    </g>
  </svg>
  <div class="kx-legal"><span>© <span data-year>2026</span> ${esc(site.name)}</span><span>Product design portfolio</span><span>${esc(site.role)}</span></div>
</footer>`;
}

/* --------------------------------------------------------------- homepage */
function caseRow(cs, i) {
  const meta = cs.overview
    .filter(([k]) => ["Surface", "Surfaces", "Platform", "Status", "Stage", "Launched"].includes(k))
    .slice(0, 2)
    .map(([, v]) => esc(v))
    .join(" <i>•</i> ");
  return `<li class="kx-case" data-rv>
        <a href="work/${cs.slug}.html">
          <span class="kx-case-i">${pad2(i + 1)}</span>
          <span class="kx-case-main">
            <span class="kx-case-t">${esc(cs.title)}</span>
            <span class="kx-case-d">${esc(cs.cardDescription)}</span>
            ${meta ? `<span class="kx-case-m">${meta}</span>` : ""}
          </span>
          <span class="kx-metric"><span class="kx-metric-v">${esc(cs.heroMetric.value)}</span><span class="kx-metric-l">${esc(cs.heroMetric.label)}</span></span>
          <span class="kx-case-go">${ICON_CORNER}</span>
        </a>
      </li>`;
}

function renderHome() {
  const cols = navCols(true);
  const colX = [7, 117];
  const lids = WM.lids.map((l) => `<rect class="lid" x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}"/>`).join("\n          ");
  const proof = COPY.proof.map(([v, l]) => `<i>${esc(v)}</i> ${esc(l)}`).join(" • ");

  return `${head({ title: `${site.name} — ${site.role}`, description: site.bio, gate: true })}

<a class="kx-skip" href="#work">Skip to work</a>
<main id="top">
<div class="stage" id="stage">
  <video class="photo" id="photo" width="1920" height="1080" poster="assets/hero-poster.jpg"
         autoplay muted loop playsinline preload="auto" aria-hidden="true" disablepictureinpicture>
    <source src="assets/hero.mp4" type="video/mp4">
  </video>
  <div class="lift" aria-hidden="true"></div>
  <div class="shade" aria-hidden="true"></div>

  <header class="band" aria-label="${esc(site.name)}">
    <span class="band-top"></span>
    <span></span>
    <h1><span class="sr">${esc(site.name)} — ${esc(site.role)}</span>
      <svg viewBox="0 0 1280 ${WM.vbH}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path fill="#000" fill-rule="evenodd" d="${WM.knockout}"/>
        <g fill="#000" aria-hidden="true">
          ${lids}
        </g>
      </svg>
    </h1>
    <span></span>
    <span class="band-bot"></span>
  </header>

  <nav class="nav" aria-label="Main">
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="navLinks"><i aria-hidden="true"></i><span class="menu-label">MENU</span></button>
    <div class="nav-links" id="navLinks">
      ${cols
        .map(
          (col, c) => `<ul class="col" style="left:calc(${colX[c]} * var(--u));top:calc(10.5 * var(--u))">
        ${col.map((l) => `<li><a href="${esc(l.href)}"${ext(l)} style="--ls:${l.ls}">${esc(l.label)}</a></li>`).join("\n        ")}
      </ul>`
        )
        .join("\n      ")}
    </div>
    <p class="tagline">${esc(COPY.tagline)}</p>
    <a class="cta" href="mailto:${esc(site.email)}">
      ${ICON_CORNER}
      <span>${esc(COPY.cta)}</span>
    </a>
  </nav>

  <section class="copy" aria-label="Introduction">
    <p class="headline">${esc(COPY.headline)}</p>
    <a class="proof" href="#work" aria-label="${esc(COPY.proofWord)}: ${esc(COPY.proof.map(([v, l]) => `${v} ${l}`).join(", "))}">
      ${ICON_CORNER}
      <span class="proof-word" aria-hidden="true">${esc(COPY.proofWord)}</span>
      <span class="proof-meta" aria-hidden="true">${proof}</span>
    </a>
    <a class="cue" href="#work">${caseStudies.length} case studies <span aria-hidden="true">↓</span></a>
  </section>
</div>

<section class="kx-sec kx-work" id="work" aria-labelledby="work-h">
  <div class="kx-head"><h2 class="kx-label" id="work-h">Selected work</h2><span class="kx-mono">(01)</span></div>
  <ol class="kx-cases">
      ${caseStudies.map(caseRow).join("\n      ")}
  </ol>
</section>

<section class="kx-sec kx-about" id="about" aria-labelledby="about-h">
  <div class="kx-head"><h2 class="kx-label" id="about-h">About</h2><span class="kx-mono">(02)</span></div>
  <p class="kx-lead" data-rv>${esc(COPY.aboutLead)}</p>
  <div class="kx-about-grid">
    <p class="kx-bio" data-rv>${esc(COPY.aboutRest || site.bio)}</p>
    <dl class="kx-facts" data-rv>
      <div><dt>Role</dt><dd>${esc(site.role)}</dd></div>
      <div><dt>Focus</dt><dd>Native mobile &amp; web, B2C</dd></div>
      <div><dt>Work</dt><dd>${caseStudies.length} case studies</dd></div>
    </dl>
  </div>
  <ul class="kx-stats">
    ${site.stats
      .map((s) => `<li data-rv><span class="kx-stat-v">${esc(s.value)}</span><span class="kx-stat-l">${esc(s.label)}</span></li>`)
      .join("\n    ")}
  </ul>
  <figure class="kx-quote" data-rv>
    <blockquote><p>“${esc(site.testimonial.quote)}”</p></blockquote>
    <figcaption>— ${esc(site.testimonial.author)}</figcaption>
  </figure>
</section>
</main>

${footer({ home: true })}

<script src="js/knockout.js"></script>
`;
}

/* ---------------------------------------------------------- case study page */
function renderSection(sec, i) {
  let body = "";
  if (sec.paras) body += sec.paras.map((p) => `<p>${esc(p)}</p>`).join("");
  if (sec.subsections)
    body += sec.subsections.map((s) => `<div class="kx-sub"><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></div>`).join("");
  if (sec.bullets) body += `<ul class="kx-bullets">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  if (sec.table)
    body += `<div class="kx-table-wrap"><table class="kx-table${sec.table.rows.every((r) => String(r[r.length - 1]).length <= 16) ? " kx-table--impact" : ""}"><thead><tr>${sec.table.head
      .map((h) => `<th scope="col">${esc(h)}</th>`)
      .join("")}</tr></thead><tbody>${sec.table.rows
      .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  if (sec.closer) body += `<p class="kx-closer">${esc(sec.closer)}</p>`;
  return `<section class="kx-cs-sec" data-rv>
      <h2 class="kx-cs-sec-h"><span class="kx-mono">${pad2(i + 1)}</span>${esc(sec.title)}</h2>
      <div class="kx-cs-sec-b">${body}</div>
    </section>`;
}

function renderCase(cs, idx) {
  const prev = caseStudies[idx - 1], next = caseStudies[idx + 1];
  const cols = navCols(false);
  const pagerLink = (c, dir) =>
    c
      ? `<a class="kx-pager-${dir}" href="${c.slug}.html"><span class="kx-mono">${dir === "prev" ? "← Previous" : "Next →"}</span><span class="kx-pager-t">${esc(c.title)}</span></a>`
      : `<a class="kx-pager-${dir}" href="../index.html#work"><span class="kx-mono">${dir === "prev" ? "← Back" : "Done →"}</span><span class="kx-pager-t">All work</span></a>`;

  return `${head({ title: `${cs.title} — ${site.name}`, description: cs.summary, base: "../" })}

<a class="kx-skip" href="#content">Skip to content</a>
<header class="kx-bar">
  <a class="kx-bar-mark" href="../index.html" aria-label="${esc(site.name)} — home">${solidMark()}</a>
  <nav class="kx-bar-nav" aria-label="Main">
    ${cols.flat().map((l) => `<a href="${esc(l.href)}"${ext(l)}>${esc(l.label)}</a>`).join("\n    ")}
  </nav>
  <a class="cta" href="mailto:${esc(site.email)}">${ICON_CORNER}<span>${esc(COPY.cta)}</span></a>
</header>

<main id="content" class="kx-cs">
  <div class="kx-cs-top">
    <a class="kx-back" href="../index.html#work"><span aria-hidden="true">←</span> All work</a>
    <span class="kx-mono">Case ${pad2(idx + 1)} / ${pad2(caseStudies.length)}</span>
  </div>

  <header class="kx-cs-hero">
    <h1 class="kx-cs-title" data-rv>${esc(cs.title)}</h1>
    <div class="kx-cs-side" data-rv>
      <p class="kx-cs-sub">${esc(cs.subtitle)}</p>
      <p class="kx-metric kx-metric--lg"><span class="kx-metric-v">${esc(cs.heroMetric.value)}</span><span class="kx-metric-l">${esc(cs.heroMetric.label)}</span></p>
    </div>
  </header>

  <p class="kx-cs-summary" data-rv>${esc(cs.summary)}</p>

  <dl class="kx-ov" data-rv>
    ${cs.overview.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n    ")}
  </dl>

  <div class="kx-cs-body">
    ${cs.sections.map(renderSection).join("\n    ")}
  </div>

  <section class="kx-refl" data-rv>
    <h2 class="kx-cs-sec-h"><span class="kx-mono">↘</span>Reflections</h2>
    <ol>${cs.reflections.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
  </section>

  <nav class="kx-pager" aria-label="More work">
    ${pagerLink(prev, "prev")}
    ${pagerLink(next, "next")}
  </nav>
</main>

${footer({ base: "../" })}

<script src="../js/knockout.js"></script>
`;
}

/* -------------------------------------------------------------------- run */
export async function buildKnockout({ outDir = KNOCKOUT_DIR } = {}) {
  await mkdir(join(outDir, "work"), { recursive: true });
  await writeFile(join(outDir, "index.html"), renderHome(), "utf8");
  for (let i = 0; i < caseStudies.length; i++) {
    await writeFile(join(outDir, "work", `${caseStudies[i].slug}.html`), renderCase(caseStudies[i], i), "utf8");
  }
  console.log(`Built ${outDir}: index.html + ${caseStudies.length} case study pages (Knockout variant).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildKnockout().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
