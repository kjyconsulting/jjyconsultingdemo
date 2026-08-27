// Jonathan J. Young Consulting — Site 3 interactions (retrospective)
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("is-open"); });
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

  // Lightbox gallery
  var galleryButtons = Array.prototype.slice.call(document.querySelectorAll(".gallery button"));
  var lightbox = document.querySelector(".lightbox");
  if (galleryButtons.length && lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var currentIndex = 0;
    var lastFocused = null;

    var show = function (index) {
      currentIndex = (index + galleryButtons.length) % galleryButtons.length;
      var img = galleryButtons[currentIndex].querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
    };

    var open = function (index) {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add("is-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    };

    var close = function () {
      lightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    };

    var onKeydown = function (e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(currentIndex + 1);
      if (e.key === "ArrowLeft") show(currentIndex - 1);
    };

    galleryButtons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { open(i); });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { show(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
  }
});
