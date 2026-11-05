---
name: visual-check
description: Take Playwright screenshots of the home page at mobile, tablet and desktop widths in light and dark mode, inspect them, and list visual problems. Use after any UI change and before ticking a UI roadmap task.
---

# /visual-check

Screenshots are the most expensive thing in this repo. Shoot only what changed, and have only one
agent (main or subagent, never both) open the images.

1. No server needed: Playwright starts its own (or reuses one on :3000).
2. Pick the smallest shoot that covers the change. Env knobs on `tests/e2e/visual.spec.ts`:
   - `VISUAL_TILES="#contact,.tile--case"`: element crops of just those tiles (CSS selectors; tiles
     have ids like `#about`, `#estimator`, `#projects`, `#experience`, `#stack`, `#certifications`,
     `#contact`, and classes like `.tile--now`, `.tile--case`).
   - `VISUAL_THEMES="light"`: one theme.
   - `VISUAL_WIDTHS="390,1440"`: a subset of widths.

   Default for a UI task: changed tiles, light, at 390 and 1440 (add 1024 if spans or the grid
   changed):
   `VISUAL_TILES="<selectors>" VISUAL_THEMES=light VISUAL_WIDTHS=390,1440 npx playwright test tests/e2e/visual.spec.ts --project=chromium`
   Then dark at 390 only, and only if colours, tokens or theme code changed.
   Full-page, all widths and both themes: only for the end-of-milestone pass and before a release.
3. Files land in `tests/e2e/__screenshots__/latest/` (`tile-<selector>-<width>-<theme>.png` or
   `home-<width>-<theme>.png`). Check them against `docs/01-design-system.md`:
   - Spans correct for the breakpoint, no orphan tiles, no horizontal scroll (measure
     `scrollWidth > clientWidth` instead of eyeballing a full page)
   - Text contrast and hierarchy; estimator is the boldest element
   - Dark mode has no light-only colours leaking through
   - Nothing clipped, overlapping or cramped at 390px
4. After a fix, re-shoot only the affected tiles and widths.
5. Report findings as a short list: screenshot name, problem, suggested fix. Say "No issues" if clean.
   Don't commit screenshots (the folder is git-ignored).
