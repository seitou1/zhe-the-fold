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

## Next steps

- Port menu / story content (or load from Supabase)
- Real NAP, hours, Resy URL
- Media from the static site assets folder
- Flip `robots` metadata when launch-ready
