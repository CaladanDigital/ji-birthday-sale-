/* ============================================================
   Infinite horizontal carousel - swipe, mouse-drag, seamless loop.
   Shared by the product carousels (Tasks 7, 9, 12).

   Each [data-carousel] has its track tripled, so scrolling past
   either end is repositioned by one set width with no visible seam.
   Touch uses native scrolling; mouse uses drag-to-scroll.
   ============================================================ */

'use strict';

(function () {
  function initCarousel(root) {
    if (root.dataset.carouselReady === '1') {
      return;
    }
    var viewport = root.querySelector('.carousel__viewport');
    var track = root.querySelector('.carousel__track');
    if (!viewport || !track) {
      return;
    }
    var originals = Array.prototype.slice.call(track.children);
    if (originals.length < 2) {
      return; // nothing to loop
    }
    // some carousels (e.g. social proof, few items) are a static row on desktop
    if (root.hasAttribute('data-carousel-static-desktop') &&
        window.matchMedia('(min-width: 900px)').matches) {
      return;
    }
    root.dataset.carouselReady = '1';

    // triple the set so there is always content on both sides;
    // clones are visual duplicates - keep them out of the a11y tree and tab order
    for (var copy = 0; copy < 2; copy++) {
      for (var i = 0; i < originals.length; i++) {
        var clone = originals[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        var focusable = clone.querySelectorAll('a, button');
        for (var f = 0; f < focusable.length; f++) {
          focusable[f].setAttribute('tabindex', '-1');
        }
        track.appendChild(clone);
      }
    }

    var setWidth = 0;
    var repositioning = false;

    function recenter() {
      setWidth = track.scrollWidth / 3;
      repositioning = true;
      // center the middle set's first card in the viewport
      var card = track.children[originals.length];
      if (card) {
        viewport.scrollLeft =
          card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      } else {
        viewport.scrollLeft = setWidth;
      }
      requestAnimationFrame(function () { repositioning = false; });
    }

    // keep the scroll position inside the middle copy
    viewport.addEventListener('scroll', function () {
      if (repositioning || !setWidth) {
        return;
      }
      var x = viewport.scrollLeft;
      if (x < setWidth * 0.5) {
        viewport.scrollLeft = x + setWidth;
      } else if (x > setWidth * 1.5) {
        viewport.scrollLeft = x - setWidth;
      }
    }, { passive: true });

    // mouse drag to scroll
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = 0;

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') {
        return;
      }
      isDown = true;
      moved = 0;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add('is-grabbing');
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDown) {
        return;
      }
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      viewport.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!isDown) {
        return;
      }
      isDown = false;
      viewport.classList.remove('is-grabbing');
    });
    // a drag that ends over a card must not fire that card's click
    viewport.addEventListener('click', function (e) {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    }, true);

    window.addEventListener('resize', recenter, { passive: true });
    recenter();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recenter);
    }

    /* optional auto-advance (Social Proof carousel) - pauses on hover */
    if (root.hasAttribute('data-carousel-autoplay') &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var autoTimer = null;
      var autoHover = false;

      function autoAdvance() {
        if (track.children.length > 1) {
          var pitch = track.children[1].offsetLeft - track.children[0].offsetLeft;
          viewport.scrollBy({ left: pitch, behavior: 'smooth' });
        }
      }
      function autoPlay() {
        if (!autoTimer && !autoHover) {
          autoTimer = setInterval(autoAdvance, 6000);
        }
      }
      function autoPause() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      viewport.addEventListener('mouseenter', function () {
        autoHover = true;
        autoPause();
      });
      viewport.addEventListener('mouseleave', function () {
        autoHover = false;
        autoPlay();
      });
      viewport.addEventListener('pointerdown', autoPause);
      window.addEventListener('pointerup', autoPlay);
      autoPlay();
    }
  }

  function init() {
    var carousels = document.querySelectorAll('[data-carousel]');
    for (var i = 0; i < carousels.length; i++) {
      initCarousel(carousels[i]);
    }
  }

  window.SISCarousel = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
