# WOJOD Promote

Bilingual (EN/AR, RTL-aware) promotional landing page for WOJOD with an
early-access waitlist form. Vite + React, static deploy on Cloudflare Pages.

- `src/content.js` — all EN/AR copy, country list, business types, waitlist endpoint const.
<<<<<<< HEAD
- `src/App.jsx` — page shell: nav (logo + language pill only; the nav row takes
  `dir` so the logo sits in the right corner for AR and the left for EN), hero (video + door image + particles), what-we-offer, early-access, footer. Three sections only: `#top`, `#what-we-offer`, `#early-access`. There is no mobile menu and no `#why-wojood` section — the Aug 2026 artboards dropped both.
- `src/WaitlistForm.jsx` — waitlist form: name, email, phone (country dropdown),
  services multi-select, validation, success/duplicate/error modals. The
  business-type (sector) field was removed from the UI, but the payload still
  sends `businessType: ''` so the sheet's Business Type column stays aligned
  with existing rows — don't drop it from the payload.
=======
- `src/App.jsx` — page shell: nav, mobile menu, hero (video + door image + particles), why/offer sections, footer.
- `src/WaitlistForm.jsx` — waitlist form, country & business-type dropdowns, validation, success/duplicate/error modals; fires `waitlist_signup` / `waitlist_duplicate` / `waitlist_error` GA events.
- `src/analytics.js` — Google Analytics 4 loader (`initAnalytics`, `trackEvent`); active only when `VITE_GA_MEASUREMENT_ID` is set at build time. Production is served through the `www.wojod.sa` proxy in `wujod_app`, whose CSP must allow the GA hosts.
>>>>>>> 7c0d501 (Add Google Analytics 4 with waitlist conversion events)
- `src/styles.css` — keyframes, hover states, and the responsive `[data-r=...]` media-query overrides ported from the design.
- `apps-script/Code.gs` — Google Apps Script backend (appends to Google Sheet, dedupes by email). Endpoint configured via `VITE_WAITLIST_ENDPOINT` env var.
- `Lumina Landing Page (Standalone).html` — design export (source of truth for
  visuals); `public/assets/` images were extracted from it. Superseded by the
  Aug 2026 pair of exports (desktop + `Mobile Preview`), which removed the
  `#why-wojood` section, the mobile burger menu, and the hero eyebrow logo, and
  simplified the hero video to a plain full-bleed cover (no canvas offsets, no
  RTL mirror). All artwork in those exports is byte-identical to `public/assets/`
  except the video: the export ships the 27MB original, and the repo keeps the
  3.5MB compressed cut of the same footage — do not swap it back.
- `public/assets/door-of-light-alpha.png` — the hero door, derived from
  `door-of-light.png` by baking alpha = luminance (black point 0.05, gamma 0.7,
  gain 1.5, via a canvas pass). The original is an opaque near-black frame; over
  the hero video that showed as a hard rectangle, and `mix-blend-mode` cannot fix
  it because `[data-r="hero-inner"]` has `z-index: 10` and that stacking context
  isolates the blend. Keep the alpha version wherever the door is composited.

Conventions: inline style objects in JSX matching the design's inline styles;
responsive behavior via `data-r` attributes + `!important` overrides in
styles.css (kept verbatim from the design). Don't "clean up" the odd absolute
sizes in the hero — they're tuned to match the canvas design. The exception is
the hero heading stack (`hero-h1`, `hero-h1-text`, `hero-text`): those fixed
heights were tuned to the English copy and clipped the longer Arabic headline,
so they are now auto/min-height. Arabic is the default language, so check any
hero change in AR first.

Commands: `npm run dev`, `npm run build`.
