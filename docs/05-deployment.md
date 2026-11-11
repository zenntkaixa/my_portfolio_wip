# 05 — Deployment

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel (Production + Preview), `.env.local` | Server only. Never prefix with `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | Optional | Default `claude-haiku-5-5` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel, `.env.local` | Public by design; Vercel type **Config** (it rejects Sensitive for `NEXT_PUBLIC_`). Production: real key. Preview: test key |
| `TURNSTILE_SECRET_KEY` | Vercel, `.env.local` | Server only, type Sensitive. Production: real secret. Preview: test secret |
| `TURNSTILE_HOSTNAME` | Required with a real secret, Vercel Production | `my-portfolio-wip.vercel.app`; when set, siteverify must report this hostname |
| `RATE_LIMIT_PER_HOUR` | Optional | Default 5 |
| `DAILY_LIMIT` | Optional | Default 150 |

On Production the estimator refuses (503) Cloudflare test keys or a missing `TURNSTILE_HOSTNAME`; the guard also runs when `VERCEL=1` without `VERCEL_ENV`, and a real secret always needs `TURNSTILE_HOSTNAME`. Preview and local test-key setups are unaffected. Changing any Turnstile env var needs a redeploy (the site key is inlined at build time).

Local development uses Cloudflare's official **test keys** (already in `.env.example`), which always pass.

## First deploy (Izzat does the account steps; Claude Code can guide)

Production is **https://my-portfolio-wip.vercel.app** (Vercel project imported from
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
4. In the Anthropic Console: set a **monthly spend limit** (start low, e.g. USD 10).
5. Only then add `ANTHROPIC_API_KEY` (Production; Preview only if wanted) and redeploy.

## CI

`.github/workflows/ci.yml` runs one job, `ci`, on every PR into and push to `develop` and `main`:
`npm ci`, `npm run check`, Playwright chromium, `npm run test:e2e`. It needs no secrets (fetch is mocked,
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
- Lighthouse mobile run meets the targets in `00-brief.md`.

## Custom domain (later)
Vercel → Project → Settings → Domains. Then add the new hostname to the Turnstile widget.
