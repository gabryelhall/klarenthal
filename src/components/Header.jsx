import { useState } from 'react';
import { useLang } from '../App.jsx';
import { Icon, LogoMark } from '../Icons.jsx';
import { LANG_LABELS } from '../i18n.js';

// Hauptnavigation — [Route-Slug, i18n-Schlüssel]. Reihenfolge = Reihenfolge im Menü.
const LINKS = [
  ['start', 'nav_home'],
  ['wer-wir-sind', 'nav_who'],
  ['ziele', 'nav_goals'],
  ['veranstaltungen', 'nav_events'],
  ['informationen', 'nav_info'],
];

export default function Header({ route, onLangClick }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false); // mobiles Menü auf/zu

  return (
    <header>
      <nav className="nav" aria-label="Hauptnavigation">
        <a className="logo" href="#/start" onClick={() => setOpen(false)}>
          <LogoMark className="logo-mark" />
          <div className="logo-text">Klarenthal lebt<br /><span>Demokratie</span></div>
        </a>
        <ul className={`nav-links${open ? ' open' : ''}`} id="primary-nav">
          {LINKS.map(([r, key]) => (
            <li key={r}>
              <a
                href={`#/${r}`}
                className={route === r ? 'active' : ''}
                aria-current={route === r ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </a>
            </li>
          ))}
          <li>
            <button className="lang-current" aria-haspopup="dialog" aria-label={`${t('lang_title')} — ${LANG_LABELS[lang]}`} onClick={onLangClick}>
              <Icon id="i-globe" /> <span>{LANG_LABELS[lang]}</span>
            </button>
          </li>
        </ul>
        {/* Instagram direkt oben in der Leiste — schneller Weg zum Profil */}
        <a
          className="nav-insta"
          href="https://www.instagram.com/klarenthal_lebt_demokratie/"
          target="_blank" rel="noopener noreferrer"
          aria-label="Instagram — klarenthal_lebt_demokratie"
          title="Instagram"
        >
          <Icon id="i-insta" />
        </a>
        {/* Hamburger nur mobil sichtbar (CSS) — klappt die Navigation auf */}
        <button
          className="burger"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}
