"use client";

import { Component, type ReactNode } from "react";
import { estimatorCopy } from "@/lib/content";

type Props = { children: ReactNode; resetKey: unknown };

/** A render error inside the plan shows a short message instead of taking the page down. */
export class ResultsBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Shows in the browser console and Vercel's client error view; the plan text itself is never logged.
    console.error("Estimator results failed to render", error instanceof Error ? error.name : "unknown");
  }

  componentDidUpdate(prev: Props) {
    // A new plan gets a fresh try.
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (this.state.failed)
      return (
        <p role="alert" className="estimator__banner">
          {estimatorCopy.resultsCrashed}
        </p>
      );
    return this.props.children;
  }
}
