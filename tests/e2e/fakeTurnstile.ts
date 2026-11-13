import { test as base } from "@playwright/test";

export { expect, type Page } from "@playwright/test";

// Stands in for Cloudflare's api.js: issues a token straight away on render and on reset.
// Matches the calls components/estimator/Turnstile.tsx makes (render, reset, remove).
const STUB = `(() => {
  const widgets = new Map();
  let n = 0;
  const issue = (id) => setTimeout(() => widgets.get(id)?.callback?.("e2e-token"), 0);
  window.turnstile = {
    render(_el, opts) { const id = "w" + ++n; widgets.set(id, opts); issue(id); return id; },
    reset(id) { issue(id); },
    remove(id) { widgets.delete(id); },
  };
})();`;

/**
 * `test` with the Turnstile script faked, for specs that are not about Turnstile. Waiting for the real
 * widget's token costs about 3 s per test and depends on Cloudflare answering. The real widget stays
 * covered by turnstile.spec.ts, csp.spec.ts, keyboard.spec.ts and visual.spec.ts.
 */
export const test = base.extend<{ fakeTurnstile: void }>({
  fakeTurnstile: [
    async ({ page }, use) => {
      await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js*", (route) =>
        route.fulfill({ contentType: "text/javascript", body: STUB }),
      );
      await use();
    },
    { auto: true },
  ],
});
