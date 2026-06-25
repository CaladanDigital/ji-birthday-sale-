/* ============================================================
   Subscription "lock in 20%" toggle on the preset bundle cards.

   Each Karalyn's-Favorite card has a One-Time / Subscribe pill pair.
   Subscriptions are normally 10% off; during the Birthday Sale a
   subscriber can LOCK IN the full 20% for life. Toggling swaps the
   card's note and flips an is-sub class the CSS uses to light up the
   "Lock in 20%" badge. Price stays 20% off either way (that's the hook).
   ============================================================ */

'use strict';

(function () {
  var NOTE_ONCE = 'One-time order — 20% off during the Birthday Sale.';
  var NOTE_SUB = 'Subscribe & lock in 20% off for life — your rate never drops to the usual 10%.';

  function wire(card) {
    var picks = card.querySelectorAll('[data-plan]');
    var note = card.querySelector('[data-plan-note]');

    function select(btn) {
      for (var i = 0; i < picks.length; i++) {
        var on = picks[i] === btn;
        picks[i].classList.toggle('is-active', on);
        picks[i].setAttribute('aria-pressed', String(on));
      }
      var sub = btn.dataset.plan === 'sub';
      card.classList.toggle('is-sub', sub);
      if (note) {
        note.textContent = sub ? NOTE_SUB : NOTE_ONCE;
      }
    }

    for (var i = 0; i < picks.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () { select(btn); });
      })(picks[i]);
    }
  }

  function init() {
    var cards = document.querySelectorAll('[data-planpick-card]');
    for (var i = 0; i < cards.length; i++) {
      wire(cards[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
