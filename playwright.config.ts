import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // A production server: no on-demand compiling (the suite ran 2.6x faster than on `next dev`), and it
  // serves the real CSP and bundles. CI reuses the build from `npm run check`; locally it builds first.
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    // Always-pass Cloudflare test key so e2e never needs real keys.
    env: { NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" },
  },
});
