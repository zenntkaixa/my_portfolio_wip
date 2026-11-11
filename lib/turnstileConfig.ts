// Cloudflare's documented dummy keys: secrets look like 1x0000000000000000000000000000000AA, site keys like
// 1x00000000000000000000AA (1x/2x/3x plus at least 20 zeros). Real keys start with 0x.
const DUMMY_KEY = /^[123]x0{20,}/;

export function isDummyTurnstileKey(key: string): boolean {
  return DUMMY_KEY.test(key);
}

/**
 * Returns a short reason (never a value) for the first Turnstile config problem, or null when it is fine.
 * Fails closed: counts as production when VERCEL_ENV is "production", or on Vercel (VERCEL === "1") unless
 * VERCEL_ENV is explicitly "preview" or "development". Production needs a real secret, a real site key and a
 * hostname. In any environment, a real (non-test) secret also needs TURNSTILE_HOSTNAME.
 */
export function turnstileConfigProblem(env: Record<string, string | undefined>): string | null {
  const onVercel = env.VERCEL === "1" && env.VERCEL_ENV !== "preview" && env.VERCEL_ENV !== "development";
  const production = env.VERCEL_ENV === "production" || onVercel;
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  const hostname = env.TURNSTILE_HOSTNAME?.trim();
  if (production) {
    if (!secret) return "TURNSTILE_SECRET_KEY is missing";
    if (isDummyTurnstileKey(secret)) return "TURNSTILE_SECRET_KEY is a Cloudflare test key";
    const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (!siteKey) return "NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing";
    if (isDummyTurnstileKey(siteKey)) return "NEXT_PUBLIC_TURNSTILE_SITE_KEY is a Cloudflare test key";
  }
  if (secret && !isDummyTurnstileKey(secret) && !hostname) return "TURNSTILE_HOSTNAME is missing";
  return null;
}
