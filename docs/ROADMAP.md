# Roadmap

Work top to bottom. One task ≈ one commit. Tick `[x]` only when the definition of done in CLAUDE.md is met.
Agent hints in brackets.

## M0 — Foundations
- [x] Next.js 15 + TypeScript scaffold, security headers, `.env.example`
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
- [ ] E2E: page renders all tiles; estimator happy path and 429 path with mocked API [qa-tester]
- [ ] Accessibility pass: keyboard-only walkthrough, contrast check, labels [qa-tester]
- [ ] GitHub Actions CI: typecheck, unit tests, build, e2e [qa-tester]
  - then (Izzat): branch protection on `develop` and `main` (PR + required `ci` check) and
    auto-delete head branches

## M4 — Go live
- [ ] Push to GitHub; repo description and topics set (Izzat)
- [ ] Vercel project with env vars (test Turnstile keys) (Izzat, guided)
- [ ] Real Turnstile widget for the `.vercel.app` host; swap keys; redeploy (Izzat, guided)
- [ ] Production guards: refuse dummy Turnstile keys and a missing `TURNSTILE_HOSTNAME` when
  `VERCEL_ENV=production` (see `docs/security-review-m2.md`) [api-engineer]
- [ ] Anthropic monthly spend limit set (Izzat)
- [ ] Post-deploy checks from 05-deployment pass
- [ ] Add live URL to README and LinkedIn (Izzat)

## M5 — Polish
- [ ] Open Graph image with `next/og` and full metadata [ui-builder]
- [ ] Lighthouse targets met on mobile; fix findings [qa-tester]
- [ ] Vercel Web Analytics (ADR first) [api-engineer]
- [ ] radiozk live URL added (needs Izzat)
- [ ] Optional: Upstash Redis rate limit (ADR-002 upgrade path) [api-engineer]
- [ ] Optional: custom domain
