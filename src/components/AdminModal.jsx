import { useState } from 'react';
import { Icon } from '../Icons.jsx';
import { SEED_EVENTS } from '../events.js';
import { loadCustom, loadRemoved, addEvent, deleteEvent, hideSeed, uploadImage, seedId, updateEventType } from '../storage.js';
import { sectionOf, sortByDate, isPinned, parseEventDate, AUTO, PIN_FUTURE, PIN_PAST } from '../eventSection.js';
import Modal from './Modal.jsx';
import LoginGate from './LoginGate.jsx';
import FileDrop from './FileDrop.jsx';

/* Längste Bildkante in Pixel — verkleinert große Uploads vor dem Hochladen. */
const MAX_EDGE = 1600;

const SECTION_LABEL = { future: 'Zukünftiges', past: 'Vergangenes' };

/* Auswahl, in welchem Tab eine Veranstaltung erscheint. „Automatisch“ zeigt
   gleich mit an, wohin das Datum sie gerade einsortiert. */
function SectionSelect({ id, date, value, onChange, disabled, label }) {
  const autoTarget = SECTION_LABEL[sectionOf({ type: AUTO, date })];
  return (
    <select id={id} className="section-select" value={value} disabled={disabled}
      onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value={AUTO}>Automatisch nach Datum ({autoTarget})</option>
      <option value={PIN_FUTURE}>Immer unter „Zukünftiges“</option>
      <option value={PIN_PAST}>Immer unter „Vergangenes“</option>
    </select>
  );
}

export default function AdminModal({ open, onClose, onChanged }) {
  const [unlocked, setUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // Die Listen leben im Daten-Snapshot (storage.js), nicht im State — dieser
  // Zähler erzwingt nach jeder Änderung ein Neu-Rendern (hier und auf der
  // Veranstaltungsseite).
  const [, force] = useState(0);
  const refresh = () => { force((n) => n + 1); onChanged(); };

  // Bild-Upload: mehrere Bilder möglich. Jedes wird clientseitig verkleinert
  // und als JPEG-Data-URL in einer Galerie-Liste abgelegt.
  const [imgList, setImgList] = useState([]);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgError, setImgError] = useState('');

  // Bereich im Formular (Standard: automatisch nach Datum) und wohin die
  // zuletzt gespeicherte Veranstaltung einsortiert wurde (für die Meldung).
  const [formDate, setFormDate] = useState('');
  const [formType, setFormType] = useState(AUTO);
  const [savedSection, setSavedSection] = useState('future');
  const [busyRow, setBusyRow] = useState(null); // id der Zeile, deren Bereich gerade gespeichert wird

  // Eine Bilddatei einlesen und auf die längste Kante herunterskalieren.
  // Gibt ein Promise mit der JPEG-Data-URL zurück.
  const readAndResize = (file) => new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) { reject(new Error('kein Bild')); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        let w = im.width, h = im.height;
        if (w > h && w > MAX_EDGE) { h = Math.round((h * MAX_EDGE) / w); w = MAX_EDGE; }
        else if (h >= w && h > MAX_EDGE) { w = Math.round((w * MAX_EDGE) / h); h = MAX_EDGE; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // weißer Grund statt Transparenz
        ctx.drawImage(im, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      im.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
      im.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });

  // Mehrere Dateien nacheinander verarbeiten und an die Galerie anhängen.
  const processFiles = async (files) => {
    const pics = Array.from(files || []);
    const images = pics.filter((f) => f.type.startsWith('image/'));
    if (!images.length) { setImgError('Bitte Bilddateien (JPG oder PNG) auswählen.'); return; }
    setImgError(''); setImgBusy(true);
    const done = [];
    for (const file of images) {
      try { done.push(await readAndResize(file)); }
      catch { setImgError('Ein Bild konnte nicht gelesen werden und wurde übersprungen.'); }
    }
    setImgList((list) => [...list, ...done]);
    if (images.length < pics.length) setImgError('Nicht-Bild-Dateien wurden übersprungen.');
    setImgBusy(false);
  };

  const removeImg = (idx) => setImgList((list) => list.filter((_, i) => i !== idx));

  if (!open) return null;

  // Verwaltbare Liste: alle eigenen Veranstaltungen plus die noch nicht
  // ausgeblendeten zukünftigen Seed-Termine — getrennt nach Bereich und
  // sortiert wie auf der Veranstaltungsseite.
  const rows = [
    ...loadCustom().map((e) => ({ title: e.title, date: e.date, type: e.type, custom: true, id: e.id })),
    ...SEED_EVENTS
      .filter((e) => sectionOf(e) === 'future' && !loadRemoved().includes(seedId(e)))
      .map((e) => ({ title: e.title, date: e.date, type: e.type, custom: false, sid: seedId(e) })),
  ];
  const groups = ['future', 'past'].map((sec) => ({
    sec,
    rows: sortByDate(rows.filter((r) => sectionOf(r) === sec), sec),
  }));

  const changeSection = async (r, type) => {
    setBusyRow(r.id);
    try {
      await updateEventType(r.id, type);
      refresh();
    } catch {
      window.alert('Ändern fehlgeschlagen — bitte Internetverbindung prüfen und erneut versuchen.');
    } finally {
      setBusyRow(null);
    }
  };

  const removeRow = async (r) => {
    if (!window.confirm(`„${r.title}“ wirklich entfernen?`)) return;
    try {
      if (r.custom) {
        await deleteEvent(r.id);
      } else {
        // Seed-Termine löschen wir nicht, wir merken sie nur als ausgeblendet.
        await hideSeed(r.sid);
      }
      refresh();
    } catch {
      window.alert('Entfernen fehlgeschlagen — bitte Internetverbindung prüfen und erneut versuchen.');
    }
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (saving) return;
    const f = e.target;
    const ev = {
      type: formType,
      title: f.aTitle.value.trim(),
      date: f.aDate.value.trim(),
      where: f.aWhere.value.trim() || 'Klarenthal',
      text: f.aText.value.trim(),
      custom: true,
    };
    setSaving(true);
    setImgError('');
    try {
      // Bilder erst jetzt hochladen; gespeichert werden nur ihre URLs.
      // Erstes Bild ist das Kachelbild, alle Bilder landen in der Detail-Galerie.
      if (imgList.length) {
        const urls = [];
        for (const dataUrl of imgList) urls.push(await uploadImage(dataUrl));
        ev.img = urls[0];
        ev.alt = ev.title;
        ev.images = urls.map((src, i) => ({ src, alt: `${ev.title} — Bild ${i + 1}` }));
      }
      await addEvent(ev);
      f.reset();
      setSavedSection(sectionOf(ev));
      setFormDate('');
      setFormType(AUTO);
      setImgList([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      refresh();
    } catch {
      setImgError('Speichern fehlgeschlagen — bitte Internetverbindung prüfen und erneut versuchen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal label="Veranstaltungen verwalten" onClose={onClose}>
      {!unlocked ? (
        <LoginGate
          prompt="Bitte Admin-Passwort eingeben, um Veranstaltungen zu verwalten."
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <div>
          <h3><Icon id="i-cal" /> Veranstaltungen verwalten</h3>
          <p className="admin-sub">
            Veranstaltungen hinzufügen, verschieben oder entfernen. Sie landen automatisch
            nach ihrem Datum unter „Zukünftiges“ oder „Vergangenes“ und wandern nach dem
            Termin von selbst weiter. Änderungen sind sofort für alle Besucher sichtbar.
          </p>

          {/* Bestehende Veranstaltungen, nach Bereich gruppiert */}
          {groups.map(({ sec, rows: list }) => (
            <div className="admin-list" key={sec}>
              <h4 className="admin-group">{SECTION_LABEL[sec]}</h4>
              {list.length === 0 && (
                <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                  {sec === 'future'
                    ? 'Keine zukünftigen Veranstaltungen vorhanden.'
                    : 'Noch keine selbst angelegten vergangenen Veranstaltungen.'}
                </p>
              )}
              {list.map((r) => (
                <div className="admin-row" key={r.custom ? r.id : r.sid}>
                  <div className="meta">
                    <strong>{r.title}</strong>
                    <span>{r.date}</span>
                    {r.custom ? (
                      <SectionSelect
                        date={r.date}
                        label={`Bereich für „${r.title}“`}
                        value={isPinned(r) ? r.type : AUTO}
                        disabled={busyRow === r.id}
                        onChange={(type) => changeSection(r, type)}
                      />
                    ) : (
                      <span className="seed-note">Fest eingebaut · wandert automatisch nach dem Datum</span>
                    )}
                  </div>
                  <button className="btn-del" aria-label="Veranstaltung löschen" title="Löschen" onClick={() => removeRow(r)}>
                    <Icon id="i-trash" />
                  </button>
                </div>
              ))}
            </div>
          ))}

          {/* Formular für eine neue Veranstaltung */}
          <div className="admin-form">
            <h4><Icon id="i-plus" /> Neue Veranstaltung anlegen</h4>
            <form onSubmit={onAdd}>
              <label htmlFor="aTitle">Titel *</label>
              <input id="aTitle" name="aTitle" required maxLength={120} placeholder="z.B. 2. Klarenthaler Demokratiewoche" />
              <label htmlFor="aDate">Datum *</label>
              <input
                id="aDate" name="aDate" required maxLength={40} placeholder="z.B. 21.09.2026 oder Herbst 2026"
                value={formDate} onChange={(e) => setFormDate(e.target.value)}
              />
              <label htmlFor="aSection">Bereich</label>
              <SectionSelect id="aSection" date={formDate} value={formType} onChange={setFormType} />
              {formType === AUTO && formDate.trim() && !parseEventDate(formDate) && (
                <p className="img-status">
                  Datum nicht erkannt — die Veranstaltung erscheint unter „Zukünftiges“.
                  Für automatisches Einsortieren z.B. „21.09.2026“ oder „September 2026“ eingeben
                  oder den Bereich fest wählen.
                </p>
              )}
              <label htmlFor="aWhere">Ort</label>
              <input id="aWhere" name="aWhere" maxLength={120} placeholder="z.B. Stadtteilzentrum Klarenthal" />
              <label htmlFor="aText">Beschreibung *</label>
              <textarea id="aText" name="aText" required maxLength={600} placeholder="Worum geht es bei der Veranstaltung?" />

              <label>Bilder (optional, mehrere möglich)</label>
              {/* Galerie der bereits gewählten Bilder — das erste ist das Kachelbild */}
              {imgList.length > 0 && (
                <div className="img-gallery">
                  {imgList.map((src, i) => (
                    <div className="img-thumb" key={i}>
                      <img src={src} alt={`Vorschau ${i + 1}`} />
                      {i === 0 && <span className="img-badge">Kachelbild</span>}
                      <button
                        type="button" className="img-thumb-del"
                        aria-label={`Bild ${i + 1} entfernen`} title="Entfernen"
                        onClick={() => removeImg(i)}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
              <FileDrop
                accept="image/*"
                multiple
                label="Bilder hochladen — hierher ziehen oder klicken zum Auswählen"
                hasFile={imgList.length > 0}
                onFiles={processFiles}
              >
                <div className="img-hint">
                  <Icon id="i-image" />
                  <span>{imgList.length ? 'Weitere Bilder hinzufügen' : 'Bilder hierher ziehen oder klicken zum Auswählen'}</span>
                  <small>JPG oder PNG · mehrere möglich · werden automatisch verkleinert</small>
                </div>
              </FileDrop>
              {imgBusy && <p className="img-status">Bilder werden verarbeitet …</p>}
              {imgError && <p className="img-status err">{imgError}</p>}

              <div style={{ marginTop: 18 }}>
                <button
                  className="btn btn-violett" type="submit" disabled={saving || imgBusy}
                  style={{ fontSize: '14.5px', padding: '12px 24px' }}
                >
                  {saving ? 'Wird gespeichert …' : 'Veranstaltung speichern'}
                </button>
              </div>
              <div className={`admin-saved${saved ? ' show' : ''}`} role="status" aria-live="polite">
                Gespeichert! Die Veranstaltung ist jetzt unter „{SECTION_LABEL[savedSection]}“ sichtbar.
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
