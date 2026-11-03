import type { CSSProperties, ReactNode } from "react";

/** The 12-column bento grid. Layout rules live in app/globals.css and docs/01-design-system.md. */
export function Bento({ children }: { children: ReactNode }) {
  return <div className="bento">{children}</div>;
}

type TileProps = {
  /** Desktop column span out of 12. */
  span: number;
  /** Tablet column span out of 6 (≤1024px). Defaults to full width. */
  tabletSpan?: 3 | 6;
  /** "lg" = hero and estimator radius. */
  size?: "md" | "lg";
  /** Accessible name for the section, shown as a heading inside the tile. */
  title: string;
  /** Hide the title visually but keep it for screen readers (e.g. the hero). */
  hideTitle?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Every tile is a labelled <section>. */
export function Tile({ span, tabletSpan = 6, size = "md", title, hideTitle, id, className, children }: TileProps) {
  const headingId = `${id ?? slug(title)}-title`;
  const style = { "--span": span, "--span-md": tabletSpan } as CSSProperties;
  const classes = ["tile", size === "lg" ? "tile--lg" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <section id={id} className={classes} style={style} aria-labelledby={headingId}>
      <h2 id={headingId} className={hideTitle ? "sr-only" : "tile__title"}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
