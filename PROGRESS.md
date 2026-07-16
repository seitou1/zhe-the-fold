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

## Phone polish (2026-07-16)

- [x] visualViewport `--shell-h` + past-hero / active nav link (`ShellChrome`)  
- [x] Larger Story dots/chevrons + menu row taps  
- [x] Open chip: hide meta on phone (state only)  
- [x] Visit CTAs full-width stack  
- [x] Menu type halo on rows  
- Phone QA: **human** on live URL after deploy  

## Calm hybrid menu (2026-07-16)

Synthesis of research options (1+2+3+5+6; soft 4 via active row):

| Rule | Implementation |
|------|----------------|
| Rest row | EN · price only |
| Active row | + CN, House/Shellfish, desc |
| Categories | Filters only; **no** list group headers |
| Default | **Classic** chapter |
| Photo | Wall only (print ledger) |
| Subagents | menu-panel.tsx ∥ zhe-craft.css (non-overlapping) |

Human: hard-refresh live Menu — should feel quieter.

## Blockers

None for demo.
