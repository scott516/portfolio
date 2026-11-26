// Portfolio v2 interactions. Everything here is progressive enhancement:
// with JS off the pages are fully readable, just without motion, the theme
// switch or the hover previews.
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  if (hasIO && !reduce) doc.classList.add("js");

  /* ---------------------------------------------------------------- theme */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t) {
    doc.setAttribute("data-theme", t);
    if (themeMeta) themeMeta.setAttribute("content", t === "dark" ? "#161310" : "#ecebeb");
    $$("[data-theme-set]").forEach(function (b) {
      var on = b.getAttribute("data-theme-set") === t;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  applyTheme(doc.getAttribute("data-theme") === "dark" ? "dark" : "light");
  $$("[data-theme-set]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-theme-set");
      applyTheme(t);
      try { localStorage.setItem("ls-theme", t); } catch (e) {}
    });
  });

  /* -------------------------------------------- scale tile stages to fit */
  var STAGE_W = 360;
  function fit(tile) { tile.style.setProperty("--k", (tile.clientWidth / STAGE_W).toFixed(4)); }
  var tiles = $$(".tile");
  tiles.forEach(fit);
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { fit(e.target); }); });
    tiles.forEach(function (t) { ro.observe(t); });
  } else {
    window.addEventListener("resize", function () { tiles.forEach(fit); });
  }

  function show(slides, i) {
    slides.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-i") === i); });
  }

  /* ------------------------------------- hero: cycle through the screens */
  $$("[data-cycle]").forEach(function (stage) {
    var slides = $$(".stage__slide", stage);
    if (reduce || slides.length < 2) return;
    var i = 0, timer = null;
    function start() { if (!timer) timer = setInterval(function () { i = (i + 1) % slides.length; show(slides, i); }, 1400); }
    function stop() { clearInterval(timer); timer = null; }
    if (hasIO) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(stage);
    } else { start(); }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  });

  /* ------------------------------------ work index: hover → preview tile */
  var rows = $$(".wl__row");
  var previewSlides = $$(".work__tile .stage__slide");
  var caps = $$(".work__cap");
  function activate(i) {
    rows.forEach(function (r) { r.classList.toggle("is-on", +r.getAttribute("data-i") === i); });
    show(previewSlides, i);
    show(caps, i);
  }
  rows.forEach(function (r) {
    var i = +r.getAttribute("data-i");
    r.addEventListener("mouseenter", function () { activate(i); });
    r.addEventListener("focusin", function () { activate(i); });
  });

  /* --------------------------------------- split statements into lines */
  function split(el) {
    var text = el.getAttribute("data-text");
    if (text === null) { text = el.textContent.trim(); el.setAttribute("data-text", text); }
    el.classList.remove("is-split");
    el.textContent = "";
    var words = text.split(/\s+/).map(function (w) {
      var s = document.createElement("span");
      s.textContent = w;
      s.style.whiteSpace = "nowrap"; // keep "end-to-end" etc. on one measured line
      el.appendChild(s);
      el.appendChild(document.createTextNode(" "));
      return s;
    });
    var lines = [], top = null;
    words.forEach(function (s) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines[lines.length - 1].push(s.textContent);
    });
    el.textContent = "";
    lines.forEach(function (ws, n) {
      var ln = document.createElement("span"); ln.className = "ln";
      var inner = document.createElement("span"); inner.className = "ln__i";
      inner.style.transitionDelay = (n * 60) + "ms";
      inner.textContent = ws.join(" ");
      ln.appendChild(inner);
      el.appendChild(ln);
    });
    el.classList.add("is-split");
  }
  var splitEls = $$("[data-lines]");
  if (doc.classList.contains("js") && splitEls.length) {
    var run = function () { splitEls.forEach(split); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
    var lastW = window.innerWidth, rt;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rt); rt = setTimeout(run, 150);
    });
  }

  /* --------------------------------------------------- reveal on scroll */
  if (doc.classList.contains("js")) {
    var targets = $$("[data-reveal], [data-lines]");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        // stagger siblings that enter together (index rows, stats)
        var sibs = el.parentNode ? $$(":scope > [data-reveal]", el.parentNode) : [];
        var idx = Math.max(0, sibs.indexOf(el));
        setTimeout(function () { el.classList.add("is-in"); }, Math.min(idx, 10) * 55);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
    // safety net: never leave anything hidden that's already on screen
    window.addEventListener("load", function () {
      setTimeout(function () {
        targets.forEach(function (t) { if (t.getBoundingClientRect().top < window.innerHeight) t.classList.add("is-in"); });
      }, 1200);
    });
  }

  /* ----------------------------------------- header nav: scroll-spy */
  var spyLinks = $$("[data-spy-link]");
  var spied = $$("[data-spy]");
  if (hasIO && spied.length && spyLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var key = e.target.getAttribute("data-spy");
        spyLinks.forEach(function (a) {
          var on = a.getAttribute("data-spy-link") === key;
          a.classList.toggle("is-on", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    spied.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------- mobile menu */
  var menuBtn = document.querySelector(".hd__menu");
  var menu = document.getElementById("menu");
  if (menuBtn && menu) {
    var label = menuBtn.querySelector("[data-menu-label]");
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "Close" : "Open";
      doc.classList.toggle("menu-open", open);
    };
    menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 760 && !menu.hidden) setMenu(false); });
  }

  /* ------------------------------------------------- back to top, year */
  $$("[data-top]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  });
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();
