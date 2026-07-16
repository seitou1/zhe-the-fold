-- Menu CMS — public read of published dishes
-- Apply in Supabase SQL editor or: supabase db push
-- Seed data matches lib/menu.ts MENU_ITEMS (fallback SSOT).

do $$ begin
  create type public.menu_category as enum (
    'classic',
    'seasonal',
    'plant'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.menu_items (
  id text primary key,
  category public.menu_category not null,
  cat_label text not null,
  en text not null,
  rail text not null,
  cn text not null,
  description text not null,
  price text not null,
  popular boolean not null default false,
  tags text[] not null default '{}',
  image text not null,
  position text,
  position_mobile text,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_sort_idx
  on public.menu_items (category, sort_order);

alter table public.menu_items enable row level security;

-- Public site reads published rows only (anon key)
drop policy if exists "Public read published menu items" on public.menu_items;
create policy "Public read published menu items"
  on public.menu_items
  for select
  to anon, authenticated
  using (published = true);

-- Writes: service role / dashboard only (no insert/update policy for anon)

comment on table public.menu_items is 'Zhe menu dishes — mirrors MenuItem in lib/menu.ts';
