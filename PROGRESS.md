# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Craft parity — dual-buffer walls + wall-only swipe |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Updated** | 2026-07-16 |
| **Kit** | `AGENTS.md` + static `BUILD_PLAYBOOK` §15/§16 |

## Session goal (this chunk)

Dual-buffer Story + Menu walls; wall-only swipe; ship to Vercel.

## Done

- [x] Four-panel craft port (`zhe-craft.css` + assets)  
- [x] Vercel + GitHub auto-deploy  
- [x] Dual-buffer Story wall + wall swipe (`use-wall-swipe` on `.story-wall` only)  
- [x] Dual-buffer Menu wall + wall swipe (`.menu-wall` only; ledger scroll untouched)  

## Honesty

| Item | Status |
|------|--------|
| Dual-buffer Story | **done** (opacity crossfade layers; not full leave/enter sweep) |
| Dual-buffer Menu | **done** (A/B buffer swap) |
| Wall swipe | **fixed** — panel-level + axis lock (ledger covers wall on mobile; wall-only never fired). Human re-QA |
| Adaptive nav tone | **deferred** (frozen/out of session) |
| Static repo | **untouched** |

## Next

- Human phone QA: Story/Menu swipe + list scroll + filters  
- Optional full sweep classes if crossfade feels thin  
- Real NAP only at launch  

## Blockers

None for demo.
