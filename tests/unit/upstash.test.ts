import { afterEach, describe, expect, it, vi } from "vitest";
import { upstashCommand, upstashConfig, UpstashError } from "@/lib/upstash";

describe("upstashConfig", () => {
  it("returns trimmed values for an https URL and a token", () => {
    expect(upstashConfig({ UPSTASH_REDIS_REST_URL: " https://db.upstash.io/ ", UPSTASH_REDIS_REST_TOKEN: " tok " })).toEqual({
      url: "https://db.upstash.io",
      token: "tok",
    });
  });

  it.each([
    ["no vars", {}],
    ["no token", { UPSTASH_REDIS_REST_URL: "https://db.upstash.io" }],
    ["blank token", { UPSTASH_REDIS_REST_URL: "https://db.upstash.io", UPSTASH_REDIS_REST_TOKEN: "  " }],
    ["no URL", { UPSTASH_REDIS_REST_TOKEN: "tok" }],
    ["an http URL", { UPSTASH_REDIS_REST_URL: "http://db.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" }],
    ["a non-URL", { UPSTASH_REDIS_REST_URL: "db.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" }],
    ["URL credentials", { UPSTASH_REDIS_REST_URL: "https://u:p@db.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" }],
  ])("returns null with %s", (_label, env) => {
    expect(upstashConfig(env)).toBeNull();
  });
});

describe("upstashCommand", () => {
  const config = { url: "https://db.upstash.io", token: "tok" };
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs the command as a JSON array of strings with a bearer token and a timeout", async () => {
    const fn = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) => Response.json({ result: "PONG" }));
    vi.stubGlobal("fetch", fn);
    expect(await upstashCommand(config, ["PING", 1])).toBe("PONG");
    const [url, init] = fn.mock.calls[0];
    expect(url).toBe("https://db.upstash.io");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe('["PING","1"]');
    expect((init?.headers as Record<string, string>).authorization).toBe("Bearer tok");
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    ["a non-2xx", () => new Response("x", { status: 401 }), "HTTP 401"],
    ["an error reply", () => Response.json({ error: "ERR secret detail" }), "error reply"],
    ["no result", () => Response.json({}), "unexpected reply"],
    ["a non-object", () => Response.json(42), "unexpected reply"],
    ["invalid JSON", () => new Response("{", { status: 200 }), "unparseable reply"],
  ])("throws a short UpstashError on %s", async (_label, reply, reason) => {
    vi.stubGlobal("fetch", vi.fn(async () => reply()));
    const err = await upstashCommand(config, ["PING"]).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(UpstashError);
    expect((err as Error).message).toBe(reason);
  });

  it("throws with the error name only when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("connect ECONNREFUSED 10.1.2.3"))));
    const err = await upstashCommand(config, ["PING"]).catch((e: unknown) => e);
    expect((err as Error).message).toBe("TypeError");
  });
});
