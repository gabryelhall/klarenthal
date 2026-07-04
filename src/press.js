// Fest eingebaute Pressemitteilungen (Seed). titleKey + translate => über i18n übersetzt.
// Optionales img => kleines Vorschaubild neben dem Eintrag (statt Icon).
export const SEED_PRESS = [
  { id: 'naspa-stiftung', href: 'assets/press/2026-06-01_WIE_PM_Stiftung.pdf', title: 'Naspa Stiftung: Spendenübergabe „Engagement im Fokus“ — u.a. an das Volksbildungswerk Klarenthal', meta: '01.06.2026 · PDF', img: 'assets/Volksbildungswerk_Klarenthal.jpg' },
  { id: 'demokratiewoche', href: 'assets/press/pressemitteilung-demokratiewoche.pdf', titleKey: 'pr1', meta: 'September 2025 · PDF', translate: true },
  { id: 'vrm-stimme', href: 'assets/press/vrm-stimme-erheben.pdf', title: 'VRM: „Es ist wichtig, die Stimme zu erheben“', meta: '24.09.2025 · PDF' },
  { id: 'vrm-sehenswert', href: 'assets/press/vrm-sehenswert.pdf', title: 'VRM: „Sehenswert und unerträglich“', meta: '26.09.2025 · PDF' },
  { id: 'wk-wunschebaum', href: 'assets/press/wk-wunschebaum.pdf', title: 'Wiesbadener Kurier: „Ein Wünschebaum für Klarenthal“', meta: '24.12.2024 · PDF' },
  { id: 'wk-handlungsfaehigkeit', href: 'assets/press/wk-handlungsfaehigkeit.pdf', title: 'Wiesbadener Kurier: „Handlungsfähigkeit bewahren“', meta: '10.02.2025 · PDF' },
  { id: 'wk-ratlosigkeit', href: 'assets/press/2024-09-05_Wiesbadener_Kurier_Untertaunus__Idsteiner_Land_Ratlosigkeit_am_runden_Tisch.pdf', title: 'Wiesbadener Kurier: „Ratlosigkeit am runden Tisch“', meta: '05.09.2024 · PDF' },
];

export const pressSeedId = (p) => 'press:' + p.id;
