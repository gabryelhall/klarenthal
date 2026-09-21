/* Zuordnung Zukünftiges / Vergangenes.
   Standard: automatisch nach Datum — liegt das (End-)Datum vor heute, landet
   die Veranstaltung unter „Vergangenes“, sonst unter „Zukünftiges“. Das
   Datum ist Freitext („21.09.2026“, „15.–21.08.2026“, „März 2026“,
   „Herbst 2026“ …); erkannt wird jeweils das letzte Datum im Text.
   Im Admin kann der Bereich pro Veranstaltung auch fest gewählt werden:
   type = 'pin-future' | 'pin-past'. Alle anderen Werte ('auto', und die
   älteren 'future' / 'past') bedeuten „automatisch“; nur wenn das Datum
   nicht erkannt wird, entscheidet der gespeicherte Wert (Standard: zukünftig). */

export const PIN_FUTURE = 'pin-future';
export const PIN_PAST = 'pin-past';
export const AUTO = 'auto';

const MONTHS = [
  ['jan', 1], ['feb', 2], ['mär', 3], ['mar', 3], ['maer', 3], ['apr', 4], ['mai', 5],
  ['jun', 6], ['jul', 7], ['aug', 8], ['sep', 9], ['okt', 10], ['nov', 11], ['dez', 12],
];
// Kein Lookbehind — ältere Safari-Versionen (< 16.4) können das nicht.
const MONTH_RE = '(?:^|[^a-zäöüß])(januar|jan|februar|feb|märz|maerz|mär|mar|april|apr|mai|juni|jun|juli|jul|'
  + 'august|aug|september|sept|sep|oktober|okt|november|nov|dezember|dez)\\.?(?![a-zäöüß])';

const monthNum = (s) => MONTHS.find(([p]) => s.toLowerCase().startsWith(p))?.[1];
const endOfMonth = (y, m) => new Date(y, m, 0); // Tag 0 des Folgemonats = letzter Tag
const fullYear = (y) => (y.length === 2 ? 2000 + Number(y) : Number(y));
const lastMatch = (re, s) => { let m, last = null; while ((m = re.exec(s))) last = m; return last; };

/* Letzter Tag, auf den sich die Datumsangabe bezieht — oder null. */
export function parseEventDate(text) {
  const s = String(text || '').toLowerCase();

  // 21.09.2026 · 21.9.26 · Bereich „15.–21.08.2026“ → letztes Datum
  let m = lastMatch(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4}|\d{2})(?!\d)/g, s);
  if (m) return new Date(fullYear(m[3]), Number(m[2]) - 1, Number(m[1]));

  // 21. September 2026
  m = lastMatch(new RegExp(`(\\d{1,2})\\.?\\s*${MONTH_RE}\\s*(\\d{4})`, 'g'), s);
  if (m) return new Date(Number(m[3]), monthNum(m[2]) - 1, Number(m[1]));

  // September 2026 · Sept. 2025
  m = lastMatch(new RegExp(`${MONTH_RE}\\s*(\\d{4})`, 'g'), s);
  if (m) return endOfMonth(Number(m[2]), monthNum(m[1]));

  // Jahreszeiten / grobe Angaben: Ende des gemeinten Zeitraums
  m = lastMatch(/(frühling|frühjahr|sommer|herbst|winter|anfang|mitte|ende)\s*(\d{4})/g, s);
  if (m) {
    const y = Number(m[2]);
    const endMonth = { frühling: 5, frühjahr: 5, sommer: 8, herbst: 11, anfang: 2, mitte: 8, ende: 12 }[m[1]];
    return m[1] === 'winter' ? endOfMonth(y + 1, 2) : endOfMonth(y, endMonth);
  }

  // Nur eine Jahreszahl
  m = lastMatch(/(?:^|\D)(20\d{2})(?!\d)/g, s);
  if (m) return new Date(Number(m[1]), 11, 31);

  return null;
}

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

/* 'future' | 'past' — in welchem Tab die Veranstaltung erscheint. */
export function sectionOf(e, today = startOfToday()) {
  if (e.type === PIN_FUTURE) return 'future';
  if (e.type === PIN_PAST) return 'past';
  const d = parseEventDate(e.date);
  if (d) return d < today ? 'past' : 'future';
  return e.type === 'past' ? 'past' : 'future';
}

export const isPinned = (e) => e.type === PIN_FUTURE || e.type === PIN_PAST;

/* Sortierung innerhalb eines Tabs: Zukünftiges — nächster Termin zuerst,
   Vergangenes — neuester zuerst. Ohne erkennbares Datum jeweils ans Ende. */
export function sortByDate(list, section = 'future') {
  const dir = section === 'past' ? -1 : 1;
  const key = (e) => parseEventDate(e.date)?.getTime() ?? null;
  return [...list].sort((a, b) => {
    const ka = key(a), kb = key(b);
    if (ka === kb) return 0;
    if (ka === null) return 1;
    if (kb === null) return -1;
    return ka < kb ? -dir : dir;
  });
}
