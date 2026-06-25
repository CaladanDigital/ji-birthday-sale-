/* ============================================================
   Cart engine - Birthday Sale edition

   The Sip Into Summer original was a "Buy 3, Get 1 FREE" builder with
   four open slots. This sale sells PRESET bundles (Karalyn's Favorites)
   and individual products, so there is no slot grid to fill - every Add
   to Cart simply increments the cart and flies the product up to the
   cart icon in the header.

   The public surface is kept identical to the old window.SISBundle
   (add / remove / reset / room / isFull / count / showToast) so
   js/cart-button.js continues to drive it unchanged. room()/isFull()
   report "always space" since a real cart has no four-item ceiling.
   ============================================================ */

'use strict';

(function () {
  var count = 0;
  var toastEl, cartBtn;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function syncCount() {
    if (typeof window.updateCartCount === 'function') {
      window.updateCartCount(count);
    }
  }

  /* ---- fly the product image up to the cart icon ---- */
  function flyToCart(sourceImg, product, onDone) {
    var done = onDone || function () {};
    var target = cartBtn ? cartBtn.getBoundingClientRect() : null;
    var source = sourceImg ? sourceImg.getBoundingClientRect() : null;
    if (!target || !source || !source.width || !target.width) {
      done();
      return;
    }

    var clone = document.createElement('img');
    clone.src = (product && product.image) || sourceImg.currentSrc || sourceImg.src;
    clone.className = 'bundle-fly';
    clone.style.left = source.left + 'px';
    clone.style.top = source.top + 'px';
    clone.style.width = source.width + 'px';
    clone.style.height = source.height + 'px';
    document.body.appendChild(clone);

    var dx = (target.left + target.width / 2) - (source.left + source.width / 2);
    var dy = (target.top + target.height / 2) - (source.top + source.height / 2);

    var animation = clone.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
        {
          transform: 'translate(' + dx * 0.5 + 'px, ' + (dy * 0.5 - 60) + 'px) scale(0.6)',
          opacity: 1,
          offset: 0.6
        },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.18)', opacity: 0.2 }
      ],
      { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );

    function finish() {
      if (clone.parentNode) {
        clone.remove();
      }
      bumpCart();
      done();
    }
    animation.onfinish = finish;
    animation.oncancel = finish;
  }

  /* little pulse on the cart icon when something lands */
  function bumpCart() {
    if (!cartBtn || prefersReducedMotion()) {
      return;
    }
    cartBtn.classList.remove('cart-bump');
    /* force reflow so the animation can replay on rapid adds */
    void cartBtn.offsetWidth;
    cartBtn.classList.add('cart-bump');
  }

  /* ---- actions ---- */
  function add(product, sourceImg) {
    count++;
    if (sourceImg && !prefersReducedMotion()) {
      flyToCart(sourceImg, product, syncCount);
    } else {
      bumpCart();
      syncCount();
    }
    return true;
  }

  function reset() {
    count = 0;
    syncCount();
  }

  /* ---- toast ---- */
  function showToast(message) {
    if (!toastEl) {
      return;
    }
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    toastEl.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 320);
    }, 3200);
  }

  function init() {
    toastEl = document.getElementById('toastContainer');
    cartBtn = document.getElementById('cartButton');
    syncCount();
  }

  /* public API - product sections add through this (see js/cart-button.js).
     room() returns a large number so the stepper qty is never clamped;
     isFull() is always false (a real cart has no 4-item ceiling). */
  window.SISBundle = {
    add: add,
    remove: function () {},
    reset: reset,
    room: function () { return 99; },
    isFull: function () { return false; },
    count: function () { return count; },
    showToast: showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
