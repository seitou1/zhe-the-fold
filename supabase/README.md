# Supabase — Content CMS

Public **read** for menu, story, and site settings with static fallbacks in `lib/*`.  
No admin UI yet — edit in **Table Editor** (or re-run seed SQL).  
Homepage is `force-dynamic` so edits show on the next request.

**URL must be project root only** (no `/rest/v1`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # or sb_publishable_...
```

Health check: https://zhe-the-fold.vercel.app/api/cms-status  
(legacy: `/api/menu-status`)

---

## Tables

| Table | Static fallback | Edit for |
|-------|-----------------|----------|
| `menu_items` | `lib/menu.ts` | Dishes, prices, published |
| `story_chapters` | `lib/story.ts` | Origins House/Hands/Night |
| `site_settings` | `lib/site.ts` | Phone, address, hero line, menu note, Instagram, hybrid copy |

---

## Setup (new project — full)

1. Create Healthy project at [supabase.com](https://supabase.com).
2. Run SQL **in order**:

| # | File |
|---|------|
| 1 | `migrations/001_menu_items.sql` |
| 2 | `seed_menu_items.sql` |
| 3 | `migrations/002_story_chapters.sql` |
| 4 | `seed_story_chapters.sql` |
| 5 | `migrations/003_site_settings.sql` |
| 6 | `seed_site_settings.sql` |

3. Env: local `.env.local` + Vercel Production (URL **without** `/rest/v1`).
4. Redeploy once after env.
5. Check `/api/cms-status` → all three `"source":"supabase"`.

---

## If menu already works (this project)

Run only the **new** SQL (story + site), then hard-refresh.

1. SQL Editor → paste `migrations/002_story_chapters.sql` → Run  
2. Paste `seed_story_chapters.sql` → Run  
3. Paste `migrations/003_site_settings.sql` → Run  
4. Paste `seed_site_settings.sql` → Run  
5. Table Editor: `story_chapters` (3 rows), `site_settings` (1 row)  
6. Deploy latest code from GitHub, then open `/api/cms-status`

---

## Day-to-day

| Goal | Table |
|------|--------|
| Dish price / desc | `menu_items` |
| Hide dish | `menu_items.published = false` |
| Story body / labels | `story_chapters` |
| Real phone / address | `site_settings` (still keep noindex until real NAP) |
| Hero line / menu note | `site_settings` |

## RLS

- Public **SELECT** only (`published` for menu/story; site_settings always readable)
- Writes: Dashboard or service role only

## Later

- Password admin UI  
- Dish image Storage  
- Hours in CMS  
