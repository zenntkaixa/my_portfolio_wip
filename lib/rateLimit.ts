// Per-visitor limit (rolling 60 minutes, exact sliding log) and a global daily cap (UTC day).
// When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, the limits are shared across serverless
// instances in Upstash Redis (ADR-009). Without them, or whenever Upstash fails or is slow, the in-memory
// limiter below handles that request (per instance, best effort). It never fails open, and a request
// that Upstash allows must also pass the in-memory limiter, so no instance is looser than it was alone.
// Turnstile is the main gate, and the monthly spend limit in the Anthropic Console is the real backstop.

import { createHash, randomBytes } from "node:crypto";
import { upstashCommand, upstashConfig, UpstashError, type UpstashConfig } from "@/lib/upstash";

function envLimit(raw: string | undefined, fallback: number) {
  const n = Number(raw);
  return raw !== undefined && Number.isFinite(n) && n > 0 ? n : fallback;
}

const PER_HOUR = envLimit(process.env.RATE_LIMIT_PER_HOUR, 5);
const PER_DAY = envLimit(process.env.DAILY_LIMIT, 150);
const WINDOW_MS = 3_600_000;
const DAILY_RETRY_AFTER = 3600;

// `refund` gives back the slot and the daily count this request took. It never throws, and calling it
// twice does nothing more. The route calls it only when the model call failed without being charged.
export type LimitResult = { ok: true; refund: () => Promise<void> } | { ok: false; reason: string; retryAfter: number };

function dailyBlocked(): LimitResult {
  return { ok: false, reason: "The demo has reached today's limit. Try again tomorrow.", retryAfter: DAILY_RETRY_AFTER };
}

function visitorBlocked(oldestHit: number, now: number): LimitResult {
  const retryAfter = Math.ceil((oldestHit + WINDOW_MS - now) / 1000);
  return { ok: false, reason: `You've used ${PER_HOUR} estimates this hour. Try again in ${Math.ceil(retryAfter / 60)} minutes.`, retryAfter };
}

function utcDay(now: number) {
  return new Date(now).toISOString().slice(0, 10);
}

// ---- In-memory limiter (fallback, and the only limiter without Upstash env vars) ----

const visitors = new Map<string, number[]>();
let day = utcDay(Date.now());
let dayCount = 0;
let lastSweep = 0;

/** Test helper: number of IPs currently tracked. */
export function visitorCountForTests() {
  return visitors.size;
}

function memoryRollDay(now: number) {
  const today = utcDay(now);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
}

function memoryRecord(ip: string, now: number) {
  memoryRollDay(now);
  const hourAgo = now - WINDOW_MS;
  const hits = (visitors.get(ip) ?? []).filter((t) => t > hourAgo);
  hits.push(now);
  visitors.set(ip, hits);
  dayCount += 1;

  // Drop IPs whose hits are all outside the window, at most once per window.
  if (now - lastSweep >= WINDOW_MS) {
    lastSweep = now;
    for (const [key, times] of visitors) if (!times.some((t) => t > hourAgo)) visitors.delete(key);
  }
}

function memoryRefund(ip: string, at: number) {
  const hits = visitors.get(ip);
  const i = hits?.indexOf(at) ?? -1;
  if (!hits || i < 0) return; // already outside the window and swept
  hits.splice(i, 1);
  if (utcDay(at) === day && dayCount > 0) dayCount -= 1;
}

/** The per-instance limiter: daily cap first, then the visitor's rolling hour. Blocked requests use no slot. */
export function checkLimitsInMemory(ip: string): LimitResult {
  const now = Date.now();
  memoryRollDay(now);
  if (dayCount >= PER_DAY) return dailyBlocked();

  const hourAgo = now - WINDOW_MS;
  const hits = (visitors.get(ip) ?? []).filter((t) => t > hourAgo);
  if (hits.length >= PER_HOUR) return visitorBlocked(hits[0], now);

  memoryRecord(ip, now);
  let refunded = false;
  return {
    ok: true,
    refund: async () => {
      if (refunded) return;
      refunded = true;
      memoryRefund(ip, now);
    },
  };
}

// ---- Shared limiter in Upstash Redis (ADR-009) ----

// KEYS[1] visitor sorted set, KEYS[2] day counter. Both carry the {rl} hash tag so they share a cluster slot.
// Expiries: visitor key one hour plus a minute (3660000 ms), day key two days (172800 s).
// ARGV[1] now (ms), ARGV[2] window start (ms, hits at or before it have expired), ARGV[3] per-hour limit,
// ARGV[4] daily limit, ARGV[5] unique member for this hit.
// Returns {0, 0} allowed, {1, 0} daily cap reached, {2, oldest score} visitor limit reached.
export const LIMIT_SCRIPT = `local count = tonumber(redis.call('GET', KEYS[2]) or '0')
if count >= tonumber(ARGV[4]) then return {1, 0} end
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[2])
if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[3]) then
  local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
  return {2, oldest[2]}
end
redis.call('ZADD', KEYS[1], ARGV[1], ARGV[5])
redis.call('PEXPIRE', KEYS[1], 3660000)
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 172800)
return {0, 0}`;

// KEYS as above, ARGV[1] the hit's member. Only a hit that is still there gives its daily count back.
export const REFUND_SCRIPT = `if redis.call('ZREM', KEYS[1], ARGV[1]) == 1 then
  if tonumber(redis.call('GET', KEYS[2]) or '0') > 0 then redis.call('DECR', KEYS[2]) end
end
return 1`;

/** Pseudonymous visitor key: a truncated SHA-256 of the IP, so raw IPs never leave the server. */
export function visitorKey(ip: string) {
  return `est:{rl}:v:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
}

async function checkLimitsUpstash(config: UpstashConfig, ip: string, now: number): Promise<LimitResult> {
  const member = `${now}-${randomBytes(6).toString("hex")}`;
  const keys = [visitorKey(ip), `est:{rl}:d:${utcDay(now)}`];
  const result = await upstashCommand(config, [
    "EVAL",
    LIMIT_SCRIPT,
    2,
    ...keys,
    now,
    now - WINDOW_MS,
    PER_HOUR,
    PER_DAY,
    member,
  ]);
  if (!Array.isArray(result) || result.length !== 2) throw new UpstashError("unexpected result");
  const [code, value] = result as unknown[];
  if (code === 0) {
    return {
      ok: true,
      refund: async () => {
        try {
          await upstashCommand(config, ["EVAL", REFUND_SCRIPT, 2, ...keys, member]);
        } catch (err) {
          console.error("Shared rate limit refund failed:", err instanceof UpstashError ? err.message : "unknown");
        }
      },
    };
  }
  if (code === 1) return dailyBlocked();
  if (code === 2) {
    // A block is always honoured. Another instance's clock may differ from ours, so clamp the oldest hit
    // into our window (Retry-After 1..3600 s); an unreadable score means the full hour.
    const oldest = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
    const clamped = Number.isFinite(oldest) ? Math.min(now, Math.max(now - WINDOW_MS + 1000, oldest)) : now;
    return visitorBlocked(clamped, now);
  }
  throw new UpstashError("unexpected result");
}

/** Shared limits when Upstash is configured and healthy; otherwise the in-memory limiter for this request. */
export async function checkLimits(ip: string): Promise<LimitResult> {
  const config = upstashConfig(process.env);
  if (!config) return checkLimitsInMemory(ip);
  const now = Date.now();
  try {
    const shared = await checkLimitsUpstash(config, ip, now);
    if (!shared.ok) return shared;
    // Both limiters must allow. Memory also holds hits taken while Upstash was down, and recording every
    // allowed hit there keeps a later fallback as strict as the per-instance limiter always was.
    const local = checkLimitsInMemory(ip);
    if (!local.ok) return local;
    return { ok: true, refund: () => Promise.all([local.refund(), shared.refund()]).then(() => undefined) };
  } catch (err) {
    console.error("Shared rate limit unavailable, using in-memory limits:", err instanceof UpstashError ? err.message : "unknown");
    return checkLimitsInMemory(ip);
  }
}
