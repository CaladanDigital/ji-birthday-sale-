/* ============================================================
   Live Birthday Sale countdown in the top announcement bar.

   Each [data-countdown] element carries a data-deadline ISO string
   (the single source of truth for the sale end). Every second we
   recompute the remaining Days / Hrs / Min and write them into the
   [data-cd=*] slots, only touching the DOM when a value actually
   changes (so minutes flip exactly on the tick-over, no jitter).

   When the deadline passes we stop and swap the bar back to the
   static sale copy. The literal markup shipped in the HTML is the
   pre-JS fallback, so the bar is never empty.
   ============================================================ */

'use strict';

(function () {
  var ENDED_TEXT = 'Birthday Sale — 20% Off Sitewide, Incl. Subscriptions · July 21–27';

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function setSlot(el, value) {
    // Only write when changed to avoid needless reflow.
    if (el && el.textContent !== value) {
      el.textContent = value;
    }
  }

  function wire(root) {
    var deadlineStr = root.getAttribute('data-deadline');
    var deadline = deadlineStr ? new Date(deadlineStr).getTime() : NaN;
    if (isNaN(deadline)) {
      return; // bad/missing date: leave the fallback markup in place
    }

    var daysEl = root.querySelector('[data-cd="days"]');
    var hoursEl = root.querySelector('[data-cd="hours"]');
    var minsEl = root.querySelector('[data-cd="mins"]');
    var timer = null;

    function tick() {
      var remaining = deadline - Date.now();

      if (remaining <= 0) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        root.textContent = ENDED_TEXT;
        root.removeAttribute('data-countdown');
        return;
      }

      var totalMinutes = Math.floor(remaining / 60000);
      var days = Math.floor(totalMinutes / 1440);
      var hours = Math.floor((totalMinutes % 1440) / 60);
      var mins = totalMinutes % 60;

      setSlot(daysEl, pad(days));
      setSlot(hoursEl, pad(hours));
      setSlot(minsEl, pad(mins));
    }

    tick();
    if (deadline - Date.now() > 0) {
      timer = setInterval(tick, 1000);
    }
  }

  var bars = document.querySelectorAll('[data-countdown]');
  for (var i = 0; i < bars.length; i++) {
    wire(bars[i]);
  }
})();
