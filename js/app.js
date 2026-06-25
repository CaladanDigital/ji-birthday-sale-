/* ============================================================
   Sip Into Summer - app entry
   Vanilla JS, no build step. Section modules are plain functions
   wired up on DOMContentLoaded as each section is built.
   ============================================================ */

'use strict';

/* ---- Header: mobile nav drawer ---- */
function initHeader() {
  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('mobileNav');
  var scrim = document.getElementById('navScrim');
  var closeBtn = document.getElementById('menuClose');
  if (!toggle || !drawer || !scrim) {
    return;
  }

  function setOpen(open) {
    drawer.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = drawer.querySelector('a, button');
      if (first) {
        first.focus();
      }
    } else {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(true);
  });
  closeBtn.addEventListener('click', function () {
    setOpen(false);
  });
  scrim.addEventListener('click', function () {
    setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  });
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });
}

/* ---- Cart count badge - updated by the bundle builder (Task 5) ---- */
function updateCartCount(count) {
  var label = document.getElementById('cartCount');
  var button = document.getElementById('cartButton');
  if (label) {
    label.textContent = String(count);
  }
  if (button) {
    button.setAttribute(
      'aria-label',
      'Cart, ' + count + (count === 1 ? ' item' : ' items')
    );
  }
}
window.updateCartCount = updateCartCount;

/* ---- Sync --header-h to the real header height ----
   The sticky bundle bar sticks at top: var(--header-h). Measuring the
   header (instead of hardcoding it) makes the bar sit flush against
   the nav with no gap for content to scroll through. */
function syncHeaderHeight() {
  var top = document.querySelector('.site-top');
  if (!top) {
    return;
  }
  var height = Math.round(top.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-h', height + 'px');
}

/* ---- "What's Inside?" FAQ accordion - one panel open at a time ---- */
function initAccordion() {
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  items.forEach(function (item) {
    var header = item.querySelector('.faq-item__header');
    if (!header) {
      return;
    }
    header.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      items.forEach(function (other) {
        other.classList.remove('is-open');
        var otherHeader = other.querySelector('.faq-item__header');
        if (otherHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
        }
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---- Footer link columns - collapsible accordions on mobile ---- */
function initFooter() {
  var cols = Array.prototype.slice.call(document.querySelectorAll('.footer-col'));
  var mobile = window.matchMedia('(max-width: 899px)');

  /* a collapsed column on mobile is removed from tab order; desktop stays open */
  function syncInert() {
    cols.forEach(function (col) {
      var panel = col.querySelector('.footer-col__panel');
      if (panel) {
        panel.inert = mobile.matches && !col.classList.contains('is-open');
      }
    });
  }

  cols.forEach(function (col) {
    var head = col.querySelector('.footer-col__head');
    if (!head) {
      return;
    }
    head.addEventListener('click', function () {
      var open = col.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
      syncInert();
    });
  });

  mobile.addEventListener('change', syncInert);
  syncInert();
}

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  syncHeaderHeight();
  initAccordion();
  initFooter();
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight);
  }
});
