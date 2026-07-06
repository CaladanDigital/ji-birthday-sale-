/* ============================================================
   Birthday cake cursor trail

   A single 🎂 that eases toward the mouse with a gentle lag, so it
   reads as playfully chasing the pointer. One fixed-position element,
   transform-only, GPU-composited - cheap.

   Bails out entirely (no element ever created) under
   prefers-reduced-motion and on coarse/touch pointers.
   The rAF loop pauses while the tab is hidden.

   Also runs inside the desktop "View Mobile" iframe: the iframe swallows
   mousemove, so the outer page's badge can't follow the cursor in there -
   this instance takes over (the outer badge is hidden via
   body.mobile-active in desktop.css).
   ============================================================ */

'use strict';

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  /* No cursor to chase on touch devices. */
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  var EASE = 0.18;   /* chase tightness: higher = snappier, lower = floatier */

  var cake = document.createElement('div');
  cake.className = 'cake-cursor';
  cake.setAttribute('aria-hidden', 'true');
  cake.textContent = '🎂';
  document.body.appendChild(cake);

  var mx = 0, my = 0;   /* target: where the mouse is */
  var cx = 0, cy = 0;   /* current: where the cake is */
  var started = false;  /* seen the first mousemove yet? */
  var running = false;  /* is an rAF loop scheduled? */

  function update() {
    cx += (mx - cx) * EASE;
    cy += (my - cy) * EASE;
    cake.style.transform = 'translate3d(' + cx + 'px, ' + cy + 'px, 0)';

    /* Keep animating until the cake has all but caught up, then idle. */
    if (document.hidden || (Math.abs(mx - cx) < 0.1 && Math.abs(my - cy) < 0.1)) {
      running = false;
      return;
    }
    requestAnimationFrame(update);
  }

  function tick() {
    if (!running && !document.hidden) {
      running = true;
      requestAnimationFrame(update);
    }
  }

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      /* Drop the badge on the cursor immediately (not waiting for the
         first rAF) so it doesn't streak in from the top-left corner. */
      started = true;
      cx = mx;
      cy = my;
      cake.style.transform = 'translate3d(' + cx + 'px, ' + cy + 'px, 0)';
      cake.classList.add('is-visible');
    }
    tick();
  }

  function onVisibility() {
    if (!document.hidden) {
      tick();
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
})();
