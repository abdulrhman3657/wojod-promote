// Mixpanel. This page reports exactly one Mixpanel event — a click on "Join
// the waitlist" — and nothing else: autocapture, page views, session replay
// and feature flags are switched off explicitly so a library upgrade cannot
// quietly widen that.
//
// Enabled only when VITE_MIXPANEL_TOKEN is set at build time (GitHub Actions
// secret → Cloudflare Pages build), so local dev and unconfigured builds send
// nothing. A project token is public by nature (it ships in the page), but
// keeping it out of the source lets the same code run without Mixpanel.
//
// Production traffic reaches this page through the www.wojod.sa proxy in the
// wujod_app repo; that app's Content-Security-Policy must allow the Mixpanel
// ingestion host, https://api-js.mixpanel.com, in connect-src (see
// src/lib/config/waitlist.ts there). That host is the one for a project with
// the default US data residency; an EU or India project reports elsewhere and
// would be blocked by the CSP.

// The core loader is the SDK without the bundled session recorder: about
// 130 kB gzipped lighter than the default entry, and this page never records.
import mixpanel from 'mixpanel-browser/src/loaders/loader-module-core';

export const MIXPANEL_TOKEN = (import.meta.env.VITE_MIXPANEL_TOKEN || '').trim();

// One event for both "Join the waitlist" buttons; the `location` property
// tells them apart: 'hero' is the call-to-action that scrolls down to the
// form, 'form' is the form's submit button.
export const JOIN_WAITLIST_EVENT = 'Join Waitlist Clicked';

let ready = false;

export function isMixpanelEnabled() {
  return MIXPANEL_TOKEN !== '';
}

export function initMixpanel() {
  if (!isMixpanelEnabled() || typeof window === 'undefined' || ready) return;
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      track_pageview: false,
      record_sessions_percent: 0,
      // localStorage instead of a cookie: a cookie would be set on .wojod.sa
      // and travel to every customer site served from a wojod.sa subdomain.
      persistence: 'localStorage',
    });
    ready = true;
  } catch (e) {
    console.warn('WOJOD mixpanel: init failed, tracking disabled.', e);
  }
}

// Fire the single event. No-op when Mixpanel is disabled. Never pass personal
// data (name, email, phone) — only categorical fields.
export function trackJoinWaitlistClick(properties) {
  if (!ready) return;
  try {
    mixpanel.track(JOIN_WAITLIST_EVENT, properties || {});
  } catch (e) {
    // Analytics must never break the page.
  }
}
