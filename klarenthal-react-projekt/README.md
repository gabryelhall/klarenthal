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
- `src/storage.js` — Browser-Persistenz für das Admin-Tool
- `src/Icons.jsx` — SVG-Sprite (26 Vektor-Icons), keine Emojis
- `src/components/` — Header, Footer, Sprachauswahl, Admin-Modal
- `src/pages/` — die 7 Seiten

## Admin-Tool
Footer → „Admin · Veranstaltungen verwalten" → **PIN: 2026**
PIN ändern: `src/components/AdminModal.jsx`, Konstante `ADMIN_PIN`.
Hinweis: Speicherung erfolgt im Browser (localStorage) — für eine
zentrale Lösung für alle Besucher das Framer CMS bzw. ein Backend nutzen.

## Vor dem Launch ergänzen
- Echte Instagram/Facebook-URLs (`src/components/Footer.jsx`)
- IBAN + PayPal/Stripe-Button (`src/pages/InfoPage.jsx`)
- Impressum/Datenschutz juristisch prüfen lassen
