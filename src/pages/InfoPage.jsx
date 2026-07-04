import { useState } from 'react';
import { useLang } from '../App.jsx';
import { Icon } from '../Icons.jsx';
import { loadPress } from '../storage.js';
import { SEED_PRESS } from '../press.js';
import { WEB3FORMS_KEY, CONTACT_EMAIL } from '../contact.js';

// Spendendaten — PayPal-Adresse noch ersetzen, sobald das Konto eingerichtet ist.
const IBAN = 'DE78 5105 0015 0138 0028 02';
const BIC = 'NASSDE55XXX';
const PAYPAL_EMAIL = 'spenden@volksbildungswerk-klarenthal.de';
const PAYPAL_URL = `https://www.paypal.com/donate?business=${encodeURIComponent(PAYPAL_EMAIL)}&currency_code=EUR&item_name=${encodeURIComponent('Klarenthal lebt Demokratie')}`;

export default function InfoPage({ version }) {
  const { t } = useLang();
  const customPress = loadPress(); // version-Prop löst Re-Render nach Admin-Änderungen aus
  // Formularzustand: null | 'sending' | 'sent' | 'mail' (mailto-Fallback) | 'error'
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  // IBAN ohne Leerzeichen in die Zwischenablage; „Kopiert“-Hinweis kurz zeigen.
  const copyIban = () => {
    navigator.clipboard.writeText(IBAN.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Fallback ohne Versand-Key: öffnet das Mailprogramm mit vorausgefüllter
  // Nachricht. Läuft über einen echten Link-Klick — eine Zuweisung an
  // window.location wird von Browsern für externe Protokolle teils blockiert.
  const openMailProgram = (f) => {
    const body = encodeURIComponent(`Name: ${f.cName.value}\nE-Mail: ${f.cMail.value}\n\n${f.cMsg.value}`);
    const a = document.createElement('a');
    a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Kontakt über die Webseite')}&body=${body}`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setStatus('mail');
  };

  // Mit Web3Forms-Key wird direkt aus dem Browser versendet — die Besucherin
  // braucht kein eigenes E-Mail-Programm. Ohne Key greift der mailto-Fallback.
  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    if (!WEB3FORMS_KEY) { openMailProgram(f); return; }
    if (f.botcheck.checked) return; // Honeypot: nur Bots füllen dieses Feld
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Kontakt über die Webseite klarenthal.org',
          from_name: 'Kontaktformular klarenthal.org',
          name: f.cName.value,
          email: f.cMail.value, // wird als Antwort-Adresse gesetzt
          message: f.cMsg.value,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      f.reset();
      setStatus('sent');
    } catch {
      setStatus('error'); // Hinweis verweist auf die klickbare Adresse unterm Formular
    }
  };

  const STATUS_TEXT = { sending: 'f_sending', sent: 'f_sent', mail: 'f_ok', error: 'f_err' };

  // Adresse im Hinweistext anklickbar machen (Fallback, falls kein Mailprogramm aufgeht).
  const noteParts = t('f_note').split(CONTACT_EMAIL);

  return (
    <section className="page visible">
      <div className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t('info_eyebrow')}</div>
          <h1>{t('info_title')}</h1>
        </div>
      </div>

      {/* Zweispaltig: links Kontaktformular, rechts Spenden-Box */}
      <div className="section">
        <div className="wrap contact-grid">
          <div className="form-card">
            <h2 className="sec-title" style={{ fontSize: 26 }}>{t('contact_title')}</h2>
            <p className="sec-sub" style={{ marginBottom: 8, fontSize: '15.5px' }}>{t('contact_sub')}</p>
            <form onSubmit={onSubmit}>
              <label htmlFor="cName">{t('f_name')}</label>
              <input id="cName" name="cName" type="text" required autoComplete="name" />
              <label htmlFor="cMail">{t('f_mail')}</label>
              <input id="cMail" name="cMail" type="email" required autoComplete="email" />
              <label htmlFor="cMsg">{t('f_msg')}</label>
              <textarea id="cMsg" name="cMsg" required />
              {/* Honeypot gegen Spam-Bots — unsichtbar, Menschen lassen es leer */}
              <input className="form-botcheck" type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" autoComplete="off" />
              <div style={{ marginTop: 24 }}>
                <button className="btn btn-violett" type="submit" disabled={status === 'sending'}>{t('f_send')}</button>
              </div>
              <p className="form-note">
                {noteParts[0]}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                {noteParts[1] || ''}
              </p>
              <div
                className={`form-success${status ? ' show' : ''}${status === 'error' ? ' form-error' : ''}${status === 'sending' ? ' form-sending' : ''}`}
                role={status === 'error' ? 'alert' : 'status'} aria-live="polite"
              >
                {status && t(STATUS_TEXT[status])}
              </div>
            </form>
          </div>

          {/* Spenden: PayPal-Button + IBAN zum Kopieren */}
          <div className="donate-card">
              <h3>{t('don_title')}</h3>
              <p>{t('don_p')}</p>

              {/* PayPal donate button */}
              <a
                className="btn btn-orange"
                href={PAYPAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 16 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                </svg>
                Mit PayPal spenden
              </a>

              {/* IBAN bank transfer */}
              <div className="iban-box">
                <div className="label">Volksbildungswerk Klarenthal e.V.</div>
                <div className="val">
                  <span>Naspa</span>
                  <button
                    className="copy-iban-btn"
                    onClick={copyIban}
                    title="IBAN kopieren"
                    aria-label="IBAN in die Zwischenablage kopieren"
                  >
                    <span className="iban-number">{IBAN}</span>
                    <span className="copy-hint">{copied ? '✓ Kopiert' : 'Kopieren'}</span>
                  </button>
                  <span style={{ fontSize: '12.5px', color: '#A99BC9' }}>BIC: {BIC}</span>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', marginTop: 14, marginBottom: 0, color: '#A99BC9' }}>{t('don_note')}</p>
            </div>
          </div>
        </div>

      {/* Pressespiegel: hochgeladene + fest hinterlegte PDFs zum Download */}
      <div className="section tint">
        <div className="wrap">
          <div className="sec-eyebrow">{t('press_eyebrow')}</div>
          <div className="press-list press-list-full" data-version={version}>
            {/* Im Browser hochgeladene Mitteilungen zuerst, danach die fest hinterlegten */}
            {customPress.map((p, i) => (
              <a className="press-item" href={p.pdf} download={`${p.title}.pdf`} key={`c-${i}`}>
                <div className="press-icon"><Icon id="i-news" /></div>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.date} · PDF</p>
                </div>
              </a>
            ))}
            {SEED_PRESS.map((p) => (
              <a className="press-item" href={p.href} download key={p.id}>
                {p.img
                  ? <img className="press-thumb" src={p.img} alt="" loading="lazy" />
                  : <div className="press-icon"><Icon id="i-news" /></div>}
                <div>
                  <h3>{p.translate ? t(p.titleKey) : p.title}</h3>
                  <p>{p.meta}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
