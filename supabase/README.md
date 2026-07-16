# Supabase — Content CMS (split site tables)

## Tables (edit these)

| Table | Purpose | Edit for |
|-------|---------|----------|
| **`menu_items`** | Dishes | Price, name, desc, published |
| **`story_chapters`** | Origins | House / Hands / Night |
| **`site_hours`** | Schedule + open chip | When open, timezone, closed days, chip words |
| **`site_contact`** | NAP / contact | Phone, email, address, maps, Instagram |
| **`site_copy`** | Brand & chrome | Name, hero, nav, Call/Reserve, sections, footer |

Legacy **`site_settings`** may still exist (old fat row). The app prefers the three split tables; you can ignore `site_settings` after the split seed.

Each of `site_hours` / `site_contact` / `site_copy` has **one row** with `id = default`.

---

## Setup order

### Already have menu + story + old site_settings

1. Run `migrations/007_site_split.sql`  
2. Run `seed_site_split.sql` (copies phone/address/etc. from old row when possible)  
3. Deploy latest app code  
4. Check `/api/cms-status` → `site.slices` all `supabase`

### Fresh project

1. `001` + seed menu  
2. `002` + seed story  
3. `007` + `seed_site_split` (skip bloated `003` if you want)  
4. Env + deploy  

---

## Where to change hours (open chip)

**Table Editor → `site_hours` → `default`**

| Column | Meaning |
|--------|---------|
| `timezone` | e.g. `America/New_York` |
| `closed_weekdays` | e.g. `Mon` |
| `note` | e.g. `Closed Mondays` |
| `periods` | JSON open windows (see below) |
| `kitchen_open` / `kitchen_until` / `kitchen_opens` | Chip wording |

```json
[
  {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"11:30","close":"14:30"},
  {"days":["Tue","Wed","Thu","Fri","Sat","Sun"],"open":"17:00","close":"21:00"}
]
```

---

## Where to change Call / Reserve

**`site_copy`** → `action_call`, `action_reserve`, `action_directions`, `action_reserve_nav`

## Where to change phone / address

**`site_contact`**

---

## Env

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # no /rest/v1 on URL
```

Health: `/api/cms-status`

## RLS

Public **SELECT** only on all content tables. Writes via Dashboard.
