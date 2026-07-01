import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import App from './App.jsx';
import './styles.css';

// Font-Awesome-CSS wird oben einmal eingebunden – Auto-Injektion abschalten,
// damit die Icons nicht kurz überdimensioniert aufblitzen.
config.autoAddCss = false;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
