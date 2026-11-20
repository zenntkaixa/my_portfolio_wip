import { Tile } from "@/components/Bento";
import { Estimator } from "@/components/estimator/Estimator";
import { ExternalLink } from "@/components/ExternalLink";
import { countPlans, usageStats } from "@/lib/estimator/events";
import { estimatorBuiltBy, estimatorCopy, estimatorIntro, howItsBuilt as h } from "@/lib/content";

// The signature tile. Server wrapper around the client Estimator.
// Bento span 12, size lg; the blueprint grid background is on .tile--estimator in globals.css.
export async function EstimatorTile() {
  const [plans, stats] = await Promise.all([countPlans(), usageStats()]);
  const live = stats && stats.plans >= h.statsMin ? h.stats(stats) : null;
  return (
    <Tile span={12} size="lg" title="Try it: feature to delivery plan" id="estimator" focusTarget className="tile--estimator">
      <p>{estimatorIntro}</p>
      <p className="estimator__built">
        {estimatorBuiltBy.text}
        <ExternalLink href={estimatorBuiltBy.url}>{estimatorBuiltBy.link}</ExternalLink>
      </p>
      <details className="built">
        <summary>{h.summary}</summary>
        <div className="built__body">
          <section aria-labelledby="built-path">
            <h3 id="built-path">{h.pathTitle}</h3>
            <ol className="built__path" role="list">
              {h.path.map((p) => (
                <li key={p.step}>
                  <strong>{p.step}</strong>
                  <span>{p.note}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="built-split">
            <h3 id="built-split">{h.splitTitle}</h3>
            <div className="built__split">
              <div>
                <h4>{h.modelTitle}</h4>
                <ul role="list">{h.model.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div>
                <h4>{h.codeTitle}</h4>
                <ul role="list">{h.code.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
            <p>{h.splitWhy}</p>
          </section>
          {live && (
            <section aria-labelledby="built-stats">
              <h3 id="built-stats">{h.statsTitle}</h3>
              <p>{live.caption}</p>
              <dl className="built__stats">
                {live.items.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <section aria-labelledby="built-eval">
            <h3 id="built-eval">{h.evalTitle}</h3>
            <table className="cmp-table">
              <caption>{h.evalCaption}</caption>
              <thead>
                <tr>
                  {h.evalHead.map((c) => (
                    <th key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {h.evalRows.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section aria-labelledby="built-links">
            <h3 id="built-links">{h.linksTitle}</h3>
            <ul role="list">
              {h.links.map((l) => (
                <li key={l.url}>
                  <ExternalLink href={l.url}>{l.label}</ExternalLink>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </details>
      {plans !== null && plans >= 25 && (
        <p className="estimator__built">{estimatorCopy.plansGenerated(plans.toLocaleString("en-MY"))}</p>
      )}
      <Estimator />
    </Tile>
  );
}
