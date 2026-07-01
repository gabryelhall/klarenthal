import { useState } from 'react';
import { Icon } from '../Icons.jsx';
import { loadPress, savePress } from '../storage.js';
import Modal from './Modal.jsx';
import PinGate from './PinGate.jsx';
import FileDrop from './FileDrop.jsx';

/* PIN ändern: hier anpassen (gleiche PIN wie der Veranstaltungs-Admin). */
const ADMIN_PIN = '2420';
/* Obergrenze fürs PDF — größere Dateien passen nicht zuverlässig in den
   localStorage-Speicher des Browsers. */
const MAX_MB = 4;

export default function PressModal({ open, onClose, onChanged }) {
  const [unlocked, setUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  // localStorage statt State — Zähler erzwingt das Neu-Rendern nach Änderungen.
  const [, force] = useState(0);
  const refresh = () => { force((n) => n + 1); onChanged(); };

  // PDF-Upload: wird als Data-URL gespeichert (Name/Größe nur für die Anzeige).
  const [pdfData, setPdfData] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const processFile = (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) { setPdfError('Bitte eine PDF-Datei auswählen.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) {
      setPdfError(`PDF zu groß (max. ~${MAX_MB} MB für die Browser-Speicherung).`);
      return;
    }
    setPdfError(''); setPdfBusy(true);

    const reader = new FileReader();
    reader.onload = () => { setPdfData(reader.result); setPdfName(file.name); setPdfSize(file.size); setPdfBusy(false); };
    reader.onerror = () => { setPdfBusy(false); setPdfError('Datei konnte nicht gelesen werden.'); };
    reader.readAsDataURL(file);
  };

  const clearFile = () => { setPdfData(null); setPdfName(''); setPdfSize(0); };

  if (!open) return null;

  const rows = loadPress().map((p, i) => ({ title: p.title, date: p.date, idx: i }));

  const removeRow = (r) => {
    if (!window.confirm(`„${r.title}“ wirklich entfernen?`)) return;
    const list = loadPress();
    list.splice(r.idx, 1);
    savePress(list);
    refresh();
  };

  const onAdd = (e) => {
    e.preventDefault();
    const title = e.target.pTitle.value.trim();
    if (!title) { setPdfError('Bitte einen Titel eingeben.'); return; }
    if (!pdfData) { setPdfError('Bitte eine PDF-Datei hochladen.'); return; }

    const item = { title, pdf: pdfData, date: new Date().toLocaleDateString('de-DE') };
    if (!savePress([item, ...loadPress()])) { setPdfError('Speicher voll — bitte ein kleineres PDF wählen.'); return; }

    e.target.reset();
    clearFile();
    setPdfError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
    refresh();
  };

  return (
    <Modal label="Pressemitteilungen verwalten" onClose={onClose}>
      {!unlocked ? (
        <PinGate
          pin={ADMIN_PIN}
          prompt="Bitte 4-stellige PIN eingeben, um Pressemitteilungen zu verwalten."
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <div>
          <h3><Icon id="i-news" /> Pressemitteilungen verwalten</h3>
          <p className="admin-sub">
            Pressemitteilungen als PDF hochladen. Sie erscheinen sofort unter „Weitere Informationen“
            und können dort heruntergeladen werden. Gespeichert in diesem Browser.
          </p>

          {/* Bereits hochgeladene eigene Mitteilungen zum Entfernen */}
          <div className="admin-list">
            {rows.length === 0 && (
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                Noch keine eigenen Pressemitteilungen hochgeladen.
              </p>
            )}
            {rows.map((r, i) => (
              <div className="admin-row" key={i}>
                <div className="meta">
                  <strong>{r.title}</strong>
                  <span>{r.date} · PDF</span>
                </div>
                <button className="btn-del" aria-label="Pressemitteilung löschen" title="Löschen" onClick={() => removeRow(r)}>
                  <Icon id="i-trash" />
                </button>
              </div>
            ))}
          </div>

          {/* Formular für eine neue Mitteilung */}
          <div className="admin-form">
            <h4><Icon id="i-plus" /> Neue Pressemitteilung hochladen</h4>
            <form onSubmit={onAdd}>
              <label htmlFor="pTitle">Titel *</label>
              <input id="pTitle" name="pTitle" required maxLength={160} placeholder="z.B. Pressemitteilung: 2. Demokratiewoche" />

              <label>PDF-Datei *</label>
              <FileDrop
                accept="application/pdf,.pdf"
                label="PDF hochladen — hierher ziehen oder klicken zum Auswählen"
                hasFile={!!pdfData}
                onFile={processFile}
              >
                {pdfData ? (
                  <div className="pdf-file">
                    <Icon id="i-pdf" />
                    <strong>{pdfName}</strong>
                    <span>{Math.round(pdfSize / 1024)} KB</span>
                    <button type="button" className="img-remove" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                      Datei entfernen
                    </button>
                  </div>
                ) : (
                  <div className="img-hint">
                    <Icon id="i-pdf" />
                    <span>PDF hierher ziehen oder klicken zum Auswählen</span>
                    <small>Nur PDF · max. ~{MAX_MB} MB</small>
                  </div>
                )}
              </FileDrop>
              {pdfBusy && <p className="img-status">PDF wird verarbeitet …</p>}
              {pdfError && <p className="img-status err">{pdfError}</p>}

              <div style={{ marginTop: 18 }}>
                <button className="btn btn-violett" type="submit" style={{ fontSize: '14.5px', padding: '12px 24px' }}>
                  Pressemitteilung speichern
                </button>
              </div>
              <div className={`admin-saved${saved ? ' show' : ''}`} role="status" aria-live="polite">
                Gespeichert! Die Pressemitteilung ist jetzt unter „Weitere Informationen“ verfügbar.
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
