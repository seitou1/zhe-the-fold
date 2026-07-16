-- Fix mojibake Â· (UTF-8 middle dot mis-encoded) in site_settings.
-- Run once in SQL Editor. Safe to re-run.

update public.site_settings
set
  reserve_subject = 'Table ' || chr(183) || ' Zhe',
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
  updated_at = now()
where id = 'default';
