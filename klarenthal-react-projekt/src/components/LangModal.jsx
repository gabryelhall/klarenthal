import { useLang } from '../App.jsx';
import { useEscClose } from './Modal.jsx';
import { LANG_LABELS, LANG_NAMES } from '../i18n.js';

const LANGS = ['de', 'en', 'uk', 'ru', 'ar', 'tr', 'fa'];

export default function LangModal({ open, onClose }) {
  const { lang, t, setLang } = useLang();

  useEscClose(open, onClose);

  if (!open) return null;
  return (
    <div className="lang-modal open" role="dialog" aria-modal="true" aria-label={t('lang_title')}
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lang-sheet">
        <h3>{t('lang_title')}</h3>
        <div className="lang-grid">
          {LANGS.map((l) => (
            <button key={l} className={`lang-opt${l === lang ? ' current' : ''}`} onClick={() => setLang(l)}>
              <span className="lang-code">{LANG_LABELS[l]}</span> {LANG_NAMES[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
