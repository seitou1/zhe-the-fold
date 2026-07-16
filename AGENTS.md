# AGENTS.md — Zhe Next product app

**Workspace:** `/Users/kenneth/Desktop/Code/zhe-the-fold`  
**Live:** https://zhe-the-fold.vercel.app  
**Craft archive (design SSOT, do not delete):** `../Zhe-The-Fold-Website`

Process kit (read for freezes, honesty, QA): copy rules from static repo  
`../Zhe-The-Fold-Website/{BUILD_PLAYBOOK,PRODUCT,PROGRESS,QA_SCORECARD,OPS_RUNBOOK,GO_LIVE,MULTI_AGENT}.md`

## Cold start

1. Design truth = static site `styles.css` + panels — ported as `app/zhe-craft.css` + `public/assets/`  
2. Content SSOT = `lib/site.ts` (brand, chrome, visit, media, kitchen) + `menu.ts` + `story.ts` + `hours.ts` (reads site.hours). **No guest-facing copy hard-coded in components.**
3. Stack: Next App Router + craft CSS (not Tailwind redesign)  
4. Ship: `git push origin main` → Vercel auto-deploy  
5. Phone QA after gesture/shell changes  

## Backend (Content CMS)

- `lib/supabase/{client,server}.ts` + `@supabase/supabase-js`  
- `lib/data/{menu,story,site}.ts` — Supabase **or** static `lib/*` fallback  
- SQL: `supabase/migrations/001_menu_items.sql`, `002_story_chapters.sql`, `003_site_settings.sql` + seeds  
- Setup + Table Editor: `supabase/README.md` · health: `/api/cms-status`  
- Env: `.env.local.example` — URL **without** `/rest/v1`  
- Do **not** delete scaffold; next: admin UI / Storage

## Non-negotiables

- Do not overwrite static `Zhe-The-Fold-Website`  
- Ops content only in `lib/*` SSOT (until Supabase is the live SSOT)  
- Honesty: partial / untested called out  
- Mobile: no non-passive touch on scroll ancestors; wall-only gestures if added  
- Keep `robots: noindex` until real NAP  
- **Legibility:** open photo walls (no panel dim). Type uses panel `--tone-fg` + `--tone-shadow*`. No per-page halo tokens. Nav scrim only; menu open-row mat is the sole layout exception. Details: `app/zhe-craft.css` contract comment.

## Session end

```bash
npm run build
git add -A && git commit -m "…" && git push origin main
```
