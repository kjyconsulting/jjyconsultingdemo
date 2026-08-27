// Jonathan J. Young Consulting — Site 2 interactions
(function () {
  // Apply saved theme before paint as much as possible
  var saved = localStorage.getItem("jjy-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var themeBtn = document.querySelector(".theme-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }

  if (themeBtn) {
    var setIcon = function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      themeBtn.textContent = isLight ? "☀" : "☽";
      themeBtn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    };
    setIcon();
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      if (next === "dark") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", next);
      }
      localStorage.setItem("jjy-theme", next);
      setIcon();
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated stat counters
  var stats = document.querySelectorAll(".stat .num[data-count]");
  if (stats.length) {
    var animateStat = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1300;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateStat(entry.target); statObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      stats.forEach(function (el) { statObserver.observe(el); });
    } else {
      stats.forEach(animateStat);
    }
  }

  // Flip cards: tap-to-flip on touch devices, keyboard support
  document.querySelectorAll(".flip-card").forEach(function (card) {
    card.setAttribute("tabindex", "0");
    var flip = function () { card.classList.toggle("is-flipped"); };
    card.addEventListener("click", flip);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  });

  // Active nav link highlighting for in-page service sections
  var sections = document.querySelectorAll(".service-block[id]");
  var navLinks = document.querySelectorAll(".services-nav a");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkFor = function (id) { return document.querySelector('.services-nav a[href="#' + id + '"]'); };
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // Contact form -> mailto
  var contactForm = document.querySelector("form[data-mailto]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = contactForm.getAttribute("data-mailto");
      var name = contactForm.querySelector("#name");
      var email = contactForm.querySelector("#email");
      var message = contactForm.querySelector("#message");
      var subject = encodeURIComponent("Project inquiry from " + (name ? name.value : ""));
      var body = encodeURIComponent(
        (message ? message.value : "") + "\n\nFrom: " + (name ? name.value : "") + "\nReply to: " + (email ? email.value : "")
      );
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }
});
