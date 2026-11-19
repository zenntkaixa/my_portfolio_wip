import { Tile } from "@/components/Bento";
import { Estimator } from "@/components/estimator/Estimator";
import { ExternalLink } from "@/components/ExternalLink";
import { countPlans } from "@/lib/estimator/events";
import { estimatorBuiltBy, estimatorCopy, estimatorIntro } from "@/lib/content";

// The signature tile. Server wrapper around the client Estimator.
// Bento span 12, size lg; the blueprint grid background is on .tile--estimator in globals.css.
export async function EstimatorTile() {
  const plans = await countPlans();
  return (
    <Tile span={12} size="lg" title="Try it: feature to delivery plan" id="estimator" focusTarget className="tile--estimator">
      <p>{estimatorIntro}</p>
      <p className="estimator__built">
        {estimatorBuiltBy.text}
        <ExternalLink href={estimatorBuiltBy.url}>{estimatorBuiltBy.link}</ExternalLink>
      </p>
      {plans !== null && plans >= 25 && (
        <p className="estimator__built">{estimatorCopy.plansGenerated(plans.toLocaleString("en-MY"))}</p>
      )}
      <Estimator />
    </Tile>
  );
}
