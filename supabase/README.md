# Supabase — Full content CMS

Public **read** for menu, story, and **all guest chrome** via `site_settings`.  
Static fallbacks in `lib/*` if env/DB fails. Homepage + layout are `force-dynamic`.

**URL must be project root only** (no `/rest/v1`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Health: https://zhe-the-fold.vercel.app/api/cms-status

---

## What lives where

| Content | Table / edit |
|---------|----------------|
| Dishes, prices, tags | `menu_items` |
| Origins chapters | `story_chapters` |
| Brand, NAP, nav, Visit CTAs, hours, footer, section titles, kitchen chip | `site_settings` (row `default`) |
| Video/image **files** | still `/public/assets` (paths not CMS yet) |

---

## Migrations (order)

1. `001_menu_items.sql` + `seed_menu_items.sql`  
2. `002_story_chapters.sql` + `seed_story_chapters.sql`  
3. `003_site_settings.sql` + `seed_site_settings.sql`  
4. `004_site_action_labels.sql` (optional if 005 covers it)  
5. **`005_site_full_chrome.sql`** — brand, nav, CTAs, hours, kitchen, footer  

If menu/story/site already work, run **only 005**.

---

## Key `site_settings` columns (Visit buttons)

| Column | UI |
|--------|-----|
| `action_directions` | Directions |
| `action_call` | Call (phone) |
| `action_reserve` | Reserve (email) |
| `action_reserve_nav` | Nav chip |
| `mode_table_label` / `mode_takeout_label` | Join us mode names |
| `table_detail` / `takeout_detail` | Join us details |
| `nav_story` / `nav_menu` / `nav_visit` | Top nav |
| `brand_name` / `brand_name_cn` / `hero_line` / `city` | Hero |
| `hours_note` / `hours_closed_weekdays` / `hours_periods` | Hours |
| `section_*_en` / `section_*_cn` | Panel titles |

`hours_periods` is JSON, e.g.:

```json
[
  {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"11:30","close":"14:30"},
  {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"17:00","close":"21:00"}
]
```

---

## RLS

- Public **SELECT** only  
- Writes: Dashboard or service role  

## Not yet CMS

- Admin UI  
- Dish photo upload (Storage)  
- Media file paths  
