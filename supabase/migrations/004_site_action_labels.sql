-- Visit bottom CTA labels (Directions / Call / Reserve)
-- Run after 003_site_settings.sql

alter table public.site_settings
  add column if not exists action_directions text not null default 'Directions',
  add column if not exists action_call text not null default 'Call',
  add column if not exists action_reserve text not null default 'Reserve';

update public.site_settings
set
  action_directions = coalesce(nullif(trim(action_directions), ''), 'Directions'),
  action_call = 'Call',
  action_reserve = 'Reserve',
  updated_at = now()
where id = 'default';
