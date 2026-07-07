import type { SaveState, Scenario } from '@/types';
import { SCENARIOS } from '@/data/scenarios';

/**
 * Pick `count` scenarios using a lightweight spaced-repetition score:
 *   score = (5 - confidence) * 100 + ageHours + jitter
 * Higher score = surface sooner. New scenarios get a large baseline so they
 * appear before well-mastered ones.
 */
export function pickScenarios(
  state: SaveState,
  count: number,
  filter?: (s: Scenario) => boolean
): Scenario[] {
  const pool = SCENARIOS.filter((s) => {
    if (filter && !filter(s)) return false;
    if (s.difficulty === 'varsity' && !state.unlocked.varsity) return false;
    if (s.difficulty === 'elite' && !state.unlocked.elite) return false;
    return true;
  });

  if (pool.length === 0) return [];

  const now = Date.now();
  const scored = pool.map((s) => {
    const stat = state.scenarioStats[s.id];
    if (!stat) {
      return { s, score: 1000 + Math.random() * 100 };
    }
    const ageHours = (now - stat.lastSeen) / (1000 * 60 * 60);
    const score = (5 - stat.confidence) * 100 + ageHours + Math.random() * 30;
    return { s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((x) => x.s);
}

/**
 * Find the category the player is weakest in (lowest accuracy, ≥2 attempts).
 * Returns null if not enough data yet.
 */
export function weakestCategory(state: SaveState): string | null {
  const catAcc: Record<string, { c: number; a: number }> = {};
  Object.entries(state.scenarioStats).forEach(([id, s]) => {
    const sc = SCENARIOS.find((x) => x.id === id);
    if (!sc) return;
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
 * Returns accuracy for a given difficulty (across at least 3 attempts) for unlock checks.
 */
export function accuracyForDifficulty(
  state: SaveState,
  diff: Scenario['difficulty']
): number {
  const ids = SCENARIOS.filter((s) => s.difficulty === diff).map((s) => s.id);
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
