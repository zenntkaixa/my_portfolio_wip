"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

type Props = { onToken: (token: string | null) => void };

/**
 * Cloudflare Turnstile, explicit render. Tokens are single-use, so the parent calls reset()
 * after every request. Site key comes from NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 */
export const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile({ onToken }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset() {
      onToken(null);
      if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!siteKey) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (window.turnstile && container.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: siteKey,
          theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
          size: "flexible",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      }
      if (widgetId.current || tries > 50) window.clearInterval(timer);
    }, 200);
    return () => {
      window.clearInterval(timer);
      if (window.turnstile && widgetId.current) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return <p role="note">Human check not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (see .env.example).</p>;
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />
      <div ref={container} className="turnstile" />
    </>
  );
});
