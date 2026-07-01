import { useLang } from '../App.jsx';
import PosterSlider from '../components/PosterSlider.jsx';

// „Demokratie“ in den sieben Seitensprachen — als anklickbare Sprachblasen im Hero.
const BUBBLES = [
  ['de', 'Demokratie', 'Deutsch', 'b1'],
  ['en', 'Democracy', 'English', 'b2'],
  ['uk', 'Демократія', 'Українська', 'b3'],
  ['ru', 'Демократия', 'Русский', 'b4'],
  ['ar', 'ديمقراطية', 'العربية', 'b5'],
  ['tr', 'Demokrasi', 'Türkçe', 'b6'],
  ['fa', 'دموکراسی', 'فارسی', 'b7'],
];

// Die vier Kernziele als nummerierte Blasen (Texte über i18n).
const GOALS = [
  ['01', 'goal1_t', 'goal1_p'],
  ['02', 'goal2_t', 'goal2_p'],
  ['03', 'goal3_t', 'goal3_p'],
  ['04', 'goal4_t', 'goal4_p'],
];

export default function StartPage() {
  const { t, setLang } = useLang();
  return (
    <section className="page visible">
      {/* Hero: Schlagzeile, Lede, CTAs und die Sprachblasen rund ums Wahlkreuz */}
      <div className="hero">
        <div className="wrap hero-inner">
          <div>
            <div className="eyebrow">
              {t('hero_eyebrow').split(' · ').map((part, i) => (
                <span key={i} className="eyebrow-line">{part}</span>
              ))}
            </div>
            <h1>
              <span className="line">{t('hero_l1')}</span>
              <span className="line">{t('hero_l2')}</span>
              <span className="line mark">{t('hero_l3')}</span>
            </h1>
            <p className="lede">{t('hero_lede')}</p>
            <div className="cta-row">
              <a className="btn btn-orange" href="#/informationen">{t('cta_join')}</a>
              <a className="btn btn-ghost" href="#/wer-wir-sind">{t('cta_learn')}</a>
            </div>
          </div>
          <div className="bubble-cloud" role="group" aria-label="Sprache wählen — Demokratie in sieben Sprachen">
            <div className="hero-slogan">Weil <strong>wir</strong> zählen.</div>
            {BUBBLES.map(([lang, word, name, cls]) => (
              <button key={lang} className={`bubble ${cls}`} onClick={() => setLang(lang)}>
                <span className="word">{word}</span>
                <span className="lang">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Endlos laufendes Plakat-Band (Grundgesetz- & Demokratie-Rechte) */}
      <PosterSlider />

      {/* Leitzitat */}
      <div className="section quote-section">
        <div className="wrap">
          <blockquote className="quote">
            <p className="quote-text">{t('quote_text')}</p>
            <footer className="quote-src">{t('quote_src')}</footer>
          </blockquote>
        </div>
      </div>

      {/* Bildergalerie „Impressionen“ — feste Auswahl, breite Kacheln per imp-wide */}
      <div className="section">
        <div className="wrap">
          <div className="sec-eyebrow">{t('gallery_eyebrow')}</div>
          <h2 className="sec-title">{t('gallery_title')}</h2>
          <div className="impressions">
            <figure className="imp-wide"><img src="assets/people-candles.jpg" width="1500" height="1125" alt="Viele Menschen bei einer abendlichen Aktion vor den Klarenthaler Wohntürmen" loading="lazy" /></figure>
            <figure><img src="assets/kicken-field.jpg" width="1300" height="975" alt="Menschen beim „Kicken für die Demokratie“ auf dem Sportplatz" loading="lazy" /></figure>
            <figure><img src="assets/people-flags.jpg" width="1500" height="2046" alt="Menschenmenge mit Fahnen bei einem Demokratie-Spaziergang" loading="lazy" /></figure>
            <figure><img src="assets/audience-students.jpg" width="1300" height="975" alt="Großes Publikum bei einer Veranstaltung der Demokratiewoche" loading="lazy" /></figure>
            <figure><img src="assets/reception.jpg" width="1280" height="960" alt="Begegnung und Austausch bei einem Empfang im Stadtteil" loading="lazy" /></figure>
            <figure className="imp-wide"><img src="assets/people-circle.jpg" width="1080" height="1350" alt="Großer Kreis vieler Menschen bei einer Mitmach-Aktion im Freien" loading="lazy" /></figure>
          </div>
        </div>
      </div>

      {/* „Was ist Klarenthal lebt Demokratie?“ — Kurzvorstellung mit Ziel-Blasen */}
      <div className="section tint">
        <div className="wrap">
          <div className="sec-eyebrow">{t('home_what_eyebrow')}</div>
          <h2 className="sec-title">{t('home_what_title')}</h2>
          <p className="sec-sub">{t('home_what_sub')}</p>
          <div className="goal-bubbles">
            {GOALS.map(([num, tk, pk], i) => (
              <div className={`goal-bubble gb${i + 1}`} key={num}>
                <span className="gb-num">{num}</span>
                <h3>{t(tk)}</h3>
                <p>{t(pk)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dunkler Mitmach-Aufruf */}
      <div className="section dark">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="sec-title" style={{ margin: '0 auto 18px' }}>{t('home_cta_title')}</h2>
          <p className="sec-sub" style={{ margin: '0 auto 32px' }}>{t('home_cta_sub')}</p>
          <a className="btn btn-orange" href="#/informationen">{t('cta_contact')}</a>
        </div>
      </div>

      {/* Dank an Geldgeber & Kooperationspartner — Logo-Reihe */}
      <div className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="wrap">
          <div className="sec-eyebrow">{t('thanks_eyebrow')}</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{t('thanks_title')}</h2>
          <div className="partner-row" style={{ marginTop: 36 }}>
            <figure className="partner">
              <div className="partner-logo"><img src="assets/partner-hessen.svg" alt="Wappen des Landes Hessen" loading="lazy" /></div>
              <figcaption>Land Hessen</figcaption>
            </figure>
            <figure className="partner">
              <div className="partner-logo"><img src="assets/partner-kiez.svg" alt="KiEZ – KinderElternZentren" loading="lazy" /></div>
              <figcaption>KiEZ – KinderElternZentren</figcaption>
            </figure>
            <figure className="partner">
              <div className="partner-logo"><img src="assets/partner-wsf.svg" alt="Wiesbaden Stiftung Freunde e.V." loading="lazy" /></div>
              <figcaption>Wiesbaden Stiftung Freunde e.V.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
