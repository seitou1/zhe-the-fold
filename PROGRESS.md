# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Content CMS live (split site tables) — **paused** |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Workspace** | `~/Desktop/Code/zhe-the-fold` only |
| **Updated** | 2026-07-16 |
| **Health** | https://zhe-the-fold.vercel.app/api/cms-status |

## Verified live (cms-status)

- menu → `supabase` (8 dishes)
- story → `supabase` (House / Hands / Night)
- site slices → hours + contact + copy all `supabase`
- Visit CTAs → Call / Reserve from CMS
- Phone etc. editable via `site_contact`

---

## Done

### Product / craft
- [x] Four-panel Next craft site (Hero · Story · Menu · Visit) + footer  
- [x] Hybrid journey copy (table + takeout)  
- [x] Place-first Origins: House · Hands · Night  
- [x] Dish stills + mobile wall crops; hero/visit 720p video  
- [x] Legibility system (no panel dim; tone + shadow)  
- [x] Dead code / dead CSS pruned; Supabase scaffold kept  
- [x] Guest copy SSOT in `lib/*` with CMS overlay  
- [x] Human phone QA: good (prior session)  
- [x] `robots: noindex` held (sample NAP)  

### Workspace
- [x] Consolidated to `~/Desktop/Code/zhe-the-fold`  
- [x] Removed Grok worktree under `~/.grok/worktrees/...`  

### Backend / CMS
- [x] Supabase project connected (env local + Vercel)  
- [x] `menu_items` + seed + public read RLS  
- [x] `story_chapters` + seed  
- [x] Split site CMS (replaced bloated single row as primary):  
  - **`site_hours`** — schedule, timezone, open-chip wording  
  - **`site_contact`** — phone, email, address, maps, Instagram  
  - **`site_copy`** — brand, hero, nav, Call/Reserve, sections, footer  
- [x] App merges slices in `getSiteOps()` + static fallback  
- [x] Legacy `site_settings` still readable as fallback if split missing  
- [x] Diagnostics: `/api/cms-status`, `/api/menu-status`  
- [x] Soft Supabase client (trim URL, strip accidental `/rest/v1`)  

### Day-to-day edit map
| Content | Table |
|---------|--------|
| Dishes | `menu_items` |
| Story | `story_chapters` |
| Hours / open chip | `site_hours` |
| NAP / phone | `site_contact` |
| Brand / CTAs / nav | `site_copy` |

Ignore fat **`site_settings`** for new edits.

---

## Left / next (when resuming)

### Product
- [ ] Real NAP (address, phone, hours) then drop **noindex**  
- [ ] Real booking / reserve path if not mailto forever  
- [x] Middle-dot fix: run `supabase/fix_middle_dot_site_copy.sql` in SQL Editor (chr(183))  
- [ ] Optional: strip `/rest/v1` from env URL cleanly (`rawUrlHadRestPath` still true but code normalizes)  

### Backend
- [ ] Password **admin UI** (C2) — edit without Table Editor  
- [ ] Supabase **Storage** for dish photos (paths still `/assets/...`)  
- [ ] Optional: drop or archive legacy `site_settings` after confidence period  
- [ ] Hours periods JSON editor UX (still raw JSON in Table Editor)  

### QA / ops
- [ ] Re-run phone scorecard after CMS/layout changes if needed  
- [ ] Confirm Vercel env = same project as dashboard  
- [ ] Keep Node 20+ for local builds  

### Not in scope yet
- Delivery integrations  
- Multi-language CMS  
- Auth for guests  

---

## Blockers for *public index / go-live*

1. Real NAP + honesty on hours/booking  
2. Flip `robots` only after that  
3. Final legal/ops pass  

## Blockers for *demo / craft*

**None** — site works with CMS or static fallback.

---

## Resume checklist

```bash
cd ~/Desktop/Code/zhe-the-fold
git pull origin main
# Node 20+
npm run dev
# Health: http://localhost:3000/api/cms-status
# Live:   https://zhe-the-fold.vercel.app/api/cms-status
```

Docs: `AGENTS.md`, `supabase/README.md`.
