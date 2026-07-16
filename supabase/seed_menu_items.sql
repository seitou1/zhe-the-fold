-- Seed from craft SSOT (lib/menu.ts). Safe to re-run (upsert).
-- Run after 001_menu_items.sql

insert into public.menu_items (
  id, category, cat_label, en, rail, cn, description, price,
  popular, tags, image, position, position_mobile, sort_order, published
) values
  (
    'pork', 'classic', 'Classic',
    'Pork & Napa Cabbage', 'Pork & Cabbage', '猪肉白菜褶',
    'Soft pork, sweet napa. The house classic, familiar as home.',
    '$14', true, array['pork'],
    '/assets/dish-pork.webp', 'center 52%', 'center 48%', 10, true
  ),
  (
    'beef', 'classic', 'Classic',
    'Beef & Scallion', 'Beef & Scallion', '牛肉大葱褶',
    'Northern heartiness in a thin skin. Bright scallion, quiet soy.',
    '$16', false, array['beef'],
    '/assets/dish-beef.webp', 'center 52%', 'center 48%', 20, true
  ),
  (
    'shrimp', 'classic', 'Classic',
    'Shrimp & Chive', 'Shrimp & Chive', '虾仁韭菜褶',
    'Sweet shrimp and fragrant chive, sealed with uneven creases.',
    '$18', true, array['shellfish'],
    '/assets/dish-shrimp.webp', 'center 52%', 'center 48%', 30, true
  ),
  (
    'bamboo', 'seasonal', 'Seasonal',
    'Bamboo Shoot & Pork', 'Bamboo & Pork', '春笋鲜肉褶',
    'Crisp spring bamboo meeting slow-cooked pork.',
    '$17', false, array['pork', 'seasonal'],
    '/assets/dish-bamboo.webp', 'center 52%', 'center 48%', 40, true
  ),
  (
    'crab', 'seasonal', 'Seasonal',
    'Crab Roe', 'Crab Roe', '蟹粉小笼褶',
    'Delicate crab roe and broth that warms the palm first.',
    '$22', false, array['shellfish', 'seasonal'],
    '/assets/dish-crab.webp', 'center 52%', 'center 48%', 50, true
  ),
  (
    'chestnut', 'seasonal', 'Seasonal',
    'Chestnut & Chicken', 'Chestnut & Chicken', '栗子鸡肉褶',
    'Autumn chestnuts and tender chicken. Earth and steam.',
    '$16', false, array['poultry', 'seasonal'],
    '/assets/dish-chestnut.webp', 'center 52%', 'center 48%', 60, true
  ),
  (
    'mushroom', 'plant', 'Plant-based',
    'Mushroom & Greens', 'Mushroom & Greens', '香菇青菜褶',
    'Wood-ear depth and garden greens, folded without hurry.',
    '$13', true, array['plant'],
    '/assets/dish-mushroom.webp', 'center 52%', 'center 48%', 70, true
  ),
  (
    'tofu', 'plant', 'Plant-based',
    'Tofu & Daikon', 'Tofu & Daikon', '豆腐萝卜褶',
    'Silken tofu and mild daikon. Clean and quiet.',
    '$12', false, array['plant'],
    '/assets/dish-tofu.webp', 'center 52%', 'center 48%', 80, true
  )
on conflict (id) do update set
  category = excluded.category,
  cat_label = excluded.cat_label,
  en = excluded.en,
  rail = excluded.rail,
  cn = excluded.cn,
  description = excluded.description,
  price = excluded.price,
  popular = excluded.popular,
  tags = excluded.tags,
  image = excluded.image,
  position = excluded.position,
  position_mobile = excluded.position_mobile,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
