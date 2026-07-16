# Zhe · The Fold

Next.js App Router site for **Zhe · The Fold** — handmade Chinese dumplings in New York.

Warm void shell, serif display type, mobile-first layout. Supabase clients are wired but not required to run the home page.

> Sibling static craft demo (if present): `../Zhe-The-Fold-Website`

## Requirements

- **Node.js ≥ 20.9** (Next 16)
- npm 10+

```bash
# if you use nvm
nvm use 20
```

## Setup

```bash
cd zhe-the-fold
npm install
cp .env.local.example .env.local   # fill Supabase keys when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Environment

| Variable | Public? | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server-only admin key |

Helpers (throw only when called):

- `lib/supabase/client.ts` — browser
- `lib/supabase/server.ts` — RSC / route handlers

## Structure

```
app/           # App Router pages + layout + globals
components/    # Header, hero, footer, section heading
lib/           # site SSOT + supabase clients
public/        # static assets
```

## Brand tokens

| Token | Use |
|-------|-----|
| `void` `#12100e` | Background |
| `cream` `#faf8f4` | Primary type |
| `wheat` `#d0c0a0` | Accent / CTAs |
| `clay` `#a67c52` | Secondary warmth |
| Source Serif 4 | Display / titles |
| Outfit | UI / body |

## Relation to the original static site

| | Path | Role |
|---|------|------|
| **Original craft demo** | `../Zhe-The-Fold-Website` | Design source of truth — **do not delete** |
| **This Next app** | `zhe-the-fold` | Rebuild/port over time |

We port pieces deliberately (nav open-chip + hero first). Extra scaffold CTAs that weren’t in the original were removed.

## Next steps

- Port menu list from static `data.js` → `lib/menu.ts`
- Visit hours + directions CTAs
- Story chapters + media
- Optional: hero video loop
- Supabase when editing code for prices gets old
- Flip `robots` metadata when launch-ready
