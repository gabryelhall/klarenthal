import { useLang } from '../App.jsx';

// Sprachneutral: Art (Plakat-Typ), Grundgesetz-Artikelnummer und Farben.
const META = [
  { kind: 'gg', art: 5, bg: '#4C1D95', fg: '#A3E635' },
  { kind: 'gg', art: 6, bg: '#F26B5E', fg: '#1E2A78' },
  { kind: 'gg', art: 10, bg: '#5BC8F5', fg: '#0F5DA0' },
  { kind: 'gg', art: 1, bg: '#F5A8C8', fg: '#168A5E' },
  { kind: 'gg', art: 4, bg: '#2E2E8F', fg: '#FFE100' },
  { kind: 'gg', art: 3, bg: '#F2926E', fg: '#0F5DA0' },
  { kind: 'gg', art: 2, bg: '#F5A8C8', fg: '#B81E5B' },
  { kind: 'dem', art: 4, bg: '#E63950', fg: '#F7B8CE' },
  { kind: 'dem', art: 6, bg: '#8E5BC0', fg: '#FFE100' },
  { kind: 'dem', art: 5, bg: '#1FB39A', fg: '#1E2A78' },
  { kind: 'dem', art: 2, bg: '#F5A8C8', fg: '#0E8F7C' },
];

// Übersetzte Plakat-Texte. heads[] folgt der Reihenfolge von META; descs nach Artikelnummer.
const TXT = {
  de: {
    be: 'Kennst du deine Rechte?', bt: 'Demokratie heißt: Du darfst.',
    gg: 'Kennst du dein Grundgesetz? Du darfst …', dem: 'Nur in einer Demokratie kannst du …', art: 'Artikel',
    heads: ['Deine Meinung sagen', 'Deine Liebsten frei wählen', 'Ein Geheimnis haben', 'Du selbst sein', 'Glauben, woran du willst', 'Nicht benachteiligt werden', 'Dich frei entfalten', 'Glauben, woran du willst.', 'Lieben, wen du willst.', 'Lachen, worüber du willst.', 'Leben, wie du willst.'],
    descs: { 5: 'Freiheit der Meinung, Kunst und Wissenschaft', 6: 'Ehe – Familie – Kinder', 10: 'Brief-, Post- und Fernmeldegeheimnis', 1: 'Menschenwürde', 4: 'Glaubens- und Gewissensfreiheit', 3: 'Gleichheit vor dem Gesetz', 2: 'Persönliche Freiheitsrechte' },
  },
  en: {
    be: 'Know your rights?', bt: 'Democracy means: you may.',
    gg: 'Do you know your rights? You may …', dem: 'Only in a democracy can you …', art: 'Article',
    heads: ['Speak your mind', 'Freely choose your loved ones', 'Have a secret', 'Be yourself', 'Believe what you want', 'Not be discriminated against', 'Develop freely', 'Believe what you want.', 'Love whom you want.', 'Laugh about what you want.', 'Live how you want.'],
    descs: { 5: 'Freedom of opinion, art and science', 6: 'Marriage – family – children', 10: 'Privacy of correspondence, post and telecommunications', 1: 'Human dignity', 4: 'Freedom of faith and conscience', 3: 'Equality before the law', 2: 'Personal freedom rights' },
  },
  uk: {
    be: 'Чи знаєш свої права?', bt: 'Демократія означає: тобі дозволено.',
    gg: 'Чи знаєш ти свої права? Ти можеш …', dem: 'Лише в демократії ти можеш …', art: 'Стаття',
    heads: ['Висловлювати свою думку', 'Вільно обирати близьких', 'Мати таємницю', 'Бути собою', 'Вірити у що хочеш', 'Не зазнавати дискримінації', 'Вільно розвиватися', 'Вірити у що хочеш.', 'Любити кого хочеш.', 'Сміятися з чого хочеш.', 'Жити як хочеш.'],
    descs: { 5: 'Свобода думки, мистецтва й науки', 6: 'Шлюб – сім’я – діти', 10: 'Таємниця листування, пошти та зв’язку', 1: 'Людська гідність', 4: 'Свобода віросповідання й совісті', 3: 'Рівність перед законом', 2: 'Особисті свободи' },
  },
  ru: {
    be: 'Знаешь свои права?', bt: 'Демократия значит: тебе можно.',
    gg: 'Знаешь свои права? Ты можешь …', dem: 'Только в демократии ты можешь …', art: 'Статья',
    heads: ['Высказывать своё мнение', 'Свободно выбирать близких', 'Иметь тайну', 'Быть собой', 'Верить во что хочешь', 'Не подвергаться дискриминации', 'Свободно развиваться', 'Верить во что хочешь.', 'Любить кого хочешь.', 'Смеяться над чем хочешь.', 'Жить как хочешь.'],
    descs: { 5: 'Свобода мнения, искусства и науки', 6: 'Брак – семья – дети', 10: 'Тайна переписки, почты и связи', 1: 'Человеческое достоинство', 4: 'Свобода вероисповедания и совести', 3: 'Равенство перед законом', 2: 'Личные свободы' },
  },
  ar: {
    be: 'هل تعرف حقوقك؟', bt: 'الديمقراطية تعني: يحقّ لك.',
    gg: 'هل تعرف حقوقك؟ يحقّ لك أن …', dem: 'في الديمقراطية فقط يمكنك أن …', art: 'المادة',
    heads: ['تُعبّر عن رأيك', 'تختار أحبّاءك بحرية', 'تحتفظ بسرّ', 'تكون نفسك', 'تؤمن بما تشاء', 'لا تتعرّض للتمييز', 'تنمّي ذاتك بحرية', 'تؤمن بما تشاء.', 'تحبّ من تشاء.', 'تضحك ممّا تشاء.', 'تعيش كما تشاء.'],
    descs: { 5: 'حرية الرأي والفن والعلم', 6: 'الزواج – الأسرة – الأطفال', 10: 'سرية المراسلات والبريد والاتصالات', 1: 'الكرامة الإنسانية', 4: 'حرية المعتقد والضمير', 3: 'المساواة أمام القانون', 2: 'الحريات الشخصية' },
  },
  tr: {
    be: 'Haklarını biliyor musun?', bt: 'Demokrasi demek: yapabilirsin.',
    gg: 'Haklarını biliyor musun? Şunları yapabilirsin …', dem: 'Yalnızca demokraside yapabilirsin …', art: 'Madde',
    heads: ['Fikrini söylemek', 'Sevdiklerini özgürce seçmek', 'Bir sırrın olması', 'Kendin olmak', 'İstediğine inanmak', 'Ayrımcılığa uğramamak', 'Özgürce gelişmek', 'İstediğine inanmak.', 'İstediğini sevmek.', 'İstediğine gülmek.', 'İstediğin gibi yaşamak.'],
    descs: { 5: 'Düşünce, sanat ve bilim özgürlüğü', 6: 'Evlilik – aile – çocuklar', 10: 'Mektup, posta ve haberleşme gizliliği', 1: 'İnsan onuru', 4: 'İnanç ve vicdan özgürlüğü', 3: 'Kanun önünde eşitlik', 2: 'Kişisel özgürlük hakları' },
  },
  fa: {
    be: 'حقوقت را می‌شناسی؟', bt: 'دموکراسی یعنی: تو می‌توانی.',
    gg: 'حقوقت را می‌شناسی؟ تو می‌توانی …', dem: 'فقط در دموکراسی می‌توانی …', art: 'اصل',
    heads: ['نظرت را بگویی', 'عزیزانت را آزادانه انتخاب کنی', 'رازی داشته باشی', 'خودت باشی', 'به آنچه می‌خواهی باور داشته باشی', 'مورد تبعیض قرار نگیری', 'آزادانه رشد کنی', 'به آنچه می‌خواهی باور داشته باشی.', 'هرکه را می‌خواهی دوست بداری.', 'به هرچه می‌خواهی بخندی.', 'هرطور می‌خواهی زندگی کنی.'],
    descs: { 5: 'آزادی بیان، هنر و علم', 6: 'ازدواج – خانواده – فرزندان', 10: 'حریم نامه، پست و مخابرات', 1: 'کرامت انسانی', 4: 'آزادی دین و وجدان', 3: 'برابری در برابر قانون', 2: 'حقوق آزادی‌های فردی' },
  },
};

function PosterCard({ m, txt }) {
  return (
    <article className="poster" style={{ background: m.bg, color: m.fg }}>
      <div className="poster-eyebrow">{m.kind === 'gg' ? txt.gg : txt.dem}</div>
      <h3 className="poster-headline">{txt.head}</h3>
      <div className="poster-article"><strong>{txt.art} {m.art}</strong>{txt.desc}</div>
    </article>
  );
}

export default function PosterSlider() {
  const { lang } = useLang();
  const T = TXT[lang] || TXT.de;
  const cards = META.map((m, i) => ({
    m,
    txt: { gg: T.gg, dem: T.dem, art: T.art, head: T.heads[i], desc: T.descs[m.art] },
  }));
  const loop = [...cards, ...cards]; // doppelt für nahtlose Endlos-Schleife
  return (
    <section className="poster-band" aria-label="Grundgesetz- und Demokratie-Plakate">
      <div className="poster-band-head">
        <div className="sec-eyebrow">{T.be}</div>
        <h2>{T.bt}</h2>
      </div>
      <div className="poster-viewport">
        <div className="poster-marquee">
          {loop.map((c, i) => <PosterCard key={i} m={c.m} txt={c.txt} />)}
        </div>
      </div>
    </section>
  );
}
