-- Fix mojibake Â· on brand / hero (and related copy strings).
-- Middle dot via chr(183) so paste encoding cannot reintroduce Â·
-- Run in Supabase SQL Editor. Safe to re-run.

update public.site_copy
set
  brand_name = 'Zhe ' || chr(183) || ' The Fold',
  hero_line = 'Handmade dumplings ' || chr(183) || ' table & takeout',
  menu_note =
    'Steamed or pan-seared '
    || chr(183)
    || ' About eight per order '
    || chr(183)
    || ' Table or take home '
    || chr(183)
    || ' Share allergies',
  table_detail = 'Walk-ins welcome ' || chr(183) || ' reserve for 4+',
  takeout_detail = 'Call ahead or walk up ' || chr(183) || ' no delivery',
  seo_description =
    'Handmade Chinese dumplings in New York. A small hybrid room for the table or takeout. Every fold holds the mark of a hand.',
  updated_at = now()
where id = 'default';

-- Contact reserve subject if present
update public.site_contact
set
  reserve_subject = 'Table ' || chr(183) || ' Zhe',
  updated_at = now()
where id = 'default';
