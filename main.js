(function () {
  var W = window.WEDDING || {};

  /* ---------- Links from config ---------- */
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = W[el.getAttribute("data-link")];
    if (url) el.setAttribute("href", url);
  });

  /* ---------- QR codes (rebuilt from config links) ---------- */
  document.querySelectorAll("[data-qr]").forEach(function (box) {
    var url = W[box.getAttribute("data-qr")];
    if (!url || typeof qrcode === "undefined") return;
    var qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    var svg = box.querySelector("svg");
    if (svg) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", box.getAttribute("data-label") || "QR code");
    }
  });

  /* ---------- Countdown ---------- */
  var cd = document.getElementById("countdown");
  if (cd && W.dateTime) {
    var target = new Date(W.dateTime).getTime();
    var parts = {
      d: cd.querySelector('[data-unit="days"]'),
      h: cd.querySelector('[data-unit="hours"]'),
      m: cd.querySelector('[data-unit="minutes"]'),
      s: cd.querySelector('[data-unit="seconds"]'),
    };
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      parts.d.textContent = Math.floor(s / 86400);
      parts.h.textContent = pad(Math.floor((s % 86400) / 3600));
      parts.m.textContent = pad(Math.floor((s % 3600) / 60));
      parts.s.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Photo lightbox (photos "pop forward" when clicked) ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery img"));
  var box = document.getElementById("lightbox");
  var big = box && box.querySelector("img");
  var cap = box && box.querySelector("figcaption");
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    big.src = items[idx].currentSrc || items[idx].src;
    big.alt = items[idx].alt;
    cap.textContent = items[idx].getAttribute("data-caption") || "";
  }
  function open(i) {
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (box && items.length) {
    items.forEach(function (img, i) {
      img.addEventListener("click", function () { open(i); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    box.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Nav highlight on mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var openNav = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", openNav);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); });
    });
  }
})();
