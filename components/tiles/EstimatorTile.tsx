import { Tile } from "@/components/Bento";
import { Estimator } from "@/components/estimator/Estimator";

// The signature tile. Server wrapper around the client Estimator.
// Bento span 12, size lg; the blueprint grid background is on .tile--estimator in globals.css.
export function EstimatorTile() {
  return (
    <Tile span={12} size="lg" title="Try it: feature to delivery plan" id="estimator" focusTarget className="tile--estimator">
      <p>
        Describe a software feature, choose your team, and get the end-to-end technical workflow with a
        time-to-done estimate. This is how I break down requirements at work, powered by Claude.
      </p>
      <Estimator />
    </Tile>
  );
}
