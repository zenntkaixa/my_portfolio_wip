"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

/**
 * Injects api.js once per page (guards StrictMode and multiple instances). Rejects if the script
 * fails to load or loads without defining `window.turnstile`. A failure clears the cached promise,
 * so a later mount (not the same one) can try again.
 */
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const el = document.createElement("script");
      el.src = SCRIPT_SRC;
      el.async = true;
      const fail = () => {
        scriptPromise = null;
        el.remove();
        reject(new Error("turnstile load failed"));
      };
      el.onload = () => (window.turnstile ? resolve() : fail());
      el.onerror = fail;
      document.head.appendChild(el);
    });
  }
  return scriptPromise;
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
  // The script is only loaded once the estimator is near the viewport or the form is used.
  const [wanted, setWanted] = useState(false);
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
        action: "estimate",
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
      // Nothing rendered yet (script not loaded): the load effect renders with the current theme.
      if (!widgetId.current) return;
      removeWidget();
      onTokenRef.current(null);
      renderWidget();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // StrictMode re-runs this effect after cleanup removed the widget; the load effect won't re-run.
    if (window.turnstile) renderWidget();
    return () => {
      observer.disconnect();
      removeWidget();
    };
  }, [siteKey, renderWidget, removeWidget]);

  // Trigger: estimator within 200px of the viewport, or focus inside the form, whichever is first.
  useEffect(() => {
    if (!siteKey || wanted) return;
    const el = container.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setWanted(true);
      return;
    }
    const section = el.closest("#estimator") ?? el;
    const form = el.closest("form");
    const trigger = () => setWanted(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) trigger();
      },
      { rootMargin: "200px" },
    );
    io.observe(section);
    form?.addEventListener("focusin", trigger);
    form?.addEventListener("pointerdown", trigger);
    return () => {
      io.disconnect();
      form?.removeEventListener("focusin", trigger);
      form?.removeEventListener("pointerdown", trigger);
    };
  }, [siteKey, wanted]);

  useEffect(() => {
    if (!siteKey || !wanted) return;
    let cancelled = false;
    loadScript().then(
      () => {
        if (!cancelled) renderWidget();
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [siteKey, wanted, renderWidget]);

  if (!siteKey) {
    return <p role="note">{turnstileNotConfiguredNote}</p>;
  }

  return (
    <>
      <div ref={container} className="turnstile" />
      <p role="status" aria-live="polite" className="turnstile__error">
        {failed ? turnstileFailedMessage : ""}
      </p>
    </>
  );
});
