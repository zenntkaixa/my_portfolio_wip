# Security review — M2 estimator path (2026-11-05)

Scope: estimator form and result rendering, Turnstile widget and server check, `app/api/estimate/route.ts`,
`lib/estimate.ts`, `lib/rateLimit.ts`, model call and cost, `next.config.ts` headers, env handling.
Reviewed by `security-reviewer` (Opus), dependencies by `security-engineer` (`npm audit`: 0 findings).

## Findings and outcome

| # | Severity | Finding | Outcome |
|---|---|---|---|
| 1 | High | Rate limit and daily cap ran before Turnstile, so fake tokens burned quota and could lock out real visitors for the day | **Fixed**: order is body checks → Turnstile → limits → key → model |
| 2 | Medium | No Content-Security-Policy or HSTS | **Fixed** in `next.config.ts`; verified with no violations on dev and a production `next start` build |
| 3 | Medium | siteverify checked only `success` | **Fixed**: action `estimate` required; hostname checked when `TURNSTILE_HOSTNAME` is set |
| 4 | Low | Unbounded body, no content-type check | **Fixed**: 415 for non-JSON, 413 over 8 KB |
| 5 | Low | Model's 422 sentence passed through unbounded | **Fixed**: capped at 200 characters |
| 6 | Low | Non-numeric limit env vars silently disabled limits | **Fixed**: falls back to the default |
| 7 | Low | `</feature>` in user text could break out of its tags | **Fixed**: tag-like text stripped until stable (`stripFeatureTags`) |
| 8 | Low | 503 message named the env var and vendor | **Fixed**: generic copy, detail logged server-side |
| 9 | Low | `.gitignore` missed `.env.production` and similar | **Fixed**: `.env*` with `!.env.example` |
| 10 | Info | ADR-002 still said `max_tokens: 2500` | **Fixed**: describes `maxTokensFor` |
| 11 | Info | Worst-case cost: about $0.0044/request on Haiku 5.5 (about $0.66/day per instance at the cap), about $0.047 on Sonnet 5.5 | **Accepted**: the Anthropic Console monthly spend limit is the backstop (M4) |
| 12 | Info | `x-forwarded-for` is trustworthy on Vercel only | **Documented** in a code comment |

## Decisions and accepted risks

- **Dummy Turnstile secrets skip the action and hostname checks.** Cloudflare's dummy secrets (`1x`/`2x`/`3x`
  plus zeros) return no guaranteed `action` or `hostname`, and the always-pass one accepts any token anyway,
  so the skip adds no weakness. Real secrets start with `0x` and get every check.
- **`TURNSTILE_HOSTNAME` is optional for now.** The Cloudflare widget's hostname allowlist is the main control;
  this check is a second layer.
- **`'unsafe-inline'` in `script-src`** is needed for the theme script and Next's inline scripts until nonces
  are added. No model or user text is ever rendered as HTML.
- **HSTS without `includeSubDomains` or `preload`**: the conservative choice until a custom domain exists.
- **The body-size check counts characters, not bytes.** A multibyte body can reach about 24 KB before the 413;
  the 1,500-character feature limit still applies after it.
- Still accepted (from the Agent contract): the per-instance in-memory rate limit, and Turnstile test keys
  until M4.

## Deferred to M4 (roadmap item)

When `VERCEL_ENV=production`, refuse requests if Turnstile is still on dummy keys, or if a real secret is set
but `TURNSTILE_HOSTNAME` isn't.

## Deploy-time checklist (M4)

- Real `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; `TURNSTILE_HOSTNAME` = the production domain.
- Cloudflare widget hostnames: the production domain, plus `www` and preview domains if used.
- `RATE_LIMIT_PER_HOUR` and `DAILY_LIMIT` as positive integers.
- Anthropic Console monthly spend limit on.
