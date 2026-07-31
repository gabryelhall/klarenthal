/* Verbindung zum Supabase-Backend (Datenbank + Datei-Speicher + Login).
   URL und Publishable-Key sind bewusst öffentlich — der Schutz kommt von den
   Zugriffsregeln (RLS) auf dem Server: Lesen dürfen alle, Schreiben nur der
   eingeloggte Admin. Der geheime "sb_secret_…"-Key gehört NIE in diesen Code. */

import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://pifhwbxqizuayobkbswu.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_FGO0rFjpnBfPiX5ELhf_Hw_27hfPw1x';

/* E-Mail des Admin-Kontos (im Supabase-Dashboard unter Authentication → Users
   angelegt). Im Login-Fenster der Webseite wird nur das Passwort abgefragt. */
export const ADMIN_EMAIL = 'gabryel.hall@googlemail.com';

export const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
  // Beim Prerendern (Node) gibt es keinen localStorage für die Sitzung.
  auth: { persistSession: typeof localStorage !== 'undefined' },
});

export const signIn = (password) =>
  supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
