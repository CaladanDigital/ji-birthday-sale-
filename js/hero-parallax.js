/* ============================================================
   Hero confetti parallax (mobile)

   #heroBanner has the banner image and a confetti overlay
   (.hero-banner__confetti) sized a little larger than the hero so it has
   room to travel. The banner stays put; on scroll the confetti is
   translated DOWN, so relative to the banner it drifts downward and reads
   as gently falling. The overlay is hidden at >=900px (the desktop banner
   has confetti baked in), so this is effectively a mobile effect.

   rAF-throttled transform (not background-attachment: fixed, which janks
   on iOS - and mobile is the priority). Fully disabled under
   prefers-reduced-motion: the confetti just stays put.
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
  if (!confetti) {
    return;
  }

  var CONFETTI_RATE = 0.4;  /* how fast the confetti falls relative to scroll */
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
