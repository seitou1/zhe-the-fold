# Zhe · The Fold (Next.js)

Product path for **Zhe · The Fold** — handmade dumplings in NYC.

Focus: **ship / learn** (usable site on a modern stack).  
Craft lookbook: sibling static demo `../Zhe-The-Fold-Website` — **do not delete**.

## Requirements

- **Node.js ≥ 20.9**
- npm 10+

```bash
nvm use 20
cd /Users/kenneth/Desktop/Code/zhe-the-fold
npm install
```

## Run locally

```bash
# Dev (hot reload) — fine on Mac; phone on Wi‑Fi can be flaky with Turbopack
npm run dev

# Production mode — better for testing on phone (same Wi‑Fi)
npm run ship:preview
```

- Mac: [http://localhost:3000](http://localhost:3000)
- Phone (same Wi‑Fi): `http://YOUR_MAC_IP:3000` (e.g. `http://192.168.1.31:3000`)

## What’s on the site

| Section | Status |
|---------|--------|
| Hero + nav | Done (open chip, Reserve) |
| Story | 3 chapters + photos |
| Menu | Filters, dishes, thumbs, expand for desc |
| Visit | Hours, sample NAP, Directions / Reserve / Call |
| Supabase | Wired, unused |
| SEO index | **Off** (`noindex`) until real NAP |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run build` / `ship:check` | Production compile |
| `npm run start` / `ship:preview` | Serve production build |
| `npm run lint` | ESLint |

## Deploy

See **[SHIP.md](./SHIP.md)** — Vercel login + first URL, and optional GitHub.

## Environment (optional)

Copy `.env.local.example` → `.env.local` when you use Supabase.

| Variable | Public? |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** |

## Structure

```
app/              # routes + layout
components/       # live panels + chrome only
lib/              # site, menu, story, hours SSOT
public/assets/    # craft images + video + fonts
SHIP.md           # how to put it on the internet
```

## Ship / learn next (after deploy)

1. Share the Vercel URL; test off home Wi‑Fi  
2. Small polish only if something confuses guests  
3. Supabase later if editing menu files gets old  
4. Real NAP + `index` only when launch-ready  
