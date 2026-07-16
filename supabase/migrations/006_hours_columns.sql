-- Hours + kitchen chip columns only (if full 005 not applied yet).
-- Safe to re-run. Does not overwrite non-null values.

alter table public.site_settings
  add column if not exists hours_timezone text,
  add column if not exists hours_note text,
  add column if not exists hours_closed_weekdays text,
  add column if not exists hours_periods jsonb,
  add column if not exists kitchen_open text,
  add column if not exists kitchen_until text,
  add column if not exists kitchen_opens text,
  add column if not exists kitchen_see_visit text,
  add column if not exists kitchen_closed_prefix text,
  add column if not exists kitchen_daily text,
  add column if not exists kitchen_eastern text,
  add column if not exists kitchen_title_open text,
  add column if not exists kitchen_title_closed text;

update public.site_settings set
  hours_timezone = coalesce(hours_timezone, 'America/New_York'),
  hours_note = coalesce(hours_note, 'Closed Mondays'),
  hours_closed_weekdays = coalesce(hours_closed_weekdays, 'Mon'),
  hours_periods = coalesce(
    hours_periods,
    '[
      {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"11:30","close":"14:30"},
      {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"17:00","close":"21:00"}
    ]'::jsonb
  ),
  kitchen_open = coalesce(kitchen_open, 'Open'),
  kitchen_until = coalesce(kitchen_until, 'until'),
  kitchen_opens = coalesce(kitchen_opens, 'opens'),
  kitchen_see_visit = coalesce(kitchen_see_visit, 'see Visit'),
  kitchen_closed_prefix = coalesce(kitchen_closed_prefix, 'Closed'),
  kitchen_daily = coalesce(kitchen_daily, 'Daily'),
  kitchen_eastern = coalesce(kitchen_eastern, 'Eastern time'),
  kitchen_title_open = coalesce(kitchen_title_open, 'Kitchen open until'),
  kitchen_title_closed = coalesce(kitchen_title_closed, 'Kitchen'),
  updated_at = now()
where id = 'default';
