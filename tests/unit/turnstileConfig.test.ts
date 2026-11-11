import { describe, expect, it } from "vitest";
import { isDummyTurnstileKey, turnstileConfigProblem } from "@/lib/turnstileConfig";

const good = {
  VERCEL_ENV: "production",
  TURNSTILE_SECRET_KEY: "0x4AAAAAAArealsecret",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAArealsite",
  TURNSTILE_HOSTNAME: "example.com",
};
const dummySecret = "1x0000000000000000000000000000000AA";

describe("isDummyTurnstileKey", () => {
  it("recognises Cloudflare secret and site test keys", () => {
    for (const k of [dummySecret, "2x0000000000000000000000000000000AA", "3x0000000000000000000000000000000AA",
      "1x00000000000000000000AA", "2x00000000000000000000AB", "3x00000000000000000000FF"]) {
      expect(isDummyTurnstileKey(k)).toBe(true);
    }
  });
  it("does not flag real-looking keys", () => {
    expect(isDummyTurnstileKey("0x4AAAAAAArealsecret")).toBe(false);
    expect(isDummyTurnstileKey("test-secret")).toBe(false);
  });
});

describe("turnstileConfigProblem", () => {
  it("returns null outside production", () => {
    expect(turnstileConfigProblem({})).toBeNull();
    expect(turnstileConfigProblem({ VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: dummySecret })).toBeNull();
    expect(turnstileConfigProblem({ VERCEL_ENV: "development" })).toBeNull();
    expect(turnstileConfigProblem({ VERCEL_ENV: undefined })).toBeNull();
  });
  it("treats VERCEL=1 with a missing VERCEL_ENV as production", () => {
    expect(turnstileConfigProblem({ VERCEL: "1", TURNSTILE_SECRET_KEY: dummySecret })).toMatch(/test key/);
    expect(turnstileConfigProblem({ VERCEL: "1" })).toMatch(/SECRET_KEY is missing/);
  });
  it("skips the production checks on VERCEL=1 preview or development", () => {
    expect(turnstileConfigProblem({ VERCEL: "1", VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: dummySecret })).toBeNull();
    expect(turnstileConfigProblem({ VERCEL: "1", VERCEL_ENV: "development" })).toBeNull();
  });
  it("requires a hostname for a real secret in any environment", () => {
    expect(turnstileConfigProblem({ TURNSTILE_SECRET_KEY: "0xrealsecret" })).toMatch(/HOSTNAME/);
    expect(turnstileConfigProblem({ VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: "0xrealsecret", TURNSTILE_HOSTNAME: " " })).toMatch(/HOSTNAME/);
    expect(turnstileConfigProblem({ TURNSTILE_SECRET_KEY: "0xrealsecret", TURNSTILE_HOSTNAME: "a.dev" })).toBeNull();
  });
  it("does not require a hostname for a dummy secret outside production", () => {
    expect(turnstileConfigProblem({ TURNSTILE_SECRET_KEY: dummySecret })).toBeNull();
  });
  it("returns null for a good production config", () => {
    expect(turnstileConfigProblem(good)).toBeNull();
  });
  it("flags a missing or blank secret", () => {
    expect(turnstileConfigProblem({ ...good, TURNSTILE_SECRET_KEY: undefined })).toMatch(/SECRET_KEY is missing/);
    expect(turnstileConfigProblem({ ...good, TURNSTILE_SECRET_KEY: "  " })).toMatch(/SECRET_KEY is missing/);
  });
  it("flags a dummy secret without echoing it", () => {
    const p = turnstileConfigProblem({ ...good, TURNSTILE_SECRET_KEY: dummySecret });
    expect(p).toMatch(/SECRET_KEY/);
    expect(p).not.toContain(dummySecret);
  });
  it("flags a missing, blank or dummy site key", () => {
    expect(turnstileConfigProblem({ ...good, NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined })).toMatch(/SITE_KEY is missing/);
    expect(turnstileConfigProblem({ ...good, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "" })).toMatch(/SITE_KEY is missing/);
    expect(turnstileConfigProblem({ ...good, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" })).toMatch(/SITE_KEY is a/);
  });
  it("flags a missing or blank hostname", () => {
    expect(turnstileConfigProblem({ ...good, TURNSTILE_HOSTNAME: undefined })).toMatch(/HOSTNAME/);
    expect(turnstileConfigProblem({ ...good, TURNSTILE_HOSTNAME: "   " })).toMatch(/HOSTNAME/);
  });
  it("reports the first problem in order", () => {
    expect(turnstileConfigProblem({ VERCEL_ENV: "production" })).toMatch(/SECRET_KEY is missing/);
  });
});
