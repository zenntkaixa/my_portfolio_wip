# Progress archive

Older `docs/PROGRESS.md` entries, newest first. Read only when history is needed.

---

## 2026-11-24 — Session 87: phone-pass polish from the 21:06 sync review (M14)

**Done** on `fix/m14-polish-round5` (Izzat: "go").
- E12: after a result, the heading scrolls to the top on the next frame (it was left on the bottom edge or above
  the screen). New 360 px e2e fails on the old code, passes now.
- E13 "for a team of 8"; E14 whole headline hours and days; G9 fact dots fill by count.
- G10 RM ticks on the range bars; S4 new `--chart-neutral` token for tools (validator passes both themes);
  M9 desktop summary three across, Confidence full width.

---

## 2026-11-24 — Session 86: G2 budget charts, M6 and M7 readability, G1 request flow, E10 and G8 timeline, E11 coach (M14)

**Done** on `feat/m14-budget-charts` (Izzat: "go G2"; sync review 18:55).
- Budget tab opens with "Where the build money goes": one stacked bar of the build total with a legend of
  every range. Contingency is accent hatching. The two-styles section opens with low-to-high range bars.
- Fills: `--accent`, `--model`, `--role-frontend`; dataviz validator passes CVD and contrast in both themes.
- Tables kept. New e2e ties the chart text to the table totals. Screenshots at 390 and 1280 px, both themes.
- M6: `--fs-sm` 15px; hints, notes, footer and chart notes moved off `--fs-xs` (labels and tags only). The
  summary is 2×2 on desktop too. M7: results sit on plain surface; the blueprint grid stays behind the form.
- G1: `RequestFlow`, the 8-step path tinted code (accent) vs model (`--model`) with a key. Static in "How it's
  built"; while a plan loads it ticks to the model step and waits there (replaces the skeleton and rotating steps).
- E10 + G8: phase cards removed; each Gantt row carries "· N tasks" and the goal. Bars grow in 300 ms, staggered.
- E11: a static six-facts tip under a short typed brief. check 381, e2e 174.

---

## 2026-11-24 — Session 85: UX batch 1 from the 18:55 sync review (M14)

**Done** on `feat/m14-ux-batch1` (Izzat: "go batch 1, S1/S2 yes, E7 10").
- E5: `lib/examplePlans.json`, 43 Claude plans for every chip and brief at team size 4 (`npm run examples:generate`,
  US$0.0525). An unchanged chip at size 4 shows its saved plan at once: no request, token or rate-limit slot.
- E7: hourly limit default 5 → 10 (daily cap unchanged). E8: one-line answer under the plan title.
- E9: the four lists are disclosures, closed on phones. M5: Team card spans the row on phones.
- G3 fact dots and S1 `--model` token (#B06D00 / #F2C14E, ≥3.5:1 as a graphic); S2 gradient estimator edge.
- security-reviewer and reviewer: no blockers; saved-plan fallback hardened. check 381, e2e 171.

---

## 2026-11-24 — Session 84: Polish E2, E3, E4, M4 (M14)

**Done** on `fix/m14-polish-e2-e4` (Izzat: "do e3, m4, e4, e2"; IDs from the Drive sync review).
- E3: the "current" tag in the two-styles table is a filled accent pill sized to its text.
- M4: slider thumb 32px inside a 44px-tall touch target.
- E4: banners get a decorative icon and a tone edge: error `--danger` (new token, edge and icon only),
  rate limit `--warn`, refusal (422) `--accent`. New e2e per tone.
- E2: "Mixed is one blended rate (about 1 senior to 2 mid-level and 1 junior), applied at any team size."
- Verified: check 381, full e2e 169; banner, slider and pill screenshots at 390 px in both themes.

---

## 2026-11-24 — Session 83: Review round 4 (M14)

**Done** on `fix/m14-review-round4` (Izzat: "go, all four").
- One timer: the hourly 429 text drops its fixed "Try again in N minutes"; the button countdown is the timer.
- Phones: tiles in DOM order (Hero, Now, Estimator), so "Right now" sits under the hero and visual, reading and
  focus order match (design doc updated). Turnstile now loads a little later there (it waits for the estimator).
- Phones: the confidence card spans both columns of the stat grid.
- Back to top: a 44px round arrow link pinned to the corner, faded in by scroll where supported; last Tab stop.
- Tests: a11y scan ignores the scroll-driven animation and pins the link; keyboard and visual tests updated.
- Verified: check 381, full e2e 166; phone and desktop screenshots checked; security-reviewer on rateLimit text.

---

## 2026-11-24 — Session 82: Review round 3 (M14)

**Done** on `fix/m14-review-round3` (Izzat: "go, add both lines, re-run the eval").
- Seniority and working-style radios update the live plan at once (also under an error banner), no request;
  focus stays put and the status line says "Plan updated for…". Note: doesn't count toward the hourly limit;
  the 429 banner says the radios still work.
- Confidence card shows "N of 6 facts"; AI drivers state the real range and why it is wider.
- Eval re-run (Haiku, US$0.0080): 6/6 valid, 3/3 refused, detailed brief high, dark mode low, 4 medium;
  AI 11–13% fewer hours; repeat 226 vs 250 h. Table updated; "(dark mode)" label reworded.
- Verified: check 381, full e2e 164 (one run had the known startup flake; repeats green). Reviewer: no blockers.

---

## 2026-11-24 — Session 81: Review round 2 fixes (M14)

**Done** on `fix/m14-review-round2` (Izzat: "go, High at 5 or more"; career break yes; notice skipped).
- Same brief and team size: the browser rebuilds the saved scope (no request, token or rate-limit slot), so
  switching seniority or working style is never blocked and shows no cached note. New e2e counts requests.
- Confidence high at 5+ of 6 facts, medium 3–4, low ≤2 (spec, ADR-013). The example plan is now low (30%).
- Comparison table and copied plan add AI agent seats and the build total.
- Experience: "Career break, 2022 to 2023" (no role or field).
- Verified: check 381, full e2e 162; reviewer no blockers (docs drift fixed).
- Contact email is now hello@zenntkaixa.dev (Cloudflare Email Routing to Yahoo; Izzat tested delivery).

---

## 2026-11-24 — Session 80: Copy proofread (M14)

**Done** on `fix/m14-copy-proofread` (Izzat approved all edits).
- `lib/content.ts`: estimator intro says "delivery plan with effort and calendar estimates"; "now shipped"
  dangling modifier fixed in summary and SEO description; AWS cert name matches the list; one stray comma;
  no "Please" in the 429 message; Vetter role "Junior Software Engineer, then QA Engineer" (matches CV);
  banking case study "then moved it to microservices".
- Verified: check 380, full e2e 161.

**Next** release develop → main; real-device checks; share previews; launch.

---

## 2026-11-24 — Session 79: Branded 404 page (M14)

**Done** on `feat/m14-not-found` (Izzat: "go ahead with the 404 page", from a pre-launch scan).
- `app/not-found.tsx`: one tile with the theme toggle and footer, copy in `lib/content.ts` (`notFound`).
- Its metadata sets `robots: noindex`; the layout's "index, follow" was rendering beside Next's noindex.
- Pre-launch scan: npm audit 0, domain live on Vercel, all roadmap items ticked; patch bumps left to Dependabot.
- Verified: check 380, full e2e 161; 404 screenshots at 390/1440 in light and dark.

**Next** release #100–#104 and this; real-device checks; LinkedIn/WhatsApp share preview; launch.

---

## 2026-11-24 — Session 78: Launch content calls and repo rename (M14)

**Done** on `chore/m14-repo-rename` (Izzat: "go with your suggestions", all certifications).
- Content calls: case studies launch without figures; full legal name, PR counts and all three
  certifications stay as they are (no copy change).
- GitHub repo renamed `my_portfolio_wip` → `portfolio` (old URL 301s; homepage set to zenntkaixa.dev).
  "Read the code", ADR links, README badge and the deployment doc point at the new name. The Vercel
  project keeps its name (`my-portfolio-wip.vercel.app`); no domain email for now.
- Verified: check 380, full e2e 160 (`--workers=2`).

**Next** release #100, #101 and this; device checks; release audit; launch.

---

## 2026-11-23 — Session 77: Plan feedback line and launch checks (M14)

**Done** on `feat/m14-plan-feedback` (Izzat).
- Live plans get "Spotted something off in this plan? Tell me", a mailto with the plan title as subject
  (not on the hand-written example; hidden in print). New e2e for the href.
- `app/favicon.ico`: the 32px icon wrapped in an ICO, so `/favicon.ico` no longer 404s.
- Lighthouse 13.6 on production: mobile 91–93 / 100 / 100 / 100, desktop 92 / 100 / 100 / 100. Only miss is
  TBT 330 ms (one 306 ms hydration task); post-launch item.
- Spike check: no DAILY_LIMIT or RATE_LIMIT_PER_HOUR env in production, so the defaults apply (150/day, 5 per
  visitor per hour). Izzat approved `DAILY_LIMIT=500` (Vercel production, at most ~US$1/day); live on next deploy.
- Verified: check 380, full e2e 160 (`--workers=2`).

---

## 2026-11-23 — Session 76: Three small fixes (M14)

**Done** on `fix/m14-submit-jump` (Izzat: my suggestion from the backlog).
- Review task is capped at the hours the agents saved: tasks already at the 0.5 h floor got a review
  that made AI cost more (0.5 vs 1 h; four 0.5 h tasks 2 vs 2.5 h). No review row when nothing is saved.
- Print: "What changed the numbers" now prints when closed (print-only `::details-content` rule).
- HSTS gains `includeSubDomains` (`.dev` is preloaded anyway); security-reviewer: no blockers.
- Verified: check 380; full e2e 158/159, the miss an axe scan stalled >27 s (2.8 s alone, 6/6).
  VM now 3 vCPUs and 0 soft lockups, but the suite is slower (4.5 min).

---

## 2026-11-23 — Session 75: Submit no longer jumps to the tiles below (M14)

**Done** on `fix/m14-submit-jump` (Izzat's bug report).
- Cause: on submit the old plan is swapped for a short skeleton, so the page shrank ~790 px and the
  tiles below the estimator rose into view; on success, focus() then snapped to the heading.
- Fix (`Estimator.tsx`): the results keep their height while loading (min-height from the old plan),
  and the new heading takes focus with preventScroll plus a smooth `nearest` scroll.
- New e2e at 1920: the estimator's bottom edge moves ≤2 px while loading (788 px before the fix).
- Verified: check 379, full e2e 158 (one earlier run hit the known "not stable" flake, 75/75 alone).
- Flaky e2e root cause (debugger): not code. The VirtualBox VM freezes for 48–280 s (`journalctl -k`
  "soft lockup", all vCPUs, boots of 19 and 20 Nov); a freeze times out the 2 tests in flight. CI is
  clean. Fix is on the host (fewer vCPUs than physical cores, no power saving); no timeouts or retries added.

---

## 2026-11-23 — Session 74: Desktop layout: role column and wider page (M14)

**Done** on `feat/m14-desktop-layout` (Izzat spotted it on a desktop monitor)
- Release #97 live: How it's built panel with live numbers (10 plans, 13.3 s median); row 16 ok under the new
  prompt.
- Tasks tab: with long live task names, Role cells shrank to 74 px and "Architect", "Frontend", "Backend",
  "DevOps" broke mid-word, because the results' `overflow-wrap: anywhere` lets table columns go below one
  word. Role cells are now `nowrap`; reproduced and fixed at 1280, 1440 and 1920.
- New e2e regression test (fails without the fix).
- Page widened 1200 → 1440 px (Izzat, option 1): estimator results column 510 → 630 px at 1440+; tile prose
  capped at 70ch; Now tile stats stack under 520 px. 1024 and 1280 unchanged.
- Roles as outlined pills with a colour dot (7 `--role-*` tokens, ≥3:1 in both themes), role chips as the
  legend, a "current" pill, and "AI" / "Added by code" tags on task rows (Izzat, option B).
- Verified: check 379 unit, full e2e 157; reviewer no blockers.

**Next** bumps from 27 Nov and 2 Dec; Neon usage review; the flaky batch-a tests under load.

---

## 2026-11-20 — Session 73: Prompt fact definitions and vague briefs (M14)

**Done** on `fix/m14-integrations-fact` (Izzat: my suggestion, then the follow-ups the evals showed)
- The six facts are defined concretely: a named user group counts as users, a named page or system as
  systems, any named outside service (WhatsApp, FPX, SMS, email) as integrations.
- New rule: a request with no concrete capability ("make our app better") gets the error answer; a short
  concrete one ("add dark mode") is planned. Eval gained a ninth brief for that.
- Three Izzat eval runs (US$0.0071, 0.0080, 0.0080). Final: 6 of 6 plans, 3 of 3 refusals, AI 10–12% lower,
  leave twice 264 vs 291 h with the same facts. Panel table updated.
- Verified: check 349 unit, full e2e 152.

**Next** release #95 and this together; bumps from 27 Nov and 2 Dec; Neon usage review.

---

## 2026-11-20 — Session 72: How it's built panel (M14)

**Done** on `feat/m14-how-its-built` (Izzat: my suggestion)
- Batch E released (#94) and live: Neon rows 14–15 ok in about 10 s; golden set passed (US$0.0069).
- A closed-by-default "How it's built" panel in the estimator tile: request path, model proposes / code
  enforces, live numbers from Neon (30 days, shown from 5 plans), the dated eval table, ADR links.
- Eval script now in the repo: `npm run eval:estimator` (Izzat runs it; never CI; `--dry` makes no calls).
- Verified: check 349 unit, full e2e 152 passed; reviewer no blockers (labels now say "new plan").

**Next** integrations prompt fix (named services count); bumps from 27 Nov and 2 Dec; Neon usage review.

---

---

## 2026-11-20 — Session 71: Deterministic estimator, Batch E (M14)

**Done** on `feat/m14-deterministic-estimator` (Izzat: option 1, E1 and E2 together)
- The model returns one scope (mid-level base hours, task categories, six facts); code applies seniority, the AI
  band (20–40% less on code, tests, docs and config, plus a review task), confidence, ranges, contingency
  10/20/30% and the calendar. One call serves both styles; cache key is feature + team size. ADR-013.
- UI: effort range, missing facts, contingency rate, Estimate drivers, same-scope comparison; copy plan updated.
- Security review: safe to ship. Code review fixes in (calendar scales with hours, cache reads fully validated).
- Verified: check 346 unit, full e2e 149. Old US East Neon project deleted; live row 10 ok in Singapore.

**Waiting on Izzat** run the Haiku golden set (`!` command in chat); auto mode blocked the live call for me.

---

---

## 2026-11-19 — Session 70: Review fixes, Batch D (M14)

**Done** on `feat/m14-batch-d` (Izzat: quick wins from the team review doc, no notice period)
- robots.txt and sitemap.xml; photo alt text; "AWS Certified Solutions Architect – Associate" in the hero.
- Filled primary "Estimate this feature" button; "excluding SST" dropped (in-house rates carry no SST).
- A kept plan under an error is dimmed and labelled "Previous plan for: …"; a chip over typed text offers
  Undo for 10 s; cache hits return `cached: true` and say so; short input gets a text hint.
- Contact list adds work mode (onsite, hybrid or remote) and Malaysian citizen; plan CTA now hiring-focused.
- Verified: check (316 unit), full e2e 137 passed, then Batch D, keyboard and Batch A specs after review fixes.

**Next** Batch E (deterministic estimator) once Izzat decides how AI factors may be shown.
**Waiting on Izzat** Neon Singapore rows 7–9 are rate_limited (no live ok row yet); old US East project.

---

---

## 2026-11-19 — Session 69: Housekeeping after the M14 release

**Done** on `chore/m14-housekeeping` (Izzat: items 1 and 4; bumps held)
- Release #88 live (main 6e808ef); first live estimate wrote Neon row 2 (ok, 15.3 s, US$0.0017).
- Stale docs fixed: tile hover (01), domain and resolved open items (00), CI watch (ADR-005), estimator
  only on zenntkaixa.dev (05).
- Visitor-side outcomes (invalid input, failed human check, rate limited) log as warnings, so Vercel's error
  view shows only server failures.
- Held by the two-week rule: Playwright 1.65.1 + CI image (from 27 Nov), Vitest 5.1.1 (from 2 Dec),
  `@neondatabase/serverless` 1.2.1 (from 27 Nov).

**Next** the bumps on those dates; usage review in Neon after 1–2 weeks of traffic.
**Then** Neon moved to Singapore (`portfolio-sg`, next to `sin1`): new `DATABASE_URL`, redeployed 18:30 UTC,
rows 2–6 copied with their IDs. Old US East project kept until Izzat decides.

---

---

## 2026-11-19 — Session 68: Estimator insights, Batch C (M14)

**Done** on `feat/m14-estimator-insights` (Izzat: Neon for durable rows, my picks for the rest)
- Neon project "portfolio" (US East, Postgres 18) created; table `estimate_events` (`db/schema.sql`); app role
  `portfolio_app` may only INSERT and SELECT (DELETE denied, checked). ADR-012, `@neondatabase/serverless` 1.2.0.
- Route split into a service layer (`lib/estimator/`): one event row and one JSON log line per request, written
  after the response; 24 h Upstash plan cache keyed by model + prompt version; copy and print the plan;
  "N plans generated" line (only from 25); cache notice under the form. Click tracking and share links skipped.
- Security review: no blockers; fixed its notes (versioned cache key, log fields can't be overwritten).

**Verified** see the PR. **Next** release PR for #84–#86 and this when Izzat asks.
**Waiting on Izzat** rotate the `portfolio_app` password in Neon, then set `DATABASE_URL` in Vercel (Production).

---

---

## 2026-11-19 — Session 67: Estimator credibility, Batch B (M14)

**Done** on `feat/m14-estimator-credibility` (Izzat: contingency row, mixed RM 78, one Haiku check)
- Code enforces capacity (6 productive h per person-day; calendar stretched with a note), 20% contingency
  row, seniority hour multipliers, solo teams in sequence, "Questions to confirm" and "Not included", MVP slices.
- Structured outputs replace regex parsing; prompt moved to `lib/prompt.ts`; timeouts 4 s + 45 s; ADR-011.
- Security review: no blockers; added its fix (plans over 2000 days rejected).
- Haiku golden set, 11 cases + 1 probe (~2 US cents): all valid; vague and non-software get 422; MVP slice
  and injection behave; no calendar needed stretching. Mixed came out near junior (one sample each).

**Verified** see the PR. **Next** release PR for #84, #85 and this when Izzat asks; then Batch C.
**Waiting on Izzat** caching and share links (privacy call).

---

## 2026-11-19 — Session 66: Estimator review, Batch A (M14)

**Done** on `feat/m14-estimator-phone-conversion`
- Five-role review of the estimator (mocked API, no spend); findings ranked into Batches A, B and C (ROADMAP M14).
- Batch A built: phone task table, focus and scroll to results on submit, hero demo link, step-by-step wait,
  contact line under plans, chip focus, client plan validation and error boundary, small layout fixes.
- Fixed in review: the submit scroll ran before the render that removes the preview link (results ended 62px
  above the screen); the test now requires the step line fully on screen.

**Verified** `npm run check` (271), e2e 123 passed. **Next** Batch B when Izzat approves (needs one Haiku check).
**Waiting on Izzat** contingency as row or range; Upstash caching of descriptions (privacy); Haiku check OK.

---

## 2026-11-19 — Session 65: Pre-release batch (M13)

**Done** on `feat/m13-cv-and-estimator-layout`
- Claims softened per Izzat (#76 checks 1 to 3; Beyondsoft field kept); degree is "Bachelor of Computer
  Science (Software Engineering) with Honours". CV v4 and the LinkedIn doc in his Drive updated to match.
- "Download CV" in the hero: `public/izzat-fahmi-cv.pdf`, made from CV v4 without the phone number, clients
  anonymised (checked with `pdftotext`). Closes M10.
- Estimator: phone link above the form jumps to the example plan; desktop form is sticky beside the plan.
- Display name is now "Mohd. Izzat Fahmi Suhaimi" (first "Mohd. Izzat Fahmi", last "Suhaimi"), also in og:profile tags.
- Released (#82); PageSpeed 97/100/100/100 mobile, 100 across desktop. Then initials "MIFS" and the web CV heading.
- Borrowed from Astryx as ideas only: sliding segment highlight, week labels under the plan timeline.

**Verified** `npm run check`, e2e 113 passed. **Next** release PR when Izzat asks.
**Waiting on Izzat** check CV v4's layout in Word; AIA/OCBC on the private CV; update LinkedIn.

---

## 2026-11-19 — Session 64: Astryx trial (ADR-010)

**Done** (Izzat's instruction, outside the roadmap)
- Installed Astryx (core, theme-neutral, cli, StyleX peer) after vetting; `init` agent docs kept in `AGENTS.md` only.
- Cobalt theme: Neutral extended with the site accent (`src/themes/cobalt/`), default in `astryx-themes.ts`.
- Wiring `<Theme>` + reset into the layout broke dark mode, fonts (CSP blocks Figtree) and list bullets
  (10 e2e failures), so Izzat chose to keep Astryx off the live site; previewed via the editor's PNGs instead.

**Verified** `npm run check`, e2e back to 110 passed. **Next** release M11 + M12 when Izzat asks.
- Hitachi settled: started at Hitachi eBworx (legacy work), moved to its subsidiary Hitachi Digital Host and
  was tasked with the microservices modernisation; site entry, case study, CV and LinkedIn doc updated.
**Waiting on Izzat** wording checks from #76, degree title, web-safe CV.

---

## 2026-11-19 — Session 63: Review polish (M12)

**Done**
- M11 merged (#76). Izzat's CV refined (3 pages, capability-first) and stored privately in his Google Drive,
  "Career docs" folder; not in this repo (phone number and client names).
- M12: estimator tile gets a 2px accent border; contact tile lists what Izzat is looking for.
- Review items already met, no change: skip link, consistent link styles, 44px tap heights.
- E2E now runs on a production server (`next start`; CI reuses the `check` build): the same 110 tests in
  1.1 min instead of 2.9 locally. Unit tests (2 s) were left alone; trimming them saves nothing.

**Verified** `npm run check` (266), e2e 110 passed, screenshots light/dark 1440 and 390, no sideways scroll.
**Next** Izzat's "push it", then a release. Deferred: example plan above the form on mobile, desktop space.
**Waiting on Izzat** wording checks from #76, Hitachi name, degree title, a web-safe CV for "Download CV".

---

## 2026-11-19 — Session 62: Broad positioning (M11)

**Done**
- Release #75 (M9 + M10) is live. Vercel missed the push to `main`, so production was deployed by hand
  (`dpl_DxAGof15UeS5Chrbu5fbJQYUJ2GW`) with Izzat's OK; live checks passed. PageSpeed quota still exhausted.
- UI/UX team review (4 agents) and a LinkedIn cross-check done; Izzat now targets roles beyond insurance.
- Hero headline and role industry-neutral; case studies retitled by capability with LinkedIn outcomes;
  each job shows its domain (Vetter is veterinary practice SaaS, per the CV); dated personal GitHub stat; PwC stats relabelled.
- Estimator: "built by me" link, 20-character minimum shown before typing, tabs "Timeline / Tasks /
  Budget", amounts kept whole from 360px. Share image shows the role without the stack list.

**Verified:** `npm run check`, e2e, visual at 320/390/1440, share image rendered.

**Next:** Izzat updates LinkedIn after release; CV PDF; PageSpeed check; layout items from the review.

---

## 2026-11-19 — Session 61: Certification proof links (M10)

**Done**
- AWS and both EC-Council certifications link to their public verification pages (Credly, ASPEN),
  opening in a new tab; all four links checked by fetch (200, name and "Valid" on each page).
- Guidewire has no per-certificate page: a note links its Certification Checker with the name to search.
- Cert names wrap with `balance`; the note gets a full gap above it.

**Verified:** `npm run check`, e2e (new link test), visual check at 390 and 1440.

**Next:** release (M9 + M10); "Download CV" waits on Izzat's PDF; PageSpeed check after release.

---

## 2026-11-17 — Session 60: Estimator intro paints without the fade (M9)

**Done**
- Release #72 (M7 + M8) live and checked on production: count-up, footer, 3 tags, API 400 guard.
- Re-check of production: desktop 100 in all four; mobile accessibility, best practices and SEO 100.
  PageSpeed's keyless quota was used up, so mobile performance came from VM Lighthouse runs.
- Cause found: since M6's shorter hero summary, the mobile LCP element is the estimator's intro
  paragraph, and that tile faded in (render delay 3.3–4.6 s). It now uses `tile-rise` like hero and Now.

**Verified:** local production build, 4 mobile runs each: perf 73/73/80/82 → 93/83/87/88, LCP 3.8 → 2.7 s;
`npm run check`, e2e (motion spec now covers the estimator).

- 2026-11-19: Izzat's photo replaces the initials in the hero (`public/profile.webp`, 216px, 6 KB,
  no metadata; decorative `alt=""`). Brief's "no photo" decision updated. Icons and OG keep initials.

- Certifications: the five exam-based ones (Guidewire x2, EC-Council x2, AWS), newest first, with
  "Each one earned by passing a paid exam."; Claude Code 101 (a course) dropped. No credential IDs.

**Next:** confirm on PageSpeed Insights after release; CV PDF (needs Izzat).

---

## 2026-11-17 — Session 59: Now stats count up; keyboard test on fake Turnstile (M7 done)

**Done**
- Release #69 (M6) confirmed live by Izzat: human check passes silently; a real "With AI agents"
  estimate ran through the new layout and the Budget tab.
- Now stats count up once on load: CSS-only `--stat-n` counter, real value in `.sr-only`, off under
  reduced motion. Scope cut with Izzat: no hover lift; timeline bars already animate.
- Keyboard Tab-order test now uses `./fakeTurnstile`: 20/20 runs pass (was about 4 in 8 failing).
- Izzat's instruction: batch tasks on one branch with fewer PRs (overrides one PR per task in
  CLAUDE.md section 4). Both M7 items ship in one PR.

**Verified:** `npm run check`, e2e; the count-up tests fail without the animation; `reviewer`: no blocking findings.

## M8 tidy-up, same branch
- Nine example chips and two brief titles shortened: every short chip is 2 lines at 320px, and the chip
  block is 149px on every load (was up to 40px of jump).
- Case studies keep 3 tags each; new one-line footer (`components/Footer.tsx`, copy in `lib/content.ts`).

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

## 2026-11-17 — Session 57: Estimator shows its output first (M6)

**Done**
- Reviewed the 1,760 live sites in emmabostian/developer-portfolios; the best lead with an outcome
  and proof and show a working demo first. Izzat added M6 from it (#66).
- The estimator opens on the stored example plan (no request, no focus move); form and results sit
  side by side from 1025px. The "See an example plan" button is gone. Turnstile is
  `interaction-only`, with "Waiting for human check…" under submit while the token is pending.

**Verified**
- `npm run check`, e2e and screenshots at 390/1024/1440; `security-reviewer` (Opus): no blocking
  findings; `reviewer` found a focus pull after a field error, fixed and covered by a test.

**Next:** M6 item 2, hero headline with a proof line (Izzat approves the wording).

---

## 2026-11-17 — Session 56: Budget tab in MYR

**Done**
- Third results tab "Budget": people cost = hours × rate (junior RM 40, mid 75, senior 120, mixed
  80 per hour, including EPF and overheads); AI agent seats RM 80–400 per person per started month
  in AI mode; the model lists 3–8 one-off and monthly tool costs as ranges (capped at RM 200,000
  each). Build total and monthly running total; notes name the rates and say "planning only".

**Verified**
- 6 real Haiku runs gave sensible items. `npm run check` 266 unit; e2e 102/102; no sideways scroll at
  320 and 390; `security-reviewer` (Opus) and `reviewer`: no blocking findings.

**Next / waiting on Izzat:** review the PR; release #61–#63 and this when ready.

---

## 2026-11-17 — Session 55: Confidence by counted facts; detailed brief chips

**Done**
- Confidence now counts six facts the description states (users, systems, data, integrations,
  limits, out of scope): high at 4+, medium at 2-3, low at 0-1. Its hint changes with the level.
- Each load shows two short examples and one of 8 detailed briefs ("Detailed brief: <title>"),
  so visitors can compare. Izzat's idea.

**Verified**
- 12 real Haiku runs: 8/8 briefs "high"; one-liners "low" (3) or "medium" (1). `npm run check` 260
  unit; e2e 99/100, the Tab-order test then passed 8/8 (known flake); screenshots at 390;
  `security-reviewer` (Opus): no findings.

**Next up**
- Cost budget (needs Izzat's currency, rates and which working styles).

---

## 2026-11-17 — Session 54: Shuffled example chips

**Done**
- The estimator shows 3 example features picked at random on each page load from 35 in
  `estimatorExamples` (`lib/pick.ts`): insurance, other industries and fun projects. Chips stay hidden, keeping their space, until the pick runs.
  Asked for by Izzat, who asked for the wider mix.

**Verified**
- `npm run check` 259 unit; e2e 100/100 (one earlier run: 2 a11y tests timed out on the first page
  load, passed on rerun with no change); 6 loads at 390: different picks, same height, layout shift 0.

**Next up**
- Cost budget (needs Izzat's currency, rates and which working styles).

---

## 2026-11-17 — Session 53: Result label hints, defined confidence, Haiku note

**Done**
- One-line hints under Effort, Calendar, Team and Confidence; a note under submit that the estimator
  uses Claude Haiku and the plan is a starting point, not a quote. Wording approved by Izzat.
- The prompt now defines "confidence" (how much of the plan rests on assumptions). Before, it was
  undefined and every test plan came back "medium".

**Verified**
- `npm run check` 256 unit; e2e 100/100; `security-reviewer` (Opus): no findings; screenshots at 390
  and 1440. 8 real Haiku runs: vague descriptions gave "low" (4/4), detailed ones "medium" (4/4).

**Next up (approved ideas)**
- Shuffled example chips from a larger list; cost budget (needs Izzat's currency and rates).

---

## 2026-11-17 — Session 52: Next.js 16.4.6

**Done**
- `next` 16.4.4 → 16.4.6 (GHSA-mfr8-8qww-v76h, moderate; the affected cache feature is not used here).
  Asked for by Izzat. The notice that stopped `next build` and the dev server on alternate runs is gone.

**Verified**
- `npm audit`: 0 vulnerabilities; `npm run check` twice in a row, 256 unit; e2e 99/99.

---

## 2026-11-17 — Session 51: "With AI agents" working style on the estimator

**Done**
- New "Working style" control (Traditional team, the default / With AI agents). The request gains an
  optional `mode`; the prompt gets rules for AI-assisted plans (human review task per build phase,
  hours stay human effort, no fixed productivity claim). Plan shape unchanged. Izzat's idea; default,
  labels and prompt rules approved by him.

**Verified**
- 14 real Haiku runs on a local server (both styles): all returned plans; one fix from them
  (traditional plans no longer mention AI). `npm run check` 256 unit; e2e 99/99; `security-reviewer` (Opus): no findings; `reviewer`: no blocking
  findings; screenshots of the form at 320, 390 and 1440.
- `next build` stops on alternate local runs with a Next.js notice about 16.4.4 (GHSA-mfr8-8qww-v76h,
  moderate; the affected cache feature is not used here). Upgrade to 16.4.6 is a separate task.

**Waiting on Izzat**
- Decided 2026-11-17: production stays on Haiku (Sonnet plans were more detailed in a 3-prompt
  comparison, but about 20 times the cost). Undecided: Hallmark redesign.

---

## 2026-11-16 — Session 50: Example plan button; 44px tap targets

**Done**
- "See an example plan" on the estimator shows the stored plan in `lib/samplePlan.ts` with no request
  (no Turnstile, slot or model call). It is labelled as an example and as written by hand; a live
  estimate replaces it. Wording approved by Izzat.
- Tap targets: text links in the hero, project and contact tiles, both link buttons, submit and the
  theme button are at least 44px tall; chips on touch screens too.

**Verified**
- `npm run check` 250 unit; e2e 98/98; `reviewer`: no blocking findings; `/visual-check` of the
  estimator, contact and hero tiles; the example view at 390.

**Waiting on Izzat**
- Optional: paste a real Claude reply to replace the hand-written example. Undecided: Hallmark redesign.

---

## 2026-11-13 — Session 49: Blueprint grid on the estimator tile

**Done**
- `.tile--estimator` draws the design system's blueprint grid (`--grid` lines, 24px) in both themes; the
  old `TODO` in `EstimatorTile.tsx` is gone.
- The axe scans switch the grid image off first: with it on, axe cannot compute contrast for 28 text
  nodes on the tile and leaves them unchecked (measured: 36 checked with the grid, 64 without).

**Verified**
- `npm run check` 247 unit; e2e 95/95; estimator inspected at 390 and 1440 light, 1440 dark, and with
  results showing.

**Waiting on Izzat**
- Release of #50 to #53 and this PR. Undecided: full Hallmark redesign.

---

## 2026-11-13 — Session 48: Loose ends: refund script verified, keyboard flake measured, clean-up

**Done**
- Refund script run on the real Upstash database with throwaway `{rltest}` keys: refund lowers the day
  counter once, keeps its expiry, is a no-op when repeated or when the counter is missing. Keys deleted.
- Keyboard tab-order flake: 1 failure in the last 30 CI runs (passed on retry), 0 in 22 local runs, 12
  alone and 10 under parallel load. Focus dropped to `body` at Turnstile's stop. No code change.
- Removed a finished `TODO` in `estimator.spec.ts`; CLAUDE.md's CI line now mentions the docs-only skip.

**Waiting on Izzat**
- Release of #50, #51, #52. Open: the estimator tile's blueprint grid background (in the design system,
  `--grid` token unused, `TODO` in `EstimatorTile.tsx`); full Hallmark redesign.

---

---

## 2026-11-13 — Session 47: Hallmark re-audit; banner and stat label polish

**Done**
- Re-audit after #51: linter 0 FAIL (was 1), 1 REFLEX (slider thumb calc, a false alarm), 4 WARN.
- Estimator banner: one hairline all round (`--ink`, `--warn` for the rate limit), no side stripe.
- Now tile: stats stack as rows under 440px of tile width (was 360px), so desktop uses rows and the
  longest label takes two lines, not five; labels wrap evenly. `docs/01b-tiles.md` updated.

**Verified**
- `npm run check` 247 unit; e2e 95/95; Now tile at 390 and 1440 and both banner tones inspected.

**Waiting on Izzat**
- Release of #50, #51 and this PR. Undecided: full Hallmark redesign (cards, headings, word count).

---

---

## 2026-11-13 — Session 46: Hero contact row, design polish, Dependabot alerts (Hallmark option 2)

**Done**
- Hero: summary cut from 41 to 23 words (wording approved by Izzat); "Email me" button and LinkedIn link.
- Polish: `overflow-x: clip` on html and body, pressed states on buttons and chips, balanced heading and
  example chip wraps, skip-link padding on the 4px scale.
- Dependabot alerts switched on through the GitHub API at Izzat's request (0 open alerts); CLAUDE.md
  "Security tooling" and `docs/05-deployment.md` say so.

**Verified**
- `npm run check` 247 unit; e2e 95/95; `reviewer`: no blocking findings; `/visual-check` of the hero and
  estimator at 390 and 1440, light: no issues.

**Waiting on Izzat**
- Release of #50 and this PR. Parked: e2e against the production build; full Hallmark redesign.

---

---

## 2026-11-13 — Session 45: Refund a slot on unbilled AI errors (parked audit item)

**Done**
- When the Anthropic API answers with an error status, the visitor's slot and the daily count are given
  back, in memory and in Upstash (one atomic script). Timeouts, refusals and cut-off or unreadable
  replies keep the slot (those calls can be billed). Izzat approved this loosening (option 1).
- The feature text now rejects unpaired surrogates (400), from the security review.
- Earlier today: CLAUDE.md "Accepted risks" wording updated for ADR-009 (#48, released in #49).

**Verified**
- `npm run check` 247 unit; e2e 93/93; `security-reviewer`: no blocking findings.

**Waiting on Izzat**
- Parked: Hallmark; Dependabot alerts; e2e against the production build.

---

---

## 2026-11-13 — Session 44: Faster CI (at Izzat's request, outside the roadmap)

**Done**
- Browser tests that are not about Turnstile now load a fake widget (`tests/e2e/fakeTurnstile.ts`): five
  specs (a11y, estimator, estimator-submit, -results, -tabs). Real widget stays in four specs.
- CI skips the browser tests on PRs that change only `docs/` or root `*.md` files.

**Verified**
- `npm run check` 238 unit; e2e 93/93 in 70 s locally (CI step was 82 to 98 s; compare on this PR).

**Waiting on Izzat**
- Unchanged parked items: Hallmark; three audit items; stale CLAUDE.md "Accepted risks" wording.

---

---

## 2026-11-13 — Session 43: Custom domain live; roadmap complete

**Done**
- Released PR #43. Izzat set `TURNSTILE_HOSTNAME=zenntkaixa.dev`, redeployed, removed the old hostname
  from the Turnstile widget and refreshed LinkedIn's Post Inspector.
- Every roadmap item is now ticked.

**Verified**
- https://zenntkaixa.dev: canonical, `og:url` and share image on the new domain; fake token 403;
  Izzat's estimate worked; Upstash has today's day counter. The old `vercel.app` address redirects (308).

**Waiting on Izzat**
- Parked: Hallmark polish/redesign; audit items (e2e on the production build, Dependabot alerts, refund
  a slot on AI errors). CLAUDE.md "Accepted risks" rate-limit wording is stale.

---

---

## 2026-11-13 — Session 42: M5 custom domain zenntkaixa.dev

**Done**
- Izzat bought zenntkaixa.dev (Cloudflare), added it and `www` in Vercel, DNS only, and added the
  hostname to the Turnstile widget. The bare domain is primary; `www` redirects to it.
- `siteUrl` in `lib/content.ts` is now https://zenntkaixa.dev (canonical, `og:url`, share image); README
  and the switch-over order in `docs/05-deployment.md`.

**Verified**
- https://zenntkaixa.dev returns 200 with a valid certificate; `www` and http redirect to it.
- `npm run check` 238 unit; e2e 93/93.

**Waiting on Izzat**
- After release: set `TURNSTILE_HOSTNAME=zenntkaixa.dev` in Vercel Production and redeploy; then check an
  estimate on the new domain and remove the old hostname from the Turnstile widget.

---

---

## 2026-11-12 — Session 41: Shared rate limit verified; roadmap parked

**Done**
- Released PR #38 (Upstash limiter, audit fixes). Upstash database `portfolio-ratelimit` created
  (Singapore, free); Izzat added both env vars to Vercel Production and redeployed.
- Hallmark design audit run; Izzat parked the polish/redesign choice. Custom domain deferred (remind Izzat).

**Verified**
- Limit script run on the real database (test keys, deleted). After 6 estimates on production the 6th
  was refused; day counter 5, one hashed visitor key with 5 hits, expiries set.

**Waiting on Izzat**
- Custom domain (only open roadmap item). Open audit items, not on the roadmap: e2e on the production
  build, Dependabot alerts, refund a slot on AI errors. CLAUDE.md "Accepted risks" rate-limit wording is stale.

---

## 2026-11-12 — Session 40: Repo audit fixes

**Done**
- Izzat ran a repo audit (7 findings, none must-fix) and picked three to fix.
- `normalisePlan` returns null when no phase has a usable task (was shown as a 0-hour plan).
- Missing `ANTHROPIC_API_KEY` now answers 503 before the human check and the rate limit, so it costs no slot.
- Deleted the unused `lightToken` helper.

**Verified**
- `npm run check` 238 unit; e2e 93/93 on the rerun (first run: 2 timeouts, slow page load and Turnstile test widget).

**Waiting on Izzat**
- Open audit items: e2e on the production build, Dependabot alerts, real-Upstash check, refund slot on AI errors.

---

## 2026-11-12 — Session 39: M5 shared rate limit in Upstash

**Done**
- ADR-009: visitor limit and daily cap run as one atomic Lua script in Upstash over REST (`fetch`, no
  dependency) when both env vars are set; IPs sent as hashes. Never looser than before: failures fall
  back to memory, a block is always honoured, an allow must also pass memory (security-reviewer fixes).

**Verified**
- `npm run check` 236 unit; e2e 93/93 (first run: 2 browser start-up timeouts under load; rerun clean).
- Lua script correct on real Redis 7 (Docker). Not verified: Upstash's REST wrapper, until a database exists.

**Waiting on Izzat**
- Upstash database (Singapore) + `UPSTASH_REDIS_REST_URL` / `_TOKEN` in Vercel Production; then check the
  6th estimate gives 429. CLAUDE.md "Accepted risks" rate-limit wording is stale (Izzat's call).

---

## 2026-11-12 — Session 38: M5 radiozk live URL

**Done**
- `featuredProject.live` in `lib/content.ts` set to https://zenntkaixa-radiozk.onrender.com/ (from Izzat).
  The project tile already renders "Live demo" when it is set; no component change.

**Verified**
- URL returned 200. `npm run check` 197 unit; e2e 93/93 (the existing live-link test now checks the href).

**Waiting on Izzat**
- If radiozk is on Render's free tier it sleeps when idle; first load can take close to a minute.
- Page view in the Analytics dashboard; LinkedIn Post Inspector. `.claude/settings.json` still local.

---

## 2026-11-12 — Session 37: Analytics released; Lighthouse re-measured

**Done**
- Released Web Analytics (PR #32). Closed Vercel's bot PR #29 (package-based duplicate, targeted `main`).
- Production: script 200, no console or CSP errors. VM Lighthouse read 86–88 after release; an A/B with
  the tracker blocked (84–88) vs allowed (87–89) showed analytics is not the cause, only run variance.
- Profile: the long startup task is React/Next boot (229 KB + 187 KB), not our ~48 KB. No code change.

**Verified**
- PageSpeed Insights mobile Performance 100 (Izzat, 2026-11-12). Izzat's call: keep analytics.

**Waiting on Izzat**
- Confirm a page view shows in the Analytics dashboard. LinkedIn Post Inspector. `.claude/settings.json` still local.

---

## 2026-11-12 — Session 36: M5 Vercel Web Analytics

**Done**
- Session 35 follow-up: production mobile Lighthouse after release is 93, 90, 90 (was 64); fake token still 403.
- ADR-008: one deferred same-origin `<script>` in `layout.tsx`, only when `VERCEL_ENV=production`
  (`lib/analytics.ts`). No dependency, no CSP change, page views only.
- Izzat ran `npm i @vercel/analytics` from the dashboard prompt; removed again at Izzat's request (option 1 kept).

**Verified**
- `npm run check` 197 unit; e2e 93/93. security-reviewer: safe to ship; ADR privacy wording tightened.

**Waiting on Izzat**
- Enable Analytics in the Vercel dashboard. After release: script 200, a page view in the dashboard,
  no CSP errors, Lighthouse still ≥ 90. LinkedIn Post Inspector. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 35: M5 Lighthouse (mobile)

**Done**
- Cause: Turnstile preloaded in the critical path (~1.9 MB + CPU). Prod baseline 64, LCP 4.0 s, TBT 1150 ms.
- `Turnstile.tsx` injects `api.js` itself when the estimator nears the viewport or the form gets focus;
  rejects if `window.turnstile` is missing. Hero and Now rise without fading (`tile-rise`), so LCP text is opaque.
- Portrait phones still load it right after hydration (estimator is in view); tests say so honestly.

**Verified**
- Local production build 79 → 93/94 (LCP 2.6 s, TBT ~215 ms). `npm run check` 191 unit; e2e 92/92. reviewer: no blockers, nits fixed.

**Waiting on Izzat**
- After release: Lighthouse rerun on production; LinkedIn Post Inspector. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 34: CI in the Playwright container

**Done**
- Izzat asked why PR #24's CI took 10+ min: `playwright install --with-deps` hung on apt (runners
  couldn't resolve `security.ubuntu.com`) and failed twice; normally 22–34 s. Not our code.
- `ci` job now runs in `mcr.microsoft.com/playwright:v1.64.1-noble` (digest-pinned): no apt, no
  browser download; Playwright version guard; step timeouts. ADR-007; 05-deployment CI section.

**Verified**
- security-reviewer: safe to ship (digest is the multi-arch index). Real test: this PR's CI run.

**Waiting on Izzat**
- PR #24 (OG metadata) updated from `develop` after this merged; its CI now runs in the container. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 33: M5 Open Graph and metadata

**Done**
- `app/opengraph-image.tsx` (1200×630, static), `icon.tsx`, `apple-icon.tsx`; Bricolage Bold TTF + OFL
  in `app/fonts/`; colours from `lib/tokens.ts` (parses globals.css; contrast test reuses it).
- Full metadata in `layout.tsx` (metadataBase, canonical, openGraph, twitter large image, robots);
  `siteUrl` and OG copy in `content.ts`. e2e `metadata.spec.ts`.

**Verified**
- `npm run check` 191 unit; e2e 88/88. Production build head: absolute https og/twitter images; image
  routes 200 PNG; card and icons inspected. reviewer: no blockers, nits fixed.

**Waiting on Izzat**
- After release: LinkedIn Post Inspector to refresh the card. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 32: M4 live URL (closes M4)

**Done**
- README links https://my-portfolio-wip.vercel.app; repo "Website" set via `gh repo edit`; Izzat added
  the URL to LinkedIn. M4 complete on `develop`.

**Verified**
- Repo homepage reads back as the live URL. Docs only; CI on the PR.

**Waiting on Izzat**
- M4 release to `main` when wanted (README link). Next: M5 polish (OG image, Lighthouse Performance 71
  → 90, analytics ADR). `.claude/settings.json` still local.

---

## 2026-11-11 — Session 31: M4 go-live

**Done**
- M4 guards released (#20). Spend limit USD 10; `ANTHROPIC_API_KEY` on Production only; redeployed.
  The estimator is live at https://my-portfolio-wip.vercel.app.

**Verified**
- Vercel env names/targets as intended (values not read). Live: real plan with both tabs; 6th
  submit → 429 "Try again in 55 minutes"; `{}` → 400; fake token → 403.
- PageSpeed mobile: Performance 71 (below 90, moved to the M5 item), A11y/BP/SEO 100.

**Waiting on Izzat**
- Last M4 item: live URL in README and LinkedIn. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 30: M4 production guards

**Done**
- `lib/turnstileConfig.ts`: on production (or Vercel without an explicit preview/dev `VERCEL_ENV`), test or
  missing Turnstile keys or a missing `TURNSTILE_HOSTNAME` → 503 before siteverify, limits and model; a
  real secret needs a hostname everywhere. Hostname compare trimmed. Docs + CLAUDE.md accepted risks.

**Verified**
- `npm run check` 191 unit; e2e 86/86. security-reviewer: fail-closed fix applied as prescribed;
  reviewer: no blockers, nits fixed. Live production already passes the guard.

**Waiting on Izzat**
- Release to `main` when ready; confirm Vercel "Automatically expose System Environment Variables" is on.
  Then the spend limit, then `ANTHROPIC_API_KEY`. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 29: M4 real Turnstile

**Done**
- Cloudflare widget `portfolio` (Managed) for `my-portfolio-wip.vercel.app`. Vercel Production: real
  keys + `TURNSTILE_HOSTNAME`; Preview keeps test keys. Site key must be type Config (Vercel rejects
  Sensitive for `NEXT_PUBLIC_`). 05-deployment updated.

**Verified**
- Live build carries the real site key (test key absent); fake token → 403; 400/415 unchanged.
- Izzat's browser: widget tick, submit → 503 "unavailable" (real token passed; no API key, no spend).

**Waiting on Izzat**
- Next: production guards (code), then the spend limit, then `ANTHROPIC_API_KEY`.
  `.claude/settings.json` still local.

---

## 2026-11-10 — Session 28: M4 first Vercel deploy

**Done**
- Repo public (README release #16); branch protection on `develop`/`main` (PR + `ci`, admins too),
  auto-delete, secret scanning + push protection; merged branches deleted.
- Vercel: https://my-portfolio-wip.vercel.app (sin1, prod branch `main`), Turnstile test keys only,
  no `ANTHROPIC_API_KEY` by design. 05-deployment rewritten for that order.

**Verified**
- Live: home 200, CSP/HSTS/nosniff/DENY headers, 415/400/413, valid request → 503 (no spend).

**Waiting on Izzat**
- Real Turnstile widget next, then spend limit, then the API key. `.claude/settings.json` still local.

---

## 2026-11-10 — Session 27: M3 release, M4 repo ready to go public

**Done**
- M3 released (PR #14 into `main`). Pre-public audit of all history and PRs: safe to publish.
- README for public visitors (CI badge, "What's worth a look", PR workflow); ROADMAP header fixes;
  413/415 rows in the estimator spec (docs-auditor). Repo description and topics set via `gh`.

**Verified**
- docs-auditor: README claims match code. Release: local + CI check/e2e green, `npm audit` clean.

**Waiting on Izzat**
- After merge: flip the repo public; then branch protection, auto-delete, secret scanning and push
  protection (Claude can apply via `gh api` with an OK). `.claude/settings.json` still local.

---

## 2026-11-10 — Session 26: M3 GitHub Actions CI

**Done**
- `.github/workflows/ci.yml`: one `ci` job on PRs/pushes to `develop` and `main` (npm ci, check,
  Playwright chromium, e2e); read-only token, SHA-pinned actions, no secrets, traces on failure.
- CLAUDE.md "green" = `ci` passed on the PR; `/ship` now watches CI; CI section in 05-deployment.

**Verified**
- security-reviewer: no blockers; SHAs match tags; no path to the real API. First real run is this PR.

**Waiting on Izzat**
- Auto-delete head branches (Settings). Branch protection is blocked while the repo is private on
  the free plan: do it when public (M4). `.claude/settings.json` still local.

---

## 2026-11-10 — Session 25: M3 accessibility pass

**Done**
- ADR-006: `@axe-core/playwright` 4.14.0 (dev, exact pin). `a11y.spec.ts`: axe WCAG 2.2 AA on home,
  results tabs 1/2, 403 banner, 429 countdown, light + dark. No violations.
- `keyboard.spec.ts`: full Tab order, focus ring on every stop, no trap, Shift+Tab, keyboard submit +
  tab arrows. `contrast.test.ts`: token pairs in both themes. Skip link "Skip to the estimator" added.

**Verified**
- `npm run check` 174 unit; e2e 86/86; visual check of the focused skip link clean; reviewer: no blockers.

**Waiting on Izzat**
- Turnstile test widget adds 3 Tab stops before Submit (third-party); recheck with the real widget in M4.
- `.claude/settings.json` still has local edits (not committed).

---

## 2026-11-10 — Session 24: M3 e2e coverage

**Done**
- Roadmap item was mostly covered by M2 specs (all tiles, happy path, 429, browser-mocked API;
  `route.test.ts` runs the real route with Anthropic `fetch` mocked). Topped up: the "every tile"
  test now includes case-study tiles from content; new no-console-error check on load + mocked submit.
- Skipped a full-stack e2e against a fake Anthropic server: it needs a base-URL env var that could
  send the key elsewhere if misset in production.

**Verified**
- `npm run check` 137 unit; e2e 73/73. Reviewer skipped (few-line test diff).

---

## 2026-11-10 — Session 23: M3 unit tests

**Done**
- Unit tests for `validateRequest` edges, `normalisePlan` caps/clamps/totals/fallbacks, `rateLimit`
  window, `retryAfter`, day rollover, per-IP isolation (fake timers); `timeline` already covered (16).
- Fixes: `normaliseRole` maps model roles onto the 7 spec roles (aliases, unknown → Backend, own keys
  only after reviewers caught a `"constructor"` prototype hit); rate limiter sweeps stale IPs hourly;
  `teamSize` must be a JSON number now (Izzat: strict), so `"4"` is a 400.

**Verified**
- `npm run check` 135 unit (was 62). reviewer + security-reviewer: no blockers after the fix.

**Waiting on Izzat**
- `.claude/settings.json` still has local edits (not committed).

---

## 2026-11-05 — Session 22: M2 estimator security review (closes M2)

**Done**
- security-reviewer: 1 High, 2 Medium, 6 Low, 3 Info; `npm audit` clean. All fixed: Turnstile before
  limits, action + optional hostname check, CSP + HSTS, 415/413 limits, capped model error, safe env
  limits, `stripFeatureTags`, generic 503, `.env*` ignored. `docs/security-review-m2.md` records it all.
- ROADMAP: new M4 item for production guards (dummy Turnstile keys, missing `TURNSTILE_HOSTNAME`).

**Verified**
- `npm run check` 62 unit; e2e 72/72; CSP/Turnstile/theme 13/13 on a production build. reviewer and
  security-reviewer re-check: no blockers.

**Waiting on Izzat**
- `.claude/settings.json` has empty deny/ask lists locally: restore or keep on purpose (not committed).

---

## 2026-11-05 — Session 21: M2 real-key test and estimator tuning

**Done**
- Izzat ran 5 real cases (Haiku 5.5). Run 1: larger feature 502'd (thinking ate `max_tokens` 2500);
  "mixed" made the model invent 3 people for a team of 2. Injection and non-software 422 were fine.
- `fix(api)`: `maxTokensFor` (8000 Haiku / 4000 others), `effort: "low"`, `stop_reason` handling
  (cut off 502, refusal 422), metadata-only logging, neutral "mixed" wording + team-size rule.
- Run 2: all 4 cases 200; senior team of 6 = 4 wk vs 6.4 wk for juniors. 7 route tests (mocked).

**Verified**
- `npm run check` 50 unit; e2e 71/71. security-reviewer and reviewer: no blockers, fixes applied.

**Next up**
- M2: Security review of the whole estimator path [security-reviewer].

---

## 2026-11-05 — Session 20: M2 accessible result tabs

**Done**
- `feat(ui)`: new `ResultTabs` (WAI-ARIA tabs, automatic activation, roving tabindex, Arrow wrap,
  Home/End, focusable panels, `useId` ids); Estimator keeps the state so a new plan resets to Tab 1.
  Underline styling with tokens, 44px targets. Copy in `estimatorCopy`.
- New `tests/e2e/estimator-tabs.spec.ts` (6 tests, focus asserted with `toBeFocused`).

**Verified**
- `npm run check` passes; Playwright 71/71. Tab crops 320/1440 light+dark + focus clean. reviewer: no findings.

**Next up**
- M2: Manual test with a real API key locally (Izzat runs it) [prompt-engineer].

**Waiting on Izzat**
- Merge the PR. Then the next task needs Izzat to run the estimator with a real key in `.env.local`.

---

## 2026-11-05 — Session 19: M2 results Tab 2

**Done**
- `feat(ui)`: role chips from `roleTotals`; task table with one `<tbody>` per phase (rowgroup header,
  subtotal row), total footer, focusable scroll region on mobile. `fix`: `normalisePlan` keeps exact
  half-hour `totalHours` (was rounded, so footer and summary could disagree with subtotals).
- ROADMAP: M3 CI item gets the agreed follow-up (branch protection, auto-delete head branches).

**Verified**
- `npm run check` passes (42 unit); Playwright 65/65 (develop had 61, not 65 as PR #4 said). Tab 2 crops clean.

**Next up**
- M2: Accessible tabs with keyboard support [ui-builder].

---

## 2026-11-05 — Session 18: M2 results Tab 1

**Done**
- `feat(ui)`: summary `<dl>` (hours, weeks, team, confidence badge: ink text, tone on border + dot),
  timeline rows (label above a bar placed by `toBars`, week gridlines), phase cards, assumptions and
  risks sections. `fix(ui)`: index keys in TaskTable for repeated phase names.
- New `tests/e2e/estimator-results.spec.ts` (fixture geometry, summary, counts, 320 overflow, dup names).

**Verified**
- `npm run check` passes; Playwright 65/65. Tab 1 crops 320/1440 light+dark clean. reviewer fixes applied.

**Next up**
- M2: Tab 2: role total chips and grouped task table [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

## 2026-11-05 — Session 17: M2 timeline maths

**Done**
- `feat`: `lib/timeline.ts` — `toBars` (percent positions clamped to 0..100, whole-day labels "Day 3 to
  7" / "Day 3", half-day starts floored), `weekMarkers` (every 5 days, excludes 0 and 100),
  `roleTotals` (hours desc, ties by name). 16 unit tests replace the `it.todo` stubs.

**Verified**
- `npm run check` passes (41 unit tests). No e2e: no caller until Tab 1. reviewer skipped (small diff).

**Next up**
- M2: Tab 1: summary row, timeline chart, phase cards, assumptions and risks [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

## 2026-11-05 — Session 16: adopt claude-team agents and skills (Izzat's instruction)

**Done**
- `chore`: Agent contract in CLAUDE.md for the generic `~/claude-team` agents; `code-reviewer`
  retired for `reviewer`; `/ship` follows `ship-pr` for git and PRs; `/next-task` offers ranked
  options when there's a real choice. ADR-005.

**Verified**
- Docs and config only; no code changed. No leftover `code-reviewer` references.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR, then say "PR merged".

---

## 2026-11-05 — Session 15: branch strategy change (Izzat's instruction)

**Done**
- `chore`: task branches off `develop`, one PR per task into `develop`; Izzat merges. Releases are PRs
  `develop` → `main`. ADR-004; CLAUDE.md section 1/4/6/7, `/next-task` and `/ship` updated.

**Verified**
- Docs-only; no code changed.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR. Optional: protect `develop` and `main` on GitHub (require PR before merge).

---

## 2026-11-05 — Session 14: M2 submit flow and error states

**Done**
- `feat(ui)`: idle → submitting → success | error. Disabled fieldset, skeleton + polite "Planning phases…",
  `aria-busy`. 400 inline (textarea focused); 403/422/503 banners; 429 warn banner + Retry-After countdown
  on the button; 502/504/network Retry gated on a fresh token. Non-JSON bodies, `isPlan` guard, abort on
  unmount, focus to banner/results heading, footer note. Copy in `estimatorCopy`.
- New `lib/estimatorClient.ts` (+10 unit tests) and `tests/e2e/estimator-submit.spec.ts` (10 tests).

**Verified**
- `npm run check` passes; Playwright 58/58. 12 estimator crops clean. code-reviewer: no blockers, fixes applied.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Backlog (unchanged): siteverify `hostname` check in `route.ts`; per-instance rate limit.

---

## 2026-11-05 — Session 13: M2 Turnstile component

**Done**
- `feat(ui)`: Turnstile renders from `Script onReady` (no polling; survives StrictMode re-runs),
  `onToken` held in a ref, re-renders on `data-theme` change, try/catch around render, failure message
  in a persistent polite live region; `reset()` clears token then widget. Copy moved to `lib/content.ts`.
- New `tests/e2e/turnstile.spec.ts` (render, reset after request, blocked script, theme change).

**Verified**
- `npm run check` passes; Playwright 48/48; dev mode widget loads. Estimator crops 320/1440 light+dark
  clean. code-reviewer findings fixed; security-reviewer: safe to ship.

**Next up**
- M2: submit flow and all error states from 03-estimator-spec [ui-builder].

**Waiting on Izzat**
- Backlog (security advisories, existing code): check siteverify `hostname` in `route.ts`; rate limit is
  per-instance memory, so Turnstile is the real gate.

---

## 2026-11-05 — Session 12: M2 estimator form controls

**Done**
- `feat(ui)`: example chips (strings moved to `lib/content.ts`), textarea with right-aligned counter
  (warn colour under 20, hint in a polite live region), styled team slider with `<output>` readout and
  `aria-valuetext`, seniority as a native-radio segmented pill (2x2 under 360px). Dark fieldset border fixed.
- New `tests/e2e/estimator-form.spec.ts` (chips, counter, slider, arrow keys, no scroll at 320).

**Verified**
- `npm run check` passes; Playwright 44/44. Estimator crops at 320/1440 checked; code-reviewer: no blockers.

**Next up**
- M2: Turnstile component (explicit render, reset after each request) [api-engineer].

**Waiting on Izzat**
- Unchanged from Session 11. Open nit: estimator UI labels stay in the component (not `content.ts`).

---

## 2026-11-05 — Session 11: M1 visual-check pass (closes M1); token-budget setup

**Done**
- `chore: cut per-session token use` (Izzat's instruction): trimmed CLAUDE.md, PROGRESS archive,
  docs/01b-tiles.md split, Sonnet subagents, crop-first `/visual-check`, `/ship` confirms not re-runs.
- Visual-check fixes: focus halo spread 8px so 4px shows outside the outline; Turnstile renders
  `compact` when its container is under 300px (no sideways scroll at 320px).

**Verified**
- `npm run check` passes; Playwright 40/40. 320 and 390: scrollWidth equals clientWidth; halo crop
  checked. Few-line diff, so no code-reviewer run (CLAUDE.md section 4).

**Next up**
- M2: estimator form. Estimator styling also covers the deferred visual findings (plain controls,
  dark-mode fieldset border, cramped example buttons, radio wrapping at 320).

**Waiting on Izzat**
- Certifications empty space at 1024 (comparison image in the session). Now tile stat label wraps to
  5 lines at 1440: shorter copy or earlier row layout. M2 tile-hover roadmap line. Session 8 copy
  points, radiozk live URL, Anthropic key, `AGENTS.md`.

---

## 2026-11-04 — Session 10: M1 load animation with reduced-motion support

**Done**
- CSS-only `tile-in` (fade and rise 8px, 400ms ease-out), staggered 40ms per tile in DOM order via
  `nth-child`, capped at 440ms. All inside `prefers-reduced-motion: no-preference`; no JS, so tiles
  appear without hydration.
- Fill mode `backwards`, not `both`: a forwards fill leaves an identity transform on every tile, making
  it a containing block for `position: fixed` children (would trap M2 overlays).
- Visual spec emulates reduced motion, so screenshots never catch a mid-fade.
- New `tests/e2e/motion.spec.ts`: reduced motion means no animation; stagger delays in DOM order;
  no lingering transform after finish (shown to fail with `both`); works with JS blocked.
- docs/01: Motion section rewritten. Tile hover deferred to M2 with the estimator tile.

**Verified**
- `npm run check` passes; Playwright 40/40; motion spec 5x repeat, no flakes. Screenshots at
  390/1024/1440, light and dark, unchanged.
- code-reviewer: no blockers. Fixed: duplicated style reader in the spec, cap comment, mobile
  trade-off wording in docs.

**Found, not fixed**
- The hero paints at opacity 0 for its first frame, so LCP lands about a frame later. Negligible;
  exempt `.tile--hero` if Lighthouse ever flags it.

**Next up**
- M1: `/visual-check` pass at 390 / 1024 / 1440, light and dark; fix findings.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space
  under Certifications.

---

## 2026-11-04 — Session 9: M1 Experience, Stack, Certifications, Contact tiles

**Done**
- Experience: `ol.timeline` with the period in a tabular-nums `--muted` column, org and role, a
  `--line` rule; container query stacks the period above each entry under 420px. Education under an h3.
- Stack: h3 per group; each chips list is named by its heading (`aria-labelledby`).
- Certifications: name left, year right in tabular-nums with `--line` dividers; empty year renders
  nothing.
- Contact: email as the primary mailto button (`--accent-ink` on `--accent`, 5.9:1 light, 7.1:1
  dark); LinkedIn and GitHub as new-tab links. No phone number. Note moved to `profile.contactNote`.
- Cross-tile: new `components/ExternalLink.tsx` (used by Project and Contact); `role="list"` on every
  bullet-less list; shared `lib/slug.ts` (with a unit test) replaces two copies.
- e2e (content only): the four tiles' content in order, mailto href, external link attributes, and
  a page-wide check that every bullet-less list has `role="list"`.
- docs/01: Experience, Stack, Certifications, Contact, Lists and external links sections.

**Verified**
- `npm run check` passes; Playwright 36/36 (home spec also 3x repeat, no flakes). Checked at
  390/1024/1440, light and dark.
- code-reviewer: no blockers. Fixed: stale CSS list comment, duplicated `slug()`, brittle empty-year
  guard, redundant hand-maintained list test, unused `className` prop, Experience key, container
  query wording.

**Found, not fixed**
- At 1024 Certifications stretches to Stack's height and has empty space at the bottom.
- Labels "Education", "LinkedIn", "GitHub" are UI chrome in components (allowed, like tile titles).

**Next up**
- M1: load animation with reduced-motion support.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space.

---

## 2026-11-04 — Session 8: M1 case study tiles x3

**Done**
- Context line in `--muted` at `--fs-sm` (`.tile__meta`), body, then "Tech stack" chips.
- Each tile is a flex column and the body grows, so the chips sit at the bottom and line up across the
  equal-height row (desktop row 4; tablet tiles 1 and 2).
- e2e (content only): one region per case study, context, body and stack items in order; no
  duplicate or missing titles.
- docs/01: Case studies section.

**Verified**
- `npm run check` passes; Playwright 28/28 (two runs; the new test was shown to fail when the
  expected order was reversed). Checked at 390/1024/1440, light and dark.
- code-reviewer: no blockers. Anonymisation guardrail passes: only vendor and product names
  (Guidewire, Jutro, SonarQube, Azure and so on), no client names, internal system names or ticket IDs.

**Found, not fixed** (copy decisions for Izzat, via `/update-content`)
- "Guidewire Digital Portal program" could read as a client programme name; "Guidewire Digital
  Portals" would be unambiguous.
- "authorization" is US spelling; the other case studies use UK spelling.

**Next up**
- M1: Experience, Stack, Certifications, Contact tiles (Contact: same new-tab link treatment as the
  project tile).

**Waiting on Izzat**
- The two copy points above. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 7: M1 AI workflow tile

**Done**
- Native `<ol>` with numbers styled via `::marker` (display font, `--accent`). No `list-style: none` or
  counters, so Safari/VoiceOver keep list semantics and numbers aren't read twice.
- Each step: semibold name on its own line, then the sentence; a visually hidden ":" between them so
  screen readers don't run the two together. Hand-typed "1." numbering removed.
- e2e (content only): one `<ol>`, steps in content order with exact text, name in `<strong>`.
- docs/01: AI workflow section; `--accent` usage now includes list markers.

**Verified**
- `npm run check` passes; Playwright 27/27. Tile checked at 390 and 1440, light and dark: markers align
  with the step name and wrapped text aligns under the text. Marker contrast 5.9:1 light, 6.2:1 dark.
- code-reviewer: no blockers; the hidden separator, test merge and doc nits applied.

**Next up**
- M1: Case study tiles x3.
- Contact tile: same new-tab link treatment as the project tile (see Session 6).

**Waiting on Izzat**
- radiozk live URL (one line in `lib/content.ts`). Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 6: M1 featured project tile (radiozk)

**Done**
- Tagline as a lead line (`--fs-lg`, 600), description, compact highlights list, "Tech stack" chips.
- Links as a list in a wrapping row: "View code on GitHub", plus "Live demo" once
  `featuredProject.live` is set. Both open in a new tab with `rel="noopener noreferrer"` and hidden
  " (opens in a new tab)" text for screen readers.
- e2e (content only, per Izzat): tagline, description and highlights; stack items in order; GitHub
  link href/target/rel/name; no live link while `live` is empty (and the right one once it's set).
- docs/01: Featured project section.

**Verified**
- `npm run check` passes; Playwright 26/26. The GitHub repo URL returns 200. With a temporary live URL
  (reverted), the two-link row renders correctly and the live branch of the test passes.
- code-reviewer: no blockers; docs sync, tagline line-height and the links-as-list nit applied.

**Next up**
- M1: AI workflow tile (four numbered steps).
- When doing the Contact tile: give its links the same new-tab treatment (`rel="noopener noreferrer"`,
  hidden new-tab text, no `" "` spacing). Consider a shared `ExternalLink` component then.

**Waiting on Izzat**
- radiozk live URL (one line in `lib/content.ts`). Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 5: M1 Now tile

**Done**
- Role block: title semibold, organisation in `--muted`, then the detail (replaces `<strong>`/`<br>`).
- Stats: `<dl>` groups with dt (label) before dd (value) in the DOM; CSS shows the value first, in the
  display font at `--fs-xl`. Three columns with `--line` dividers between items.
- The tile is a size container: under 360px wide it switches to rows, value beside label. That
  happens on mobile and also on desktop around 1025-1125px.
- e2e: content, and dt/dd pairing and order. Layout tests (columns at 1440, rows at 390 and 1100)
  were written, then removed at Izzat's request; the layout is checked by `/visual-check` instead.
- docs/01: Now section; Typography line notes the stat-value exception.

**Verified**
- `npm run check` passes; Playwright 22/22 with the final test set. Now tile checked
  at 1440 and 390, light and dark; rows at 1100 were confirmed by a test before it was removed.
- code-reviewer: no blockers; its docs sync and component nits applied.

**Found, not fixed**
- At 1440 each stat column is about 130px wide, so "merged pull requests contributed to, Apr to Oct
  2026" wraps to 5 lines. Copy decision for Izzat (via `/update-content`).
- One full e2e run took 2.7 minutes instead of about 30 seconds, likely VM load from another session.

**Next up**
- M1: Featured project tile (radiozk).

**Waiting on Izzat**
- Optional: a shorter PR stat label. radiozk live URL (featured project tile). M2 needs the Anthropic
  key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 4: M1 hero tile

**Done**
- The hero name is now the page's only `<h1>` and names the hero section (was a hidden "About Izzat
  Fahmi" h2; the page had no h1). `Tile` gained `headingLevel` and `titleClassName`; `hideTitle`
  removed.
- Hero layout: 72px initials avatar beside the name (`--fs-2xl`) and role, then headline, summary,
  and a meta line with the location and the availability text after an `--ok` dot. Forced-colours
  handling for the avatar and dot.
- e2e: region name updated; new test for a single h1, hero content and the hidden avatar.
- docs/01 has a Hero section; docs/02 Bento row updated.

**Verified**
- `npm run check` passes; Playwright 20/20 (qa-tester ran it twice plus 3 repeats of home.spec;
  I reran it after the review fixes). Hero checked at 390 and 1440, light and dark: the name fits on
  one line at 390.
- code-reviewer: no blockers. Contrast: initials 4.9:1, dot 4.0:1, meta 5.9:1 or better.

**Next up**
- M1: Now tile (current role and three stats).

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-04 — Session 3: M1 theme toggle

**Done**
- Repaired the local git repo: the VM shut down uncleanly and left 11 empty object files from
  `96801b9`. I backed up `.git`, deleted the empty files and refetched them from origin; `git fsck` is
  now clean and no work was lost.
- `ThemeToggle`: 40px icon button (sun in light, moon in dark), fixed name "Dark theme" plus
  `aria-pressed`. Both icons are in the HTML and CSS shows the right one, so it's correct before
  hydration. Follows live system changes until the visitor picks a theme.
- Fixed, from code-reviewer: with storage blocked, the bootstrap can't set `data-theme`, so the
  toggle now falls back to the system scheme instead of assuming light.
- e2e: `home.spec.ts` updated; new `theme.spec.ts` covers no-flash (JS chunks blocked), system
  fallback, icons, live follow and blocked storage.
- docs/01 and docs/02 synced.

**Verified**
- `npm run check` passes; Playwright 19/19, run twice. The blocked-storage test fails on the old code
  and passes with the fix. Toggle checked at 390 and 1440, light and dark.

**Found, not fixed**
- Turnstile keeps the theme it rendered with; toggling doesn't restyle it (M2 Turnstile task).
- qa-tester saw `visual.spec.ts` time out once on a cold first run (dev server compiling). It didn't
  recur in 7 runs, including a cold one; watch for it.

**Next up**
- M1: Hero tile.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-03 — Session 2: M1 finish `app/globals.css`

**Done**
- ≤720px: Hero then Estimator via CSS `order` (`.tile--hero`, `.tile--estimator`); DOM/focus order
  unchanged. Trade-off recorded in docs/01.
- Tile base: `.tile__title`, vertical rhythm (`.tile > * + *`), lists, `.muted`/`.tile__meta` hooks,
  shared `.chips`. Rules inside tiles use `:where(.tile)` so component classes win.
- Links and form controls in `@layer base`. Text fields use a `--muted` border (3:1 non-text contrast;
  `--line` was 1.36:1). Range/radio/checkbox keep native shape with `accent-color`.
- Focus: existing outline + halo, plus a `forced-colors` `Highlight` outline. Focus and form-control
  specs added to docs/01.

**Verified**
- `npm run check` passes; Playwright 11/11. Visual check at 390/1024/1440, light and dark: spans per
  docs/01, no horizontal scroll, 390px order Hero → Estimator → Now. Computed styles confirmed the
  textarea border, range slider and chips in both themes. Focus ring checked normally and with
  emulated forced colours.
- code-reviewer: one blocker (field border contrast) and the cascade findings fixed before commit.

**Found, not fixed** (belong to later tasks)
- Hero, Now stats, Contact links and the estimator form are still unstyled. Stale "stack chips"
  TODOs remain in ProjectTile, CaseStudyTile and StackTile; clear them in those tile tasks.

**Next up**
- M1: theme toggle with no flash on load.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`.

---

## 2026-11-03 — Session 1: stack upgrade (Izzat's instruction, outside the roadmap)

Izzat asked to upgrade to the latest LTS/stable versions before starting M1, so the first roadmap task
was deferred.

**Done**
- `194ff48` Node 22 → 26 LTS: `.nvmrc` 26, `engines.node` `26.x` (the old `>=20` would have let Vercel
  silently move to 26), `@types/node` ^26, version notes in docs.
- `fc96df9` React 19.1 → 19.3.1, Vitest 3 → 5.1 (Vite 8 is now a peer). `vitest.config.ts` renamed to
  `.mts` for Vite's native config loader; `*.mts` added to tsconfig `include`.
- `767e6d6` Next.js 15.5 → 16.4.4 via `@next/codemod upgrade --skip-adoption` (no source changes needed; Next
  rewrote `tsconfig.json`: `jsx: react-jsx`, `.next/dev/types`).
- e2e: `visual.spec.ts` waits for fonts + the Turnstile iframe instead of `networkidle`, which timed out
  10/12 runs on Next 16 vs 0/12 on Next 15 (root cause not found). Fixed the rate-limit test's
  `getByRole("alert")`, which also matched Next's route announcer (failed on Next 15 too).
- `ef2f030` Branching: `develop` is the working branch, `main` is for releases (CLAUDE.md §5 Branches).
- TypeScript 5.7 → 7.0.2 (native compiler). Added `"types": ["node"]` to tsconfig: TS 7 defaults
  `types` to `[]`, and `@types/node` was only arriving via Next's own type references.

**Verified** (on Node 26.13.0)
- `npm run check` passes. Playwright 11/11 in 3 consecutive runs. This is the first e2e run on Ubuntu.
- TS 7: a deliberate type error fails both `tsc` and `next build`. The post-edit hook shells out to
  `tsc`, so it's unaffected by TS 7 having no stable JS compiler API yet.
- Editors: TS 7 ships no `tsserver` and no language-service plugins yet. Editors set to "use workspace
  TypeScript" need the TypeScript native-preview extension (or fall back to their bundled TS), and the
  `next` tsconfig plugin gives no hints.

**Found, not fixed**
- Turnstile widget isn't painted in the 390px screenshot (same on Next 15). Look at it in M1/M2.
- npm's install-scripts policy blocks esbuild's postinstall; everything works without it.

- M0 "First run on Ubuntu" ticked: Izzat installed Node 26.13.0 via nvm (default alias `lts/*`,
  npm 11.20.0). On it, `npm run check` passes and Playwright passes 11/11.

**Next up**
- M1 via `/next-task`: finish `app/globals.css`.

**Waiting on Izzat**
- Nothing blocking M1. M2 needs the Anthropic key in `.env.local` for the manual test.
- Decide what to do with the untracked `AGENTS.md`.

---

## 2026-11-03 — Session 0 (planned in Claude.ai, before first clone)

**Done**
- Scaffolded Next.js 15 project, wrote `lib/content.ts`, `lib/estimate.ts`, `lib/rateLimit.ts` and
  `app/api/estimate/route.ts`.
- Wrote CLAUDE.md, docs 00–05, ADRs 001–003, subagents, skills and the post-edit typecheck hook.
- Added compiling skeletons for every tile and the estimator UI, plus starter tests.

**Verified in the sandbox**
- `npm run typecheck` and `npm run test` pass.
- `npm run build` passes with fonts stubbed (the sandbox can't reach Google Fonts). Run the real build on Ubuntu.
- PostToolUse typecheck hook: exits 0 on clean edits, 2 with errors on broken ones.
- **Not yet run:** Playwright e2e (no browser in the sandbox). Run `npm run test:e2e` on Ubuntu.

**Next up**
- M0 last task: first run on Ubuntu, then start M1 with `/next-task`.

**Waiting on Izzat**
- radiozk live URL, Anthropic API key in `.env.local`, Vercel and Cloudflare accounts.
