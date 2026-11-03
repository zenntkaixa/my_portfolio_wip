// Best-effort limits kept in memory. On Vercel each serverless instance has its own memory,
// so these slow down casual abuse but are not a hard guarantee. Turnstile is the main gate,
// and a monthly spend limit in the Anthropic Console is the real backstop.
// For strict limits across instances, swap this for Upstash Redis (see README).

const PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR ?? 5);
const PER_DAY = Number(process.env.DAILY_LIMIT ?? 150);

const visitors = new Map<string, number[]>();
let day = new Date().toISOString().slice(0, 10);
let dayCount = 0;

export type LimitResult = { ok: true } | { ok: false; reason: string; retryAfter: number };

export function checkLimits(ip: string): LimitResult {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  if (dayCount >= PER_DAY) {
    return { ok: false, reason: "The demo has reached today's limit. Try again tomorrow.", retryAfter: 3600 };
  }

  const now = Date.now();
  const hourAgo = now - 3_600_000;
  const hits = (visitors.get(ip) ?? []).filter((t) => t > hourAgo);
  if (hits.length >= PER_HOUR) {
    const retryAfter = Math.ceil((hits[0] + 3_600_000 - now) / 1000);
    return { ok: false, reason: `You've used ${PER_HOUR} estimates this hour. Try again in ${Math.ceil(retryAfter / 60)} minutes.`, retryAfter };
  }

  hits.push(now);
  visitors.set(ip, hits);
  dayCount += 1;

  // Keep the map from growing without bound.
  if (visitors.size > 5000) {
    for (const [key, times] of visitors) if (!times.some((t) => t > hourAgo)) visitors.delete(key);
  }
  return { ok: true };
}
