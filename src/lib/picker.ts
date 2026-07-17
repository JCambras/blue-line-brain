import type { SaveState, Scenario, Sport } from '@/types';
import { SCENARIOS } from '../data/scenarios/index.ts';
import { sportOf } from '../data/modules.ts';
import { orderPool } from './scenarioOrdering.ts';

/**
 * Pick `count` scenarios, ordered by spaced repetition with a strong shuffle.
 *
 * Each scenario scores `bias + random`, where `bias` favors unseen and
 * weak/stale scenarios (bounded so no bucket dominates on magnitude) and
 * `random` is large enough to dominate small mastery/recency differences. The
 * upshot: within any (category, difficulty) grouping, similar-mastery peers
 * reorder freely from run to run, while unseen/weak/stale scenarios still tend
 * to surface first. See {@link orderPool} for the exact weighting.
 *
 * `filter` and the varsity/elite unlock gating select the pool; the top `count`
 * scored scenarios are returned.
 */
export function pickScenarios(
  state: SaveState,
  count: number,
  filter?: (s: Scenario) => boolean,
  unlocked: { varsity: boolean; elite: boolean } = { varsity: true, elite: true }
): Scenario[] {
  const pool = SCENARIOS.filter((s) => {
    if (filter && !filter(s)) return false;
    if (s.difficulty === 'varsity' && !unlocked.varsity) return false;
    if (s.difficulty === 'elite' && !unlocked.elite) return false;
    return true;
  });

  if (pool.length === 0) return [];

  return orderPool(pool, state).slice(0, count);
}

/**
 * Find the category the player is weakest in (lowest accuracy, ≥2 attempts).
 * When `sport` is given, only scenarios of that sport count, so a hockey weak
 * spot never leaks into a lacrosse "practice weakest" drill and vice versa.
 * Returns null if not enough data yet.
 */
export function weakestCategory(state: SaveState, sport?: Sport): string | null {
  const catAcc: Record<string, { c: number; a: number }> = {};
  Object.entries(state.scenarioStats).forEach(([id, s]) => {
    const sc = SCENARIOS.find((x) => x.id === id);
    if (!sc) return;
    if (sport && sportOf(sc) !== sport) return;
    // Real Examples live in their own opt-in section and their categories have
    // no generic drills to fall back on, so never surface one as the "weakest"
    // category (a Practice Weakest drill would then find an empty pool).
    if (sc.realGame) return;
    if (!catAcc[sc.category]) catAcc[sc.category] = { c: 0, a: 0 };
    catAcc[sc.category].c += s.correct;
    catAcc[sc.category].a += s.attempts;
  });

  let weakestCat: string | null = null;
  let weakestAcc = 1.1;
  Object.entries(catAcc).forEach(([cat, v]) => {
    if (v.a < 2) return;
    const acc = v.c / v.a;
    if (acc < weakestAcc) {
      weakestAcc = acc;
      weakestCat = cat;
    }
  });
  return weakestCat;
}

/**
 * Returns accuracy for a given difficulty (across at least 3 attempts) for unlock
 * checks. When `sport` is given, only that sport's scenarios count, so each
 * module unlocks its own varsity/elite independently.
 */
export function accuracyForDifficulty(
  state: SaveState,
  diff: Scenario['difficulty'],
  sport?: Sport
): number {
  // Real Examples sit outside progression: their session is opt-in and always
  // available, so replaying a memorized one must not nudge the unlock gate.
  const ids = SCENARIOS.filter(
    (s) =>
      s.difficulty === diff && (!sport || sportOf(s) === sport) && !s.realGame
  ).map((s) => s.id);
  let attempts = 0;
  let correct = 0;
  ids.forEach((id) => {
    const st = state.scenarioStats[id];
    if (st) {
      attempts += st.attempts;
      correct += st.correct;
    }
  });
  return attempts >= 3 ? correct / attempts : 0;
}
