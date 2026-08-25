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

## Deploying to Cloudflare Pages

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variable**: `VITE_WAITLIST_ENDPOINT` = your Apps Script `/exec` URL

Either connect the git repository in the Cloudflare dashboard, or deploy
directly from the CLI:

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
