/* ============================================================
   Hero confetti parallax

   Two stacked layers in #heroBanner: the banner art (.hero-banner__art)
   and a confetti overlay (.hero-banner__confetti) that sits a little
   taller than the hero so it has room to travel. They start aligned;
   on scroll the confetti is translated DOWN faster than the banner, so
   relative to the banner it drifts downward and reads as falling.

   rAF-throttled transform (not background-attachment: fixed, which
   janks on iOS - and mobile is the priority). Fully disabled under
   prefers-reduced-motion: the layers just stay put.
   ============================================================ */

'use strict';

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var hero = document.getElementById('heroBanner');
  if (!hero) {
    return;
  }
  var confetti = hero.querySelector('.hero-banner__confetti');
  var art = hero.querySelector('.hero-banner__art');
  if (!confetti) {
    return;
  }

  var CONFETTI_RATE = 0.42;  /* confetti falls fast */
  var ART_RATE = 0.10;       /* banner drifts gently the same way */
  var ticking = false;

  function update() {
    ticking = false;
    var rect = hero.getBoundingClientRect();
    /* only animate while the hero is anywhere near the viewport */
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
      return;
    }
    var scrolled = -rect.top; /* px the hero top has passed above the fold */
    confetti.style.transform = 'translate3d(0, ' + (scrolled * CONFETTI_RATE) + 'px, 0)';
    if (art) {
      art.style.transform = 'translate3d(0, ' + (scrolled * ART_RATE) + 'px, 0)';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
