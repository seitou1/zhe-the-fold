-- Seed from lib/story.ts — craft-archive stills (village / fold / city).
-- Run after 002_story_chapters.sql. Safe to re-run (upsert).

insert into public.story_chapters (
  id, label, short, body, image, position, position_mobile, sort_order, published
) values
  (
    'house', 'House', 'House',
    'A small dumpling room in New York. Steam on the glass, a few tables, bags at the counter. Sit for a plate, or take the same fold home.',
    '/assets/story-village.webp', '42% 48%', 'center 45%', 10, true
  ),
  (
    'hands', 'Hands', 'Hands',
    'Each crease is a little uneven. That is how you know a hand was here. Not a machine. Not a rush.',
    '/assets/story-fold.webp', '50% 42%', 'center 40%', 20, true
  ),
  (
    'night', 'Night', 'Night',
    'Lanterns on, kitchen open. Walk in for a table, or call for a bag. Same hands either way.',
    '/assets/story-city.webp', '42% 40%', 'center 38%', 30, true
  )
on conflict (id) do update set
  label = excluded.label,
  short = excluded.short,
  body = excluded.body,
  image = excluded.image,
  position = excluded.position,
  position_mobile = excluded.position_mobile,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
