import { useLang } from '../App.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot, faHandshakeAngle, faCheckToSlot, faLightbulb, faSeedling,
  faPeopleGroup, faScaleBalanced, faComments, faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';

// Überzeugungen als nummerierte Timeline — je Eintrag ein Icon.
const CONV = [
  ['01', faLocationDot, 'conv1_t', 'conv1_p'],
  ['02', faHandshakeAngle, 'conv2_t', 'conv2_p'],
  ['03', faCheckToSlot, 'conv3_t', 'conv3_p'],
  ['04', faLightbulb, 'conv4_t', 'conv4_p'],
  ['05', faSeedling, 'conv5_t', 'conv5_p'],
];

// Ziele als Icon-Karten.
const GOALS = [
  [faPeopleGroup, 'goal1_t', 'goal1_p'],
  [faScaleBalanced, 'goal2_t', 'goal2_p'],
  [faComments, 'goal3_t', 'goal3_p'],
  [faShieldHalved, 'goal4_t', 'goal4_p'],
];

export default function GoalsPage() {
  const { t } = useLang();
  return (
    <section className="page visible">
      <div className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{t('goals_eyebrow')}</p>
          <h1>{t('goals_title')}</h1>
        </div>
      </div>

      {/* Unsere Überzeugungen — Timeline mit Icons und begleitendem Bild */}
      <section className="section" aria-labelledby="beliefs-title">
        <div className="wrap beliefs-layout">
          <div className="beliefs-main">
            <p className="sec-eyebrow">{t('stand_eyebrow')}</p>
            <h2 className="sec-title" id="beliefs-title">{t('stand_title')}</h2>
            <ol className="beliefs">
              {CONV.map(([num, icon, tk, pk]) => (
                <li className="belief" key={num}>
                  <span className="belief-icon" aria-hidden="true"><FontAwesomeIcon icon={icon} /></span>
                  <div className="belief-text">
                    <span className="belief-num">{num}</span>
                    <h3>{t(tk)}</h3>
                    <p>{t(pk)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="beliefs-aside">
            <img
              src="assets/people-circle.jpg"
              width="1080"
              height="1350"
              alt="Viele Menschen bilden bei einer Mitmach-Aktion in Klarenthal einen großen Kreis"
              loading="lazy"
            />
          </aside>
        </div>
      </section>

      {/* Was wir wollen — Icon-Karten */}
      <section className="section tint" aria-labelledby="want-title">
        <div className="wrap">
          <p className="sec-eyebrow">{t('want_eyebrow')}</p>
          <h2 className="sec-title" id="want-title">{t('want_title')}</h2>
          <p className="sec-sub">{t('want_sub')}</p>
          <ul className="want-grid">
            {GOALS.map(([icon, tk, pk]) => (
              <li className="want-card" key={tk}>
                <span className="want-icon" aria-hidden="true"><FontAwesomeIcon icon={icon} /></span>
                <h3>{t(tk)}</h3>
                <p>{t(pk)}</p>
              </li>
            ))}
          </ul>
          <div className="goals-cta">
            <a className="btn btn-orange" href="#/informationen">{t('cta_join')}</a>
          </div>
        </div>
      </section>
    </section>
  );
}
