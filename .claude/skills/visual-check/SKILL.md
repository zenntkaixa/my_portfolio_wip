---
name: visual-check
description: Take Playwright screenshots of the home page at mobile, tablet and desktop widths in light and dark mode, inspect them, and list visual problems. Use after any UI change and before ticking a UI roadmap task.
---

# /visual-check

1. Make sure the dev server is running on http://localhost:3000 (start `npm run dev` in the background
   if not, and wait until it responds).
2. Run: `npx playwright test tests/e2e/visual.spec.ts --project=chromium`
   This saves full-page screenshots to `tests/e2e/__screenshots__/latest/`:
   `home-390-light.png`, `home-390-dark.png`, `home-1024-light.png`, `home-1024-dark.png`,
   `home-1440-light.png`, `home-1440-dark.png`.
3. Open each screenshot and check against `docs/01-design-system.md`:
   - Bento spans correct for the breakpoint, no orphan tiles, no horizontal page scroll
   - Text contrast and hierarchy; estimator is the boldest element
   - Dark mode has no light-only colours leaking through
   - Nothing clipped, overlapping or cramped at 390px
4. Report findings as a short list: screenshot name, problem, suggested fix. Say "No issues" if clean.
5. Don't commit screenshots (the folder is git-ignored).
