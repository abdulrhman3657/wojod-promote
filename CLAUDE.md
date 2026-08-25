# WOJOD Promote

Bilingual (EN/AR, RTL-aware) promotional landing page for WOJOD with an
early-access waitlist form. Vite + React, static deploy on Cloudflare Pages.

- `src/content.js` — all EN/AR copy, country list, business types, waitlist endpoint const.
- `src/App.jsx` — page shell: nav, mobile menu, hero (video + door image + particles), why/offer sections, footer.
- `src/WaitlistForm.jsx` — waitlist form, country & business-type dropdowns, validation, success/duplicate/error modals.
- `src/styles.css` — keyframes, hover states, and the responsive `[data-r=...]` media-query overrides ported from the design.
- `apps-script/Code.gs` — Google Apps Script backend (appends to Google Sheet, dedupes by email). Endpoint configured via `VITE_WAITLIST_ENDPOINT` env var.
- `Lumina Landing Page (Standalone).html` — original design export (source of truth for visuals); `public/assets/` images were extracted from it.

Conventions: inline style objects in JSX matching the design's inline styles;
responsive behavior via `data-r` attributes + `!important` overrides in
styles.css (kept verbatim from the design). Don't "clean up" the odd absolute
sizes in the hero — they're tuned to match the canvas design.

Commands: `npm run dev`, `npm run build`.
