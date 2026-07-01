import { useState } from 'react';
import { useLang } from '../App.jsx';
import { Icon } from '../Icons.jsx';
import { SEED_EVENTS } from '../events.js';
import { loadCustom, loadRemoved, seedId } from '../storage.js';

// Eigene Veranstaltungen + Seed-Termine, abzüglich der im Admin ausgeblendeten.
function allEvents() {
  const removed = loadRemoved();
  const seeds = SEED_EVENTS.filter((e) => !removed.includes(seedId(e)));
  return [...loadCustom(), ...seeds];
}

export default function EventsPage({ version }) {
  const { t } = useLang();
  const [filter, setFilter] = useState('future'); // Tab: 'future' | 'past'
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
                <article className="event-card" key={`${e.title}-${i}`}>
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
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
