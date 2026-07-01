import { useEffect } from 'react';

/* Schließt das Modal bei Escape — aber nur, solange es offen ist, damit
   die globale Tastenabfrage nicht im Hintergrund hängen bleibt. */
export function useEscClose(active, onClose) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

/* Gemeinsames Overlay für die Admin-Dialoge: abgedunkelter Hintergrund mit
   zentriertem Sheet. Geschlossen wird per ×-Button, Klick auf den Hintergrund
   oder Escape. Der eigentliche Inhalt kommt als children. */
export default function Modal({ label, onClose, children }) {
  useEscClose(true, onClose);

  return (
    <div
      className="admin-modal open"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="admin-sheet">
        <button className="admin-close" aria-label="Schließen" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
