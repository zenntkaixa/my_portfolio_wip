# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 59: Now stats count up (M7)

**Done**
- Release #69 (M6) confirmed live by Izzat: the human check passes silently, and a real "With AI
  agents" estimate ran through the new layout and the Budget tab.
- The Now stats count up from 0 once on load: a registered `--stat-n` integer through a CSS counter,
  no JS. The real value is in an `.sr-only` span; reduced motion shows it at once.
- Scope cut agreed with Izzat: no hover lift (no tile is clickable); timeline bars already animate.

**Verified**
- `npm run check`, e2e (new count-up and reduced-motion tests); sampled 5/66/9 → 8/100/13 in 0.9s.

**Next:** M7 item 2, keyboard Tab-order test on the fake Turnstile.

---

## 2026-11-17 — Session 58: Hero headline with a proof line (M6 done)

**Done**
- Hero headline is now "I build the systems insurers and banks run on." (display font, `--fs-xl`),
  with a proof line under it: "Shipped at PwC · Allianz Technology · Hitachi" and "AWS Certified
  Solutions Architect". Wording picked by Izzat. The AI-agents angle moved into the summary.
- Search and share descriptions keep the fuller sentence via `seo.description`.

**Verified**
- `npm run check`, e2e, hero screenshots at 390/1024/1440 (light and dark). Small copy and CSS
  diff, so no `reviewer` run (CLAUDE.md section 4).

**Next:** M6 is complete. Release #67 and this when Izzat asks.

---

