"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Script from "next/script";
import {
  turnstileFailedMessage,
  turnstileNotConfiguredNote,
} from "@/lib/content";

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
export const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile(
  { onToken },
  ref,
) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Held in a ref so a changing callback never removes and re-renders the widget.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useImperativeHandle(ref, () => ({
    reset() {
      setFailed(false);
      onTokenRef.current(null);
      if (window.turnstile && widgetId.current)
        window.turnstile.reset(widgetId.current);
    },
  }));

  const renderWidget = useCallback(() => {
    if (!siteKey || !window.turnstile || !container.current || widgetId.current)
      return;
    try {
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        theme:
          document.documentElement.dataset.theme === "dark" ? "dark" : "light",
        // "flexible" has a 300px minimum width, which overflows the tile on ~320px phones.
        // Below that, use the 150px "compact" widget. Re-measured on every render, including theme changes.
        size: container.current.clientWidth < 300 ? "compact" : "flexible",
        callback: (token: string) => {
          setFailed(false);
          onTokenRef.current(token);
        },
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => {
          setFailed(true);
          onTokenRef.current(null);
        },
      });
      setFailed(false);
    } catch {
      // Turnstile throws synchronously on a bad site key.
      setFailed(true);
      onTokenRef.current(null);
    }
  }, [siteKey]);

  const removeWidget = useCallback(() => {
    if (window.turnstile && widgetId.current)
      window.turnstile.remove(widgetId.current);
    widgetId.current = null;
  }, []);

  // Follow the site theme toggle: the widget's theme is fixed at render, so re-render it.
  useEffect(() => {
    if (!siteKey) return;
    const observer = new MutationObserver(() => {
      // Nothing rendered yet (script still loading): onReady will render with the current theme.
      if (!widgetId.current) return;
      removeWidget();
      onTokenRef.current(null);
      renderWidget();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // StrictMode re-runs this effect after cleanup removed the widget; onReady won't fire again.
    renderWidget();
    return () => {
      observer.disconnect();
      removeWidget();
    };
  }, [siteKey, renderWidget, removeWidget]);

  if (!siteKey) {
    return <p role="note">{turnstileNotConfiguredNote}</p>;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => setFailed(true)}
      />
      <div ref={container} className="turnstile" />
      <p role="status" aria-live="polite" className="turnstile__error">
        {failed ? turnstileFailedMessage : ""}
      </p>
    </>
  );
});
