-- Neon project "portfolio", database `portfolio` (ADR-012). Kept for reproducibility; applied by hand.
CREATE TABLE estimate_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  outcome text NOT NULL,
  status smallint NOT NULL,
  duration_ms integer NOT NULL CHECK (duration_ms >= 0),
  model text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(10,6),
  mode text CHECK (mode IN ('traditional', 'ai-assisted')),
  seniority text CHECK (seniority IN ('junior', 'mid', 'senior', 'mixed')),
  team_size smallint CHECK (team_size BETWEEN 1 AND 50),
  total_hours numeric(9,1),
  phase_count smallint,
  confidence text CHECK (confidence IN ('low', 'medium', 'high')),
  calendar_adjusted boolean,
  cache_hit boolean NOT NULL DEFAULT false
);

CREATE INDEX estimate_events_created_at ON estimate_events (created_at);

-- Least privilege: the app's role may only add and read rows.
-- GRANT INSERT, SELECT ON estimate_events TO portfolio_app;
