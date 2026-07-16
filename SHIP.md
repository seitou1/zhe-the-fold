# Ship / learn — getting Zhe on the internet

Plain-English guide. The static craft site stays separate; this is the **Next product** path.

## What you already “shipped” locally

| Command | Meaning |
|---------|---------|
| `npm run build` | Prove the site compiles for production |
| `npm run start` | Run that production build on your Mac (best for phone on Wi‑Fi) |

That’s the same build pipeline the internet uses. Deploy = “run that build on someone else’s computer and give you a URL.”

## Before you deploy (checklist)

- [ ] `nvm use 20`
- [ ] `npm run ship:check` (alias for `build`) succeeds
- [ ] Site is still **noindex** (see `app/layout.tsx` `robots`) — good while NAP is sample
- [ ] You know sample address/phone are placeholders (Visit section already says so)

## Option A — Vercel (recommended for learning)

Vercel hosts Next.js for free on a hobby plan. You get a URL like `zhe-the-fold-xxx.vercel.app`.

### 1. One-time login (on your Mac)

```bash
cd /Users/kenneth/Desktop/Code/zhe-the-fold
nvm use 20
npx vercel login
```

Follow the browser / email prompt.

### 2. First deploy

```bash
npx vercel
```

Accept defaults for a hobby project (link to existing scope, no custom domain yet).

### 3. Production deploy

```bash
npx vercel --prod
```

Copy the **Production** URL. Open it on your phone **off** home Wi‑Fi to prove it works anywhere.

### 4. Later updates

```bash
# after code changes
npm run ship:check
npx vercel --prod
```

Or connect a GitHub repo in the Vercel dashboard so every `git push` deploys automatically (best long-term habit).

## Option B — GitHub + Vercel (best habit)

1. Create an empty GitHub repo (e.g. `zhe-the-fold`).
2. Do **not** push into `Zhe-The-Fold-Website` (that’s the static craft demo).
3. From this folder:

```bash
git remote add origin https://github.com/YOUR_USER/zhe-the-fold.git
git push -u origin main
```

4. In [vercel.com](https://vercel.com) → **Add New Project** → import that repo → Deploy.

## What not to do yet

| Skip | Why |
|------|-----|
| Real domain / DNS | Optional until launch |
| Flip `robots` to index | Sample NAP would teach Google wrong address |
| Supabase on day of first deploy | Not required for the current site |
| Overwrite the static GitHub Pages site | Keep craft demo and product app separate |

## Learning takeaway

- **Build** = “does it compile?”
- **Start** = “does production mode run on my machine?”
- **Deploy** = “can a stranger open a URL?”

You’re not behind because it doesn’t look like the snap-panel demo. For ship/learn, a working URL + clear content (menu, visit, story) is the win.
