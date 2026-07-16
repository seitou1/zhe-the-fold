# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Menu CMS (Supabase read + static fallback) · fiction noindex |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Commit audited** | `059244d` (tree clean on main) |
| **Updated** | 2026-07-16 |
| **Kit** | `AGENTS.md` + static `QA_SCORECARD` A–J + `BUILD_PLAYBOOK` §13/§14 |

## Done (session trail)

- [x] Four-panel craft port + Vercel auto-deploy  
- [x] Hybrid journey copy (hero / Visit Join us / Table·Takeout)  
- [x] Place-first story: House · Hands · Night  
- [x] Menu dish regen + mobile wall crop fix  
- [x] Hero/Visit video 720p regen  
- [x] Hero scroll cue removed  
- [x] Dead components / orphan assets pruned  

## Honesty

| Item | Status |
|------|--------|
| Four panels live | **done** |
| Story chapter change | **pips + swipe** — automated OK; **human phone D2 not re-scored this audit** |
| Menu dish open/close | **tap rows** — works in code path |
| Wall/panel swipe between sections | **removed** (do not re-add without design call) |
| Phone QA full scorecard D | **human required** on live URL |
| Sample NAP | **fiction** — noindex held |
| `check-launch.mjs` | **N/A** (static kit script; Next gate adapted ad hoc this audit) |
| ESLint | **0 errors** (1 known warning: manual fonts.css link) |
| Phone QA (human) | **good** (owner-confirmed 2026-07-16) |
| Dead menu spotlight/rail/carousel CSS | **removed** |
| Menu CMS | **code ready** — table SQL + seed + `getMenuItems()`; needs project env + run SQL |
| Supabase scaffold | client/server + fallback when env missing |

## Blockers for *live index*

1. Real NAP + booking  
2. Apply menu SQL + env on Supabase/Vercel to leave static fallback

## Blockers for *craft demo*

None.
