/* Schmale localStorage-Schicht für die Admin-Funktionen. Alle Zugriffe sind
   gekapselt, damit ein voller Speicher oder der private Modus (wo localStorage
   wirft) die Seite nicht abstürzen lässt. */

const KEYS = {
  customEvents: 'kld_custom_events',   // selbst angelegte Veranstaltungen
  removedEvents: 'kld_removed_events', // ausgeblendete Seed-Veranstaltungen
  customPress: 'kld_custom_press',     // selbst hochgeladene Pressemitteilungen
};

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
};

// Gibt true zurück, wenn gespeichert werden konnte — sonst false (Quota/privat).
const write = (key, list) => {
  try { localStorage.setItem(key, JSON.stringify(list)); return true; } catch { return false; }
};

// Veranstaltungen
export const loadCustom = () => read(KEYS.customEvents);
export const saveCustom = (list) => write(KEYS.customEvents, list);
export const loadRemoved = () => read(KEYS.removedEvents);
export const saveRemoved = (list) => write(KEYS.removedEvents, list);
export const seedId = (e) => 'seed:' + e.title;

// Pressemitteilungen (Titel + PDF als Data-URL)
export const loadPress = () => read(KEYS.customPress);
export const savePress = (list) => write(KEYS.customPress, list);
