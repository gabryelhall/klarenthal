import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDove, faScaleBalanced, faPeopleGroup, faComments, faDoorOpen,
  faLandmark, faChurch, faCheckToSlot, faBookOpenReader, faPeopleRoof,
  faChildren, faFutbol, faHandsHoldingCircle, faGlobe, faEnvelope,
  faNewspaper, faCalendarDays, faLock, faTrashCan, faPlus, faImage,
  faFilePdf, faMasksTheater, faMobileScreenButton, faSeedling, faSchool,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';

/* Zuordnung der bisherigen Sprite-IDs auf passende Font-Awesome-Icons.
   So bleibt die <Icon id="…" />-Schnittstelle erhalten, während die
   Symbole gegen die kuratierten Font-Awesome-Glyphen getauscht werden. */
const ICONS = {
  // Werte / Haltung (WhoPage)
  'i-dove': faDove,                  // friedliches Miteinander
  'i-scales': faScaleBalanced,       // Grund- und Menschenrechte
  'i-diversity': faPeopleGroup,      // Vielfalt & Gemeinschaft
  'i-speech': faComments,            // Dialog & Austausch
  'i-door': faDoorOpen,              // Offenheit
  // Mitglieder am Runden Tisch (WhoPage)
  'i-gov': faLandmark,               // Ortsbeirat
  'i-church': faChurch,              // Christliche Kirchen
  'i-ballot': faCheckToSlot,         // Demokratische Parteien
  'i-book': faBookOpenReader,        // Volksbildungswerk / Lesungen
  'i-home': faPeopleRoof,            // Stadtteilzentrum (Treffpunkt)
  'i-kids': faChildren,              // KiEZ – Kinder & Jugend
  'i-ball': faFutbol,                // 1. SC Klarenthal
  'i-school': faSchool,              // Klarenthaler Bildungseinrichtungen
  'i-hands': faHandsHoldingCircle,   // engagierte Zivilgesellschaft
  // Header / Footer
  'i-globe': faGlobe,                // Sprachwahl
  'i-mail': faEnvelope,              // E-Mail
  'i-insta': faInstagram,            // Instagram
  'i-fb': faFacebookF,               // Facebook
  // Presse / Veranstaltungen / Admin
  'i-news': faNewspaper,             // Pressemitteilungen
  'i-pdf': faFilePdf,                // PDF-Datei
  'i-cal': faCalendarDays,           // Termin / Veranstaltung
  'i-lock': faLock,                  // Admin-Login
  'i-trash': faTrashCan,             // löschen
  'i-plus': faPlus,                  // hinzufügen
  'i-image': faImage,                // Bild-Upload
  // veranstaltungsspezifisch (events.js)
  'i-theater': faMasksTheater,       // Theaterstück
  'i-rose': faSeedling,              // „Weiße Rose“ – Sophie Scholl
  'i-bench': faHandsHoldingCircle,   // „Orange the World“
  'i-phone': faMobileScreenButton,   // Social-Media-Workshop
};

export function Icon({ id, className = 'icon' }) {
  return <FontAwesomeIcon icon={ICONS[id] || faCalendarDays} className={className} aria-hidden="true" />;
}

/* Logo-Bildmarke nach S&V-Feinkonzept: zwei Wohntürme + Haus,
   Fenster/Türen als echte Löcher (evenodd), Farbe via currentColor */
export function LogoMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 68" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="
        M7 16 h18 a5 5 0 0 1 5 5 v45 h-8 v-9 a6 6 0 0 0 -12 0 v9 H2 V21 a5 5 0 0 1 5 -5 Z
        M8 25 h16 v6 H8 Z
        M8 39 h16 v6 H8 Z
        M39 2 h18 a5 5 0 0 1 5 5 v59 h-8 v-9 a6 6 0 0 0 -12 0 v9 h-8 V7 a5 5 0 0 1 5 -5 Z
        M41 11 h9 v13 h-9 Z
        M41 30 h12 v5 H41 Z
        M64 66 V37 L81 21 L98 37 V66 h-11 v-9 a6 6 0 0 0 -12 0 v9 Z" />
    </svg>
  );
}

/* Wahlkreuz-Asset aus dem S&V-Designbaukasten (transparenter Hintergrund) */
export function VoteX({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" opacity=".85" />
      <path d="M20 12 L82 86" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <path d="M83 14 L19 82" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <path d="M23 16 L84 83" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity=".5" />
      <path d="M80 11 L16 79" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}
