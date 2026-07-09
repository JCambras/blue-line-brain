import type { SaveState, Scenario } from '@/types';

/**
 * Spaced-repetition ordering with a strong per-(category, difficulty) shuffle.
 *
 * Every scenario gets `score = bias + random`:
 *  - `bias` (see {@link spacedRepetitionBias}) is the deterministic spaced-
 *    repetition signal - unseen and weak/stale scenarios sit higher so they
 *    surface sooner. It is deliberately **bounded**: confidence contributes at
 *    most `5 * CONFIDENCE_WEIGHT`, staleness saturates at `AGE_WEIGHT`, and an
 *    unseen scenario gets a fixed `UNSEEN_BIAS`. Bounding it means no single
 *    category or difficulty bucket can run away and dominate the top of every
 *    run just because its numbers happen to be large.
 *  - `random` is `rand() * RANDOM_WEIGHT`, and `RANDOM_WEIGHT` is large relative
 *    to the confidence step. That is what makes the shuffle a first-class factor
 *    *within* each (category, difficulty) bucket: two scenarios of similar
 *    mastery/recency have near-identical bias, so their order is decided almost
 *    entirely by chance and flips freely from run to run. A genuinely large
 *    mastery gap (e.g. unseen vs. mastered) still survives the noise, so the
 *    spaced-repetition bias is preserved rather than dropped.
 *
 * Because the bias is on one bounded scale shared by every bucket, sorting the
 * whole pool by `score` reproduces this shuffle inside each (category,
 * difficulty) grouping while still favoring due/unseen scenarios globally.
 */

/** Tunable weights for the ordering score. Exported for unit testing. */
export const ORDERING = {
  /** Weight of one confidence level (0..5). Range of the term: 0..500. */
  CONFIDENCE_WEIGHT: 100,
  /** Max staleness contribution, reached once a scenario is `AGE_FULL_HOURS` old. */
  AGE_WEIGHT: 100,
  /** Hours of no-show at which the staleness term saturates (one week). */
  AGE_FULL_HOURS: 24 * 7,
  /**
   * Scale of the random term. Much larger than `CONFIDENCE_WEIGHT` so that
   * similar-mastery peers within a bucket reorder freely between runs, while a
   * multi-level mastery gap still biases the ordering.
   */
  RANDOM_WEIGHT: 600,
  /**
   * Fixed bias for a never-seen scenario. Sits just above the maximum seen bias
   * (`5 * CONFIDENCE_WEIGHT + AGE_WEIGHT` = 600) so unseen scenarios strongly
   * tend to lead, without being so far ahead that the shuffle can never touch
   * them.
   */
  UNSEEN_BIAS: 700,
} as const;

/**
 * Deterministic spaced-repetition bias for one scenario (no randomness).
 * Higher = surface sooner. Bounded on a single scale across every scenario so
 * no category/difficulty bucket can dominate purely on magnitude.
 */
export function spacedRepetitionBias(
  state: SaveState,
  s: Scenario,
  now: number
): number {
  const stat = state.scenarioStats[s.id];
  if (!stat) return ORDERING.UNSEEN_BIAS;
  const ageHours = (now - stat.lastSeen) / (1000 * 60 * 60);
  const staleness =
    Math.min(ageHours / ORDERING.AGE_FULL_HOURS, 1) * ORDERING.AGE_WEIGHT;
  return (5 - stat.confidence) * ORDERING.CONFIDENCE_WEIGHT + staleness;
}

/**
 * Order a pool by `bias + strong random` (see the module doc). `now` and `rand`
 * are injectable so the ordering is deterministic under test; production callers
 * take the `Date.now()` / `Math.random()` defaults.
 */
export function orderPool(
  pool: Scenario[],
  state: SaveState,
  now: number = Date.now(),
  rand: () => number = Math.random
): Scenario[] {
  return pool
    .map((s) => ({
      s,
      score: spacedRepetitionBias(state, s, now) + rand() * ORDERING.RANDOM_WEIGHT,
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
