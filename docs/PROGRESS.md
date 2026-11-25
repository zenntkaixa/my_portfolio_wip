# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 101: release #138, G4a and R3 (M15)

**Done** on `feat/m15-gif-crop-refine-row` (Izzat: "go", review 2026-11-25 19:20).
- Released #138 (fbcb894); dev-update 2026-11-25-1903 in Drive.
- G4a: GIF cropped to the player (540×400), no buffering frame; ≤720 px loads a 420×512 phone crop (no About
  frame). Player text scale on phone 0.36 → 0.68, desktop 0.53 → 0.78. Reduced motion keeps one wide still.
- R3: refine note is one row ("Refined: Medium → High · 233 → 216 h · RM 18.5k–28.4k → …") plus a reason line;
  "Re-drafted from your answers." drops its hour delta (now in the row).
- check 418; estimator + home e2e 44/44; source per width checked at 360 and 1440.
- Next: S3 is Izzat's; R2 optional (prompt work, paid eval).

## 2026-11-25 — Session 100: release #136, live check, R1 and L1 (M15)

**Done** on `feat/m15-quick-wins` (Izzat: "go for it"; L1 option "GIF beside text").
- Released #136 (1b1b820); dev-update 2026-11-25-1804 in Drive. Live check of the 18:35 review: claims hold;
  my "two helper lines" finding was wrong (the cache note sits in the closed "About plans").
- R1: `refine.calendar` adds "Calendar ±N wk: the phases were rescheduled." only when weeks move against hours.
- L1: radiozk GIF beside description + tech on desktop (2:3). Gap beside the AI tile 352–466 px → 137–156 px;
  GIF now 304–423 px wide on desktop (was 522–721).
- Next: G4a phone crop; S3 is Izzat's.
