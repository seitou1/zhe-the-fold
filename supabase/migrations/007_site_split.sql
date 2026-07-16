-- Split bloated site_settings into focused tables.
-- site_hours  = schedule + open-chip wording
-- site_contact = NAP / phone / email / maps / social
-- site_copy   = brand, nav, CTAs, section titles, footer
-- Safe to re-run. Old site_settings left in place (legacy); app prefers these.

-- ── Hours (open chip + Visit schedule) ──────────────────────────
create table if not exists public.site_hours (
  id text primary key default 'default' check (id = 'default'),
  timezone text not null default 'America/New_York',
  closed_weekdays text not null default 'Mon',
  note text not null default 'Closed Mondays',
  periods jsonb not null default '[
    {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"11:30","close":"14:30"},
    {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"17:00","close":"21:00"}
  ]'::jsonb,
  kitchen_open text not null default 'Open',
  kitchen_until text not null default 'until',
  kitchen_opens text not null default 'opens',
  kitchen_see_visit text not null default 'see Visit',
  kitchen_closed_prefix text not null default 'Closed',
  kitchen_daily text not null default 'Daily',
  kitchen_eastern text not null default 'Eastern time',
  kitchen_title_open text not null default 'Kitchen open until',
  kitchen_title_closed text not null default 'Kitchen',
  updated_at timestamptz not null default now()
);

alter table public.site_hours enable row level security;
drop policy if exists "Public read site_hours" on public.site_hours;
create policy "Public read site_hours"
  on public.site_hours for select to anon, authenticated using (true);

-- ── Contact / NAP ───────────────────────────────────────────────
create table if not exists public.site_contact (
  id text primary key default 'default' check (id = 'default'),
  email text not null,
  telephone text not null,
  telephone_display text not null,
  street_address text not null,
  address_locality text not null,
  address_region text not null,
  postal_code text not null,
  address_country text not null default 'US',
  maps_query text not null,
  reserve_subject text not null,
  instagram_url text not null default '',
  instagram_label text not null default 'Instagram',
  updated_at timestamptz not null default now()
);

alter table public.site_contact enable row level security;
drop policy if exists "Public read site_contact" on public.site_contact;
create policy "Public read site_contact"
  on public.site_contact for select to anon, authenticated using (true);

-- ── Brand / nav / CTAs / chrome ─────────────────────────────────
create table if not exists public.site_copy (
  id text primary key default 'default' check (id = 'default'),
  brand_name text not null,
  brand_name_cn text not null,
  brand_short text not null,
  city text not null,
  hero_line text not null,
  seo_description text not null,
  seo_title_suffix text not null,
  nav_story text not null default 'Story',
  nav_menu text not null default 'Menu',
  nav_visit text not null default 'Visit',
  action_directions text not null default 'Directions',
  action_call text not null default 'Call',
  action_reserve text not null default 'Reserve',
  action_reserve_nav text not null default 'Reserve',
  service_kicker text not null default 'Join us',
  mode_table_label text not null default 'Table',
  mode_takeout_label text not null default 'Takeout',
  table_detail text not null,
  takeout_detail text not null,
  visit_find_us text not null default 'Find us',
  visit_hours_label text not null default 'Hours',
  section_story_en text not null default 'The house',
  section_story_cn text not null default '小店',
  section_menu_en text not null default 'The Menu',
  section_menu_cn text not null default '菜单',
  section_visit_en text not null default 'Visit',
  section_visit_cn text not null default '造访',
  menu_note text not null,
  menu_meta_house text not null default 'House',
  menu_meta_shellfish text not null default 'Shellfish',
  footer_tag text not null,
  footer_rights text not null default 'All rights reserved.',
  skip_to_menu text not null default 'Skip to menu',
  updated_at timestamptz not null default now()
);

alter table public.site_copy enable row level security;
drop policy if exists "Public read site_copy" on public.site_copy;
create policy "Public read site_copy"
  on public.site_copy for select to anon, authenticated using (true);

comment on table public.site_hours is 'Kitchen schedule + open-chip wording';
comment on table public.site_contact is 'NAP / phone / email / maps / social';
comment on table public.site_copy is 'Brand, nav, CTAs, section titles, footer';
