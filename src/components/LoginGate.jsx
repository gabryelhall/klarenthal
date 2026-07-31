import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icons.jsx';
import { supabase, signIn } from '../supabase.js';

/* Passwort-Abfrage vor den Admin-Funktionen. Geprüft wird auf dem Server
   (Supabase-Login mit fester Admin-E-Mail, siehe supabase.js) — erst danach
   erlauben die Zugriffsregeln das Schreiben. Eine noch gültige Sitzung
   entsperrt direkt, ohne erneute Eingabe. */
export default function LoginGate({ prompt, onUnlock }) {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active && session) onUnlock();
    });
    // Fokus kurz verzögert, damit das Modal sicher gerendert ist.
    const id = setTimeout(() => input.current?.focus(), 50);
    return () => { active = false; clearTimeout(id); };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setError('');
    const { error: err } = await signIn(pw);
    setBusy(false);
    if (err) {
      setError(/fetch|network/i.test(err.message || '')
        ? 'Server nicht erreichbar — bitte Internetverbindung prüfen.'
        : 'Falsches Passwort — bitte erneut versuchen.');
      setPw('');
      input.current?.focus();
    } else {
      onUnlock();
    }
  };

  return (
    <div>
      <h3><Icon id="i-lock" /> Admin-Bereich</h3>
      <p className="admin-sub">{prompt}</p>
      <div className={`pin-error${error ? ' show' : ''}`} role="alert">{error}</div>
      <form className="admin-form" onSubmit={submit}>
        <label htmlFor="adminPw">Admin-Passwort</label>
        <input
          id="adminPw"
          ref={input}
          type="password"
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-violett" type="submit" disabled={busy} style={{ fontSize: '14.5px', padding: '12px 24px' }}>
            {busy ? 'Anmelden …' : 'Anmelden'}
          </button>
        </div>
      </form>
    </div>
  );
}
