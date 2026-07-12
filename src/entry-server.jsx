/* Server-Einstieg fürs Prerendering: rendert die App (Startseite, Deutsch)
   zu statischem HTML, das beim Build in dist/index.html eingesetzt wird.
   So sehen Suchmaschinen und Social-Crawler die Inhalte sofort – ohne JS. */
import { renderToStaticMarkup } from 'react-dom/server';
import { config } from '@fortawesome/fontawesome-svg-core';
import App from './App.jsx';

// Font-Awesome darf im Node-Build kein CSS ins (nicht vorhandene) DOM injizieren.
config.autoAddCss = false;

export function render() {
  return renderToStaticMarkup(<App />);
}
