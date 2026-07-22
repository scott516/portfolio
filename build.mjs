// ---------------------------------------------------------------------------
// Static site generator for the Lucia Scott portfolio.
//   node build.mjs   ->   writes index.html + work/<slug>.html
// Pure Node, no dependencies. Content lives in data/site.mjs.
// ---------------------------------------------------------------------------
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { site, caseStudies } from "./data/site.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ utils */
const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const arrow = (dir = "right") =>
  dir === "left"
    ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* --------------------------------------------------------------- <head> */
function head({ title, description, base = "", extraCss = [] }) {
  const css = ["css/styles.css", ...extraCss]
    .map((h) => `<link rel="stylesheet" href="${base}${h}">`)
    .join("\n  ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${esc(site.name)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta name="theme-color" content="#edf1f0">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23ff0000'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=Instrument+Sans:wght@400;500;600;700&display=swap">
  ${css}
</head>`;
}

/* ------------------------------------------------------------- shared UI */
function nav(base = "") {
  const items = [
    { label: "Work", href: `${base}index.html#work`, nav: "work" },
    { label: "About", href: `${base}index.html#about`, nav: "about" },
    { label: "Resume", href: site.linkedinUrl, ext: true },
    { label: "Contact", href: `mailto:${site.email}`, nav: "contact" },
  ];
  return `<nav class="nav" aria-label="Primary">
    <div class="nav__inner grid8">
      ${items
        .map((i) =>
          i.ext
            ? `<a class="nav__link" href="${i.href}" target="_blank" rel="noopener">${i.label}</a>`
            : `<a class="nav__link" href="${i.href}" data-nav="${i.nav}">${i.label}</a>`
        )
        .join("\n      ")}
    </div>
  </nav>`;
}

const mark = (cls = "") => `<span class="mark ${cls}" aria-hidden="true"></span>`;

// Rendered PNG of the "Lucia Scott" wordmark (assets/wordmark.png) — locks the
// exact letterforms/spacing as a brand asset rather than relying on live text
// + web-font substitution across browsers.
const wordmarkImg = (base = "") =>
  `<img class="wordmark-img" src="${base}assets/wordmark.png" width="2511" height="612" alt="Lucia Scott">`;

/* --------------------------------------------------------- device screens */
function phoneScreen(type, v = "a") {
  switch (type) {
    case "offer": {
      const title = v === "a"
        ? "£10 Domino's Voucher with Orders Over £40"
        : "£8 off Just Eat Orders Over £25";
      return `<div class="scr">
        <div class="scr__status"><span>9:41</span><span class="dots">••• 5G ▮</span></div>
        <div class="scr__banner"><span class="coin">£5</span> SHOP TWICE, EARN £5 · VIP</div>
        <div class="scr__card">
          <div class="scr__hero"><div class="scr__tags"><span class="chip chip--ex">EXCLUSIVE</span><span class="chip chip--rw">REWARD</span></div></div>
          <div class="scr__cbody">
            <div class="scr__ctitle">${title}</div>
            <div class="scr__steps">
              <div class="scr__step"><b>1</b>Tap</div>
              <div class="scr__step"><b>2</b>Shop</div>
              <div class="scr__step"><b>3</b>Verify</div>
              <div class="scr__step"><b>4</b>Earn</div>
            </div>
          </div>
        </div>
        <div class="scr__foot"><div class="scr__ico">↗</div><div class="scr__btn">Get Reward</div></div>
      </div>`;
    }
    case "onboarding":
      return `<div class="scr scr--onboard">
        <div class="scr__bell">🔔</div>
        <h4>${v === "a" ? "Never miss an offer" : "Be first to know"}</h4>
        <p>${v === "a" ? "Be first to know when a new deal drops from the brands you love." : "Turn on alerts and we'll ping you the moment a great deal lands."}</p>
        <div class="scr__cta2"><span class="b p">Allow notifications</span><span class="b g">Not now</span></div>
      </div>`;
    case "stamp":
      return `<div class="scr scr--stamp">
        <div class="scr__status"><span>9:41</span><span class="dots">••• 5G ▮</span></div>
        <div class="scr__stampcard">
          <div class="lbl">Shop Twice, Earn</div>
          <div class="amt">£5.00 reward</div>
          <div class="scr__stamps">
            ${[1, 2, 3, 4, 5].map((n) => `<span class="stamp ${n <= (v === "a" ? 3 : 4) ? "on" : ""}">${n <= (v === "a" ? 3 : 4) ? "✓" : ""}</span>`).join("")}
          </div>
        </div>
        <div class="scr__rows">
          <div class="scr__row"><span>ASOS — £42.00</span><b>Tracked</b></div>
          <div class="scr__row"><span>Nike — £68.50</span><b>Tracked</b></div>
          <div class="scr__row"><span>Boots — £15.00</span><b>Pending</b></div>
        </div>
      </div>`;
    case "biind":
      return `<div class="scr scr--biind">
        <div class="top">${v === "a" ? "Discover" : "New & rising"}</div>
        <div class="scr__albums"><span class="album"></span><span class="album"></span><span class="album"></span><span class="album"></span></div>
        <div class="scr__now"><span class="art"></span><div><div class="t">${v === "a" ? "Neon Field" : "Slow Signal"}</div><div class="s">emerging artist</div></div><span class="play">▶</span></div>
      </div>`;
    case "profile":
      return `<div class="scr scr--profile scr__pad">
        <div class="scr__status"><span>9:41</span><span class="dots">••• 5G ▮</span></div>
        <div style="font-weight:800;font-size:9px;margin:6px 2px 2px">Complete your profile</div>
        <div class="scr__fill"><i style="width:${v === "a" ? "70%" : "40%"}"></i></div>
        <div class="scr__field on">Shopping interests ✓</div>
        <div class="scr__field on">Postcode ✓</div>
        <div class="scr__field">Date of birth</div>
        <div class="scr__foot"><div class="scr__btn">Continue</div></div>
      </div>`;
    case "stories":
      return `<div class="scr scr--stories">
        <div class="scr__coins">${[1, 2, 3, 4].map(() => `<span class="coin-ring"><i></i></span>`).join("")}</div>
        <div class="scr__story"><span class="bars"><i class="on"></i><i class="on"></i><i></i></span><span class="cta">Get offer</span></div>
      </div>`;
    case "workshop":
      return `<div class="scr scr--workshop">
        <div style="font-weight:800;font-size:8px">App strategy · Day 3</div>
        <div class="scr__cluster">
          <span class="note n1">Discovery</span><span class="note n2">Retention</span>
          <span class="note n3">Sharing</span><span class="note n4">Rewards</span>
        </div>
        <span class="note n2">Prototype → test</span>
      </div>`;
    case "system":
      return `<div class="scr scr--system">
        <div style="font-weight:800;font-size:8px">Nebula · tokens</div>
        <div class="scr__tokrow"><span class="tok" style="background:#101828"></span><span class="tok" style="background:#ffd200"></span><span class="tok" style="background:#3b82f6"></span><span class="tok" style="background:#10b981"></span></div>
        <div class="scr__complist">
          <div class="scr__comp">Button / primary <span class="pill pill--app">app</span></div>
          <div class="scr__comp">Offer card <span class="pill pill--web">web</span></div>
          <div class="scr__comp">Nav bar <span class="pill pill--app">app</span></div>
        </div>
      </div>`;
    default:
      return `<div class="scr"></div>`;
  }
}

const phone = (type, v) =>
  `<div class="phone"><span class="phone__notch"></span><div class="phone__screen">${phoneScreen(type, v)}</div></div>`;

/* ------------------------------------------------------------- home card */
function card(cs) {
  const meta = cs.overview
    .filter(([k]) => ["Surface", "Platform", "Surfaces", "Role", "Timeline", "Stage"].includes(k))
    .slice(0, 3)
    .map(([, v]) => `<span>${esc(v)}</span>`)
    .join("");

  const body = `<div class="card__body">
      <a class="card__link" href="work/${cs.slug}.html">
        <h3 class="card__title">${esc(cs.title)}</h3>
      </a>
      <p class="card__desc">${esc(cs.cardDescription)}</p>
      <div class="card__meta">${meta}</div>
      <a class="card__cta" href="work/${cs.slug}.html">View case study ${arrow()}</a>
    </div>`;

  if (cs.layout === "full") {
    const stage = `<div class="card__stage">${phone(cs.mockup, "a")}${phone(cs.mockup, "b")}</div>`;
    return `<article class="card card--full" data-reveal>${body}${stage}</article>`;
  }
  return `<article class="card card--half" data-reveal>${body}</article>`;
}

/* --------------------------------------------------------------- homepage */
function renderHome(extraCss = []) {
  const cards = caseStudies.map(card).join("\n      ");

  const stats = site.stats
    .map(
      (s, i) => `<div class="stat" data-reveal>
          <div class="stat__num">${esc(s.value)}</div>
          <div class="stat__label">${esc(s.label)}</div>
        </div>${i < site.stats.length - 1 ? '<div class="stat__divider"></div>' : ""}`
    )
    .join("\n        ");

  return `${head({
    title: `${site.name} — ${site.role}`,
    description: site.bio,
    extraCss,
  })}
<body>
  ${nav()}
  <main class="shell">

    <header class="hero grid8" id="top">
      <div class="hero__wordmark" data-reveal>
        <h1 class="hero__wordmark-h">${wordmarkImg()}</h1>
      </div>
      <div class="hero__aside" data-reveal>
        ${mark()}
        <p class="hero__bio">${esc(site.bio)}</p>
      </div>
    </header>

    <section id="work" aria-label="Selected work">
      <div class="section-head"><span class="section-head__eyebrow">Selected work</span></div>
      <div class="work grid8">
      ${cards}
      </div>
    </section>

    <section class="about grid8" id="about">
      <div class="about__intro">
        <p class="about__lead">${esc(site.intro)}</p>
      </div>
      <div class="about__stats">
        ${stats}
      </div>
      <blockquote class="quote" data-reveal>
        <p class="quote__text">“${esc(site.testimonial.quote)}”</p>
        <footer class="quote__by">${esc(site.testimonial.author)}</footer>
      </blockquote>
    </section>

  </main>

  <footer class="footer shell" id="contact">
    <div class="footer__nav grid8">
      <a class="nav__link" href="#work" data-nav="work">Work</a>
      <a class="nav__link" href="#about" data-nav="about">About</a>
      <a class="nav__link" href="${site.linkedinUrl}" target="_blank" rel="noopener">Resume</a>
      <a class="nav__link is-active" href="mailto:${site.email}" data-nav="contact">Contact</a>
    </div>
    <div class="grid8" style="align-items:end">
      <div class="footer__wordmark">
        <p class="footer__wordmark-p">${wordmarkImg()}</p>
      </div>
      <div class="footer__contact">
        ${mark()}
        <a class="footer__link" href="mailto:${site.email}">${site.email}</a>
        <a class="footer__link" href="${site.linkedinUrl}" target="_blank" rel="noopener">${site.linkedinLabel}</a>
      </div>
    </div>
    <div class="footer__legal">
      <span>© <span data-year>2026</span> ${esc(site.name)}. Product design portfolio.</span>
      <span>Available for senior product design roles.</span>
    </div>
  </footer>

  <script src="js/main.js" defer></script>
</body>
</html>`;
}

/* ---------------------------------------------------------- case study page */
function renderSection(sec) {
  const accClass = "acc-" + (sec.accent || "gray");
  let content = "";
  if (sec.paras) content += sec.paras.map((p) => `<p class="cs-section__lead">${esc(p)}</p>`).join("");
  if (sec.subsections)
    content += sec.subsections
      .map((s) => `<div class="cs-sub"><div class="cs-sub__h">${esc(s.h)}</div><p class="cs-sub__p">${esc(s.p)}</p></div>`)
      .join("");
  if (sec.bullets)
    content += `<ul class="cs-list">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  if (sec.table)
    content += `<table class="cs-table"><thead><tr>${sec.table.head
      .map((h) => `<th>${esc(h)}</th>`)
      .join("")}</tr></thead><tbody>${sec.table.rows
      .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
  if (sec.closer) content += `<p class="cs-closer">${esc(sec.closer)}</p>`;

  return `<section class="cs-section ${accClass}" data-reveal>
      <div class="cs-section__grid">
        <div class="cs-section__label">${esc(sec.title)}</div>
        <div class="cs-section__content">${content}</div>
      </div>
    </section>`;
}

function renderCase(cs, prev, next, extraCss = []) {
  const overview = cs.overview
    .map(([k, v]) => `<div><div class="cs-ov__k">${esc(k)}</div><div class="cs-ov__v">${esc(v)}</div></div>`)
    .join("");

  const sections = cs.sections.map(renderSection).join("\n    ");

  const pager = `<nav class="cs-pager" aria-label="More work">
      ${
        prev
          ? `<a href="${prev.slug}.html">${arrow("left")}<span class="txt"><span class="lbl">Previous</span>${esc(prev.title)}</span></a>`
          : `<span></span>`
      }
      ${
        next
          ? `<a href="${next.slug}.html" style="text-align:right"><span class="txt"><span class="lbl">Next</span>${esc(next.title)}</span>${arrow()}</a>`
          : `<span></span>`
      }
    </nav>`;

  return `${head({
    title: `${cs.title} — ${site.name}`,
    description: cs.summary,
    base: "../",
    extraCss: ["css/case-study.css", ...extraCss],
  })}
<body class="cs">
  ${nav("../")}
  <main class="shell">

    <a class="cs-back" href="../index.html#work">${arrow("left")} All work</a>

    <header class="cs-hero grid8">
      <div class="cs-hero__head" data-reveal>
        <div class="cs-hero__subtitle">${esc(cs.subtitle)}</div>
        <h1 class="cs-hero__title">${esc(cs.title)}</h1>
      </div>
      <div class="cs-hero__metric" data-reveal>
        <div class="cs-metric__num">${esc(cs.heroMetric.value)}</div>
        <div class="cs-metric__label">${esc(cs.heroMetric.label)}</div>
      </div>
    </header>

    <section class="cs-summary grid8">
      <div class="cs-summary__inner"><p>${esc(cs.summary)}</p></div>
    </section>

    <section class="cs-overview" data-reveal aria-label="Overview">
      <div class="cs-overview__grid">${overview}</div>
    </section>

    <div class="cs-body grid8">
    ${sections}
    </div>

    <section class="cs-reflections" data-reveal>
      <h2>Reflections</h2>
      <ul>${cs.reflections.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
    </section>

    ${pager}
  </main>

  <footer class="footer shell" id="contact">
    <div class="grid8" style="align-items:end">
      <div class="footer__wordmark"><p class="footer__wordmark-p">${wordmarkImg("../")}</p></div>
      <div class="footer__contact">
        ${mark()}
        <a class="footer__link" href="mailto:${site.email}">${site.email}</a>
        <a class="footer__link" href="${site.linkedinUrl}" target="_blank" rel="noopener">${site.linkedinLabel}</a>
      </div>
    </div>
    <div class="footer__legal">
      <span>© <span data-year>2026</span> ${esc(site.name)}. Product design portfolio.</span>
      <a href="../index.html#work">Back to all work →</a>
    </div>
  </footer>

  <script src="../js/main.js" defer></script>
</body>
</html>`;
}

/* -------------------------------------------------------------------- run */
// outDir: where to write index.html + work/*.html (defaults to the repo root).
// accent: optional hex override for the --red token (the site's sole
//   interactive accent — brand mark, nav/footer/card hover states). When
//   set, writes an outDir/css/accent.css override and links it after the
//   canonical stylesheets, leaving css/styles.css itself untouched.
export async function build({ outDir = ROOT, accent } = {}) {
  const extraCss = [];
  if (accent) {
    await mkdir(join(outDir, "css"), { recursive: true });
    await writeFile(join(outDir, "css", "accent.css"), `:root { --red: ${accent}; }\n`, "utf8");
    extraCss.push("css/accent.css");
  }

  await writeFile(join(outDir, "index.html"), renderHome(extraCss), "utf8");
  await mkdir(join(outDir, "work"), { recursive: true });
  for (let i = 0; i < caseStudies.length; i++) {
    const prev = caseStudies[i - 1];
    const next = caseStudies[i + 1];
    await writeFile(
      join(outDir, "work", `${caseStudies[i].slug}.html`),
      renderCase(caseStudies[i], prev, next, extraCss),
      "utf8"
    );
  }
  console.log(`Built ${outDir}: index.html + ${caseStudies.length} case study pages.`);
}

// Only auto-run when invoked directly (`node build.mjs`), not when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
