# ADR-007 — Run CI in the official Playwright container

**Status:** Accepted (2026-11-11)

## Context
CI ran `npx playwright install --with-deps chromium` on a plain `ubuntu-latest` runner. Each run
downloaded Chromium and used `apt-get` to install its Linux packages (9 font packages, about 22 MB on
`ubuntu-26.04`). On 2026-11-11 the runners could not reach the Ubuntu archive
(`Temporary failure resolving 'security.ubuntu.com'`), so the step hung for about 10 minutes and then
failed, twice, on a PR whose own checks were green. On a normal day the step took 22–34 s.

## Decision
- The `ci` job runs in `mcr.microsoft.com/playwright:v1.64.1-noble`, pinned by digest. Chromium and its
  system packages are preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`), so CI makes no apt calls
  and downloads no browser.
- `setup-node` still installs Node from `.nvmrc`, so the image's own Node version does not matter.
- A guard step fails the job if `@playwright/test` in the lockfile differs from the image tag, because
  the bundled browsers only work with the matching Playwright version.
- Step timeouts (`npm ci` 5 min, e2e 10 min) make any remaining network outage fail in minutes.

## Consequences
- Upgrading Playwright means bumping `@playwright/test`, the image tag, its digest and the guard's version
  together, in one PR. Same age rule as actions: a release at least two weeks old. Accepted exception at
  adoption: the 1.64.1 image (built 2026-11-01, 10 days old) is a base-image rebuild of a release we
  already ran for four weeks.
- The job now depends on the Microsoft Container Registry instead of the Ubuntu archive and Playwright's
  CDN; the image pull is the new single network step.
- Steps run as root inside the container; Playwright launches Chromium without its sandbox there, which
  is fine for tests against our own localhost server.
