-- Point live story CMS rows at craft-archive stills.
-- Safe after files are restored into public/assets/.

update public.story_chapters set
  image = '/assets/story-village.webp',
  position = '42% 48%',
  position_mobile = 'center 45%',
  updated_at = now()
where id = 'house';

update public.story_chapters set
  image = '/assets/story-fold.webp',
  position = '50% 42%',
  position_mobile = 'center 40%',
  updated_at = now()
where id = 'hands';

update public.story_chapters set
  image = '/assets/story-city.webp',
  position = '42% 40%',
  position_mobile = 'center 38%',
  updated_at = now()
where id = 'night';
