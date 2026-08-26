import { Brand } from './brand.jsx';
import { useEffect, useRef, useState } from 'react';
import {
  WAITLIST_ENDPOINT, COUNTRIES, SERVICES, SERVICE_ICONS,
} from './content.js';
import { trackEvent } from './analytics.js';

function ServiceIcon({ icon, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

export default function WaitlistForm({ lang, t, dir, textAlign }) {
  const isAr = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [status, setStatus] = useState('idle');
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [modal, setModal] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const servicesRef = useRef(null);
  const countryBtnRef = useRef(null);
  const countrySearchRef = useRef(null);
  const countryWrapRef = useRef(null);

  const sessionStart = useRef(Date.now());
  const utm = useRef({ source: '', campaign: '', referrer: '' });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      utm.current = {
        source: params.get('utm_source') || '',
        campaign: params.get('utm_campaign') || '',
        referrer: document.referrer || '',
      };
    } catch (e) { /* keep defaults */ }
  }, []);

  // These live in refs so the document-level handlers see current values.
  const stateRef = useRef({});
  stateRef.current = { countryOpen, modal };

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (stateRef.current.countryOpen) {
        const insideMenu = countryWrapRef.current && countryWrapRef.current.contains(e.target);
        const onTrigger = countryBtnRef.current && countryBtnRef.current.contains(e.target);
        if (!insideMenu && !onTrigger) { setCountryOpen(false); setCountryQuery(''); }
      }
    };
    const onDocKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (stateRef.current.modal) { closeModal(); return; }
        if (stateRef.current.countryOpen) closeCountryMenu(true);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onDocKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onDocKeyDown);
    };
  }, []);

  const validateField = (key) => {
    if (key === 'fullName') {
      const v = fullName.trim();
      if (!v) return t.errors.name;
      if (v.replace(/\s/g, '').length < 2) return t.errors.name;
      return '';
    }
    if (key === 'email') {
      const v = email.trim();
      if (!v) return t.errors.emailRequired;
      if (/\.\./.test(v) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return t.errors.email;
      return '';
    }
    if (key === 'phone') {
      const digits = phone.replace(/\D/g, '');
      if (!digits) return t.errors.phoneRequired;
      if (country.code === 'SA') {
        if (!/^5\d{8}$/.test(digits.replace(/^0+/, ''))) return t.errors.phone;
      } else if (digits.length < 6 || digits.length > 14) {
        return t.errors.phone;
      }
      return '';
    }
    if (key === 'services') return selectedServices.length > 0 ? '' : t.errors.services;
    return '';
  };

  const errs = {
    fullName: validateField('fullName'),
    email: validateField('email'),
    phone: validateField('phone'),
    services: validateField('services'),
  };
  const formComplete = Object.keys(errs).every((k) => !errs[k]);

  const shown = (key) => (touched[key] || submitAttempted) ? errs[key] : '';
  const errName = shown('fullName');
  const errEmail = shown('email');
  const errPhone = shown('phone');
  const errServices = submitAttempted ? errs.services : '';

  const fieldVisualState = (key, errorVal) => {
    const focused = focusedField === key;
    if (errorVal) return { border: '1px solid #e0574a', boxShadow: 'none', bg: '#ffffff', icon: '#e0574a' };
    if (focused) return { border: '1px solid #2456c8', boxShadow: '0 0 0 3px rgba(36, 86, 200,0.12)', bg: '#fafcff', icon: '#2456c8' };
    return { border: '1px solid rgba(15, 23, 42,0.12)', boxShadow: 'none', bg: '#ffffff', icon: '#9ca3af' };
  };

  const nameVis = fieldVisualState('fullName', errName);
  const emailVis = fieldVisualState('email', errEmail);
  const phoneVis = fieldVisualState('phone', errPhone);

  const onFieldBlur = (field) => {
    setTouched((s) => ({ ...s, [field]: true }));
    setFocusedField((f) => (f === field ? '' : f));
  };

  const toggleCountryOpen = () => {
    setCountryOpen((open) => {
      const opening = !open;
      if (opening) setTimeout(() => countrySearchRef.current && countrySearchRef.current.focus(), 50);
      return opening;
    });
    setCountryQuery('');
  };

  const closeCountryMenu = (refocus) => {
    setCountryOpen(false);
    setCountryQuery('');
    if (refocus && countryBtnRef.current) countryBtnRef.current.focus();
  };

  const selectCountry = (c) => {
    setCountry(c);
    setCountryOpen(false);
    setCountryQuery('');
    if (phoneRef.current) phoneRef.current.focus();
  };



  const closeModal = () => setModal(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setSubmitAttempted(true);
    setTouched({ fullName: true, email: true, phone: true, services: true });

    const order = ['fullName', 'email', 'phone', 'services'];
    const firstInvalid = order.find((k) => errs[k]);
    if (firstInvalid) {
      const refMap = { fullName: nameRef, email: emailRef, phone: phoneRef, services: servicesRef };
      const el = refMap[firstInvalid] && refMap[firstInvalid].current;
      if (el && el.focus) el.focus();
      return;
    }
    setStatus('submitting');
    setSubmitError('');

    const elapsedMs = Date.now() - sessionStart.current;
    const totalSec = Math.max(0, Math.floor(elapsedMs / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: '+' + country.dial + phone.replace(/\D/g, ''),
      // Sector field was removed from the form; the column stays in the sheet.
      businessType: '',
      services: selectedServices.join(', '),
      language: isAr ? 'AR' : 'EN',
      sessionDuration: mm + ':' + ss,
      utmSource: utm.current.source,
      utmCampaign: utm.current.campaign,
      referrer: utm.current.referrer,
    };

    if (!WAITLIST_ENDPOINT) {
      console.warn('WOJOD waitlist: VITE_WAITLIST_ENDPOINT is not configured — set it to your deployed Google Apps Script /exec URL. No submission was sent.');
      setStatus('idle');
      setSubmitError(t.early.genericError);
      setModal('error');
      return;
    }

    fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        // Conversion tracking: categorical fields only, never name/email/phone.
        const eventParams = {
          language: payload.language,
          services_count: selectedServices.length,
          country: country.code,
          utm_source: payload.utmSource,
          utm_campaign: payload.utmCampaign,
        };
        if (data.status === 'duplicate') { setStatus('duplicate'); setModal('duplicate'); trackEvent('waitlist_duplicate', eventParams); }
        else if (data.status === 'success') { setStatus('success'); setModal('success'); trackEvent('waitlist_signup', eventParams); }
        else {
          // The backend's own message never reaches the user, but without it in
          // the console a sheet/permission failure is indistinguishable from a
          // network one.
          console.error('WOJOD waitlist: backend rejected the submission —', data && data.message);
          setStatus('idle'); setSubmitError(t.early.genericError); setModal('error'); trackEvent('waitlist_error', { ...eventParams, reason: 'backend' });
        }
      })
      .catch(() => { setStatus('idle'); setSubmitError(t.early.genericError); setModal('error'); trackEvent('waitlist_error', { reason: 'network', language: payload.language }); });
  };

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.dial.includes(q);
  });


  const submitDisabled = status !== 'idle' || !formComplete;
  const ctaLabel = status === 'submitting'
    ? t.early.ctaSubmitting
    : (status === 'success' || status === 'duplicate') ? t.early.ctaSuccess : t.early.ctaIdle;

  const menuStyle = (open) => ({
    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
    background: '#ffffff', border: '1px solid rgba(15, 23, 42,0.12)', borderRadius: 12,
    boxShadow: '0 20px 40px -12px rgba(15, 23, 42,0.25)', zIndex: 30,
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(-6px)',
    pointerEvents: open ? 'auto' : 'none',
    visibility: open ? 'visible' : 'hidden',
    transition: 'opacity 180ms ease-out, transform 180ms ease-out',
  });

  const errStyle = { marginTop: 6, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: '#d34a3f', textAlign };

  const modalTitle = modal === 'success' ? t.early.modal.successTitle : modal === 'duplicate' ? t.early.modal.duplicateTitle : t.early.modal.errorTitle;
  const modalBody = modal === 'success' ? t.early.modal.successBody : modal === 'duplicate' ? t.early.modal.duplicateBody : t.early.modal.errorBody;
  const modalBtn = modal === 'success' ? t.early.modal.successBtn : modal === 'duplicate' ? t.early.modal.duplicateBtn : t.early.modal.errorBtn;

  return (
    <div data-r="waitlist-col" dir={dir} data-reveal="right" style={{ flex: '1 1 420px', minWidth: 300, maxWidth: 560, width: '100%', textAlign, opacity: 0, transform: 'translateX(28px)', transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)' }}>
      <form data-r="waitlist-form" onSubmit={handleSubmit} style={{ background: '#ffffff', borderRadius: 24, padding: 40, boxShadow: '0 30px 60px -12px rgba(36, 86, 200,0.18)' }}>

        <label htmlFor="wj-name" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.early.fullName}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, background: nameVis.bg, border: nameVis.border, boxShadow: nameVis.boxShadow, borderRadius: 12, padding: '0 16px', transition: 'border-color 180ms ease-out, box-shadow 180ms ease-out, background-color 180ms ease-out' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={nameVis.icon} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 180ms ease-out' }}><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
          <input id="wj-name" ref={nameRef} type="text" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} onFocus={() => setFocusedField('fullName')} onBlur={() => onFieldBlur('fullName')} aria-invalid={Boolean(errName)} aria-describedby="wj-name-err" placeholder={t.early.fullName} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontFamily: "'Inter', sans-serif", fontSize: 15, padding: '15px 0', textAlign, caretColor: '#2456c8' }} />
        </div>
        {errName && <div id="wj-name-err" role="alert" style={errStyle}>{errName}</div>}

        <label htmlFor="wj-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.early.email}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, background: emailVis.bg, border: emailVis.border, boxShadow: emailVis.boxShadow, borderRadius: 12, padding: '0 16px', transition: 'border-color 180ms ease-out, box-shadow 180ms ease-out, background-color 180ms ease-out' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={emailVis.icon} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 180ms ease-out' }}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          <input id="wj-email" ref={emailRef} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => onFieldBlur('email')} aria-invalid={Boolean(errEmail)} aria-describedby="wj-email-err" placeholder={t.early.email} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontFamily: "'Inter', sans-serif", fontSize: 15, padding: '15px 0', textAlign, caretColor: '#2456c8' }} />
        </div>
        {errEmail && <div id="wj-email-err" role="alert" style={errStyle}>{errEmail}</div>}

        <label htmlFor="wj-phone" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t.early.phone}</label>
        <div style={{ direction: 'ltr', position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, background: phoneVis.bg, border: phoneVis.border, boxShadow: phoneVis.boxShadow, borderRadius: 12, padding: '0 16px', transition: 'border-color 180ms ease-out, box-shadow 180ms ease-out, background-color 180ms ease-out' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={phoneVis.icon} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 180ms ease-out' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          <button type="button" ref={countryBtnRef} onClick={toggleCountryOpen} aria-haspopup="listbox" aria-expanded={countryOpen} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#0f172a', padding: '15px 10px 15px 0', borderRight: '1px solid rgba(15, 23, 42,0.12)', flex: 'none' }}>
            <span>{country.flag}</span>
            <span>+{country.dial}</span>
            <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <input id="wj-phone" ref={phoneRef} type="tel" dir="ltr" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} onFocus={() => setFocusedField('phone')} onBlur={() => onFieldBlur('phone')} aria-invalid={Boolean(errPhone)} aria-describedby="wj-phone-err" placeholder={t.early.phone} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontFamily: "'Inter', sans-serif", fontSize: 15, padding: '15px 0', textAlign: 'left', caretColor: '#2456c8' }} />

          <div ref={countryWrapRef} onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); closeCountryMenu(true); } }} role="listbox" aria-hidden={!countryOpen} style={{ ...menuStyle(countryOpen), maxHeight: 260 }}>
            <input ref={countrySearchRef} className="menu-search" type="text" value={countryQuery} onChange={(e) => setCountryQuery(e.target.value)} placeholder={t.countrySearchPlaceholder} style={{ margin: 10, padding: '10px 12px', border: '1px solid rgba(15, 23, 42,0.12)', borderRadius: 8, outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: 14, textAlign, caretColor: '#2456c8', transition: 'border-color 180ms ease-out' }} />
            <div style={{ overflowY: 'auto' }}>
              {filteredCountries.map((c) => (
                <button key={c.code + c.dial} type="button" className="menu-option" onClick={() => selectCountry(c)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'transparent', border: 'none', padding: '10px 14px', cursor: 'pointer', textAlign, fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#0f172a' }}>
                  <span>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: '#9ca3af' }}>+{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {errPhone && <div id="wj-phone-err" role="alert" style={errStyle}>{errPhone}</div>}


        <div style={{ marginTop: 24, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{t.early.servicesLabel}</div>
        <div style={{ marginTop: 2, fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9ca3af' }}>{t.early.servicesSub}</div>
        <div ref={servicesRef} tabIndex={-1} role="group" aria-describedby="wj-services-err" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 12 }}>
          {SERVICES.map((s) => {
            const active = selectedServices.includes(s.key);
            const color = active ? '#2456c8' : '#0f172a';
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelectedServices((prev) => prev.includes(s.key) ? prev.filter((k) => k !== s.key) : prev.concat(s.key))}
                aria-pressed={active}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: active ? 'rgba(36, 86, 200,0.1)' : '#ffffff', border: `1px solid ${active ? '#2456c8' : 'rgba(15, 23, 42,0.12)'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 14, color, transition: 'background-color 180ms ease-out, border-color 180ms ease-out, color 180ms ease-out' }}
              >
                <ServiceIcon icon={SERVICE_ICONS[s.key]} color={color} />
                {t.early.services[s.key]}
              </button>
            );
          })}
        </div>
        {errServices && <div id="wj-services-err" role="alert" style={errStyle}>{errServices}</div>}

        <button type="submit" className="grad-btn" disabled={submitDisabled} aria-disabled={submitDisabled} aria-busy={status === 'submitting'} style={{ width: '100%', marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#ffffff', background: 'linear-gradient(90deg, #3567d8, #2456c8)', border: 'none', borderRadius: 12, padding: '17px 0', cursor: submitDisabled ? 'not-allowed' : 'pointer', opacity: !formComplete && status === 'idle' ? 0.5 : 1, pointerEvents: submitDisabled ? 'none' : 'auto', boxShadow: '0 12px 24px -6px rgba(36, 86, 200,0.5)', transition: 'opacity 200ms ease' }}>
          {status === 'submitting' && <span className="wj-spinner" aria-hidden="true" />}
          {ctaLabel}
          {status !== 'submitting' && <span aria-hidden="true">→</span>}
        </button>


        {status === 'success' && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{t.early.success}</p>
            <p style={{ margin: '4px 0 0', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#4a5568' }}><Brand text={t.early.successSub} /></p>
          </div>
        )}
        {status === 'duplicate' && (
          <p style={{ margin: '14px 0 0', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#4a5568' }}><Brand text={t.early.duplicate} /></p>
        )}
        {submitError && (
          <p role="alert" style={{ margin: '14px 0 0', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#d34a3f' }}>{submitError}</p>
        )}
      </form>

      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(15,17,23,0.45)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', animation: 'fadeIn 250ms ease-out both' }}>
          <div data-r="modal-card" dir={dir} onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#ffffff', border: '1px solid rgba(36, 86, 200,0.12)', borderRadius: 20, padding: '40px 32px', boxShadow: '0 30px 70px -12px rgba(36, 86, 200,0.28), 0 0 0 1px rgba(255,255,255,0.5)', textAlign: 'center', animation: 'fadeSlideUp 260ms ease-out both' }}>
            <button type="button" onClick={closeModal} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#9ca3af', display: 'flex' }}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            {modal === 'error' && (
              <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: '50%', background: 'rgba(224,87,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#d34a3f" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
              </div>
            )}
            {modal === 'success' && (
              <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: '50%', background: 'rgba(36, 86, 200,0.1)', boxShadow: '0 0 0 8px rgba(36, 86, 200,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#2456c8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            )}
            {modal === 'duplicate' && (
              <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: '50%', background: 'rgba(36, 86, 200,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#2456c8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
            )}

            <h3 style={{ margin: '22px 0 0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 21, fontWeight: 800, color: '#0f172a' }}>{modalTitle}</h3>
            <p style={{ margin: '12px 0 0', fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.6, color: '#6b7280' }}><Brand text={modalBody} /></p>

            <button type="button" className="grad-btn" onClick={closeModal} style={{ width: '100%', marginTop: 26, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#ffffff', background: 'linear-gradient(90deg, #3567d8, #2456c8)', border: 'none', borderRadius: 12, padding: '15px 0', cursor: 'pointer', transition: 'opacity 200ms ease' }}>
              {modalBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
