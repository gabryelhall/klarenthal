import { useState } from 'react';
import { Icon } from '../Icons.jsx';
import { SEED_EVENTS } from '../events.js';
import { loadCustom, loadRemoved, saveCustom, saveRemoved, seedId } from '../storage.js';
import Modal from './Modal.jsx';
import PinGate from './PinGate.jsx';
import FileDrop from './FileDrop.jsx';

/* PIN ändern: hier anpassen (gleiche PIN wie der Presse-Admin). */
const ADMIN_PIN = '2420';
/* Längste Bildkante in Pixel — verkleinert große Uploads, damit sie nicht
   die localStorage-Quota sprengen. */
const MAX_EDGE = 1000;

export default function AdminModal({ open, onClose, onChanged }) {
  const [unlocked, setUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  // Die Listen leben in localStorage, nicht im State — dieser Zähler erzwingt
  // nach jeder Änderung ein Neu-Rendern (hier und auf der Veranstaltungsseite).
  const [, force] = useState(0);
  const refresh = () => { force((n) => n + 1); onChanged(); };

  // Bild-Upload: wird clientseitig verkleinert und als JPEG-Data-URL abgelegt.
  const [imgData, setImgData] = useState(null);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgError, setImgError] = useState('');

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImgError('Bitte eine Bilddatei (JPG oder PNG) auswählen.'); return; }
    setImgError(''); setImgBusy(true);

    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => {
        // Auf die längste Kante herunterskalieren, Seitenverhältnis behalten.
        let w = im.width, h = im.height;
        if (w > h && w > MAX_EDGE) { h = Math.round((h * MAX_EDGE) / w); w = MAX_EDGE; }
        else if (h >= w && h > MAX_EDGE) { w = Math.round((w * MAX_EDGE) / h); h = MAX_EDGE; }

        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // weißer Grund statt Transparenz
        ctx.drawImage(im, 0, 0, w, h);

        setImgData(canvas.toDataURL('image/jpeg', 0.82));
        setImgBusy(false);
      };
      im.onerror = () => { setImgBusy(false); setImgError('Bild konnte nicht gelesen werden.'); };
      im.src = reader.result;
    };
    reader.onerror = () => { setImgBusy(false); setImgError('Datei konnte nicht gelesen werden.'); };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  // Verwaltbare Liste: eigene Veranstaltungen zuerst, dann die noch nicht
  // ausgeblendeten zukünftigen Seed-Termine.
  const rows = [
    ...loadCustom().map((e, i) => ({ title: e.title, date: e.date, custom: true, idx: i })),
    ...SEED_EVENTS
      .filter((e) => e.type === 'future' && !loadRemoved().includes(seedId(e)))
      .map((e) => ({ title: e.title, date: e.date, custom: false, sid: seedId(e) })),
  ];

  const removeRow = (r) => {
    if (!window.confirm(`„${r.title}“ wirklich entfernen?`)) return;
    if (r.custom) {
      const list = loadCustom();
      list.splice(r.idx, 1);
      saveCustom(list);
    } else {
      // Seed-Termine löschen wir nicht, wir merken sie uns nur als ausgeblendet.
      saveRemoved([...loadRemoved(), r.sid]);
    }
    refresh();
  };

  const onAdd = (e) => {
    e.preventDefault();
    const f = e.target;
    const ev = {
      type: 'future',
      title: f.aTitle.value.trim(),
      date: f.aDate.value.trim(),
      where: f.aWhere.value.trim() || 'Klarenthal',
      text: f.aText.value.trim(),
      custom: true,
    };
    if (imgData) { ev.img = imgData; ev.alt = ev.title; }

    if (!saveCustom([ev, ...loadCustom()])) {
      setImgError('Speicher voll — bitte ein kleineres Bild wählen oder ohne Bild speichern.');
      return;
    }
    f.reset();
    setImgData(null);
    setImgError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
    refresh();
  };

  return (
    <Modal label="Veranstaltungen verwalten" onClose={onClose}>
      {!unlocked ? (
        <PinGate
          pin={ADMIN_PIN}
          prompt="Bitte 4-stellige PIN eingeben, um Veranstaltungen zu verwalten."
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <div>
          <h3><Icon id="i-cal" /> Veranstaltungen verwalten</h3>
          <p className="admin-sub">
            Zukünftige Veranstaltungen hinzufügen oder entfernen. Änderungen werden sofort auf der
            Webseite sichtbar und in diesem Browser gespeichert.
          </p>

          {/* Bestehende zukünftige Veranstaltungen zum Entfernen */}
          <div className="admin-list">
            {rows.length === 0 && (
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                Keine zukünftigen Veranstaltungen vorhanden.
              </p>
            )}
            {rows.map((r, i) => (
              <div className="admin-row" key={i}>
                <div className="meta">
                  <strong>{r.title}</strong>
                  <span>{r.date}</span>
                </div>
                <button className="btn-del" aria-label="Veranstaltung löschen" title="Löschen" onClick={() => removeRow(r)}>
                  <Icon id="i-trash" />
                </button>
              </div>
            ))}
          </div>

          {/* Formular für eine neue Veranstaltung */}
          <div className="admin-form">
            <h4><Icon id="i-plus" /> Neue Veranstaltung anlegen</h4>
            <form onSubmit={onAdd}>
              <label htmlFor="aTitle">Titel *</label>
              <input id="aTitle" name="aTitle" required maxLength={120} placeholder="z.B. 2. Klarenthaler Demokratiewoche" />
              <label htmlFor="aDate">Datum *</label>
              <input id="aDate" name="aDate" required maxLength={40} placeholder="z.B. 21.09.2026 oder Herbst 2026" />
              <label htmlFor="aWhere">Ort</label>
              <input id="aWhere" name="aWhere" maxLength={120} placeholder="z.B. Stadtteilzentrum Klarenthal" />
              <label htmlFor="aText">Beschreibung *</label>
              <textarea id="aText" name="aText" required maxLength={600} placeholder="Worum geht es bei der Veranstaltung?" />

              <label>Bild (optional)</label>
              <FileDrop
                accept="image/*"
                label="Bild hochladen — hierher ziehen oder klicken zum Auswählen"
                hasFile={!!imgData}
                onFile={processFile}
              >
                {imgData ? (
                  <div className="img-preview">
                    <img src={imgData} alt="Vorschau des gewählten Bildes" />
                    <button type="button" className="img-remove" onClick={(e) => { e.stopPropagation(); setImgData(null); }}>
                      Bild entfernen
                    </button>
                  </div>
                ) : (
                  <div className="img-hint">
                    <Icon id="i-image" />
                    <span>Bild hierher ziehen oder klicken zum Auswählen</span>
                    <small>JPG oder PNG · wird automatisch verkleinert</small>
                  </div>
                )}
              </FileDrop>
              {imgBusy && <p className="img-status">Bild wird verarbeitet …</p>}
              {imgError && <p className="img-status err">{imgError}</p>}

              <div style={{ marginTop: 18 }}>
                <button className="btn btn-violett" type="submit" style={{ fontSize: '14.5px', padding: '12px 24px' }}>
                  Veranstaltung speichern
                </button>
              </div>
              <div className={`admin-saved${saved ? ' show' : ''}`} role="status" aria-live="polite">
                Gespeichert! Die Veranstaltung ist jetzt unter „Zukünftiges“ sichtbar.
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
