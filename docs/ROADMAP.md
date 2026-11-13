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
  - zenntkaixa.dev (Cloudflare Registrar); `www` redirects to it; `TURNSTILE_HOSTNAME` switches right after release
