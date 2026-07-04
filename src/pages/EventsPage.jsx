import { useState } from 'react';
import { useLang } from '../App.jsx';
import { Icon } from '../Icons.jsx';
import { SEED_EVENTS } from '../events.js';
import { loadCustom, loadRemoved, seedId } from '../storage.js';
import Modal from '../components/Modal.jsx';

// Eigene Veranstaltungen + Seed-Termine, abzüglich der im Admin ausgeblendeten.
function allEvents() {
  const removed = loadRemoved();
  const seeds = SEED_EVENTS.filter((e) => !removed.includes(seedId(e)));
  return [...loadCustom(), ...seeds];
}

/* Detailansicht einer Veranstaltung: großes Bild (bzw. alle Bilder der
   Veranstaltung), voller Text und — falls hinterlegt — ein PDF-Download.
   Galerie-Einträge sind Strings oder { src, alt }-Objekte. */
function EventDetail({ event, onClose }) {
  const raw = event.images?.length ? event.images : (event.img ? [event.img] : []);
  const imgs = raw.map((im, i) => typeof im === 'string'
    ? { src: im, alt: i === 0 ? (event.alt || '') : `${event.title} — Bild ${i + 1}` }
    : im);
  return (
    <Modal label={event.title} onClose={onClose}>
      <div className="event-detail">
        <div className="event-detail-head">
          <span className="event-date">{event.date}</span>
          {event.where && <span className="event-detail-where">{event.where}</span>}
        </div>
        <h3>{event.title}</h3>
        <p>{event.text}</p>
        {event.pdf && (
          <a className="btn btn-orange event-detail-pdf" href={event.pdf} download>
            <Icon id="i-pdf" /> {event.pdfLabel || 'PDF herunterladen'}
          </a>
        )}
        {imgs.map((im) => (
          <img key={im.src} src={im.src} alt={im.alt} loading="lazy" />
        ))}
      </div>
    </Modal>
  );
}

export default function EventsPage({ version }) {
  const { t } = useLang();
  const [filter, setFilter] = useState('future'); // Tab: 'future' | 'past'
  const [detail, setDetail] = useState(null); // angeklickte Veranstaltung (Detail-Overlay)
  const list = allEvents().filter((e) => e.type === filter); // version-Prop erzwingt Re-Render nach Admin-Änderungen

  return (
    <section className="page visible" data-version={version}>
      <div className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t('ev_eyebrow')}</div>
          <h1>{t('ev_title')}</h1>
          <p>{t('ev_sub')}</p>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          {/* Umschalter Zukünftiges / Vergangenes */}
          <div className="event-tabs" role="tablist" aria-label={t('ev_title')}>
            <button
              type="button" id="tab-future" aria-controls="events-panel"
              className={`event-tab${filter === 'future' ? ' active' : ''}`}
              role="tab" aria-selected={filter === 'future'}
              onClick={() => setFilter('future')}
            >
              {t('tab_future')}
            </button>
            <button
              type="button" id="tab-past" aria-controls="events-panel"
              className={`event-tab${filter === 'past' ? ' active' : ''}`}
              role="tab" aria-selected={filter === 'past'}
              onClick={() => setFilter('past')}
            >
              {t('tab_past')}
            </button>
          </div>

          {/* Leerzustand, sonst Karten-Raster der gefilterten Veranstaltungen */}
          <div id="events-panel" role="tabpanel" aria-labelledby={filter === 'future' ? 'tab-future' : 'tab-past'}>
          {list.length === 0 ? (
            <div className="event-empty">
              <strong>{t('ev_empty_t')}</strong>
              <span>{t('ev_empty_p')}</span>
            </div>
          ) : (
            <div className="events-grid">
              {list.map((e, i) => (
                <article
                  className="event-card event-card-clickable" key={`${e.title}-${i}`}
                  role="button" tabIndex={0}
                  aria-label={`${e.title} — ${t('ev_more')}`}
                  onClick={() => setDetail(e)}
                  onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setDetail(e); } }}
                >
                  <div className="event-img">
                    {e.img
                      ? <img src={e.img} alt={e.alt || ''} loading="lazy" />
                      : <div className="placeholder"><Icon id={e.icon || 'i-cal'} /></div>}
                    <span className="event-date">{e.date}</span>
                  </div>
                  <div className="event-body">
                    <h3>{e.title}</h3>
                    <div className="where">{e.where}</div>
                    <p>{e.text}</p>
                    <span className="event-more">{t('ev_more')}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Klick auf eine Karte öffnet die Detailansicht mit allen Bildern */}
      {detail && <EventDetail event={detail} onClose={() => setDetail(null)} />}
    </section>
  );
}
