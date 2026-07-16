-- Seed split tables from craft defaults + existing site_settings (base cols only).
-- Run after 007_site_split.sql. Safe to re-run.

-- ── Hours ───────────────────────────────────────────────────────
insert into public.site_hours (
  id, timezone, closed_weekdays, note, periods,
  kitchen_open, kitchen_until, kitchen_opens, kitchen_see_visit,
  kitchen_closed_prefix, kitchen_daily, kitchen_eastern,
  kitchen_title_open, kitchen_title_closed
) values (
  'default',
  'America/New_York',
  'Mon',
  'Closed Mondays',
  '[
    {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"11:30","close":"14:30"},
    {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"17:00","close":"21:00"}
  ]'::jsonb,
  'Open', 'until', 'opens', 'see Visit',
  'Closed', 'Daily', 'Eastern time',
  'Kitchen open until', 'Kitchen'
)
on conflict (id) do update set
  updated_at = now();

-- ── Contact (copy from site_settings when present) ─────────────
insert into public.site_contact (
  id, email, telephone, telephone_display,
  street_address, address_locality, address_region, postal_code, address_country,
  maps_query, reserve_subject, instagram_url, instagram_label
)
select
  'default',
  coalesce(nullif(trim(s.email), ''), 'hello@zhethefold.com'),
  coalesce(nullif(trim(s.telephone), ''), '+12125550100'),
  coalesce(nullif(trim(s.telephone_display), ''), '(212) 555-0100'),
  coalesce(nullif(trim(s.street_address), ''), '200 Sample Street, Floor 1'),
  coalesce(nullif(trim(s.address_locality), ''), 'New York'),
  coalesce(nullif(trim(s.address_region), ''), 'NY'),
  coalesce(nullif(trim(s.postal_code), ''), '10013'),
  coalesce(nullif(trim(s.address_country), ''), 'US'),
  coalesce(nullif(trim(s.maps_query), ''), '200 Sample Street New York NY 10013'),
  coalesce(nullif(trim(s.reserve_subject), ''), 'Table ' || chr(183) || ' Zhe'),
  coalesce(nullif(trim(s.instagram_url), ''), 'https://instagram.com/zhe.thefold'),
  coalesce(nullif(trim(s.instagram_label), ''), 'Instagram')
from public.site_settings s
where s.id = 'default'
on conflict (id) do update set
  email = excluded.email,
  telephone = excluded.telephone,
  telephone_display = excluded.telephone_display,
  street_address = excluded.street_address,
  address_locality = excluded.address_locality,
  address_region = excluded.address_region,
  postal_code = excluded.postal_code,
  address_country = excluded.address_country,
  maps_query = excluded.maps_query,
  reserve_subject = excluded.reserve_subject,
  instagram_url = excluded.instagram_url,
  instagram_label = excluded.instagram_label,
  updated_at = now();

insert into public.site_contact (
  id, email, telephone, telephone_display,
  street_address, address_locality, address_region, postal_code, address_country,
  maps_query, reserve_subject, instagram_url, instagram_label
) values (
  'default',
  'hello@zhethefold.com', '+12125550100', '(212) 555-0100',
  '200 Sample Street, Floor 1', 'New York', 'NY', '10013', 'US',
  '200 Sample Street New York NY 10013',
  'Table ' || chr(183) || ' Zhe',
  'https://instagram.com/zhe.thefold', 'Instagram'
)
on conflict (id) do nothing;

-- ── Copy / chrome ───────────────────────────────────────────────
insert into public.site_copy (
  id, brand_name, brand_name_cn, brand_short, city, hero_line,
  seo_description, seo_title_suffix,
  nav_story, nav_menu, nav_visit,
  action_directions, action_call, action_reserve, action_reserve_nav,
  service_kicker, mode_table_label, mode_takeout_label,
  table_detail, takeout_detail, visit_find_us, visit_hours_label,
  section_story_en, section_story_cn, section_menu_en, section_menu_cn,
  section_visit_en, section_visit_cn,
  menu_note, menu_meta_house, menu_meta_shellfish,
  footer_tag, footer_rights, skip_to_menu
)
select
  'default',
  'Zhe ' || chr(183) || ' The Fold', '褶', 'Zhe', 'New York City',
  coalesce(nullif(trim(s.hero_line), ''), 'Handmade dumplings ' || chr(183) || ' table & takeout'),
  'Handmade Chinese dumplings in New York. A small hybrid room for the table or takeout. Every fold holds the mark of a hand.',
  'Handmade Dumplings in New York',
  'Story', 'Menu', 'Visit',
  'Directions', 'Call', 'Reserve', 'Reserve',
  coalesce(nullif(trim(s.service_kicker), ''), 'Join us'),
  'Table', 'Takeout',
  coalesce(nullif(trim(s.table_detail), ''), 'Walk-ins welcome ' || chr(183) || ' reserve for 4+'),
  coalesce(nullif(trim(s.takeout_detail), ''), 'Call ahead or walk up ' || chr(183) || ' no delivery'),
  'Find us', 'Hours',
  'The house', '小店', 'The Menu', '菜单', 'Visit', '造访',
  coalesce(nullif(trim(s.menu_note), ''), 'Steamed or pan-seared ' || chr(183) || ' About eight per order ' || chr(183) || ' Table or take home ' || chr(183) || ' Share allergies'),
  'House', 'Shellfish',
  'The imperfect pleats are the point',
  'All rights reserved.',
  'Skip to menu'
from public.site_settings s
where s.id = 'default'
on conflict (id) do update set
  hero_line = excluded.hero_line,
  service_kicker = excluded.service_kicker,
  table_detail = excluded.table_detail,
  takeout_detail = excluded.takeout_detail,
  menu_note = excluded.menu_note,
  updated_at = now();

insert into public.site_copy (
  id, brand_name, brand_name_cn, brand_short, city, hero_line,
  seo_description, seo_title_suffix,
  table_detail, takeout_detail, menu_note, footer_tag
) values (
  'default',
  'Zhe ' || chr(183) || ' The Fold', '褶', 'Zhe', 'New York City',
  'Handmade dumplings ' || chr(183) || ' table & takeout',
  'Handmade Chinese dumplings in New York. A small hybrid room for the table or takeout. Every fold holds the mark of a hand.',
  'Handmade Dumplings in New York',
  'Walk-ins welcome ' || chr(183) || ' reserve for 4+',
  'Call ahead or walk up ' || chr(183) || ' no delivery',
  'Steamed or pan-seared ' || chr(183) || ' About eight per order ' || chr(183) || ' Table or take home ' || chr(183) || ' Share allergies',
  'The imperfect pleats are the point'
)
on conflict (id) do nothing;

-- Prefer Call/Reserve if user already set them on bloated site_settings
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings'
      and column_name = 'action_call'
  ) then
    update public.site_copy c
    set
      action_call = coalesce(nullif(trim(s.action_call), ''), c.action_call),
      action_reserve = coalesce(nullif(trim(s.action_reserve), ''), c.action_reserve),
      action_directions = coalesce(nullif(trim(s.action_directions), ''), c.action_directions),
      action_reserve_nav = coalesce(nullif(trim(s.action_reserve_nav), ''), c.action_reserve_nav),
      updated_at = now()
    from public.site_settings s
    where s.id = 'default' and c.id = 'default';
  end if;
exception when others then null;
end $$;
