# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Full chrome CMS (menu/story/site_settings + migration 005) |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Workspace** | `~/Desktop/Code/zhe-the-fold` |
| **Updated** | 2026-07-16 |
| **Kit** | `AGENTS.md` + static QA kit |

## Done

- [x] Four-panel craft + Vercel  
- [x] Hybrid journey, place-first story, dish/video polish  
- [x] Menu CMS live (`source: supabase` verified)  
- [x] Story + site_settings CMS **code** (run SQL 002/003 + seeds on project)  

## Honesty

| Item | Status |
|------|--------|
| Menu CMS | **live** |
| Story CMS | **live** (after 002+seed) |
| Site settings CMS | **live** + full chrome cols via **005** (run SQL) |
| Deploy fix | client must not import `lib/data/site` (server) — use `site-types` / `site-static` |
| Visit Call/Reserve | CMS `action_call` / `action_reserve` |
| Sample NAP | **fiction** — noindex held |
| Admin write UI | **not built** — Table Editor only |
| Phone QA | **good** (prior human confirm) |

## Blockers for *live index*

1. Real NAP + booking  
2. Flip noindex only after real NAP  

## Blockers for *craft demo*

None (static fallback always works).

## Next tracks

- C2: password admin for menu  
- B: polish / real NAP when available  
