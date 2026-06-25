# Just Ingredients — Birthday Sale

Interactive landing-page mockup for the Just Ingredients **Birthday Sale**
(company anniversary): our biggest sale of the year, **20% off sitewide
incl. subscriptions**, July 21–27. Centerpiece is **Karalyn's Favorites** —
five preset (non-customizable) bundles you choose between.

Vanilla static HTML/CSS/JS, **no build step**. Forked from the
`sip-into-summer` landing for its component system, and from the
`coconut-chocolate-pdp` for its desktop ⇄ mobile **view toggle**.

## Structure

```
index.html          ← SOURCE OF TRUTH: mobile-first landing
css/
  tokens.css        design tokens (re-themed birthday magenta-pink)
  base.css          reset + global type
  sections.css      inherited Sip-Into-Summer section styles
  birthday.css      NEW: hero banner, preset bundles, sub toggle, cart bump
js/
  bundle.js         cart engine (fly-to-cart); keeps window.SISBundle API
  carousel.js       infinite swipe carousels (static grid on desktop)
  cart-button.js    qty steppers + Add-to-Cart 3-state flow
  app.js            nav drawer, accordions, footer, --header-h sync
  subscribe.js      NEW: per-bundle One-Time / Subscribe lock-in toggle
  hero-parallax.js  NEW: confetti layer falls out of sync on scroll
assets/images/      product art, reviews, badges, hero-confetti.svg
desktop/
  index.html        desktop layout + the "View Mobile" iframe toggle
  desktop.css       toggle styles + wide-screen polish
```

`/` and `/desktop/` **share** `css/`, `js/`, and `assets/` via `../` paths —
nothing is duplicated. `/` never carries the toggle (it must not iframe
itself); `/desktop/` redirects viewports < 1024px back to `/`.

## Hero confetti parallax

The hero is two layers: `.hero-banner__art` (pink gradient + text — a
rebuilt stand-in for the provided banner) and `.hero-banner__confetti`
(`assets/images/hero-confetti.svg`). On scroll, `js/hero-parallax.js`
translates the confetti **down faster** than the banner so it reads as
gently falling (rAF transform; disabled under `prefers-reduced-motion`).

### Swapping in the real banner art
The banner is currently reconstructed in CSS so the mockup is self-contained.
To use the exported graphics instead, drop them in `assets/images/` and
either (a) replace the confetti SVG at `assets/images/hero-confetti.svg`
with a transparent PNG of the same name, and/or (b) replace the
`.hero-banner__art` inner markup in both `index.html` and `desktop/index.html`
with `<img class="hero-banner__bg" src="../assets/images/hero-birthday-banner.jpg">`.
Use a banner **without** confetti baked in, so the separate confetti layer
can still move.

## Run locally

```
cd ji-birthday-sale
python3 -m http.server 8000
```

- Mobile (source of truth): http://localhost:8000/
- Desktop + toggle:          http://localhost:8000/desktop/

## Deploy

Plain static site — no `vercel.json`, no build. Push to a GitHub repo under
**CaladanDigital** and import to Vercel (framework preset: Other / no build,
output = project root). `/` serves the mobile landing, `/desktop/` the
desktop view.
