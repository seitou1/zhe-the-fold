-- Site settings CMS — contact / NAP / hybrid visit strings
-- Single row id = 'default'. Static fallback: lib/site.ts

create table if not exists public.site_settings (
  id text primary key default 'default'
    check (id = 'default'),
  email text not null,
  telephone text not null,
  telephone_display text not null,
  street_address text not null,
  address_locality text not null,
  address_region text not null,
  postal_code text not null,
  address_country text not null,
  maps_query text not null,
  reserve_subject text not null,
  hero_line text not null,
  menu_note text not null,
  instagram_url text not null,
  instagram_label text not null,
  service_kicker text not null,
  table_detail text not null,
  takeout_detail text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

comment on table public.site_settings is 'Ops contact + visit strings — single row default';
