import { useEffect, useRef, useState } from 'react';
import { ACCENT, T, PILLARS, PILLAR_ICONS } from './content.js';
import WaitlistForm from './WaitlistForm.jsx';

function PillarIcon({ icon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={30}
      height={30}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

const PARTICLES = [
  { right: '4%', top: '46%', size: 5, bg: '#a8c4ff', shadow: '0 0 6px rgba(120,170,255,0.9)', dist: -230, rise: -22, maxop: 0.95, dur: 5.2, delay: 0 },
  { right: '6%', top: '62%', size: 3, bg: '#ffffff', shadow: '0 0 5px rgba(255,255,255,0.8)', dist: -190, rise: 14, maxop: 0.85, dur: 4.4, delay: 0.5 },
  { right: '3%', top: '24%', size: 7, bg: 'rgba(139,92,246,0.85)', shadow: '0 0 9px rgba(139,92,246,0.8)', dist: -260, rise: -34, maxop: 0.9, dur: 6.1, delay: 1.3 },
  { right: '8%', top: '76%', size: 4, bg: '#7aa5ff', shadow: '0 0 6px rgba(74,144,255,0.85)', dist: -210, rise: 26, maxop: 0.8, dur: 5.6, delay: 0.9 },
  { right: '5%', top: '52%', size: 2, bg: '#ffffff', dist: -170, rise: -8, maxop: 0.7, dur: 4.0, delay: 2.1 },
  { right: '7%', top: '12%', size: 5, bg: '#8fb6ff', shadow: '0 0 7px rgba(120,170,255,0.75)', dist: -245, rise: -40, maxop: 0.75, dur: 6.6, delay: 1.7 },
  { right: '4%', top: '86%', size: 6, bg: 'rgba(165,140,255,0.8)', shadow: '0 0 8px rgba(165,140,255,0.7)', dist: -200, rise: 38, maxop: 0.7, dur: 5.9, delay: 2.8 },
  { right: '9%', top: '36%', size: 3, bg: '#cddcff', dist: -280, rise: -16, maxop: 0.65, dur: 7.0, delay: 0.3 },
  { right: '6%', top: '68%', size: 2, bg: '#ffffff', dist: -150, rise: 18, maxop: 0.6, dur: 4.6, delay: 3.2 },
  { right: '2%', top: '50%', size: 8, border: '1px solid rgba(160,190,255,0.8)', bg: 'transparent', dist: -220, rise: 4, maxop: 0.6, dur: 6.3, delay: 1.1 },
  { right: '10%', top: '18%', size: 4, bg: '#6f9dff', dist: -265, rise: -28, maxop: 0.55, dur: 7.4, delay: 2.4 },
  { right: '8%', top: '80%', size: 3, bg: 'rgba(139,92,246,0.75)', dist: -235, rise: 30, maxop: 0.55, dur: 6.8, delay: 3.7 },
  { right: '12%', top: '42%', size: 2, bg: '#b9cdff', dist: -300, rise: -6, maxop: 0.45, dur: 8.0, delay: 1.9 },
  { right: '11%', top: '72%', size: 5, border: '1px solid rgba(139,92,246,0.6)', bg: 'transparent', dist: -270, rise: 22, maxop: 0.45, dur: 7.6, delay: 4.1 },
  { right: '14%', top: '30%', size: 3, bg: '#ffffff', dist: -310, rise: -18, maxop: 0.35, dur: 8.6, delay: 0.7 },
  { right: '13%', top: '92%', size: 2, bg: '#8fb6ff', dist: -290, rise: 12, maxop: 0.3, dur: 8.2, delay: 3.0 },
];

export default function App() {
  const [lang, setLangState] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [menuOpen, setMenuOpenState] = useState(false);
  const [activeSection, setActiveSection] = useState('');
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

  const setMenu = (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
    setMenuOpenState(open);
  };

  const playVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  useEffect(() => {
    let saved = 'en';
    try { saved = localStorage.getItem('wojood_lang') || 'en'; } catch (e) {}
    applyDocLang(saved);
    if (saved !== 'en') setLangState(saved);

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

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4, rootMargin: '-100px 0px -50% 0px' }
    );
    ['why-wojood', 'what-we-offer', 'early-access'].forEach((id) => {
      const node = document.getElementById(id);
      if (node) sectionObserver.observe(node);
    });

    return () => {
      clearTimeout(videoTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const navLinkStyle = (id) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: activeSection === id ? '#ffffff' : 'rgba(255,255,255,0.8)',
    transition: 'color 200ms ease',
  });

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
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px', display: 'flex', direction: 'ltr', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', color: '#ffffff', flex: 'none' }}>
            <img src="/assets/logo-nav.png" alt="Wojod" style={{ height: 32, width: 'auto', maxWidth: 180, objectFit: 'contain' }} />
          </a>

          <div style={{ display: narrow ? 'none' : 'flex', alignItems: 'center', gap: 34 }}>
            <a className="nav-link" href="#why-wojood" style={navLinkStyle('why-wojood')}>{t.nav.why}</a>
            <a className="nav-link" href="#what-we-offer" style={navLinkStyle('what-we-offer')}>{t.nav.offer}</a>
            <a className="nav-link" href="#early-access" style={navLinkStyle('early-access')}>{t.nav.early}</a>
          </div>

          <div style={{ display: narrow ? 'none' : 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: 3, gap: 2 }}>
              <button onClick={() => setLang('en')} style={langBtnStyle(!isAr, true)}>EN</button>
              <button onClick={() => setLang('ar')} style={langBtnStyle(isAr, true)}>AR</button>
            </div>
            <button className="nav-ghost-btn" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#ffffff', background: 'transparent', border: 'none', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', transition: 'background-color 200ms ease' }}>
              {t.nav.coming}
            </button>
          </div>

          <button onClick={() => setMenu(true)} aria-label="Open menu" style={{ display: narrow ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: '#ffffff' }}>
            <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0f172a', display: 'flex', flexDirection: 'column', animation: 'fadeIn 200ms ease both' }}>
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/assets/logo-menu.png" alt="Wojod" style={{ height: 24, width: 'auto', objectFit: 'contain' }} />
            </div>
            <button onClick={() => setMenu(false)} aria-label="Close menu" style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: '#ffffff', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
            {[
              { href: '#why-wojood', label: t.nav.why },
              { href: '#what-we-offer', label: t.nav.offer },
              { href: '#early-access', label: t.nav.early },
            ].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenu(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 600, color: '#ffffff' }}>
                {item.label}
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}><path d="m9 18 6-6-6-6" /></svg>
              </a>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: 4, width: 'fit-content' }}>
              <button onClick={() => setLang('en')} style={langBtnStyle(!isAr, false)}>EN</button>
              <button onClick={() => setLang('ar')} style={langBtnStyle(isAr, false)}>AR</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              <button style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: '#ffffff', background: ACCENT, border: 'none', borderRadius: 12, padding: '16px 20px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
                {t.nav.coming}
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="top" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#0f172a' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', backgroundColor: '#0D0D0F' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: '#050708' }} />

        <video
          data-r="hero-video"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '1095px',
            left: isAr ? '579px' : '316px',
            transform: isAr
              ? 'scaleX(-1) translate(34%, -155%) rotate(-360deg) scale(0.99, -1.71)'
              : 'translate(-34%, -155%) rotate(-360deg) scale(0.99, -1.71)',
            minWidth: '100%', minHeight: '100%', width: 1272, height: 997,
            objectFit: 'cover', opacity: 1, backgroundColor: '#000000',
            filter: 'hue-rotate(-45deg) saturate(0.85) brightness(1.03) contrast(1.05)',
          }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>

        <div data-r="hero-inner" dir={dir} style={{ position: 'relative', zIndex: 10, width: 1326, maxWidth: 1200, margin: '0 auto', padding: '150px 24px 110px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 48, minHeight: 605 }}>
          <div data-r="hero-text" style={{ flex: 1, minWidth: 0, zIndex: 0, width: 757, height: 605, textAlign }}>
            <h1 data-r="hero-h1" style={{ margin: '28px 0 0', maxWidth: 900, fontFamily: 'Lato', fontSize: 'clamp(48px, 6.4vw, 72px)', lineHeight: 1.06, fontWeight: 500, letterSpacing: '-0.02em', color: '#ffffff', textWrap: 'pretty', animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) both', width: 715, height: 243 }}>
              <img src="/assets/logo-hero.png" alt="Wojod" style={{ height: 45, width: 146, objectFit: 'contain', paddingLeft: 10, paddingRight: 10 }} />
              <div data-r="hero-h1-text" style={{ width: 619, height: 167 }}>{t.hero.headline}</div>
            </h1>
            <div data-r="hero-desc" style={{ margin: '24px 0 0', maxWidth: 700, fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', textWrap: 'pretty', animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 150ms both', fontWeight: 500 }}>
              <div>{t.hero.desc1} <br />{t.hero.desc2}</div>
            </div>

            <div data-r="hero-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 38, animation: 'fadeSlideUp 700ms cubic-bezier(0.16,1,0.3,1) 300ms both' }}>
              <a className="btn-accent" href="#early-access" aria-label={t.hero.cta1} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: '#ffffff', background: ACCENT, border: 'none', borderRadius: 12, padding: '16px 28px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)', transition: 'background-color 200ms ease', outline: 'none' }}>
                {t.hero.cta1}
              </a>
              <a className="btn-dark" href="#why-wojood" aria-label={t.hero.cta2} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: '#ffffff', background: '#0f172a', border: 'none', borderRadius: 12, padding: '16px 28px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35)', transition: 'background-color 200ms ease', outline: 'none' }}>
                {t.hero.cta2}
              </a>
            </div>
          </div>

          <div data-r="door-wrap" style={{ position: 'relative', flex: '0 0 420px', width: 489, height: 540 }}>
            <div data-r="particles" style={{ position: 'absolute', left: isAr ? '-282px' : '-104px', top: 50, width: 420, height: 336, zIndex: 3, pointerEvents: 'none', overflow: 'visible', transform: 'scaleX(1)' }}>
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', right: p.right, top: p.top,
                    width: p.size, height: p.size, borderRadius: 1,
                    background: p.bg,
                    border: p.border,
                    boxShadow: p.shadow,
                    '--dist': `${p.dist}px`, '--rise': `${p.rise}px`, '--maxop': p.maxop,
                    animation: `gateFlow ${p.dur}s linear infinite`,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}
            </div>
            <img data-r="door-img" src="/assets/door-of-light.png" alt="Door of light" style={{ width: 659, height: 699, objectFit: 'fill', animation: 'heroImageIn 1100ms cubic-bezier(0.16,1,0.3,1) 200ms both' }} />
          </div>
        </div>
      </section>

      <section id="why-wojood" style={{ width: '100%', position: 'relative', overflow: 'hidden', scrollMarginTop: 100, minHeight: 504, background: 'url("/assets/why-bg.png") center / cover no-repeat' }}>
        <div data-r="why-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'url("/assets/why-bg-overlay.png") center / cover no-repeat', transform: isAr ? 'scaleX(-1)' : 'none' }} />
        <div data-r="why-inner" dir={dir} style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '72px 24px', display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: 40, height: 404 }}>
          <div data-r="why-text" data-reveal="up" style={{ flex: '1 1 420px', minWidth: 0, maxWidth: 560, textAlign, opacity: 0, transform: 'translate(0px, 41px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)', height: 249 }}>
            <h2 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, color: '#0f172a', textWrap: 'pretty' }}>
              {t.why.heading1}<span style={{ color: ACCENT }}>{t.why.heading2}</span>{t.why.heading3}
            </h2>
            <p style={{ margin: '24px 0 0', fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 500, lineHeight: 1.7, color: '#6b7280', textWrap: 'pretty' }}>{t.why.p1}</p>
            {t.why.p2 && (
              <p style={{ margin: '14px 0 0', fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 500, lineHeight: 1.7, color: '#6b7280', textWrap: 'pretty' }}>{t.why.p2}</p>
            )}
            <div style={{ marginTop: 32, paddingLeft: isAr ? 0 : 18, paddingRight: isAr ? 18 : 0, borderLeft: isAr ? 'none' : `3px solid ${ACCENT}`, borderRight: isAr ? `3px solid ${ACCENT}` : 'none' }}>
              <p data-r="why-closing" style={{ margin: '31px 0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 2.2vw, 28px)', fontWeight: 700, lineHeight: 1.5, color: '#0f172a', textWrap: 'pretty', height: 93 }}>
                {t.why.closing1}<span style={{ color: ACCENT }}>{t.why.closingWojod}</span>{t.why.closingRest}
                {t.why.closingBreak && <br />}
                {t.why.closing2}<span style={{ color: 'rgb(139, 92, 246)' }}>{t.why.closing3}</span>{t.why.closing4}
              </p>
            </div>
          </div>
          <div data-r="why-spacer" style={{ flex: '1 1 420px', minWidth: 0, maxWidth: 640 }} />
          <img data-r="why-illus" src="/assets/why-bg-overlay.png" alt="" aria-hidden="true" style={{ display: 'none', transform: isAr ? 'scaleX(-1)' : 'none' }} />
        </div>
      </section>

      <section id="what-we-offer" style={{ position: 'relative', padding: '96px 24px', background: '#f5f4fb', overflow: 'hidden', scrollMarginTop: 100 }}>
        <img src="/assets/offer-bg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        <div data-r="offer-inner" dir={dir} data-reveal="up" style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '-2px auto', textAlign: 'center', opacity: 0, transform: 'translateY(28px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)', height: 249, top: -14 }}>
          <h2 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, color: '#0f172a', textWrap: 'pretty' }}>
            {t.offer.heading1}<span style={{ color: ACCENT }}>{t.offer.heading2}</span>
          </h2>
          <p style={{ margin: '20px auto 0', maxWidth: 700, fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.6, color: '#6b7280', textWrap: 'pretty', fontWeight: 500 }}>{t.offer.desc}</p>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, marginTop: 48, flexWrap: 'wrap', rowGap: 32 }}>
            {PILLARS.map((p, i) => (
              <div key={p.key} data-reveal="up" style={{ display: 'flex', alignItems: 'center', flex: 'none', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1) calc(var(--i, 0) * 80ms), transform 700ms cubic-bezier(0.16,1,0.3,1) calc(var(--i, 0) * 80ms)' }}>
                <div style={{ width: 1, height: 56, background: 'rgba(15,23,42,0.1)', display: i === 0 ? 'none' : 'block' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 165, padding: '0 4px', height: 97 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 999, background: '#ffffff', boxShadow: '0 4px 14px rgba(15,23,42,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, flex: 'none' }}>
                    <PillarIcon icon={PILLAR_ICONS[p.key]} />
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>{t.offer.pillars[p.key]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" style={{ position: 'relative', padding: '96px 24px 0', background: 'url("/assets/early-bg.png") center / cover no-repeat', overflow: 'visible', minHeight: 1010, scrollMarginTop: 100 }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 220, height: 220, backgroundImage: 'radial-gradient(#ffffff 1.4px, transparent 1.4px)', backgroundSize: '16px 16px', opacity: 0.5, maskImage: 'radial-gradient(circle, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 75%)' }} />

        <div data-r="early-inner" dir={dir} style={{ position: 'relative', zIndex: 2, maxWidth: 1136, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 60, flexWrap: 'wrap', paddingBottom: 96, boxSizing: 'border-box' }}>
          <div data-r="early-left" data-reveal="left" style={{ flex: '1 1 380px', minWidth: 280, maxWidth: 560, zIndex: 0, textAlign, opacity: 0, transform: 'translateX(-28px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)' }}>
            <h2 data-r="early-h2" style={{ margin: '-62px 0 36px', maxWidth: 468, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12, color: '#14122b' }}>
              {t.early.headline1}<span style={{ color: '#6d5cd6' }}>{t.early.headline2}</span>
            </h2>

            <p data-r="early-desc" style={{ margin: '20px -4px 62px 0', maxWidth: 523, fontFamily: "'Inter', sans-serif", fontSize: 20, lineHeight: 1.6, color: '#514f6b', fontWeight: 500 }}>{t.early.desc}</p>

            <div data-r="benefits" style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginTop: 44, flexWrap: 'wrap', rowGap: 28, maxWidth: '100%', justifyContent: 'space-around', marginRight: -45, marginLeft: -53 }}>
              <div data-r="benefit-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 168, padding: '0 12px' }}>
                <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke="#5b46d6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="3.5" /><path d="m10.5 12.5 8-8" /><path d="M16 6.5h3v3" /></svg>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#14122b', textAlign: 'center', whiteSpace: 'nowrap' }}>{t.early.priority}</div>
              </div>
              <div data-r="benefit-divider" style={{ width: 1, height: 68, alignSelf: 'center', background: 'rgba(20,18,43,0.12)' }} />
              <div data-r="benefit-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 168, padding: '0 12px' }}>
                <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke="#5b46d6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5 14.6 9l6.9.5-5.3 4.5 1.7 6.7L12 17l-5.9 3.7 1.7-6.7-5.3-4.5 6.9-.5z" /></svg>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#14122b', textAlign: 'center', whiteSpace: 'nowrap' }}>{t.early.updates}</div>
              </div>
              <div data-r="benefit-divider" style={{ width: 1, height: 68, alignSelf: 'center', background: 'rgba(20,18,43,0.12)' }} />
              <div data-r="benefit-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 168, padding: '0 12px' }}>
                <svg viewBox="0 0 24 24" width={42} height={42} fill="none" stroke="#5b46d6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 101 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" /></svg>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#14122b', textAlign: 'center', whiteSpace: 'nowrap', width: 132 }}>{t.early.voice}</div>
              </div>
            </div>
          </div>

          <WaitlistForm lang={lang} t={t} dir={dir} textAlign={textAlign} />
        </div>

        <div data-r="footer-bar" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '64px auto 0', padding: '28px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/assets/logo-footer.png" alt="Wojod" style={{ height: 20, width: 'auto', maxWidth: 137, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6b7280' }}>{t.footer.copyright}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26 }}>
            <a className="footer-link" href="#top" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6b7280', transition: 'color 200ms ease' }}>{t.footer.privacy}</a>
            <a className="footer-link" href="#top" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6b7280', transition: 'color 200ms ease' }}>{t.footer.terms}</a>
            <a className="footer-link" href="#top" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6b7280', transition: 'color 200ms ease' }}>{t.footer.contact}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
