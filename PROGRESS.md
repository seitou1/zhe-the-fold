# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Craft demo / fiction preview (not live index) |
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
| ESLint | **2 errors** (menu-panel refs, use-panel-video setState) — not blocking build |
| Legacy CSS (spotlight/rail) | **still in zhe-craft.css**, no component usage |

## Blockers for *live index*

1. Real NAP + booking  
2. Human phone QA (story swipe both ways, menu fold, visit actions)  
3. Optional: strip dead menu spotlight/rail CSS; fix lint errors  

## Blockers for *craft demo*

None critical if honesty rows stay visible. ESLint debt + dead CSS are polish, not demo blockers.
