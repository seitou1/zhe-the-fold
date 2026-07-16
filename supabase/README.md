# Supabase — Menu CMS

## First milestone

Public **read** of `menu_items` with static fallback in `lib/menu.ts`.  
No admin UI yet — edit rows in the Supabase Table Editor (or re-run seed).

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL → New query** → run `migrations/001_menu_items.sql`.
3. Run `seed_menu_items.sql`.
4. **Project Settings → API** → copy URL + anon key into `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# optional later for admin writes
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

5. Redeploy / restart `npm run dev`.

If env is missing or the table is empty, the site still serves `MENU_ITEMS` from `lib/menu.ts`.

## RLS

- `anon` / `authenticated`: **SELECT** where `published = true`
- Inserts/updates: Dashboard or service role only (no public write policy)

## Next (later sessions)

- Admin login + form to edit price/desc
- Storage for dish photos
- Site settings / story chapters tables
