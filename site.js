(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- mobile menu ---- */
  var mb = document.querySelector(".menubtn"), nav = document.querySelector(".nav");
  if (mb && nav) {
    mb.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", open ? "true" : "false");
      mb.textContent = open ? "Close" : "Menu";
    });
  }

  /* ---- live hours ---- */
  var HRS = { 0: [8, 17], 1: [7, 18], 2: [6, 18], 3: [6, 18], 4: [6, 18], 5: [6, 18], 6: [6, 18] };
  var DAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function fmt(h){ var s = h >= 12 ? "pm" : "am"; var v = h % 12 || 12; return v + s; }
  function hours() {
    var strip = document.querySelector(".hours"); if (!strip) return;
    var n = new Date(), d = n.getDay(), h = n.getHours() + n.getMinutes() / 60;
    var o = HRS[d][0], c = HRS[d][1], open = h >= o && h < c;
    var dot = strip.querySelector(".dot"), st = strip.querySelector(".st"), rest = strip.querySelector(".rest");
    dot.classList.toggle("shut", !open);
    st.classList.toggle("shut", !open);
    st.textContent = open ? "Open now" : "Closed";
    if (open) rest.textContent = "Until " + fmt(c) + " today · most jobs seen same day";
    else if (h < o) rest.textContent = "Opens " + fmt(o) + " this morning";
    else { var nd = (d + 1) % 7; rest.textContent = "Opens " + fmt(HRS[nd][0]) + " " + DAY[nd]; }
    var row = document.querySelector("tr[data-day='" + d + "']");
    if (row) row.classList.add("today");
  }
  hours(); setInterval(hours, 60000);

  /* ---- scroll entrances (observer, so they run once and don't reverse) ---- */
  var ups = document.querySelectorAll(".up");
  if (ups.length) {
    if (RM || !("IntersectionObserver" in window)) {
      ups.forEach(function (e) { e.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
      ups.forEach(function (e) { io.observe(e); });
    }
  }

  /* ---- the saved figure ---- */
  var fig = document.querySelector("[data-count]");
  if (fig) {
    var target = parseInt(fig.getAttribute("data-count"), 10);
    var show = function (v) { fig.textContent = "$" + v.toLocaleString("en-US"); };
    if (RM) show(target);
    else {
      var run = function () {
        var s = null;
        requestAnimationFrame(function step(ts) {
          if (!s) s = ts;
          var p = Math.min((ts - s) / 1000, 1), e = 1 - Math.pow(1 - p, 3);
          show(Math.round(target * e));
          if (p < 1) requestAnimationFrame(step);
        });
      };
      show(0); setTimeout(run, 620);
    }
  }

  /* ---- cutaway reveal + parts ---- */
  var cut = document.querySelector(".cutstage");
  if (cut) {
    var rev = cut.querySelector(".reveal");
    if (rev) {
      if (RM || !("IntersectionObserver" in window)) rev.classList.add("shown");
      else {
        var io2 = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { rev.classList.add("shown"); io2.disconnect(); } });
        }, { threshold: .25 });
        io2.observe(cut);
      }
    }
    var info = document.querySelector(".cutinfo");
    var parts = cut.querySelectorAll(".part");
    function pick(el) {
      parts.forEach(function (p) { p.setAttribute("aria-pressed", p === el ? "true" : "false"); });
      info.querySelector("h3").textContent = el.dataset.name;
      info.querySelector(".what").textContent = el.dataset.what;
      info.querySelector(".fix").textContent = el.dataset.fix;
      info.querySelector(".goes").textContent = el.dataset.goes;
      info.querySelector(".hint").textContent = el.dataset.src;
    }
    parts.forEach(function (p) {
      p.setAttribute("tabindex", "0");
      p.setAttribute("role", "button");
      p.setAttribute("aria-pressed", "false");
      p.addEventListener("click", function () { pick(p); });
      p.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(p); }
      });
    });
  }

  /* ---- year ---- */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
