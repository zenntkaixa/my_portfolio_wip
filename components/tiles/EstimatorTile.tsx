import { Tile } from "@/components/Bento";
import { Estimator } from "@/components/estimator/Estimator";
import { ExternalLink } from "@/components/ExternalLink";
import { estimatorBuiltBy, estimatorIntro } from "@/lib/content";

// The signature tile. Server wrapper around the client Estimator.
// Bento span 12, size lg; the blueprint grid background is on .tile--estimator in globals.css.
export function EstimatorTile() {
  return (
    <Tile span={12} size="lg" title="Try it: feature to delivery plan" id="estimator" focusTarget className="tile--estimator">
      <p>{estimatorIntro}</p>
      <p className="estimator__built">
        {estimatorBuiltBy.text}
        <ExternalLink href={estimatorBuiltBy.url}>{estimatorBuiltBy.link}</ExternalLink>
      </p>
      <Estimator />
    </Tile>
  );
}
