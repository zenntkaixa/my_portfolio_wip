import type { Metadata } from "next";
import { Bento, Tile } from "@/components/Bento";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { notFound } from "@/lib/content";

// Overrides the layout's "index, follow", which would otherwise sit beside Next's own noindex.
export const metadata: Metadata = { title: notFound.title, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <main className="page">
        <div className="topbar">
          <ThemeToggle />
        </div>
        <Bento>
          <Tile span={12} tabletSpan={6} size="lg" title={notFound.title} headingLevel={1} id="not-found">
            <p>{notFound.body}</p>
            <p>
              <Link className="button-link" href="/">
                {notFound.homeCta}
              </Link>
            </p>
          </Tile>
        </Bento>
      </main>
      <Footer />
    </>
  );
}
