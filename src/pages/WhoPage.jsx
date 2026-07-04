import { useLang } from '../App.jsx';
import { Icon } from '../Icons.jsx';

// Unsere fünf Werte — je [Icon-ID, Farbklasse, i18n-Schlüssel].
const VALUES = [
  ['i-dove', 'vi-1', 'v1'],
  ['i-scales', 'vi-2', 'v2'],
  ['i-diversity', 'vi-3', 'v3'],
  ['i-speech', 'vi-4', 'v4'],
  ['i-door', 'vi-5', 'v5'],
];

// Akteure am Runden Tisch — [Icon, Titel-Schlüssel, Text-Schlüssel, fester Name].
// Wo ein fester Name steht (KiEZ, 1. SC Klarenthal), wird der Titel-Schlüssel ignoriert.
const MEMBERS = [
  ['i-gov', 'm1_t', 'm1_p', null],
  ['i-church', 'm2_t', 'm2_p', null],
  ['i-ballot', 'm3_t', 'm3_p', null],
  ['i-book', 'm4_t', 'm4_p', null],
  ['i-home', 'm5_t', 'm5_p', null],
  ['i-kids', null, 'm6_p', 'KiEZ'],
  ['i-ball', null, 'm7_p', '1. SC Klarenthal'],
  ['i-school', 'm9_t', 'm9_p', null],
  ['i-hands', 'm8_t', 'm8_p', null],
];

export default function WhoPage() {
  const { t } = useLang();

  // Die einleitende Frage aus dem Fließtext als Überschrift herauslösen
  // (funktioniert in jeder Sprache, auch mit arabischem Fragezeichen ؟).
  const p1 = t('who_p1');
  const m = p1.match(/^([\s\S]*?[?؟])\s*([\s\S]*)$/);
  const question = m ? m[1] : p1;
  const p1rest = m ? m[2] : '';

  return (
    <section className="page visible">
      {/* Seitenkopf */}
      <div className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t('who_eyebrow')}</div>
          <h1>{t('who_title')}</h1>
        </div>
      </div>

      {/* Haltung: „Wofür wir stehen“ — die fünf Werte mit Icon */}
      <div className="section">
        <div className="wrap">
          <div className="sec-eyebrow">{t('who_stand_eyebrow')}</div>
          <h2 className="sec-title">{t('who_stand_title')}</h2>
          <div className="values-list">
            {VALUES.map(([icon, vi, key]) => (
              <div className="value" key={key}>
                <div className={`value-icon ${vi}`}><Icon id={icon} /></div>
                <p>{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Entstehungsgeschichte: einleitende Frage als Überschrift, Text + Bild zweispaltig */}
      <div className="section tint">
        <div className="wrap story-cols">
          <div className="story-text">
            <div className="sec-eyebrow">{t('who_story_eyebrow')}</div>
            <h2 className="sec-title">{question}</h2>
            {p1rest && <p>{p1rest}</p>}
            <p>{t('who_p2')}</p>
            <p>{t('who_p3')}</p>
          </div>
          <div className="story-img">
            <img src="assets/event3.jpg" width="1107" height="1008" alt="Zwei Mitglieder der Initiative in T-Shirts mit der Aufschrift „Weil wir zählen“" loading="lazy" />
          </div>
        </div>
      </div>

      {/* Mitglieder: Gruppenfoto + Raster der Akteure */}
      <div className="section">
        <div className="wrap">
          <div className="sec-eyebrow">{t('members_eyebrow')}</div>
          <h2 className="sec-title">{t('members_title')}</h2>
          <p className="sec-sub">{t('members_sub')}</p>
          <figure className="who-team">
            <img src="assets/100004598.jpeg" width="2048" height="1533" alt="Der Runde Tisch der Initiative „Klarenthal lebt Demokratie“ bei einem Treffen" loading="lazy" />
          </figure>
          <div className="members-grid">
            {MEMBERS.map(([icon, tk, pk, fixed], i) => (
              <div className="member" key={i}>
                <div className="avatar"><Icon id={icon} /></div>
                <h3>{fixed ?? t(tk)}</h3>
                <p>{t(pk)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
