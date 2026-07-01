import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icons.jsx';

/* Vierstelliges Zahlenschloss vor den Admin-Funktionen. Der Cursor springt
   beim Tippen automatisch ins nächste Feld, Backspace eine Stelle zurück;
   ist die PIN komplett, wird sie geprüft und bei Erfolg onUnlock() gemeldet.
   Die richtige PIN steckt nicht hier, sondern wird vom Modal hereingereicht. */
export default function PinGate({ pin, prompt, onUnlock }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputs = useRef([]);

  // Beim Einblenden direkt das erste Feld fokussieren (kurz verzögert, damit
  // das Modal sicher gerendert ist).
  useEffect(() => {
    const id = setTimeout(() => inputs.current[0]?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  const enterDigit = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 3) inputs.current[idx + 1]?.focus();

    const code = next.join('');
    if (code.length < 4) return;
    if (code === pin) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setDigits(['', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  // Backspace im leeren Feld springt zurück, damit man flüssig korrigieren kann.
  const goBackOnEmpty = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  return (
    <div>
      <h3><Icon id="i-lock" /> Admin-Bereich</h3>
      <p className="admin-sub">{prompt}</p>
      <div className={`pin-error${error ? ' show' : ''}`} role="alert">Falsche PIN — bitte erneut versuchen.</div>
      <div className="pin-row">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            className="pin-digit"
            type="password"
            inputMode="numeric"
            maxLength={1}
            autoComplete="off"
            aria-label={`PIN Ziffer ${i + 1}`}
            value={digit}
            onChange={(e) => enterDigit(i, e.target.value)}
            onKeyDown={(e) => goBackOnEmpty(i, e)}
          />
        ))}
      </div>
    </div>
  );
}
