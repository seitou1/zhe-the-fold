-- Story CMS — Origins chapters (House · Hands · Night)
-- Apply after 001_menu_items.sql

create table if not exists public.story_chapters (
  id text primary key,
  label text not null,
  short text not null,
  body text not null,
  image text not null,
  position text,
  position_mobile text,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists story_chapters_sort_idx
  on public.story_chapters (sort_order);

alter table public.story_chapters enable row level security;

drop policy if exists "Public read published story chapters" on public.story_chapters;
create policy "Public read published story chapters"
  on public.story_chapters
  for select
  to anon, authenticated
  using (published = true);

comment on table public.story_chapters is 'Origins chapters — mirrors StoryChapter in lib/story.ts';
