import { Bento } from "@/components/Bento";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { caseStudies, skipLink } from "@/lib/content";

// Tile order and desktop spans follow the bento table in docs/01-design-system.md.
export default function Home() {
  return (
    <main className="page">
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
          <CaseStudyTile key={study.title} study={study} tabletSpan={i === 2 ? 6 : 3} />
        ))}
        <ExperienceTile />
        <StackTile />
        <CertificationsTile />
        <ContactTile />
      </Bento>
    </main>
  );
}
