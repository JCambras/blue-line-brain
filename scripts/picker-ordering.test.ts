/**
 * Unit tests for the scenario-ordering algorithm (`src/lib/scenarioOrdering.ts`).
 *
 * Verifies the two properties the shuffle rework must guarantee:
 *  (a) ordering VARIES across runs for same-mastery peers within one
 *      (category, difficulty) grouping, and
 *  (b) unseen / low-confidence scenarios still TEND to surface before
 *      well-mastered ones.
 *
 * A seeded PRNG makes the statistics deterministic (never flaky).
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SaveState, Scenario, ScenarioStats } from '../src/types/index.ts';
import {
  orderPool,
  spacedRepetitionBias,
  BOSS_HARDNESS_BIAS,
} from '../src/lib/scenarioOrdering.ts';
import { pickBossScenarios } from '../src/lib/picker.ts';

/** Deterministic PRNG (mulberry32) so the statistical assertions are stable. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOW = 1_700_000_000_000;
const HOUR = 1000 * 60 * 60;

/** Minimal scenario - the ordering only reads id/category/difficulty. */
function scn(id: string, category: string, difficulty: string): Scenario {
  return { id, category, difficulty } as unknown as Scenario;
}

function stat(confidence: number, ageHours: number): ScenarioStats {
  return {
    attempts: 5,
    correct: Math.round(confidence),
    lastSeen: NOW - ageHours * HOUR,
    confidence,
  };
}

function makeState(stats: Record<string, ScenarioStats>): SaveState {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    level: 'squirts',
    badges: [],
    scenarioStats: stats,
    unlocked: { varsity: true, elite: true },
    dailyLastDone: null,
    dailyStreakDays: 0,
    soundOn: true,
  };
}

const RUNS = 2000;

test('(a) same-mastery peers within a (category,difficulty) bucket reorder freely', () => {
  // Two unseen peers in the SAME category+difficulty: identical bias, so their
  // order should be decided by chance and land ~50/50 across runs.
  const a = scn('ret-r-a', 'retrieval', 'rookie');
  const b = scn('ret-r-b', 'retrieval', 'rookie');
  const state = makeState({}); // both unseen
  const rand = mulberry32(1);

  let aFirst = 0;
  for (let i = 0; i < RUNS; i++) {
    const order = orderPool([a, b], state, NOW, rand);
    if (order[0].id === a.id) aFirst++;
  }
  const frac = aFirst / RUNS;
  // Both orderings must occur, and neither may dominate: a real shuffle.
  assert.ok(frac > 0.4 && frac < 0.6, `expected ~50/50, got aFirst=${frac}`);
});

test('(a) the shuffle is per-bucket, not just global', () => {
  // Two independent buckets, each with two same-mastery (seen, equal conf/recency)
  // peers. Each bucket must reorder on its own - a global-only jitter that lets
  // one category dominate would pin at least one bucket's order.
  const buckets = [
    ['retrieval', 'rookie'],
    ['breakout', 'varsity'],
  ] as const;
  const scenarios = buckets.flatMap(([cat, diff]) => [
    scn(`${cat}-${diff}-a`, cat, diff),
    scn(`${cat}-${diff}-b`, cat, diff),
  ]);
  // Every scenario has the SAME mastery/recency, so bias is identical for all.
  const state = makeState(
    Object.fromEntries(scenarios.map((s) => [s.id, stat(3, 10)]))
  );
  const rand = mulberry32(7);

  const aFirst: Record<string, number> = {};
  for (let i = 0; i < RUNS; i++) {
    const order = orderPool(scenarios, state, NOW, rand);
    for (const [cat, diff] of buckets) {
      const idxA = order.findIndex((s) => s.id === `${cat}-${diff}-a`);
      const idxB = order.findIndex((s) => s.id === `${cat}-${diff}-b`);
      const key = `${cat}-${diff}`;
      aFirst[key] = (aFirst[key] ?? 0) + (idxA < idxB ? 1 : 0);
    }
  }
  for (const [cat, diff] of buckets) {
    const frac = aFirst[`${cat}-${diff}`] / RUNS;
    assert.ok(
      frac > 0.4 && frac < 0.6,
      `bucket ${cat}/${diff} did not shuffle: aFirst=${frac}`
    );
  }
});

test('(b) unseen and low-confidence scenarios tend to surface before mastered ones', () => {
  const unseen = scn('ret-r-unseen', 'retrieval', 'rookie');
  const weak = scn('ret-r-weak', 'retrieval', 'rookie'); // low confidence, stale
  const mastered = scn('ret-r-mastered', 'retrieval', 'rookie'); // high conf, fresh
  const pool = [mastered, weak, unseen]; // input order must not matter
  const state = makeState({
    [weak.id]: stat(1, 72),
    [mastered.id]: stat(5, 0),
  });
  const rand = mulberry32(42);

  let unseenBeatsMastered = 0;
  let weakBeatsMastered = 0;
  let masteredAvgIdx = 0;
  for (let i = 0; i < RUNS; i++) {
    const order = orderPool(pool, state, NOW, rand);
    const iUnseen = order.findIndex((s) => s.id === unseen.id);
    const iWeak = order.findIndex((s) => s.id === weak.id);
    const iMastered = order.findIndex((s) => s.id === mastered.id);
    if (iUnseen < iMastered) unseenBeatsMastered++;
    if (iWeak < iMastered) weakBeatsMastered++;
    masteredAvgIdx += iMastered;
  }
  // Unseen strongly leads mastered; weak clearly (if less absolutely) leads too;
  // mastered gravitates to the back of a 3-item list.
  assert.ok(
    unseenBeatsMastered / RUNS > 0.9,
    `unseen should almost always beat mastered, got ${unseenBeatsMastered / RUNS}`
  );
  assert.ok(
    weakBeatsMastered / RUNS > 0.75,
    `weak should usually beat mastered, got ${weakBeatsMastered / RUNS}`
  );
  assert.ok(
    masteredAvgIdx / RUNS > 1.3,
    `mastered should trend last, avg idx ${masteredAvgIdx / RUNS}`
  );
});

test('boss hardness bias leans elite over varsity but still mixes in varsity (variety)', () => {
  // Equal-mastery elite vs varsity peers. The moderate BOSS_HARDNESS_BIAS makes
  // elite lead most of the time (a Boss is elite-heavy = genuinely harder), but
  // the random term still floats varsity to the front often enough that the draw
  // stays varied - so a shallow module (lacrosse: exactly 10 elite) never
  // repeats the same all-elite set every battle.
  const elite = scn('elite-x', 'coverage', 'elite');
  const varsityS = scn('varsity-x', 'coverage', 'varsity');
  const pool = [varsityS, elite]; // input order must not matter
  const state = makeState({}); // both unseen -> identical spaced-rep bias
  const rand = mulberry32(123);

  const RUNS2 = 4000;
  let eliteFirst = 0;
  for (let i = 0; i < RUNS2; i++) {
    const order = orderPool(pool, state, NOW, rand, BOSS_HARDNESS_BIAS);
    if (order[0].id === elite.id) eliteFirst++;
  }
  const frac = eliteFirst / RUNS2;
  assert.ok(frac > 0.8, `elite should lead most of the time (harder Boss), got ${frac}`);
  assert.ok(frac < 0.99, `varsity must still surface sometimes (variety), got ${frac}`);

  // Without the bias, equal-mastery peers are a coin flip (Daily 5 behavior).
  const rand2 = mulberry32(123);
  let eliteFirstNoBias = 0;
  for (let i = 0; i < RUNS2; i++) {
    const order = orderPool(pool, state, NOW, rand2); // no hardness bias
    if (order[0].id === elite.id) eliteFirstNoBias++;
  }
  const fracNoBias = eliteFirstNoBias / RUNS2;
  assert.ok(
    fracNoBias > 0.4 && fracNoBias < 0.6,
    `with no bias elite/varsity should be ~50/50, got ${fracNoBias}`
  );
});

test('pickBossScenarios never returns a rookie rep, so a Boss beats a mixed Daily 5', () => {
  // Rookie exclusion is a deterministic filter, independent of the shuffle: no
  // matter the random order, a Boss draw contains zero rookie scenarios (Daily 5
  // still includes them). This is the floor that guarantees "harder than Daily 5".
  const state = makeState({});
  const boss = pickBossScenarios(state, 40, undefined, { varsity: true, elite: true });
  assert.ok(boss.length > 0, 'expected a non-empty Boss pool');
  assert.ok(
    boss.every((s) => s.difficulty !== 'rookie'),
    'Boss must not include any rookie scenarios'
  );
});

test('bias is bounded: unseen outranks the strongest seen bias, staleness saturates', () => {
  const s = scn('x', 'retrieval', 'rookie');
  const unseen = spacedRepetitionBias(makeState({}), s, NOW);
  const weakestSeen = spacedRepetitionBias(
    makeState({ x: stat(0, 24 * 365) }), // conf 0, a year stale
    s,
    NOW
  );
  // Unseen sits just above the max seen bias, and a year-stale item is capped at
  // the same value as a one-week-stale one (staleness saturates).
  assert.ok(unseen > weakestSeen, 'unseen must outrank the strongest seen bias');
  const oneWeek = spacedRepetitionBias(makeState({ x: stat(0, 24 * 7) }), s, NOW);
  assert.equal(weakestSeen, oneWeek, 'staleness term must saturate at AGE_FULL_HOURS');
});
