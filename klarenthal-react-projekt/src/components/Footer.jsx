import { useLang } from '../App.jsx';
import { Icon, LogoMark } from '../Icons.jsx';

export default function Footer({ onAdminClick, onPressClick, route }) {
  const { t } = useLang();
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <LogoMark className="footer-logo" />
            <div className="footer-brand">Klarenthal lebt<br /><span>Demokratie</span></div>
            <p style={{ fontSize: '14.5px', maxWidth: 300 }}>{t('foot_claim')}</p>
            {/* Soziale Profile + Kontakt-Mail */}
            <div className="social-row">
              <a href="https://www.instagram.com/klarenthal_lebt_demokratie/" target="https://www.instagram.com/klarenthal_lebt_demokratie/" rel="noopener noreferrer" aria-label="Instagram"><Icon id="i-insta" /></a>
              <a href="https://www.facebook.com/groups/179073358903993/" target="https://www.facebook.com/groups/179073358903993/" rel="noopener noreferrer" aria-label="Facebook"><Icon id="i-fb" /></a>
              <a href="mailto:Dein_Gesicht_fuer_Demokratie@web.de" aria-label="E-Mail"><Icon id="i-mail" /></a>
            </div>
          </div>
          <div>
            <h4>{t('foot_nav')}</h4>
            <a href="#/start">{t('nav_home')}</a>
            <a href="#/wer-wir-sind">{t('nav_who')}</a>
            <a href="#/ziele">{t('nav_goals')}</a>
            <a href="#/veranstaltungen">{t('nav_events')}</a>
            <a href="#/informationen">{t('nav_info')}</a>
          </div>
          <div>
            <h4>{t('foot_legal')}</h4>
            <a href="#/impressum">Impressum</a>
            <a href="#/datenschutz">{t('foot_privacy')}</a>
            <a href="mailto:Dein_Gesicht_fuer_Demokratie@web.de">Dein_Gesicht_fuer_Demokratie@web.de</a>
            {/* Dezente Admin-Einstiege — nur auf „Weitere Informationen“ sichtbar */}
            {route === 'informationen' && (
              <>
                <a href="#" className="footer-admin" onClick={(e) => { e.preventDefault(); onAdminClick(); }}>
                  Admin · Veranstaltungen verwalten
                </a>
                <a href="#" className="footer-admin" onClick={(e) => { e.preventDefault(); onPressClick(); }}>
                  Admin · Pressemitteilungen verwalten
                </a>
              </>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Klarenthal lebt Demokratie · Wiesbaden</span>
          <span>{t('foot_made')}</span>
        </div>
      </div>
    </footer>
  );
}
