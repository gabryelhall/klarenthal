-- Einmalige Einrichtung für klarenthal.org
-- Im Supabase-Dashboard: SQL Editor → dieses Skript einfügen → "Run".
-- Legt Tabellen, Zugriffsregeln (RLS) und den Datei-Bucket an.
-- Regel überall: Lesen dürfen alle Besucher, Schreiben nur der eingeloggte Admin.
-- Das Skript ist wiederholbar (bereits Vorhandenes wird übersprungen/ersetzt).

-- Veranstaltungen, die der Admin über die Webseite anlegt
-- (die fest eingebauten Seed-Termine bleiben im Code, src/events.js)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- 'auto' = Tab nach Datum; 'pin-future' / 'pin-past' = fest gewählt
  -- (ältere Einträge mit 'future'/'past' werden ebenfalls nach Datum sortiert)
  type text not null default 'future',
  title text not null,
  date_text text not null,
  where_text text not null default 'Klarenthal',
  body text not null,
  img text,
  alt text,
  images jsonb not null default '[]'::jsonb
);

-- Vom Admin ausgeblendete Seed-Termine (id = 'seed:' + Titel)
create table if not exists public.removed_seeds (
  id text primary key,
  created_at timestamptz not null default now()
);

-- Vom Admin hochgeladene Pressemitteilungen
create table if not exists public.press (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  date_text text,
  pdf_url text not null
);

alter table public.events enable row level security;
alter table public.removed_seeds enable row level security;
alter table public.press enable row level security;

drop policy if exists "public read"  on public.events;
drop policy if exists "admin insert" on public.events;
drop policy if exists "admin update" on public.events;
drop policy if exists "admin delete" on public.events;
create policy "public read"  on public.events for select using (true);
create policy "admin insert" on public.events for insert to authenticated with check (true);
create policy "admin update" on public.events for update to authenticated using (true);
create policy "admin delete" on public.events for delete to authenticated using (true);

drop policy if exists "public read"  on public.removed_seeds;
drop policy if exists "admin insert" on public.removed_seeds;
drop policy if exists "admin delete" on public.removed_seeds;
create policy "public read"  on public.removed_seeds for select using (true);
create policy "admin insert" on public.removed_seeds for insert to authenticated with check (true);
create policy "admin delete" on public.removed_seeds for delete to authenticated using (true);

drop policy if exists "public read"  on public.press;
drop policy if exists "admin insert" on public.press;
drop policy if exists "admin delete" on public.press;
create policy "public read"  on public.press for select using (true);
create policy "admin insert" on public.press for insert to authenticated with check (true);
create policy "admin delete" on public.press for delete to authenticated using (true);

-- Öffentlicher Datei-Bucket für Veranstaltungsbilder und Presse-PDFs
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;
create policy "media public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media');
