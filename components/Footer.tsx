import { footer } from "@/lib/content";

/** One-line page footer (contentinfo landmark). The year is taken at build time. */
export function Footer() {
  return (
    <footer className="footer">
      <p>{footer.text(new Date().getFullYear())}</p>
    </footer>
  );
}
