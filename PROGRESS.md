# PROGRESS — Zhe Next product

| Field | Value |
|-------|--------|
| **Phase** | Craft parity port (panel system) |
| **Live** | https://zhe-the-fold.vercel.app |
| **GitHub** | https://github.com/seitou1/zhe-the-fold |
| **Updated** | 2026-07-16 |

## Done

- [x] Ship/learn shell, menu data, visit facts, story chapters  
- [x] Progressive HTML fixes for mobile taps  
- [x] Vercel + GitHub auto-deploy  
- [x] **Craft port v1:** `zhe-craft.css` + assets; four panels (Hero video, Story wall, Menu plate+ledger, Visit video); original nav/footer chrome  

## Partial / known gaps vs static

- Story wall: single image swap (not dual-layer sweep animation)  
- Menu wall: single layer crossfade (not dual-buffer swap animation)  
- Adaptive luminance tone for nav light/dark plates not fully ported  
- Wall swipe gestures not re-added yet (filters/rows use click — safer on mobile)  
- Scroll-progress + snap depend on craft CSS mobile shell  

## Next

- Phone QA on live URL  
- Gesture parity if needed (wall-only swipe)  
- Dual-buffer wall animation if gap is obvious  
- Real NAP only at launch  

## Blockers

None for demo.
