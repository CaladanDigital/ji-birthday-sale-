/* ============================================================
   Product controls shared by every product section (featured
   products and carousels):

   - Quantity steppers ([data-qty] with - / value / +)
   - Add to Cart buttons ([data-add-to-cart]) with the 3-state flow:
       default  ->  "Added to Cart!" (check + bounce)  ->  "Add Another?"

   Add to Cart adds the stepper quantity to the bundle, clamped to the
   slots still free, then resets the stepper to 1. Routes through
   window.SISBundle.add().
   ============================================================ */

'use strict';

(function () {
  var ICON_CHECK =
    '<svg class="btn-add__check" viewBox="0 0 24 24" width="15" height="15" fill="none" ' +
    'stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  /* ---- quantity steppers ---- */
  function wireQty(group) {
    if (group.dataset.qtyWired === '1') {
      return;
    }
    group.dataset.qtyWired = '1';

    var value = group.querySelector('[data-qty-value]');
    var dec = group.querySelector('[data-qty-dec]');
    var inc = group.querySelector('[data-qty-inc]');
    var MININ = 1;
    var MAXIN = 9;

    function get() {
      return Math.max(MININ, parseInt(value.textContent, 10) || MININ);
    }
    function set(n) {
      n = Math.min(MAXIN, Math.max(MININ, n));
      value.textContent = String(n);
      if (dec) {
        dec.disabled = n <= MININ;
      }
      if (inc) {
        inc.disabled = n >= MAXIN;
      }
    }

    if (dec) {
      dec.addEventListener('click', function () { set(get() - 1); });
    }
    if (inc) {
      inc.addEventListener('click', function () { set(get() + 1); });
    }
    set(get());
  }

  /* ---- Add to Cart buttons ---- */
  function wireAddButton(btn) {
    if (btn.dataset.cartWired === '1') {
      return;
    }
    btn.dataset.cartWired = '1';

    var label = btn.querySelector('.btn-add__label');
    var defaultText = label ? label.textContent.trim() : 'Add to Cart';
    var card = btn.closest('[data-product-card]') || btn.closest('article, section');
    var timer = null;

    function setState(state) {
      var oldCheck = btn.querySelector('.btn-add__check');
      if (oldCheck) {
        oldCheck.remove();
      }
      btn.classList.remove('is-added', 'is-again');
      if (!label) {
        return;
      }
      if (state === 'added') {
        btn.classList.add('is-added');
        label.textContent = 'Added to Cart!';
        label.insertAdjacentHTML('afterbegin', ICON_CHECK);
      } else if (state === 'again') {
        btn.classList.add('is-again');
        label.textContent = 'Add Another?';
      } else {
        label.textContent = defaultText;
      }
    }

    btn.addEventListener('click', function () {
      if (btn.disabled || !window.SISBundle) {
        return;
      }
      var product = {
        id: btn.dataset.id || btn.dataset.name,
        name: btn.dataset.name || 'Product',
        image: btn.dataset.image || ''
      };
      var sourceImg = card ? card.querySelector('[data-product-img], img') : null;
      var qtyEl = card ? card.querySelector('[data-qty-value]') : null;
      var qty = qtyEl ? Math.max(1, parseInt(qtyEl.textContent, 10) || 1) : 1;

      var count = Math.min(qty, window.SISBundle.room());
      if (count === 0) {
        window.SISBundle.add(product, sourceImg); // triggers the single "full" toast
        return;
      }

      for (var i = 0; i < count; i++) {
        (function (delay) {
          setTimeout(function () {
            window.SISBundle.add(product, sourceImg);
          }, delay);
        })(i * 140);
      }
      if (qtyEl) {
        qtyEl.textContent = '1';
        var group = qtyEl.closest('[data-qty]');
        if (group) {
          var gDec = group.querySelector('[data-qty-dec]');
          var gInc = group.querySelector('[data-qty-inc]');
          if (gDec) {
            gDec.disabled = true;
          }
          if (gInc) {
            gInc.disabled = false;
          }
        }
      }

      setState('added');
      clearTimeout(timer);
      timer = setTimeout(function () {
        setState(btn.disabled ? 'added' : 'again');
      }, 1500);
    });
  }

  /* cross-sell buttons (Seasonal Protein) - separate from the bundle */
  function wireCrossSell(btn) {
    if (btn.dataset.cartWired === '1') {
      return;
    }
    btn.dataset.cartWired = '1';
    btn.addEventListener('click', function () {
      if (window.SISBundle) {
        window.SISBundle.showToast('Seasonal Protein checks out separately from your bundle.');
      }
    });
  }

  function init(root) {
    var scope = root || document;
    var groups = scope.querySelectorAll('[data-qty]');
    for (var i = 0; i < groups.length; i++) {
      wireQty(groups[i]);
    }
    var buttons = scope.querySelectorAll('[data-add-to-cart]');
    for (var j = 0; j < buttons.length; j++) {
      wireAddButton(buttons[j]);
    }
    var crossButtons = scope.querySelectorAll('[data-crosssell]');
    for (var k = 0; k < crossButtons.length; k++) {
      wireCrossSell(crossButtons[k]);
    }
  }

  /* re-callable so carousel sections can wire their injected cards */
  window.SISCartButtons = { init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
})();
