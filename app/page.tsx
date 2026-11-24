import { Bento } from "@/components/Bento";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { HeroTile } from "@/components/tiles/HeroTile";
import { NowTile } from "@/components/tiles/NowTile";
import { EstimatorTile } from "@/components/tiles/EstimatorTile";
import { ProjectTile } from "@/components/tiles/ProjectTile";
import { AiWorkflowTile } from "@/components/tiles/AiWorkflowTile";
import { CaseStudyTile } from "@/components/tiles/CaseStudyTile";
import { ExperienceTile } from "@/components/tiles/ExperienceTile";
import { StackTile } from "@/components/tiles/StackTile";
import { CertificationsTile } from "@/components/tiles/CertificationsTile";
import { ContactTile } from "@/components/tiles/ContactTile";
import { backToTop, caseStudies, skipLink } from "@/lib/content";

// Hourly refresh keeps the plans-generated count current without a request-time query.
export const revalidate = 3600;

// Tile order and desktop spans follow the bento table in docs/01-design-system.md.
export default function Home() {
  return (
    <>
      <main className="page" id="top">
        <a className="skip-link" href="#estimator">
          {skipLink}
        </a>
        <div className="topbar">
          <ThemeToggle />
        </div>
        <Bento>
          <HeroTile />
          <NowTile />
          <EstimatorTile />
          <ProjectTile />
          <AiWorkflowTile />
          {caseStudies.map((study, i) => (
            <CaseStudyTile
              key={study.title}
              study={study}
              tabletSpan={i === 2 ? 6 : 3}
            />
          ))}
          <ExperienceTile />
          <StackTile />
          <CertificationsTile />
          <ContactTile />
        </Bento>
      </main>
      <Footer />
      {/* Last in the DOM, so keyboard users reach it after the footer; CSS pins it to the corner. */}
      <a className="to-top" href="#top" aria-label={backToTop}>
        <span aria-hidden="true">↑</span>
      </a>
    </>
  );
}
