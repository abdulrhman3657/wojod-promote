import { useEffect, useRef, useState } from 'react';
import { ACCENT, SOCIALS, SPOTS, T, WAITLIST_ENDPOINT, WHATSAPP } from './content.js';
import WaitlistForm from './WaitlistForm.jsx';
import { Brand } from './brand.jsx';

// Brand-glyph paths (24x24, fill=currentColor) for the footer social links,
// keyed by SOCIALS[].key in content.js.
const SOCIAL_PATHS = {
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  x:
    'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

// Capacity counter. `taken` comes from the sheet (see App), so the number is
// whatever has actually been registered. It counts up the first time it scrolls
// into view, and again whenever the value changes — which is how a fresh
// sign-up in this session shows immediately. Reduced motion jumps to the value.
function SpotsCounter({ template, taken, total }) {
  const [shown, setShown] = useState(0);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          setSeen(true);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = fromRef.current;
    if (reduced || from === taken) { setShown(taken); fromRef.current = taken; return; }
    let raf;
    const started = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - started) / 1100);
      setShown(Math.round(from + (taken - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) { raf = requestAnimationFrame(step); } else { fromRef.current = taken; }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, taken]);

  const [before, after] = template.split('{taken}');
  const pct = Math.max(0, Math.min(100, (taken / total) * 100));

  return (
    <div ref={ref} data-r="spots" style={{ marginTop: 26, maxWidth: 380, padding: '15px 18px 17px', borderRadius: 14, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 10px 24px -14px rgba(15,23,42,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#4a5568' }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: ACCENT, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{shown}</span>
        <span>{(before + '').trim()}{after.replace('{total}', total)}</span>
      </div>
      <div style={{ marginTop: 11, height: 8, borderRadius: 999, background: 'rgba(15,23,42,0.09)', overflow: 'hidden' }}>
        <div
          style={{
            width: seen ? pct + '%' : '0%',
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${ACCENT}, #1f5fd8)`,
            transition: 'width 1200ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

const PARTICLES = [
  { right: '4%', top: '46%', size: 5, bg: '#a8c4ff', shadow: '0 0 6px rgba(120,170,255,0.9)', dist: -230, rise: -22, maxop: 0.95, dur: 5.2, delay: 0 },
  { right: '6%', top: '62%', size: 3, bg: '#ffffff', shadow: '0 0 5px rgba(255,255,255,0.8)', dist: -190, rise: 14, maxop: 0.85, dur: 4.4, delay: 0.5 },
  { right: '3%', top: '24%', size: 7, bg: 'rgba(43, 114, 238,0.85)', shadow: '0 0 9px rgba(43, 114, 238,0.8)', dist: -260, rise: -34, maxop: 0.9, dur: 6.1, delay: 1.3 },
  { right: '8%', top: '76%', size: 4, bg: '#7aa5ff', shadow: '0 0 6px rgba(74,144,255,0.85)', dist: -210, rise: 26, maxop: 0.8, dur: 5.6, delay: 0.9 },
  { right: '5%', top: '52%', size: 2, bg: '#ffffff', dist: -170, rise: -8, maxop: 0.7, dur: 4.0, delay: 2.1 },
  { right: '7%', top: '12%', size: 5, bg: '#8fb6ff', shadow: '0 0 7px rgba(120,170,255,0.75)', dist: -245, rise: -40, maxop: 0.75, dur: 6.6, delay: 1.7 },
  { right: '4%', top: '86%', size: 6, bg: 'rgba(125, 170, 255,0.8)', shadow: '0 0 8px rgba(125, 170, 255,0.7)', dist: -200, rise: 38, maxop: 0.7, dur: 5.9, delay: 2.8 },
  { right: '9%', top: '36%', size: 3, bg: '#cddcff', dist: -280, rise: -16, maxop: 0.65, dur: 7.0, delay: 0.3 },
  { right: '6%', top: '68%', size: 2, bg: '#ffffff', dist: -150, rise: 18, maxop: 0.6, dur: 4.6, delay: 3.2 },
  { right: '2%', top: '50%', size: 8, border: '1px solid rgba(160,190,255,0.8)', bg: 'transparent', dist: -220, rise: 4, maxop: 0.6, dur: 6.3, delay: 1.1 },
  { right: '10%', top: '18%', size: 4, bg: '#6f9dff', dist: -265, rise: -28, maxop: 0.55, dur: 7.4, delay: 2.4 },
  { right: '8%', top: '80%', size: 3, bg: 'rgba(43, 114, 238,0.75)', dist: -235, rise: 30, maxop: 0.55, dur: 6.8, delay: 3.7 },
  { right: '12%', top: '42%', size: 2, bg: '#b9cdff', dist: -300, rise: -6, maxop: 0.45, dur: 8.0, delay: 1.9 },
  { right: '11%', top: '72%', size: 5, border: '1px solid rgba(43, 114, 238,0.6)', bg: 'transparent', dist: -270, rise: 22, maxop: 0.45, dur: 7.6, delay: 4.1 },
  { right: '14%', top: '30%', size: 3, bg: '#ffffff', dist: -310, rise: -18, maxop: 0.35, dur: 8.6, delay: 0.7 },
  { right: '13%', top: '92%', size: 2, bg: '#8fb6ff', dist: -290, rise: 12, maxop: 0.3, dur: 8.2, delay: 3.0 },
];

// The landing-page art is a full wireframe, so it is contained rather than
// cropped; the other two are photographic and overscan to hide baked-in edges.
const CARDS = [
  { key: 'domain', img: '/assets/card-domain.png', fit: 'cover' },
  { key: 'email', img: '/assets/card-email.png', fit: 'cover' },
  { key: 'landing', img: '/assets/card-landing.png', fit: 'contain' },
];

export default function App() {
  const [lang, setLangState] = useState('ar');
  const [scrolled, setScrolled] = useState(false);
  // Real registrations read from the sheet; stays 0 if it can't be read, so the
  // counter simply sits at the baseline.
  const [rows, setRows] = useState(0);
  const taken = SPOTS.baseline + rows;
  const [narrow, setNarrow] = useState(false);
  const videoRef = useRef(null);
  const rootRef = useRef(null);

  const isAr = lang === 'ar';
  const t = T[lang];
  const dir = isAr ? 'rtl' : 'ltr';
  const textAlign = isAr ? 'right' : 'left';

  const applyDocLang = (l) => {
    document.documentElement.setAttribute('lang', l === 'ar' ? 'ar' : 'en');
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  };

  const setLang = (l) => {
    try { localStorage.setItem('wojood_lang', l); } catch (e) {}
    applyDocLang(l);
    setLangState(l);
  };

  // Smooth-scrolls to a section and, for the waitlist CTA, puts the cursor in
  // the first field on arrival. Anchors keep their href, so this is pure
  // enhancement — with JS off, or reduced motion on, the browser just jumps.
  const goToSection = (id, { focusForm = false } = {}) => (event) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

    const finish = () => {
      if (!focusForm) return;
      const first = document.getElementById('wj-name');
      // preventScroll: focusing must not fight the scroll that just finished
      if (first) first.focus({ preventScroll: true });
    };

    if (reduced) { finish(); return; }
    // Wait for the smooth scroll to settle rather than guessing a duration.
    let last = -1;
    let still = 0;
    const settle = () => {
      const y = Math.round(window.scrollY);
      if (y === last) { still += 1; } else { still = 0; last = y; }
      if (still >= 3) { finish(); return; }
      requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  };

  const playVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  // doGet returns `rows` — the real number of registrations. It is added to
  // SPOTS.baseline for display, so every visitor sees the same figure and it
  // grows on its own as people register.
  useEffect(() => {
    if (!WAITLIST_ENDPOINT) return undefined;
    let alive = true;
    fetch(WAITLIST_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        if (alive && typeof data.rows === 'number' && data.rows >= 0) setRows(data.rows);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let saved = 'ar';
    try { saved = localStorage.getItem('wojood_lang') || 'ar'; } catch (e) {}
    applyDocLang(saved);
    if (saved !== 'ar') setLangState(saved);

    playVideo();
    const videoTimer = setTimeout(playVideo, 400);

    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setNarrow(window.innerWidth < 860);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    onScroll();
    onResize();

    const els = document.querySelectorAll('[data-reveal]');
    els.forEach((node, i) => node.style.setProperty('--i', i % 6));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate(0,0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((node) => revealObserver.observe(node));


    return () => {
      clearTimeout(videoTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
      revealObserver.disconnect();
    };
  }, []);


  const langBtnStyle = (active, small) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: small ? 12 : 14,
    fontWeight: 700,
    letterSpacing: small ? '0.02em' : undefined,
    color: active ? '#0f172a' : 'rgba(255,255,255,0.7)',
    background: active ? '#ffffff' : 'transparent',
    border: 'none',
    borderRadius: 999,
    padding: small ? '6px 12px' : '9px 18px',
    cursor: 'pointer',
    transition: 'background-color 200ms ease, color 200ms ease',
  });

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%', overflowX: 'hidden', background: '#ffffff' }}>
      <nav
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          background: scrolled ? 'rgba(15,23,42,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
        }}
      >
        {/* Logo follows the reading direction: right corner in Arabic, left in
            English. That falls out of `direction: dir` — the row was previously
            pinned to ltr, which forced the logo left in both languages. The
            language pill keeps its own ltr so EN stays before AR inside it. */}
        <div dir={dir} style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#top" aria-label="WOJOD" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', flex: 'none' }}>
            <img data-r="nav-logo" src="/assets/logo-nav.png" alt="WOJOD" style={{ height: 32, width: 'auto', maxWidth: 180, objectFit: 'contain' }} />
          </a>

          <div style={{ direction: 'ltr', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: 3, gap: 2 }}>
            <button onClick={() => setLang('en')} style={langBtnStyle(!isAr, true)}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtnStyle(isAr, true)}>AR</button>
          </div>
        </div>
      </nav>

      <section id="top" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#000205' }}>

        <video
          data-r="hero-video"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            backgroundColor: '#000205',
            filter: 'hue-rotate(-45deg) saturate(0.85) brightness(1.03) contrast(1.05)',
          }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Light floor under the copy. The design's video is no longer mirrored
            for RTL, so the flare stays off the text; this only guards contrast. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: `linear-gradient(to ${isAr ? 'left' : 'right'}, rgba(0,2,5,0.74) 0%, rgba(0,2,5,0.62) 38%, rgba(0,2,5,0.44) 60%, rgba(0,2,5,0.2) 78%, rgba(0,2,5,0) 92%)`,
          }}
        />

        <div data-r="hero-inner" dir={dir} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '120px 24px 96px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          {/* position+z-index so the copy paints above the door column. door-wrap
              carries a transform, which makes it a stacking context — without
              this its dark backdrop (which spreads ~190px past the art) landed
              on top of the headline and dimmed whatever it overlapped. */}
          <div data-r="hero-text" style={{ position: 'relative', zIndex: 2, flex: '1 1 560px', minWidth: 0, textAlign }}>
            {/* Wordmark above the headline. Its own block, not inline inside the
                h1 as it used to be — that distorted the heading's line metrics.
                Natural art is 1207x190, so height alone keeps the ratio (the old
                146x45 pair squashed it). */}
            <img
              data-r="hero-logo"
              src="/assets/logo-hero.png"
              alt="WOJOD"
              style={{ display: 'block', height: 30, width: 'auto', objectFit: 'contain', marginBottom: 22, opacity: 0.96, marginInline: 0, animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) both' }}
            />
            <h1 data-r="hero-h1" style={{ margin: 0, maxWidth: 660, fontFamily: 'Lato', fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.06, fontWeight: 500, letterSpacing: '-0.02em', color: '#ffffff', textShadow: '0 1px 2px rgba(0,2,5,0.45), 0 2px 22px rgba(0,2,5,0.55)', textWrap: 'pretty', animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) both' }}>
              <div data-r="hero-h1-text">{t.hero.headline}</div>
            </h1>
            <div data-r="hero-desc" style={{ margin: '24px 0 0', maxWidth: 700, fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.6, color: '#ffffff', textShadow: '0 1px 2px rgba(0,2,5,0.5), 0 2px 16px rgba(0,2,5,0.6)', textWrap: 'pretty', animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 150ms both', fontWeight: 500 }}>
              <div>{t.hero.desc}</div>
            </div>

            <div data-r="hero-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 38, animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 300ms both' }}>
              <a className="btn-accent" href="#early-access" onClick={goToSection('early-access', { focusForm: true })} aria-label={t.hero.cta1} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: '#ffffff', background: ACCENT, border: 'none', borderRadius: 12, padding: '16px 28px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)', transition: 'background-color 200ms ease', outline: 'none' }}>
                {t.hero.cta1}
              </a>
            </div>
          </div>

          <div data-r="door-wrap" style={{ position: 'relative', flex: '0 0 auto', width: 'min(560px, 62vh)', maxWidth: '100%', transform: 'translateY(12.6%)' }}>
            <div data-r="particles" style={{ position: 'absolute', left: 0, top: '8.8%', width: '38%', height: '44%', zIndex: 3, pointerEvents: 'none', overflow: 'visible' }}>
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', right: p.right, top: p.top,
                    width: p.size, height: p.size, borderRadius: 1,
                    background: p.bg,
                    border: p.border,
                    boxShadow: p.shadow,
                    '--dist': `calc(${p.dist} * var(--p-scale, 1px))`,
                    '--rise': `calc(${p.rise} * var(--p-scale, 1px))`,
                    '--maxop': p.maxop,
                    animation: `gateFlow ${p.dur}s linear infinite`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
            <div data-r="door-backdrop" aria-hidden="true" />
            <img data-r="door-img" src="/assets/door-of-light-alpha.png" alt="Door of light" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '852 / 982', objectFit: 'contain', animation: 'heroImageIn 1100ms cubic-bezier(0.16,1,0.3,1) 200ms both' }} />
          </div>
        </div>
      </section>

      <section id="what-we-offer" style={{ position: 'relative', padding: '96px 24px', background: '#f2f6fc', overflow: 'hidden', scrollMarginTop: 100 }}>
        <img src="/assets/offer-bg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

        <div data-r="offer-inner" dir={dir} style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto' }}>
          {/* Sits inside this section rather than its own: the section's
              background is an image, so any separate block above it showed a
              seam however closely the flat colour was matched. */}
          <div id="why-wojood" data-r="problem-inner" data-reveal="up" style={{ maxWidth: 760, margin: '0 auto 128px', textAlign: 'center', scrollMarginTop: 100, opacity: 0, transform: 'translateY(24px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)' }}>
            <h2 data-r="problem-h2" style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.18, color: '#0f172a', textWrap: 'pretty' }}>
              {t.problem.heading1}<span style={{ color: ACCENT }}>{t.problem.heading2}</span>{t.problem.heading3}
            </h2>
            <p data-r="problem-body" style={{ margin: '16px auto 0', maxWidth: 620, fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.6, color: '#5b6070', fontWeight: 500, textWrap: 'pretty' }}><Brand text={t.problem.body} /></p>
          </div>

          {/* Small centred label introducing the offer. */}
          <p data-r="offer-eyebrow" data-reveal="up" style={{ margin: '0 0 14px', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, opacity: 0, transform: 'translateY(14px)', transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)' }}>{t.offer.eyebrow}</p>


          <div data-r="offer-row" style={{ display: 'flex', gap: 24, marginTop: 36 }}>
            {CARDS.map((c, i) => (
              <article
                key={c.key}
                className="svc-card"
                data-reveal="up"
                style={{ opacity: 0, transform: 'translateY(24px)', transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms` }}
              >
                {/* Blurred copy of the same art, so the glass bar has something to refract. */}
                <img className="svc-card-backdrop" src={c.img} alt="" aria-hidden="true" />
                <div className={`svc-card-img ${c.fit}`}>
                  <img src={c.img} alt={t.offer.cards[c.key].alt} loading="lazy" />
                </div>
                <div className="svc-card-glass">
                  <div className="svc-card-title">{t.offer.cards[c.key].title}</div>
                  <div className="svc-card-body">{t.offer.cards[c.key].body}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* No minHeight: it forced the section to 1010px and left ~170px of empty
          scroll below the footer whenever the content was shorter. */}
      <section id="early-access" style={{ position: 'relative', padding: '96px 24px 36px', background: 'url("/assets/early-bg.png") center / cover no-repeat', overflow: 'visible', scrollMarginTop: 100 }}>
        <div data-r="early-dots" style={{ position: 'absolute', right: -20, top: -20, width: 220, height: 220, backgroundImage: 'radial-gradient(#ffffff 1.4px, transparent 1.4px)', backgroundSize: '16px 16px', opacity: 0.5, maskImage: 'radial-gradient(circle, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 75%)' }} />

        <div data-r="early-inner" dir={dir} style={{ position: 'relative', zIndex: 2, maxWidth: 1136, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap', paddingBottom: 96, boxSizing: 'border-box' }}>
          <div data-r="early-left" data-reveal="left" style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 560, zIndex: 0, textAlign, opacity: 0, transform: 'translateX(-28px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)' }}>
            <h2 data-r="early-h2" style={{ margin: '0 0 20px', maxWidth: 468, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4.2vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.14, color: '#0f172a' }}>
              {t.early.headline}
            </h2>

            <p data-r="early-desc" style={{ margin: '0 0 18px', maxWidth: 523, fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.62, color: '#4a5568', fontWeight: 500, textWrap: 'pretty' }}><Brand text={t.early.desc} /></p>

            <SpotsCounter template={t.early.spots} taken={taken} total={SPOTS.total} />

          </div>

          <WaitlistForm lang={lang} t={t} dir={dir} textAlign={textAlign} onRegistered={() => setRows((n) => n + 1)} />
        </div>

        {/* Its own centred row above the footer, so it reads as an action
            rather than a footer item. */}
        <div data-r="contact-row" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          {/* Opens a WhatsApp chat. target=_blank so the page isn't replaced,
              rel=noopener because it's a cross-origin target. */}
          <a
            className="wa-link"
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.45-.72-2.93-1.16-4.75-4.2-4.9-4.4-.14-.2-1.15-1.53-1.15-2.92 0-1.39.72-2.07.98-2.36.26-.29.56-.36.75-.36.19 0 .38 0 .55.01.18.01.41-.7.64.48.24.56.79 1.94.86 2.08.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.58.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.09 1.66.78 1.95.92.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
            </svg>
            <span>{t.footer.contact}</span>
          </a>
        </div>

        <div data-r="footer-bar" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '20px auto 0', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/assets/logo-footer.png" alt="WOJOD" style={{ height: 20, width: 'auto', maxWidth: 137, objectFit: 'contain' }} />
          </div>
          {/* Social profiles. target=_blank + noopener for the same reason as
              the WhatsApp link above; order is fixed regardless of dir. */}
          <div data-r="social-row" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {SOCIALS.map((s) => (
              <a key={s.key} className="social-link" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Wojod on ${s.label}`}>
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[s.key]} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
