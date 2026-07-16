# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Craft port v1 stable after swipe revert |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Updated** | 2026-07-16 |
| **Kit** | `AGENTS.md` + static `BUILD_PLAYBOOK` §15/§16 |

## Done

- [x] Four-panel craft port (`zhe-craft.css` + assets)  
- [x] Vercel + GitHub auto-deploy  
- [x] **Reverted** dual-buffer + wall-swipe experiments (wrong UX on mobile)  

## Honesty

| Item | Status |
|------|--------|
| Four panels + original CSS | **done** (live) |
| Story chapter change | **buttons/dots** (chevrons) — works |
| Menu dish change | **tap rows / filters** — works |
| Wall / panel swipe | **removed** — wall-only never received touches under ledger; panel swipe on list was incorrect |
| Dual-buffer animation | **removed** with swipe commits |
| Adaptive nav tone | deferred |
| Phone swipe | do **not** re-add without human design call |

## Next (only after human says so)

- Prefer reliable controls (already present) over reintroducing swipe  
- If swipe returns: design first (where does finger land on mobile menu?) then §15  

## Blockers

None for demo.
