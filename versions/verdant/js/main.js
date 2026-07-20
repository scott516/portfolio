// Portfolio interactions: scroll-spy nav highlighting + reveal-on-scroll.
(function () {
  "use strict";

  // --- scroll-spy: mark the nav link for the section in view --------------
  var sections = ["work", "about", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute("data-nav") === id;
      a.classList.toggle("is-active", on);
      if (on) { a.setAttribute("aria-current", "true"); }
      else { a.removeAttribute("aria-current"); }
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setActive(e.target.id); }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // --- reveal on scroll (progressive enhancement) -------------------------
  // The `js` flag on <html> is what makes [data-reveal] start hidden in CSS,
  // so without JS (or if it errors) all content stays fully visible.
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("js");
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          ro.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { ro.observe(el); });
    // Safety net: if anything is still hidden after load, show it.
    window.addEventListener("load", function () {
      setTimeout(function () {
        reveals.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) { el.classList.add("is-in"); }
        });
      }, 400);
    });
  }

  // current year in footer
  var y = document.querySelector("[data-year]");
  if (y) { y.textContent = String(new Date().getFullYear()); }
})();
