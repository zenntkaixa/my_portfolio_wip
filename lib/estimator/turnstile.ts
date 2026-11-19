import { isDummyTurnstileKey } from "@/lib/turnstileConfig";

const TURNSTILE_ACTION = "estimate";

/** Cloudflare siteverify. False on any failure, so a broken check never lets a request through. */
export async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(4000),
    });
    const data = (await res.json()) as { success?: boolean; action?: string; hostname?: string };
    if (data.success !== true) return false;
    // Cloudflare's documented test secrets (1x/2x/3x + zeros) return dummy action/hostname values, so the
    // binding checks apply to real secrets only.
    if (isDummyTurnstileKey(secret)) return true;
    if (data.action !== TURNSTILE_ACTION) return false;
    const host = process.env.TURNSTILE_HOSTNAME?.trim();
    if (host && data.hostname !== host) return false;
    return true;
  } catch {
    return false;
  }
}
