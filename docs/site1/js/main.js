// Jonathan J. Young Consulting — Site 1 interactions
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
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
      var duration = 1200;
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
      var statObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      stats.forEach(function (el) { statObserver.observe(el); });
    } else {
      stats.forEach(animateStat);
    }
  }

  // Active nav link highlighting for in-page service sections
  var sections = document.querySelectorAll(".service-block[id]");
  var navLinks = document.querySelectorAll(".services-nav a");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkFor = function (id) {
      return document.querySelector('.services-nav a[href="#' + id + '"]');
    };
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // Contact form -> mailto (no backend on static hosting)
  var contactForm = document.querySelector("form[data-mailto]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = contactForm.getAttribute("data-mailto");
      var name = contactForm.querySelector("#name");
      var email = contactForm.querySelector("#email");
      var message = contactForm.querySelector("#message");
      var subject = encodeURIComponent("Project inquiry from " + (name ? name.value : ""));
      var bodyLines = [
        message ? message.value : "",
        "",
        "From: " + (name ? name.value : ""),
        "Reply to: " + (email ? email.value : "")
      ];
      var body = encodeURIComponent(bodyLines.join("\n"));
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }
});
