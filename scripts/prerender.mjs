/* Läuft nach `vite build` + SSR-Build: rendert die Startseite zu statischem
   HTML und setzt es in den leeren <div id="root"></div> der gebauten
   dist/index.html ein. Der Client-Code (createRoot) ersetzt diesen Inhalt beim
   Laden nahtlos – Crawler ohne JavaScript behalten ihn dagegen. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { render } from '../dist-ssr/entry-server.js';

const here = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(here, '..', 'dist', 'index.html');

const html = readFileSync(indexPath, 'utf8');
const appHtml = render();

const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  console.error(`prerender: Marker "${marker}" nicht in dist/index.html gefunden.`);
  process.exit(1);
}

const out = html.replace(marker, `<div id="root">${appHtml}</div>`);
writeFileSync(indexPath, out);
console.log(`prerender: ${appHtml.length} Zeichen statisches HTML in dist/index.html eingesetzt.`);
