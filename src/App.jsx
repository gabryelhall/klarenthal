import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { I18N } from './i18n.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LangModal from './components/LangModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import PressModal from './components/PressModal.jsx';
import StartPage from './pages/StartPage.jsx';
import WhoPage from './pages/WhoPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import InfoPage from './pages/InfoPage.jsx';
import ImpressumPage from './pages/ImpressumPage.jsx';
import DatenschutzPage from './pages/DatenschutzPage.jsx';

const ROUTES = ['start', 'wer-wir-sind', 'ziele', 'veranstaltungen', 'informationen', 'impressum', 'datenschutz'];

const TITLES = {
  start: 'Klarenthal lebt Demokratie | Initiative in Wiesbaden',
  'wer-wir-sind': 'Wer wir sind | Klarenthal lebt Demokratie',
  ziele: 'Unsere Ziele | Klarenthal lebt Demokratie',
  veranstaltungen: 'Veranstaltungen & Projekte | Klarenthal lebt Demokratie',
  informationen: 'Kontakt & Informationen | Klarenthal lebt Demokratie',
  impressum: 'Impressum | Klarenthal lebt Demokratie',
  datenschutz: 'Datenschutzerklärung | Klarenthal lebt Demokratie',
};

const LangContext = createContext({ lang: 'de', t: (k) => k, setLang: () => {} });
export const useLang = () => useContext(LangContext);

function currentRoute() {
  // Beim Prerendering (Node, kein window) immer die Startseite ausliefern.
  if (typeof window === 'undefined') return 'start';
  const r = window.location.hash.replace('#/', '') || 'start';
  return ROUTES.includes(r) ? r : 'start';
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [lang, setLang] = useState('de');
  const [langOpen, setLangOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [pressOpen, setPressOpen] = useState(false);
  const [eventsVersion, setEventsVersion] = useState(0); // bump to refresh events after admin changes
  const [pressVersion, setPressVersion] = useState(0); // bump to refresh press releases after admin changes

  const t = useCallback((key) => I18N[lang][key] ?? I18N.de[key] ?? key, [lang]);

  useEffect(() => {
    const onHash = () => { setRoute(currentRoute()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => { document.title = TITLES[route]; }, [route]);

  useEffect(() => {
    const root = document.getElementById('html-root');
    root.setAttribute('lang', lang);
    root.setAttribute('dir', I18N[lang]._dir);
  }, [lang]);

  const pickLang = (l) => { setLang(l); setLangOpen(false); };

  return (
    <LangContext.Provider value={{ lang, t, setLang: pickLang }}>
      <a href="#main" className="skip-link">{t('skip')}</a>
      <Header route={route} onLangClick={() => setLangOpen(true)} />
      <main id="main">
        {route === 'start' && <StartPage />}
        {route === 'wer-wir-sind' && <WhoPage />}
        {route === 'ziele' && <GoalsPage />}
        {route === 'veranstaltungen' && <EventsPage version={eventsVersion} />}
        {route === 'informationen' && <InfoPage version={pressVersion} />}
        {route === 'impressum' && <ImpressumPage />}
        {route === 'datenschutz' && <DatenschutzPage />}
      </main>
      <Footer route={route} onAdminClick={() => setAdminOpen(true)} onPressClick={() => setPressOpen(true)} />
      <LangModal open={langOpen} onClose={() => setLangOpen(false)} />
      <AdminModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onChanged={() => setEventsVersion((v) => v + 1)}
      />
      <PressModal
        open={pressOpen}
        onClose={() => setPressOpen(false)}
        onChanged={() => setPressVersion((v) => v + 1)}
      />
    </LangContext.Provider>
  );
}
