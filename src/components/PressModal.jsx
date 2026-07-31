import { useState } from 'react';
import { Icon } from '../Icons.jsx';
import { loadPress, addPress, deletePress } from '../storage.js';
import Modal from './Modal.jsx';
import LoginGate from './LoginGate.jsx';
import FileDrop from './FileDrop.jsx';

/* Obergrenze fürs PDF — schont Speicherplatz und Ladezeiten. */
const MAX_MB = 10;

export default function PressModal({ open, onClose, onChanged }) {
  const [unlocked, setUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // Die Liste lebt im Daten-Snapshot (storage.js) — Zähler erzwingt das
  // Neu-Rendern nach Änderungen.
  const [, force] = useState(0);
  const refresh = () => { force((n) => n + 1); onChanged(); };

  // Ausgewählte PDF-Datei; hochgeladen wird erst beim Speichern.
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfError, setPdfError] = useState('');

  const processFile = (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) { setPdfError('Bitte eine PDF-Datei auswählen.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) {
      setPdfError(`PDF zu groß (max. ~${MAX_MB} MB).`);
      return;
    }
    setPdfError('');
    setPdfFile(file);
  };

  const clearFile = () => setPdfFile(null);

  if (!open) return null;

  const rows = loadPress();

  const removeRow = async (p) => {
    if (!window.confirm(`„${p.title}“ wirklich entfernen?`)) return;
    try {
      await deletePress(p);
      refresh();
    } catch {
      window.alert('Entfernen fehlgeschlagen — bitte Internetverbindung prüfen und erneut versuchen.');
    }
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (saving) return;
    const f = e.target;
    const title = f.pTitle.value.trim();
    if (!title) { setPdfError('Bitte einen Titel eingeben.'); return; }
    if (!pdfFile) { setPdfError('Bitte eine PDF-Datei hochladen.'); return; }

    setSaving(true);
    setPdfError('');
    try {
      await addPress({ title, date: new Date().toLocaleDateString('de-DE'), file: pdfFile });
      f.reset();
      clearFile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      refresh();
    } catch {
      setPdfError('Speichern fehlgeschlagen — bitte Internetverbindung prüfen und erneut versuchen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal label="Pressemitteilungen verwalten" onClose={onClose}>
      {!unlocked ? (
        <LoginGate
          prompt="Bitte Admin-Passwort eingeben, um Pressemitteilungen zu verwalten."
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <div>
          <h3><Icon id="i-news" /> Pressemitteilungen verwalten</h3>
          <p className="admin-sub">
            Pressemitteilungen als PDF hochladen. Sie werden zentral gespeichert und erscheinen
            sofort für alle Besucher unter „Weitere Informationen“ zum Herunterladen.
          </p>

          {/* Bereits hochgeladene eigene Mitteilungen zum Entfernen */}
          <div className="admin-list">
            {rows.length === 0 && (
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                Noch keine eigenen Pressemitteilungen hochgeladen.
              </p>
            )}
            {rows.map((p, i) => (
              <div className="admin-row" key={p.id || i}>
                <div className="meta">
                  <strong>{p.title}</strong>
                  <span>{p.date} · PDF</span>
                </div>
                <button className="btn-del" aria-label="Pressemitteilung löschen" title="Löschen" onClick={() => removeRow(p)}>
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
                hasFile={!!pdfFile}
                onFile={processFile}
              >
                {pdfFile ? (
                  <div className="pdf-file">
                    <Icon id="i-pdf" />
                    <strong>{pdfFile.name}</strong>
                    <span>{Math.round(pdfFile.size / 1024)} KB</span>
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
              {pdfError && <p className="img-status err">{pdfError}</p>}

              <div style={{ marginTop: 18 }}>
                <button
                  className="btn btn-violett" type="submit" disabled={saving}
                  style={{ fontSize: '14.5px', padding: '12px 24px' }}
                >
                  {saving ? 'Wird gespeichert …' : 'Pressemitteilung speichern'}
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
