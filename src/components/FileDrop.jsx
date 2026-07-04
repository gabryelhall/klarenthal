import { useRef, useState } from 'react';

/* Wiederverwendbare Upload-Fläche (Bilder im Veranstaltungs-Admin, PDF im
   Presse-Admin). Kümmert sich nur um Klick/Tastatur/Drag&Drop und den
   Hover-Zustand — was darin angezeigt wird (Vorschau, Datei-Info oder
   Platzhalter), bestimmt der Aufrufer über children.

   Einzeldatei:   <FileDrop onFile={fn} … />        → fn(file)
   Mehrere Dateien: <FileDrop multiple onFiles={fn} … /> → fn([file, …]) */
export default function FileDrop({ accept, label, hasFile, onFile, onFiles, multiple = false, children }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const choose = () => input.current?.click();

  // Ausgewählte / fallengelassene Dateien an den passenden Callback geben.
  const emit = (fileList) => {
    const files = Array.from(fileList || []);
    if (multiple) { if (files.length) onFiles(files); }
    else { onFile(files[0]); }
    if (input.current) input.current.value = ''; // gleiche Datei erneut wählbar
  };

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
      onDrop={(e) => { e.preventDefault(); setOver(false); emit(e.dataTransfer.files); }}
    >
      {children}
      <input ref={input} type="file" accept={accept} multiple={multiple} onChange={(e) => emit(e.target.files)} hidden />
    </div>
  );
}
