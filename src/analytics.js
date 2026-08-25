// Google Analytics 4 (gtag.js). Enabled only when VITE_GA_MEASUREMENT_ID is
// set at build time (GitHub Actions secret → Cloudflare Pages build), so local
// dev and unconfigured builds send nothing. The measurement id is public by
// nature (it ships in the page), but keeping it out of the source lets the
// same code run without analytics.
//
// Production traffic reaches this page through the www.wojod.sa proxy in the
// wujod_app repo; that app's Content-Security-Policy must allow the Google
// Analytics hosts used here (see src/lib/config/waitlist.ts there).

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

export function isAnalyticsEnabled() {
  return GA_MEASUREMENT_ID !== '';
}

export function initAnalytics() {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') return;
  if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) {
    console.warn('WOJOD analytics: VITE_GA_MEASUREMENT_ID should look like "G-XXXXXXXXXX"; got "' + GA_MEASUREMENT_ID + '". Analytics disabled.');
    return;
  }
  if (window.__wojodAnalyticsLoaded) return;
  window.__wojodAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = GTAG_SRC + '?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);
}

// Fire a custom GA4 event. No-op when analytics is disabled. Never pass
// personal data (name, email, phone) — only categorical fields.
export function trackEvent(name, params) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params || {});
}
