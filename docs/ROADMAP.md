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
- [x] `/visual-check` pass at 390 / 1024 / 1440, light and dark; fix findings [qa-tester, ui-builder]

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
- [x] Unit tests: `validateRequest`, `normalisePlan`, `timeline`, `rateLimit` [qa-tester, ui-builder]
- [x] E2E: page renders all tiles; estimator happy path and 429 path with mocked API [qa-tester, ui-builder]
- [x] Accessibility pass: keyboard-only walkthrough, contrast check, labels [qa-tester, ui-builder]
- [x] GitHub Actions CI: typecheck, unit tests, build, e2e [qa-tester, ui-builder]
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
- [x] Lighthouse targets met on mobile; fix findings (Performance 71 at go-live; others 100) [qa-tester, ui-builder]
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
  specs, so it no longer depends on Cloudflare's network (fails about 4 in 8 runs on the VM) [qa-tester, ui-builder]

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
- [x] "Download CV" link in the hero: web copy of CV v4, phone removed, clients anonymised (M13) [ui-builder]

## M11 — Broad positioning
Added 2026-11-19: Izzat is targeting roles beyond insurance and banking (B2B SaaS, HealthTech, logistics,
e-commerce, developer tools, security). Transferable capabilities lead; industries become evidence.
- [x] Hero headline and role line industry-neutral; SEO and share text to match [ui-builder]
- [x] Case studies retitled by capability, with outcomes from LinkedIn; experience shows each domain [ui-builder]
- [x] Personal GitHub stat (dated) in the project tile; PwC stats relabelled for impact [ui-builder]
- [x] Estimator quick fixes from the team review: "built by me" line, minimum length shown before typing,
  shorter tab names, budget amounts never split across lines [ui-builder]

## M12 — Review polish
Added 2026-11-19 from the UI/UX team review. The skip link and consistent link styles were already in place;
44px tap heights already covered. Deferred: example plan above the form on mobile, desktop space beside the form.
- [x] Estimator tile framed with a 2px `--accent` border so it reads as the thing to try [ui-builder]
- [x] Contact tile: "What I'm looking for" list (roles, kinds of team, location) [ui-builder]

## M13 — Pre-release batch
Added 2026-11-19 (Izzat): the deferred M12 layout items, the web CV and the #76 wording checks.
- [x] Soften three claims (portal batching, "Shipped at", personal PRs) and use the full degree title [content]
- [x] Phones: a link above the form previews the example plan (title, hours, weeks) and jumps to it [ui-builder]
- [x] Desktop: the form stays in view (sticky) beside the taller plan, when the screen fits the whole form [ui-builder]
- [x] Seniority and working style: one highlight slides to the chosen option (CSS only; idea from Astryx's
  SegmentedControl, no Astryx code, ADR-010 unchanged) [ui-builder]
- [x] Plan timeline: "Week 1, 2…" labels under the week gridlines (`weekLabels` in `lib/timeline.ts`) [ui-builder]

## M14 — Estimator review follow-ups
Added 2026-11-19 from a five-role review (PO/PM, BA, QA, Architect, UI/UX). Batch A is phone and conversion;
Batch B (credibility: calendar vs hours, contingency, seniority multipliers, open questions and out of scope,
structured outputs, timeouts) and Batch C (analytics events, copy/print plan, logging; caching and share links
need an ADR and Izzat's privacy call) wait for Izzat.
- [x] Batch A: phone task table stacks the role under the task; submit focuses and scrolls to the results;
  hero "Try the live demo" link; step-by-step wait with a plan-shaped skeleton; "Want this scoped…" email and
  LinkedIn line under every plan; chip puts the caret in the field; client rejects malformed plans and an error
  boundary guards the results; long words wrap, edge week labels stay inside, a failed re-estimate keeps the
  last plan [ui-builder]
- [x] Batch B: code enforces team capacity (calendar note), 20% contingency row and cost basis, seniority hour
  multipliers (mixed RM 78), solo teams in sequence, "Questions to confirm" and "Not included" with MVP slicing,
  structured outputs, timeouts 4 s + 45 s, prompt in `lib/prompt.ts` (ADR-011) [prompt-engineer, ui-builder]
- [x] Batch C: usage rows in Neon Postgres (ADR-012) and one JSON log line per request; route → service →
  adapters; 24 h plan cache in Upstash; copy and print the plan; "N plans generated" line from 25; share links
  and click tracking skipped (Izzat) [api-engineer, ui-builder]
- [x] Branded 404 (`app/not-found.tsx`): tile, theme toggle, link home, noindex only (Izzat, pre-launch) [ui-builder]
- [x] Review round 2: browser rebuild on seniority or working-style change (no request), confidence high at
  5+ of 6 facts, seats and build total in the comparison, "Career break" 2022 to 2023 (Izzat) [ui-builder]
- [x] Review round 3: radios update the plan at once with a "doesn't count toward your hourly limit" note (and on
  the 429 banner), "N of 6 facts", AI range in the drivers box, eval re-run 2026-11-24 (Izzat) [ui-builder]
- [x] Review round 4: one 429 timer, phones show Hero → Now → Estimator, full-width confidence card on phones,
  back-to-top link (Izzat) [ui-builder]
- [x] Polish from the sync review: E2 blended-rate wording, E3 filled "current" pill, E4 banner icon and tones,
  M4 bigger slider thumb (Izzat) [ui-builder]
- [x] UX batch 1 (sync review 18:55): E5 saved example plans, E7 10 per hour, E8 answer line, E9 collapsible lists
  on phones, M5 team card, G3 fact dots, S1 `--model` token, S2 gradient estimator edge (Izzat) [ui-builder]
- [x] G2 budget charts: build-cost stacked bar and traditional vs AI range bars, tables kept (Izzat) [ui-builder]
- [x] M6 15px reading text and M7 plain results background (Izzat: "move on to the next items") [ui-builder]
- [x] G1 request-flow diagram: static in How it's built, lights up to the model step while loading [ui-builder]
- [x] E10 one timeline (task count and goal on each Gantt row, no phase cards) and G8 staggered bar growth [ui-builder]
- [x] E11 brief coach: six-facts tip under a short typed brief, no extra call [ui-builder]
- [x] Phone-pass polish: E12 scroll to the new plan, E13, E14, G9, G10, S4, M9 (Izzat) [ui-builder]
- [x] B4 answer the open questions and refine the plan, with a before and after line (Izzat) [ui-builder]
- [x] Refine fixes: E12b scroll after a refine, B4c human-check reason and jump, B4a growing answers, B4b hours reason (reviewer 22:40/22:45) [ui-builder]
- [x] B4d refine reason names the added and removed tasks ("Same tasks; hours re-estimated." otherwise); always shown when hours or tasks change, so no hidden threshold (reviewer 02:35) [ui-builder]
- [x] Reviewer T1, T3, T5, T7 as automated tests (`tests/unit/reviewerCases.test.ts`, `tests/e2e/dark-contrast.spec.ts`); fixed the dark-theme contrast bug it found on the pending request-flow steps, opacity 0.45 → 0.7 (Izzat) [qa-tester, ui-builder]
- [x] G6 Experience as a Gantt-style timeline: a bar per job on a shared 2017-to-now axis, hollow dashed bar for the career break; text and list semantics unchanged (Izzat: "do g6") [ui-builder]
