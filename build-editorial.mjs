// ---------------------------------------------------------------------------
// Static site generator for the "editorial" design variant of the portfolio.
//   node build-editorial.mjs   ->   writes versions/editorial/index.html
//                                   + versions/editorial/work/<slug>.html
//
// A second, standalone design of the same portfolio: a 15-column vw
// grid, a light display serif (Newsreader, standing in for Merchant) paired
// with a tight grotesk (Inter Tight, standing in for PP Neue Montreal), and a
// warm off-white / near-black palette with a light/dark mode switch.
//
// The original site (index.html, work/, css/, js/ — built by build.mjs) is
// left untouched. Both designs read the same case-study content from
// data/site.mjs, so edits there flow into both after a rebuild.
//
// The folder is self-contained (only relative links, its own copy of the
// mark image), so publish.mjs can serve it either at /versions/editorial/
// or as the homepage — see live-site.json.
// Pure Node, no dependencies.
// ---------------------------------------------------------------------------
import { writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { site, caseStudies } from "./data/site.mjs";
import { phoneScreen } from "./build.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "versions", "editorial");

/* ------------------------------------------------------ editorial copy */
// Copy that only the editorial design uses. The two "about" statements are the bio
// from data/site.mjs, split into two sentences and put in the first person.
const copy = {
  status: "Open to senior roles",
  about:
    "Hey, I'm Lucia Scott, a product designer with 5+ years owning complex B2C " +
    "products end-to-end across native mobile and web. Data-driven, AI-forward, " +
    "and collaborative with product & engineering, focused on shipping real, " +
    "measurable impact.",
  contact:
    "Available for senior product design roles. If you're building something " +
    "people use every day, I'd love to hear about it.",
};

// Short labels for the work index. Any case study missing here falls back to
// the part of its title before the colon, and its hero metric.
const short = {
  "onboarding-personalisation": { name: "Onboarding Personalisation", impact: "+38% push opt-ins" },
  "product-deals": { name: "Product Deals", impact: "0→1 deal surface" },
  "merchant-offer-redesign": { name: "Merchant & Offer Redesign", impact: "+14.2% YoY revenue" },
  "profile-completion": { name: "Profile Completion", impact: "+447% completions" },
  stories: { name: "Stories", impact: "+230% clickouts" },
  "push-optins-onboarding": { name: "Push Opt-in Onboarding", impact: "+117% push opt-ins" },
  "loyalty-rewards": { name: "Loyalty Rewards", impact: "Tracker & wallet redesign" },
  "app-strategy-facilitation": { name: "App Strategy Workshops", impact: "21 stakeholders aligned" },
  "design-systems-nebula-gamora": { name: "Nebula & Gamora", impact: "2 design systems" },
  biind: { name: "Biind", impact: "0→1 music platform" },
};

const nameOf = (cs) => short[cs.slug]?.name ?? cs.title.split(":")[0];
const impactOf = (cs) => short[cs.slug]?.impact ?? cs.heroMetric.value;
const ov = (cs, keys) => (cs.overview.find(([k]) => keys.includes(k)) || [])[1] || "";
const nn = (i) => String(i + 1).padStart(2, "0");

/* ------------------------------------------------------------------ utils */
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const arrowNE = `<svg class="ico" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;

const kv = (k, v, cls = "") =>
  `<div class="kv ${cls}"><span class="kv__k">${k}</span><span class="kv__v">${v}</span></div>`;

const phone = (type, v) =>
  `<div class="phone"><span class="phone__notch"></span><div class="phone__screen">${phoneScreen(type, v)}</div></div>`;

// A 3:4 tile holding a fixed-size 360×480 stage; js/editorial.js scales the stage to
// the tile's width, so the phone screens stay crisp at any size.
const tile = (slides, { cls = "", cycle = false } = {}) =>
  `<div class="tile ${cls}"><div class="stage"${cycle ? " data-cycle" : ""}>${slides}</div></div>`;

const slideSingle = (cs, i) =>
  `<div class="stage__slide stage__slide--single${i === 0 ? " is-on" : ""}" data-i="${i}">${phone(cs.mockup, "a")}</div>`;

const slidePair = (cs, i, on) =>
  `<div class="stage__slide stage__slide--pair${on ? " is-on" : ""}" data-i="${i}">${phone(cs.mockup, "a")}${phone(cs.mockup, "b")}</div>`;

/* --------------------------------------------------------------- <head> */
function head({ title, description, base = "" }) {
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${esc(site.name)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta name="theme-color" content="#ecebeb">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23161310'/%3E%3C/svg%3E">
  <link rel="preload" href="${base}fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${base}fonts/inter-tight.woff2" as="font" type="font/woff2" crossorigin>
  <script>(function(){try{var t=localStorage.getItem("ls-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();</script>
  <link rel="stylesheet" href="${base}css/mockups.css">
  <link rel="stylesheet" href="${base}css/editorial.css">
</head>`;
}

/* ------------------------------------------------------------- header */
// page: "home" | "case" — sets which nav links point at in-page anchors.
function header(page) {
  const home = page === "home" ? "" : "../index.html";
  const links = [
    { key: "index", label: "Index", href: `${home}#top` },
    { key: "work", label: "Work", href: `${home}#work` },
    { key: "about", label: "About", href: `${home}#about` },
    { key: "contact", label: "Contact", href: `${home}#contact` },
  ];
  const active = page === "home" ? "index" : "work";
  const navLinks = links
    .map((l) => `<a href="${l.href}" data-spy-link="${l.key}"${l.key === active ? ' class="is-on" aria-current="page"' : ""}>${l.label}</a>`)
    .join("");
  const themeBtns = `<button type="button" data-theme-set="light">Light Mode</button><button type="button" data-theme-set="dark">Dark Mode</button>`;

  const menuRows = links
    .map(
      (l, i) => `<a class="menu__row" href="${l.href}"><span class="menu__n">${nn(i)}</span><span class="menu__t">${l.label}</span>${arrowNE}</a>`
    )
    .join("\n      ");

  return `<a class="skip" href="#main">Skip to content</a>
  <header class="hd">
    <div class="hd__col">
      <span class="kv__k">${esc(site.name)}:</span>
      <a class="kv__v" href="${home || "#top"}">${esc(site.role)}</a>
    </div>
    <div class="hd__col hd__col--wide">
      <span class="kv__k">Status:</span>
      <span class="kv__v">${esc(copy.status)}</span>
    </div>
    <nav class="hd__col hd__col--wide" aria-label="Primary">
      <span class="kv__k">Navigation:</span>
      <span class="kv__v list">${navLinks}</span>
    </nav>
    <div class="hd__col hd__col--wide">
      <span class="kv__k">Theme:</span>
      <span class="kv__v list" role="group" aria-label="Colour theme">${themeBtns}</span>
    </div>
    <button class="hd__menu" type="button" aria-expanded="false" aria-controls="menu"><span class="kv__k">Menu:</span><span class="kv__v" data-menu-label>Open</span></button>
  </header>

  <div class="menu" id="menu" hidden>
    <nav class="menu__list" aria-label="Primary (mobile)">
      ${menuRows}
    </nav>
    <div class="menu__meta">
      ${kv("Status:", esc(copy.status))}
      <div class="kv"><span class="kv__k">Theme:</span><span class="kv__v list" role="group" aria-label="Colour theme">${themeBtns}</span></div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------- footer */
function footer() {
  return `<footer class="ft">
    <p class="ft__name" aria-hidden="true">${esc(site.name)}</p>
    <div class="ft__row">
      ${kv("Copyright:", `All Rights Reserved ©<span data-year>2026</span>`)}
      <div class="kv"><span class="kv__k">Fast Travel:</span><a class="kv__v" href="#top" data-top>Go Back to Top</a></div>
      <div class="kv"><span class="kv__k">Email:</span><a class="kv__v" href="mailto:${site.email}">${esc(site.email)}</a></div>
      <div class="kv"><span class="kv__k">Elsewhere:</span><a class="kv__v" href="${site.linkedinUrl}" target="_blank" rel="noopener">LinkedIn</a></div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------------- homepage */
function renderHome() {
  const heroSlides = caseStudies.map(slideSingle).join("");

  const rows = caseStudies
    .map(
      (cs, i) => `<li class="wl__row${i === 0 ? " is-on" : ""}" data-i="${i}" data-reveal>
          <a class="wl__a" href="work/${cs.slug}.html">
            <span class="wl__n">${nn(i)}</span>
            <span class="wl__t">${esc(nameOf(cs))}</span>
            <span class="wl__m">${esc(impactOf(cs))}</span>
            <span class="wl__i">${arrowNE}</span>
          </a>
        </li>`
    )
    .join("\n        ");

  const previewSlides = caseStudies.map((cs, i) => slidePair(cs, i, i === 0)).join("");
  const captions = caseStudies
    .map(
      (cs, i) => `<div class="work__cap${i === 0 ? " is-on" : ""}" data-i="${i}">
            ${kv("Surface:", esc(ov(cs, ["Surface", "Surfaces", "Platform", "Formats", "Systems"])))}
            ${kv("Role:", esc(ov(cs, ["Role"])))}
          </div>`
    )
    .join("\n          ");

  const stats = site.stats
    .map(
      (s, i) => `<div class="impact__item" data-reveal>
          <p class="impact__num">${esc(s.value)}</p>
          ${kv(`${nn(i)}:`, esc(s.label))}
        </div>`
    )
    .join("\n        ");

  const mailLabel = `Email: ${site.email}`;
  const liLabel = `LinkedIn: /in/${site.linkedinUrl.split("/in/")[1] || ""}`;
  const roll = (href, label, ext) =>
    `<a class="roll" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="roll__in"><span>${esc(label)}</span><span aria-hidden="true">${esc(label)}</span></span></a>`;

  return `${head({ title: `${site.name} — ${site.role}`, description: site.bio })}
<body class="home">
  ${header("home")}

  <main id="main">
    <section class="hero" id="top" data-spy="index">
      ${tile(heroSlides, { cls: "hero__tile", cycle: true })}
      <h1 class="hero__name">${esc(site.name)}</h1>
    </section>

    <section class="about" id="about" data-spy="about" aria-label="About">
      <p class="statement" data-lines>${esc(copy.about)}</p>
    </section>

    <section class="work" id="work" data-spy="work" aria-labelledby="work-h">
      <h2 class="work__head kv" id="work-h"><span class="kv__k">Selected Work:</span><span class="kv__v">${caseStudies.length} Case Studies</span></h2>
      <ol class="wl">
        ${rows}
      </ol>
      <div class="work__preview" aria-hidden="true">
        ${tile(previewSlides, { cls: "work__tile" })}
        <div class="work__caps">
          ${captions}
        </div>
      </div>
    </section>

    <section class="impact" data-spy="work" aria-labelledby="impact-h">
      <h2 class="impact__head kv" id="impact-h"><span class="kv__k">Impact:</span><span class="kv__v">Selected Results</span></h2>
      <div class="impact__grid">
        ${stats}
      </div>
    </section>

    <section class="quote" data-spy="about" aria-label="Testimonial">
      <figure>
        <blockquote><p class="statement statement--s" data-lines>“${esc(site.testimonial.quote)}”</p></blockquote>
        <figcaption>${kv("Kind words from:", esc(site.testimonial.author), "kv--c")}</figcaption>
      </figure>
    </section>

    <section class="contact" id="contact" data-spy="contact" aria-label="Contact">
      <div class="contact__card">
        <p class="contact__p">${esc(copy.contact)}</p>
        <img class="contact__mark" src="assets/mark.png" width="192" height="192" alt="">
        <ul class="contact__links">
          <li>${roll(`mailto:${site.email}`, mailLabel)}</li>
          <li>${roll(site.linkedinUrl, liLabel, true)}</li>
        </ul>
      </div>
    </section>
  </main>

  ${footer()}

  <script src="js/editorial.js" defer></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------- case study page */
const isFigure = (s) => s.length <= 10 && /^[+\-−£0-9]/.test(s);

function renderSection(sec, i) {
  let body = "";
  if (sec.paras) body += sec.paras.map((p) => `<p class="cs-lead">${esc(p)}</p>`).join("");
  if (sec.subsections)
    body += `<div class="cs-subs">${sec.subsections
      .map(
        (s, j) => `<div class="cs-sub" data-reveal><h3 class="cs-sub__h"><span class="cs-sub__n">${i + 1}.${j + 1}</span>${esc(s.h)}</h3><p class="cs-sub__p">${esc(s.p)}</p></div>`
      )
      .join("")}</div>`;
  if (sec.bullets) body += `<ul class="cs-list">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  if (sec.table) {
    const last = sec.table.head.length - 1;
    body += `<div class="cs-table-wrap"><table class="cs-table"><thead><tr>${sec.table.head
      .map((h) => `<th scope="col">${esc(h)}</th>`)
      .join("")}</tr></thead><tbody>${sec.table.rows
      .map(
        (r) =>
          `<tr>${r
            .map((c, k) => `<td${k === last && isFigure(c) ? ' class="is-fig"' : ""}>${esc(c)}</td>`)
            .join("")}</tr>`
      )
      .join("")}</tbody></table></div>`;
  }
  if (sec.closer) body += `<p class="cs-closer">${esc(sec.closer)}</p>`;

  return `<section class="cs-sec" aria-labelledby="sec-${i}">
      <div class="cs-sec__label kv"><span class="kv__k">${nn(i)}:</span><h2 class="kv__v" id="sec-${i}">${esc(sec.title)}</h2></div>
      <div class="cs-sec__body">${body}</div>
    </section>`;
}

function renderCase(cs, i) {
  const total = caseStudies.length;
  const prev = caseStudies[i - 1];
  const next = caseStudies[(i + 1) % total];
  const sections = cs.sections.map(renderSection).join("\n    ");
  const reflIndex = cs.sections.length;

  const navPrev = prev
    ? `<a href="${prev.slug}.html" aria-label="Previous case study: ${esc(nameOf(prev))}">Previous</a>`
    : `<a href="../index.html#work">All Work</a>`;
  const navNext = `<a href="${next.slug}.html" aria-label="Next case study: ${esc(nameOf(next))}">Next</a>`;

  const overview = cs.overview.map(([k, v]) => kv(`${esc(k)}:`, esc(v))).join("\n      ");

  return `${head({ title: `${cs.title} — ${site.name}`, description: cs.summary, base: "../" })}
<body class="case">
  ${header("case")}

  <main id="main">
    <section class="cs-top" id="top">
      <div class="cs-top__text">
        ${kv(`Case Study ${nn(i)}:`, esc(nameOf(cs)))}
        <h1 class="cs-top__title">${esc(cs.title)}</h1>
        <nav class="cs-top__nav" aria-label="Case studies">
          ${navPrev}
          <span class="cs-top__count">${nn(i)} / ${String(total).padStart(2, "0")}</span>
          ${navNext}
        </nav>
      </div>
      <div class="cs-top__media" aria-hidden="true">
        ${tile(slidePair(cs, 0, true), { cls: "cs-top__tile" })}
      </div>
    </section>

    <section class="cs-intro" aria-label="Summary">
      ${kv("In Short:", esc(cs.subtitle), "kv--c")}
      <p class="statement statement--m" data-lines>${esc(cs.summary)}</p>
    </section>

    <section class="cs-metric" aria-label="Headline result">
      <p class="cs-metric__num">${esc(cs.heroMetric.value)}</p>
      ${kv("Headline Result:", esc(cs.heroMetric.label), "kv--c")}
    </section>

    <section class="cs-ov" aria-label="Overview">
      ${overview}
    </section>

    ${sections}

    <section class="cs-sec cs-sec--refl" aria-labelledby="sec-refl">
      <div class="cs-sec__label kv"><span class="kv__k">${nn(reflIndex)}:</span><h2 class="kv__v" id="sec-refl">Reflections</h2></div>
      <div class="cs-sec__body">
        <ol class="cs-refl">${cs.reflections.map((r) => `<li data-reveal>${esc(r)}</li>`).join("")}</ol>
      </div>
    </section>

    <section class="cs-next" aria-label="Next case study">
      ${kv(`Next Case Study ${nn((i + 1) % total)}:`, esc(nameOf(next)), "kv--c")}
      <a class="cs-next__title" href="${next.slug}.html">${esc(next.title)}</a>
      <a class="cs-next__all" href="../index.html#work">All Work ${arrowNE}</a>
    </section>
  </main>

  ${footer()}

  <script src="../js/editorial.js" defer></script>
</body>
</html>
`;
}

/* -------------------------------------------------------------------- run */
export async function buildEditorial() {
  await mkdir(join(OUT, "work"), { recursive: true });
  await mkdir(join(OUT, "assets"), { recursive: true });
  await copyFile(join(ROOT, "assets", "mark.png"), join(OUT, "assets", "mark.png"));
  await writeFile(join(OUT, "index.html"), renderHome(), "utf8");
  for (let i = 0; i < caseStudies.length; i++) {
    await writeFile(join(OUT, "work", `${caseStudies[i].slug}.html`), renderCase(caseStudies[i], i), "utf8");
  }
  console.log(`Built versions/editorial/: index.html + ${caseStudies.length} case study pages.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildEditorial().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
