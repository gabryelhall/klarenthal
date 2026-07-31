# Klarenthal lebt Demokratie — React-Projekt

## Schnellstart
```bash
npm install     # einmalig
npm run dev     # Entwicklung: http://localhost:5173
npm run build   # Produktion: erzeugt /dist
```
Der Ordner `/dist` ist bereits fertig gebaut und kann direkt auf jeden
Webspace oder zu Netlify/Vercel hochgeladen werden.

## Struktur
- `src/App.jsx` — Routing (Hash), Sprach-Context, Seitentitel
- `src/i18n.js` — alle 7 Sprachen (DE Default, AR + FA als RTL)
- `src/events.js` — fest eingebaute Veranstaltungen (Seed-Daten)
- `src/storage.js` — Datenschicht: Supabase + localStorage-Cache
- `src/supabase.js` — Supabase-Verbindung (URL, Publishable-Key, Admin-E-Mail)
- `src/Icons.jsx` — SVG-Sprite (26 Vektor-Icons), keine Emojis
- `src/components/` — Header, Footer, Sprachauswahl, Admin-Modal
- `src/pages/` — die 7 Seiten

## Admin-Tool
Footer → „Admin" (Veranstaltungen bzw. Presse) → **Admin-Passwort**.
Inhalte (Veranstaltungen, ausgeblendete Seed-Termine, Pressemitteilungen)
liegen zentral in Supabase und sind für alle Besucher gleich; Bilder und
PDFs landen im öffentlichen Bucket `media`.
- Einrichtung: `supabase/setup.sql` im SQL Editor des Supabase-Dashboards ausführen
- Verbindung + Admin-E-Mail: `src/supabase.js`
- Admin-Passwort ändern: Supabase-Dashboard → Authentication → Users

## Vor dem Launch ergänzen
- Echte Instagram/Facebook-URLs (`src/components/Footer.jsx`)
- IBAN + PayPal/Stripe-Button (`src/pages/InfoPage.jsx`)
- Impressum/Datenschutz juristisch prüfen lassen
