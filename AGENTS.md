# AGENTS.md — Zhe Next product app

**Workspace:** `/Users/kenneth/Desktop/Code/zhe-the-fold`  
**Live:** https://zhe-the-fold.vercel.app  
**Craft archive (design SSOT, do not delete):** `../Zhe-The-Fold-Website`

Process kit (read for freezes, honesty, QA): copy rules from static repo  
`../Zhe-The-Fold-Website/{BUILD_PLAYBOOK,PRODUCT,PROGRESS,QA_SCORECARD,OPS_RUNBOOK,GO_LIVE,MULTI_AGENT}.md`

## Cold start

1. Design truth = static site `styles.css` + panels — ported as `app/zhe-craft.css` + `public/assets/`  
2. Content SSOT = `lib/site.ts`, `menu.ts`, `story.ts`, `hours.ts`  
3. Stack: Next App Router + craft CSS (not Tailwind redesign)  
4. Ship: `git push origin main` → Vercel auto-deploy  
5. Phone QA after gesture/shell changes  

## Non-negotiables

- Do not overwrite static `Zhe-The-Fold-Website`  
- Ops content only in `lib/*` SSOT  
- Honesty: partial / untested called out  
- Mobile: no non-passive touch on scroll ancestors; wall-only gestures if added  
- Keep `robots: noindex` until real NAP  

## Session end

```bash
npm run build
git add -A && git commit -m "…" && git push origin main
```
