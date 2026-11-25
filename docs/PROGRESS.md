# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 102: R2 refine stability measured, prompt rule dropped (M15)

**Done** on `chore/m15-refine-overlap-eval` (Izzat: "do R2", then "option 2"; live eval allowed, two runs).
- Eval prints "refine task overlap" (share of old tasks kept, reworded names count) with a same-brief baseline.
- A "keep the same phases and task names" prompt rule kept 17% and 24% (baseline 39%, 52%); reverted, no gain.
- Open question: the "large" brief was refused ("one feature at a time") in both runs; no control run, so not
  known whether that predates this session.
- Next: release G4a and R3 when Izzat asks; option 1 (send previous task names) only if refines matter to visitors.

## 2026-11-25 — Session 101: release #138, G4a and R3 (M15)

**Done** on `feat/m15-gif-crop-refine-row` (Izzat: "go", review 2026-11-25 19:20).
- Released #138 (fbcb894); dev-update 2026-11-25-1903 in Drive.
- G4a: GIF cropped to the player (540×400), no buffering frame; ≤720 px loads a 420×512 phone crop (no About
  frame). Player text scale on phone 0.36 → 0.68, desktop 0.53 → 0.78. Reduced motion keeps one wide still.
- R3: refine note is one row ("Refined: Medium → High · 233 → 216 h · RM 18.5k–28.4k → …") plus a reason line;
  "Re-drafted from your answers." drops its hour delta (now in the row).
- check 418; estimator + home e2e 44/44; source per width checked at 360 and 1440.
- Next: S3 is Izzat's; R2 optional (prompt work, paid eval).
