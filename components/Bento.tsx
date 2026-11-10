import type { CSSProperties, ReactNode } from "react";
import { slug } from "@/lib/slug";

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
  /** Heading level for the title. Only the hero uses 1 (the page's single h1). */
  headingLevel?: 1 | 2;
  /** Extra class on the heading, e.g. to restyle the hero name. */
  titleClassName?: string;
  id?: string;
  /** Programmatic focus target (tabIndex -1), e.g. for a skip link. */
  focusTarget?: boolean;
  className?: string;
  children: ReactNode;
};

/** Every tile is a labelled <section>. */
export function Tile({
  span,
  tabletSpan = 6,
  size = "md",
  title,
  headingLevel = 2,
  titleClassName,
  id,
  focusTarget,
  className,
  children,
}: TileProps) {
  const headingId = `${id ?? slug(title)}-title`;
  const style = { "--span": span, "--span-md": tabletSpan } as CSSProperties;
  const classes = ["tile", size === "lg" ? "tile--lg" : "", className ?? ""].filter(Boolean).join(" ");
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const headingClasses = ["tile__title", titleClassName ?? ""].filter(Boolean).join(" ");

  return (
    <section id={id} tabIndex={focusTarget ? -1 : undefined} className={classes} style={style} aria-labelledby={headingId}>
      <Heading id={headingId} className={headingClasses}>
        {title}
      </Heading>
      {children}
    </section>
  );
}
