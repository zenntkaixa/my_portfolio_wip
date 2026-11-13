# 05 — Deployment

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel (Production + Preview), `.env.local` | Server only. Never prefix with `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | Optional | Default `claude-haiku-5-5` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel, `.env.local` | Public by design; Vercel type **Config** (it rejects Sensitive for `NEXT_PUBLIC_`). Production: real key. Preview: test key |
| `TURNSTILE_SECRET_KEY` | Vercel, `.env.local` | Server only, type Sensitive. Production: real secret. Preview: test secret |
| `TURNSTILE_HOSTNAME` | Required with a real secret, Vercel Production | `zenntkaixa.dev`; when set, siteverify must report this hostname |
| `RATE_LIMIT_PER_HOUR` | Optional | Default 5 |
| `DAILY_LIMIT` | Optional | Default 150 |
| `UPSTASH_REDIS_REST_URL` | Optional, Vercel Production | `https://` REST URL of the Upstash database; shares the limits across instances (ADR-009) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional, Vercel Production | Server only, type Sensitive. Without both vars, or when Upstash fails or takes over 1 s, the in-memory limiter is used |

On Production the estimator refuses (503) Cloudflare test keys or a missing `TURNSTILE_HOSTNAME`; the guard also runs when `VERCEL=1` without `VERCEL_ENV`, and a real secret always needs `TURNSTILE_HOSTNAME`. Preview and local test-key setups are unaffected. Changing any Turnstile env var needs a redeploy (the site key is inlined at build time).

Local development uses Cloudflare's official **test keys** (already in `.env.example`), which always pass.

## First deploy (Izzat does the account steps; Claude Code can guide)

Production is **https://zenntkaixa.dev** (also `my-portfolio-wip.vercel.app`; Vercel project imported from
`zenntkaixa/my_portfolio_wip`, production branch `main`, region `sin1`). The order below keeps the
estimator **off** (no `ANTHROPIC_API_KEY`, so it answers 503) until human verification is real, so the
public endpoint can't spend money while Turnstile still uses always-pass test keys.

1. Done (2026-11-10): Vercel **Add New → Project → Import** the repo, defaults for Next.js. Env vars
   for Production + Preview: only the two Turnstile **test** keys from `.env.example`. Deployed.
2. Done (2026-11-11): Cloudflare **Turnstile → Add widget** `portfolio`, hostname
   `my-portfolio-wip.vercel.app` only (local dev keeps the test keys), Managed, no pre-clearance.
3. Done (2026-11-11): real keys and `TURNSTILE_HOSTNAME` on **Production** only; Preview keeps the test
   keys (preview hostnames change per deploy, so a real widget would fail there, and previews sit
   behind Vercel login with no API key). Redeployed without build cache (the site key is built in).
4. Done (2026-11-11): Anthropic Console **monthly spend limit** USD 10.
5. Done (2026-11-11): `ANTHROPIC_API_KEY` added (Production only, Sensitive) and redeployed. The
   estimator is live.

## Shared rate limit (ADR-009, optional)

1. Upstash console: create a free **Redis** database in the Singapore region (`ap-southeast-1`, next to
   Vercel `sin1`), eviction off.
2. Copy its REST URL and REST token into Vercel **Production** as `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN`, both type Sensitive, then redeploy.
3. Check: the 6th estimate in an hour still returns 429, and the function logs show no
   "Shared rate limit unavailable" line. Without the vars the site keeps the in-memory limiter.

Done 2026-11-12: database `portfolio-ratelimit` (free, `ap-southeast-1`, eviction off). After Izzat's
6 estimates the 6th was refused; Upstash held `est:{rl}:d:2026-11-12` = 5 and one hashed visitor key
with 5 hits, both with their expiries. Function logs not checked.

## Web analytics (ADR-008)

Izzat enables it once: Vercel **Project → Analytics → Enable**. The site then loads
`/_vercel/insights/script.js` on production builds only (`VERCEL_ENV=production`); previews and local
runs do not. Page views only, cookieless; no env vars and no CSP change.

## CI

`.github/workflows/ci.yml` runs one job, `ci`, on every PR into and push to `develop` and `main`:
`npm ci`, `npm run check`, `npm run test:e2e`, inside the official Playwright container pinned by digest
(ADR-007: browsers and their Linux packages are preinstalled, so no apt or browser download; bump the
image together with `@playwright/test`). It needs no secrets (fetch is mocked,
Turnstile uses the test key). Actions are pinned to commit SHAs; bump them only to releases at least two
weeks old. Failed runs upload `test-results/` (traces) for 7 days. The repo is public. Branch protection on `develop`
and `main`: a PR is required (0 approvals), the `ci` check must pass on an up-to-date branch, admins
included, no force pushes or deletion. Head branches auto-delete on merge; secret scanning and push
protection are on.

## Every later deploy
Push to `main` (a release, see CLAUDE.md section 4, Branches) → Vercel builds and deploys to production. Pushes to
`develop` and pull requests get preview URLs.

## Post-deploy checks
- Estimator works on the live URL and the Turnstile widget appears.
- Submitting 6 times in an hour returns the 429 message.
- `curl -X POST <url>/api/estimate -d '{}'` returns 400, not 500.
- `curl -I <url>/_vercel/insights/script.js` returns 200 on production, and a page view shows in the
  Analytics dashboard.
- Lighthouse mobile run meets the targets in `00-brief.md`.

First run (2026-11-11, production): plan returned with both tabs; the 6th submission in the hour showed
"You've used 5 estimates this hour. Try again in 55 minutes."; `{}` → 400; a fake token → 403.
PageSpeed Insights mobile: Performance **71** (target 90, tracked in the M5 Lighthouse item),
Accessibility 100, Best Practices 100, SEO 100.

## Custom domain: zenntkaixa.dev (Cloudflare Registrar and DNS)
`TURNSTILE_HOSTNAME` takes one hostname, so the estimator works on one address at a time. Order:

1. Vercel → Project → Settings → **Domains**: add `zenntkaixa.dev` (and `www`, redirecting to the apex).
2. Cloudflare DNS: add the records Vercel shows, **DNS only** (grey cloud), so Vercel issues the certificate.
3. Cloudflare Turnstile widget `portfolio`: add hostname `zenntkaixa.dev`, keep the old one for now.
4. Release the `siteUrl` change, then set `TURNSTILE_HOSTNAME=zenntkaixa.dev` in Vercel Production and redeploy.
5. Check on the new domain: one estimate works, a fake token gets 403, canonical and `og:url` show it.
   Then remove `my-portfolio-wip.vercel.app` from the Turnstile widget and make it redirect in Vercel.
