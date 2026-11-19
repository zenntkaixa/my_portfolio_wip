# Roadmap

Work top to bottom. One task = one branch and one PR into `develop`. Tick `[x]` only when the definition of done in CLAUDE.md is met.
Agent hints in brackets.

## M0 — Foundations
- [x] Next.js 16 + TypeScript scaffold, security headers, `.env.example`
- [x] Site content from CV in `lib/content.ts`
- [x] Estimator types, validation and normalisation in `lib/estimate.ts`
- [x] In-memory rate limit and daily cap in `lib/rateLimit.ts`
- [x] `POST /api/estimate` with Turnstile verification and Claude call
- [x] Claude Code framework: CLAUDE.md, docs, subagents, skills, hooks
- [x] Component and test skeletons that compile
- [x] First run on Ubuntu: `npm install`, `npm run check`, `npx playwright install chromium`, log result

## M1 — Layout and design system
- [x] Finish `app/globals.css`: grid spans, breakpoints, tile base styles, focus styles [ui-builder]
- [x] Theme toggle with no flash on load, persists choice [ui-builder]
- [x] Hero tile: initials avatar, name, headline, summary, location, availability dot [ui-builder]
- [x] Now tile: current role and three stats [ui-builder]
- [x] Featured project tile (radiozk) with stack chips and repo/live links [ui-builder]
- [x] AI workflow tile: four numbered steps [ui-builder]
- [x] Case study tiles x3 [ui-builder]
- [x] Experience, Stack, Certifications, Contact tiles [ui-builder]
- [x] Load animation with reduced-motion support [ui-builder]
- [x] `/visual-check` pass at 390 / 1024 / 1440, light and dark; fix findings [qa-tester]

## M2 — Estimator UI
- [x] Form: textarea with counter, example chips, team slider, seniority segmented control [ui-builder]
- [x] Turnstile component (explicit render, reset after each request) [api-engineer]
- [x] Submit flow and all error states from 03-estimator-spec [ui-builder]
- [x] `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester]
- [x] Tab 1: summary row, timeline chart, phase cards, assumptions and risks [ui-builder]
- [x] Tab 2: role total chips and grouped task table [ui-builder]
- [x] Accessible tabs with keyboard support [ui-builder]
- [x] Manual test with real API key locally (Izzat runs it), tune prompt if plans look off [prompt-engineer]
- [x] Security review of the whole estimator path [security-reviewer]

## M3 — Quality
- [x] Unit tests: `validateRequest`, `normalisePlan`, `timeline`, `rateLimit` [qa-tester]
- [x] E2E: page renders all tiles; estimator happy path and 429 path with mocked API [qa-tester]
- [x] Accessibility pass: keyboard-only walkthrough, contrast check, labels [qa-tester]
- [x] GitHub Actions CI: typecheck, unit tests, build, e2e [qa-tester]
  - then (Izzat): auto-delete head branches now; branch protection on `develop` and `main`
    (PR + required `ci` check) once the repo is public (M4) or on GitHub Pro

## M4 — Go live
- [x] Push to GitHub; repo description and topics set (Izzat)
- [x] Vercel project with env vars (test Turnstile keys) (Izzat, guided)
  - deployed without `ANTHROPIC_API_KEY` (estimator answers 503); the key goes in only after real
    Turnstile keys and the spend limit (order in `docs/05-deployment.md`)
- [x] Real Turnstile widget for the `.vercel.app` host; swap keys; redeploy (Izzat, guided)
- [x] Production guards: refuse dummy Turnstile keys and a missing `TURNSTILE_HOSTNAME` when
  `VERCEL_ENV=production` (see `docs/security-review-m2.md`) [api-engineer]
- [x] Anthropic monthly spend limit set (Izzat)
- [x] Post-deploy checks from 05-deployment pass
  - all pass except Lighthouse mobile Performance 71 (target 90): carried to the M5 Lighthouse item
- [x] Add live URL to README and LinkedIn (Izzat)

## M5 — Polish
- [x] Open Graph image with `next/og` and full metadata [ui-builder]
- [x] CI: run in the pinned Playwright container instead of installing browsers each run (ADR-007)
- [x] Lighthouse targets met on mobile; fix findings (Performance 71 at go-live; others 100) [qa-tester]
  - local production build 79 → 93/94 (Turnstile out of the critical path, no fade on first-row tiles); production: PageSpeed Insights mobile 100 (2026-11-12, with analytics); VM Lighthouse runs vary 84–93
- [x] Vercel Web Analytics (ADR first) [api-engineer]
  - ADR-008: same-origin script, production only, no dependency; Izzat enables it in the dashboard
- [x] radiozk live URL added (needs Izzat)
- [x] Optional: Upstash Redis rate limit (ADR-002 upgrade path) [api-engineer]
  - ADR-009: REST over fetch, no dependency, in-memory fallback; active and verified on production 2026-11-12
- [x] Optional: custom domain
  - zenntkaixa.dev (Cloudflare Registrar); `www` redirects to it; `TURNSTILE_HOSTNAME` switched and verified 2026-11-13

## M6 — First impression
Added 2026-11-17 after reviewing the 1,760 live sites in emmabostian/developer-portfolios: the best
lead with an outcome and proof, and the most memorable shows a working demo before any input.
- [x] Estimator shows its output first: the example plan sits beside the form (stacked on mobile)
  before any input, and the Turnstile widget only appears when a challenge is needed
  (`appearance: "interaction-only"`; verification unchanged) [ui-builder]
- [x] Hero headline states an outcome with a proof line under it (e.g. merged PRs, years,
  certification); Izzat approves the wording before it ships [ui-builder]

## M7 — Feel and reliability
Added 2026-11-17. Release #69 (M6) confirmed live by Izzat: human check passes silently, and a real
"With AI agents" estimate ran through the new layout and the Budget tab.
- [x] Gentle motion: the Now stats (8+, 100, 13) count up once, CSS only, off under
  `prefers-reduced-motion` [ui-builder]
  - Scope cut with Izzat 2026-11-17: timeline bars already grow in (M2); no hover lift, since no tile
    is clickable as a whole and the design system says no scale
- [x] Keyboard Tab-order test uses the fake Turnstile (`tests/e2e/fakeTurnstile.ts`) like the other
  specs, so it no longer depends on Cloudflare's network (fails about 4 in 8 runs on the VM) [qa-tester]

## M8 — Tidy-up
Added 2026-11-17 from the audit's leftovers; batched on one branch with M7 (Izzat).
- [x] Shorten the example chips that wrap to a third line at 320px, so the chip block stops changing
  height between loads [ui-builder]
- [x] Case studies show 3 tags each, not 4 (the Stack tile already lists everything) [ui-builder]
- [x] One-line footer: © year, name, "Built with Next.js and Claude" [ui-builder]

## M9 — Speed check
Added 2026-11-17 after a Lighthouse re-check of production (PageSpeed quota was used up; VM runs).
- [x] Estimator intro paints without the fade: since M6 it is the mobile LCP element, and its fade-in
  waited on the main thread (render delay 3.3–4.6 s) [ui-builder]
- [x] Photo in the hero in place of the initials (Izzat's photo, 2026-11-19) [ui-builder]
- [x] Certifications list only the five exam-based ones, newest first, with a one-line note (Izzat) [ui-builder]

## M10 — Proof links
Added 2026-11-19 (Izzat).
- [x] Certification names link to their verification pages (Credly, EC-Council ASPEN); Guidewire has no
  per-certificate page, so a note links its Certification Checker with the name to search [ui-builder]
- [ ] "Download CV" button in the hero (waiting on Izzat's CV PDF; check it for the phone number first)

## M11 — Broad positioning
Added 2026-11-19: Izzat is targeting roles beyond insurance and banking (B2B SaaS, HealthTech, logistics,
e-commerce, developer tools, security). Transferable capabilities lead; industries become evidence.
- [x] Hero headline and role line industry-neutral; SEO and share text to match [ui-builder]
- [x] Case studies retitled by capability, with outcomes from LinkedIn; experience shows each domain [ui-builder]
- [x] Personal GitHub stat (dated) in the project tile; PwC stats relabelled for impact [ui-builder]
- [x] Estimator quick fixes from the team review: "built by me" line, minimum length shown before typing,
  shorter tab names, budget amounts never split across lines [ui-builder]
