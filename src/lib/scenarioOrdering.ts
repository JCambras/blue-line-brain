import type { Difficulty, SaveState, Scenario } from '@/types';

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
 *
 * Boss battles add a third term - a moderate per-difficulty hardness lean; see
 * {@link BOSS_HARDNESS_BIAS}.
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

/** Difficulty ordering rank (higher = harder), used by the Boss hardness bias. */
export const DIFFICULTY_RANK: Record<Difficulty, number> = {
  rookie: 0,
  varsity: 1,
  elite: 2,
};

/**
 * Hardness bias for Boss battles. Added to the score as `rank * this`, it is a
 * *moderate* lean (not a hard override): one difficulty rank is smaller than the
 * maximum spaced-repetition-plus-random score (`UNSEEN_BIAS + RANDOM_WEIGHT` =
 * 1300), so elite *tends* to lead varsity within the Boss pool, but the random
 * term still routinely floats a varsity scenario up so the draw stays varied
 * run to run. Paired with the picker's rookie exclusion
 * ({@link pickBossScenarios}), this makes a Boss genuinely harder than a
 * mixed-tier Daily 5 - elite-heavy, never a rookie rep - while never collapsing
 * a small module's Boss to a single fixed set (lacrosse has exactly
 * `BOSS_RULES.questions` elite scenarios, so a strict elite-only Boss would be
 * the same 10 every time; the varsity blend keeps it fresh). Daily 5 and zone
 * drills pass `0` (no bias).
 */
export const BOSS_HARDNESS_BIAS = 400;

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
 * Order a pool by `bias + strong random` (see the module doc), plus
 * `DIFFICULTY_RANK * hardnessBias` when a caller passes a nonzero
 * `hardnessBias` (Boss battles pass {@link BOSS_HARDNESS_BIAS}; everything else
 * leaves the default 0). `now` and `rand` are injectable so the ordering is
 * deterministic under test; production callers take the `Date.now()` /
 * `Math.random()` defaults.
 */
export function orderPool(
  pool: Scenario[],
  state: SaveState,
  now: number = Date.now(),
  rand: () => number = Math.random,
  hardnessBias = 0
): Scenario[] {
  return pool
    .map((s) => ({
      s,
      score:
        spacedRepetitionBias(state, s, now) +
        rand() * ORDERING.RANDOM_WEIGHT +
        DIFFICULTY_RANK[s.difficulty] * hardnessBias,
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
