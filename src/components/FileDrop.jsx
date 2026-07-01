import { useRef, useState } from 'react';

/* Wiederverwendbare Upload-Fläche (Bild im Veranstaltungs-Admin, PDF im
   Presse-Admin). Kümmert sich nur um Klick/Tastatur/Drag&Drop und den
   Hover-Zustand — was darin angezeigt wird (Vorschau, Datei-Info oder
   Platzhalter), bestimmt der Aufrufer über children. */
export default function FileDrop({ accept, label, hasFile, onFile, children }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const choose = () => input.current?.click();

  return (
    <div
      className={`img-drop${over ? ' over' : ''}${hasFile ? ' has-img' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={choose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files?.[0]); }}
    >
      {children}
      <input ref={input} type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0])} hidden />
    </div>
  );
}
