-- Seed from lib/site.ts (sample NAP — keep noindex until real). Safe upsert.
-- Middle dots via chr(183) so paste encoding cannot produce Â·
-- Run after 003_site_settings.sql

insert into public.site_settings (
  id,
  email, telephone, telephone_display,
  street_address, address_locality, address_region, postal_code, address_country,
  maps_query, reserve_subject, hero_line, menu_note,
  instagram_url, instagram_label,
  service_kicker, table_detail, takeout_detail
) values (
  'default',
  'hello@zhethefold.com',
  '+12125550100',
  '(212) 555-0100',
  '200 Sample Street, Floor 1',
  'New York',
  'NY',
  '10013',
  'US',
  '200 Sample Street New York NY 10013',
  'Table ' || chr(183) || ' Zhe',
  'Handmade dumplings ' || chr(183) || ' table & takeout',
  'Steamed or pan-seared ' || chr(183) || ' About eight per order ' || chr(183) || ' Table or take home ' || chr(183) || ' Share allergies',
  'https://instagram.com/zhe.thefold',
  'Instagram',
  'Join us',
  'Walk-ins welcome ' || chr(183) || ' reserve for 4+',
  'Call ahead or walk up ' || chr(183) || ' no delivery'
)
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
  hero_line = excluded.hero_line,
  menu_note = excluded.menu_note,
  instagram_url = excluded.instagram_url,
  instagram_label = excluded.instagram_label,
  service_kicker = excluded.service_kicker,
  table_detail = excluded.table_detail,
  takeout_detail = excluded.takeout_detail,
  updated_at = now();
