/* Zentrale Datenschicht: Veranstaltungen, ausgeblendete Seed-Termine und
   Pressemitteilungen liegen in Supabase und sind damit für alle Besucher
   gleich. Die Seiten lesen synchron aus einem Snapshot im Speicher, den
   refreshData() beim Laden vom Server aktualisiert. Eine Kopie im
   localStorage dient als Cache, damit die Seite sofort rendert und auch
   dann funktioniert, wenn das Backend gerade nicht erreichbar ist. */

import { supabase } from './supabase.js';

const CACHE_KEY = 'kld_data_v2';
const BUCKET = 'media';

// Beim Prerendern (Node) gibt es keinen localStorage.
const hasBrowser = typeof localStorage !== 'undefined';

let data = { events: [], removed: [], press: [] };
if (hasBrowser) {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached) {
      data = {
        events: cached.events || [],
        removed: cached.removed || [],
        press: cached.press || [],
      };
    }
  } catch { /* defekter Cache — ignorieren, Seeds reichen als Fallback */ }
}

const saveCache = () => {
  if (!hasBrowser) return;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* voll/privat */ }
};

// Datenbank-Zeile → Objektform, die die Seiten erwarten (wie in events.js)
const rowToEvent = (r) => ({
  id: r.id,
  type: r.type,
  title: r.title,
  date: r.date_text,
  where: r.where_text,
  text: r.body,
  img: r.img || undefined,
  alt: r.alt || undefined,
  images: Array.isArray(r.images) && r.images.length ? r.images : undefined,
  custom: true,
});
const rowToPress = (r) => ({ id: r.id, title: r.title, date: r.date_text, pdf: r.pdf_url });

/* Synchrone Lese-Funktionen — gleiche Signatur wie früher, damit die
   Seiten unverändert daraus lesen können. */
export const loadCustom = () => data.events;
export const loadRemoved = () => data.removed;
export const loadPress = () => data.press;
export const seedId = (e) => 'seed:' + e.title;

/* Alles vom Server laden und Snapshot + Cache aktualisieren. Wirft bei
   Netz-/Backend-Fehlern — der Aufrufer entscheidet, was dann passiert. */
export async function refreshData() {
  const [ev, rm, pr] = await Promise.all([
    supabase.from('events').select().order('created_at', { ascending: false }),
    supabase.from('removed_seeds').select('id'),
    supabase.from('press').select().order('created_at', { ascending: false }),
  ]);
  const error = ev.error || rm.error || pr.error;
  if (error) throw error;
  data = {
    events: ev.data.map(rowToEvent),
    removed: rm.data.map((r) => r.id),
    press: pr.data.map(rowToPress),
  };
  saveCache();
}

// ——— Schreiboperationen — erlauben die Server-Regeln nur mit Admin-Login ———

export async function addEvent(ev) {
  const row = {
    type: ev.type,
    title: ev.title,
    date_text: ev.date,
    where_text: ev.where,
    body: ev.text,
    img: ev.img || null,
    alt: ev.alt || null,
    images: ev.images || [],
  };
  const { data: inserted, error } = await supabase.from('events').insert(row).select().single();
  if (error) throw error;
  data.events = [rowToEvent(inserted), ...data.events];
  saveCache();
}

// Öffentliche Bucket-URL → Pfad innerhalb des Buckets (fürs Aufräumen)
const urlToPath = (u) => {
  const p = typeof u === 'string' ? u.split(`/object/public/${BUCKET}/`)[1] : undefined;
  return p ? decodeURIComponent(p.split('?')[0]) : null;
};

export async function deleteEvent(id) {
  const ev = data.events.find((e) => e.id === id);
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  // Hochgeladene Bilder mit entfernen — Fehler dabei sind unkritisch.
  const paths = [ev?.img, ...(ev?.images || []).map((im) => im.src)].map(urlToPath).filter(Boolean);
  if (paths.length) await supabase.storage.from(BUCKET).remove([...new Set(paths)]);
  data.events = data.events.filter((e) => e.id !== id);
  saveCache();
}

export async function hideSeed(sid) {
  const { error } = await supabase.from('removed_seeds').insert({ id: sid });
  if (error) throw error;
  data.removed = [...data.removed, sid];
  saveCache();
}

async function uploadFile(path, file, contentType) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/* Ein im Browser verkleinertes Bild (JPEG-Data-URL) hochladen;
   gibt die öffentliche URL zurück. */
export async function uploadImage(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  return uploadFile(`events/${crypto.randomUUID()}.jpg`, blob, 'image/jpeg');
}

export async function addPress({ title, date, file }) {
  const url = await uploadFile(`press/${crypto.randomUUID()}.pdf`, file, 'application/pdf');
  const { data: inserted, error } = await supabase
    .from('press')
    .insert({ title, date_text: date, pdf_url: `${url}?download=` }) // ?download= erzwingt den Download statt Anzeige
    .select()
    .single();
  if (error) throw error;
  data.press = [rowToPress(inserted), ...data.press];
  saveCache();
}

export async function deletePress(item) {
  const { error } = await supabase.from('press').delete().eq('id', item.id);
  if (error) throw error;
  const path = urlToPath(item.pdf);
  if (path) await supabase.storage.from(BUCKET).remove([path]);
  data.press = data.press.filter((p) => p.id !== item.id);
  saveCache();
}
