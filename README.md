# WOJOD — Promotional Landing Page

Bilingual (EN/AR with full RTL) coming-soon landing page for WOJOD, with an
early-access waitlist form that saves leads to a Google Sheet.

Built with **Vite + React**. Deployed as a static site (Cloudflare Pages).

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

## Waitlist backend (Google Sheet + Apps Script)

Submissions POST to a Google Apps Script Web App that appends rows to a
Google Sheet and rejects duplicate emails.

Set it up once (~5 minutes):

1. Create a new Google Sheet (or import `WOJOD_Early_Access_Waitlist_Template.xlsx`).
2. In the sheet: **Extensions → Apps Script**, delete the default code and
   paste the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
3. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
4. Copy the Web App URL (ends in `/exec`).
5. Locally: copy `.env.example` to `.env` and paste the URL into
   `VITE_WAITLIST_ENDPOINT`. On Cloudflare Pages: add the same variable under
   **Settings → Environment variables**, then redeploy.

The script auto-creates a `Waitlist` tab with the same columns as the Excel
template (Lead ID, Submitted At, Full Name, Email, Phone, Business Type,
Services Interested In, Language, Session Duration, UTM Source, UTM Campaign,
Referrer).

If the endpoint is not configured, the form shows the error modal and logs a
console warning — no submission is sent anywhere.

### Troubleshooting submissions

Open the `/exec` URL in a browser. It opens the sheet, so it reports the real
state rather than just "the script responds":

- `{"status":"ok", ..., "rows": N}` — the backend is healthy; a failing form is
  then a front-end or CSP problem (the `www.wojod.sa` proxy must keep
  `script.google.com` and `script.googleusercontent.com` in `connect-src`).
- `{"status":"error","message":"...permission to access the requested
  document..."}` — the web app can no longer open the sheet. Fix in Apps Script:
  **Deploy → Manage deployments → edit → Execute as: Me / Who has access:
  Anyone**, re-run any function once to re-grant authorization, and if the
  script is not bound to the sheet, add a `SPREADSHEET_ID` script property
  (**Project Settings → Script Properties**) with the sheet's id. Editing the
  existing deployment keeps the `/exec` URL; a *new* deployment changes it, and
  `VITE_WAITLIST_ENDPOINT` must be updated in `.env` and in the GitHub secret.

The browser console logs the backend's message whenever the error modal appears.

## Google Analytics

Page views and waitlist conversions are tracked with Google Analytics 4
(`gtag.js`) via [`src/analytics.js`](src/analytics.js). It is enabled only
when `VITE_GA_MEASUREMENT_ID` is set at build time; without it the site
sends nothing (local dev included).

1. In [Google Analytics](https://analytics.google.com): **Admin → Create
   property** (or reuse one), then **Data Streams → Add stream → Web** with
   URL `https://www.wojod.sa`. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
2. Add it as the GitHub Actions secret `VITE_GA_MEASUREMENT_ID` on this repo
   (or `gh secret set VITE_GA_MEASUREMENT_ID`), then push or re-run the
   deploy workflow. Locally, put it in `.env` to test.
3. Production traffic reaches this page through the `www.wojod.sa` proxy in
   the `wujod_app` repo; its waitlist Content-Security-Policy
   (`src/lib/config/waitlist.ts`) already allows the Google Analytics hosts.

Events sent (no personal data — categorical fields only): `waitlist_signup`,
`waitlist_duplicate`, `waitlist_error`, each with `language`,
`services_count`, `country`, `utm_source`, `utm_campaign`.
Mark `waitlist_signup` as a key event in GA to see it as a conversion.
Because the page is also reachable directly at `wojod-promote.pages.dev`,
reports may show two hostnames; filter on `www.wojod.sa` if needed.

## Deploying

**Every push to `main` deploys automatically** via GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): it builds the
site and publishes `dist/` to the `wojod-promote` Cloudflare Pages project at
https://wojod-promote.pages.dev.

Required GitHub Actions secrets (already configured on the repo):

- `CLOUDFLARE_API_TOKEN` — API token with *Account → Cloudflare Pages → Edit*
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account id
- `VITE_WAITLIST_ENDPOINT` — the Apps Script `/exec` URL (injected at build time)
- `VITE_GA_MEASUREMENT_ID` — Google Analytics 4 measurement id (optional; analytics off when unset)

Manual deploy from a local machine still works too:

```bash
npm run build
npx wrangler pages deploy dist --project-name wojod-promote
```

## Project notes

- All copy (EN + AR) lives in [`src/content.js`](src/content.js).
- The design source of truth is `Lumina Landing Page (Standalone).html`
  (exported from Claude Design); images in `public/assets/` were extracted
  from it. The hero background video is served locally from
  `public/assets/hero-video.mp4`.
- Language preference persists in `localStorage` (`wojood_lang`); the page
  flips to RTL for Arabic.
