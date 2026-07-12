/**
 * Unit tests for per-module save state (v2): the v1 -> v2 migration, picker
 * sport-scoping, and per-module daily independence.
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { migrateV1, defaultState, defaultModuleProgress } from '../src/lib/storage.ts';
import { pickScenarios, weakestCategory } from '../src/lib/picker.ts';
import { sportOf } from '../src/data/modules.ts';
import type { SaveState, ScenarioStats } from '../src/types/index.ts';

test('migration: a v1 save moves all legacy progression into perModule.hockey', () => {
  const v1 = {
    xp: 500,
    streak: 4,
    bestStreak: 7,
    level: 'peewees',
    badges: ['gap_master', 'daily_grinder'],
    scenarioStats: { 'retrieval-scan': { attempts: 3, correct: 2, lastSeen: 1, confidence: 2 } },
    unlocked: { varsity: true, elite: false },
    dailyLastDone: '2026-01-01',
    dailyStreakDays: 3,
    soundOn: false,
  };
  const v2 = migrateV1(v1);

  assert.equal(v2.version, 2);
  assert.equal(v2.activeModule, 'hockey');

  // Hockey slice inherits every legacy value - the owner's son loses nothing.
  const h = v2.perModule.hockey;
  assert.equal(h.xp, 500);
  assert.equal(h.level, 'peewees');
  assert.equal(h.streak, 4);
  assert.equal(h.bestStreak, 7);
  assert.deepEqual(h.unlocked, { varsity: true, elite: false });
  assert.equal(h.dailyLastDone, '2026-01-01');
  assert.equal(h.dailyStreakDays, 3);

  // Global fields carry over untouched.
  assert.deepEqual(v2.badges, ['gap_master', 'daily_grinder']);
  assert.ok(v2.scenarioStats['retrieval-scan']);
  assert.equal(v2.soundOn, false);
});

test('migration: lacrosse starts completely fresh', () => {
  const v2 = migrateV1({ xp: 9999, streak: 20, bestStreak: 20, level: 'pro' });
  const l = v2.perModule.lacrosse;
  assert.equal(l.xp, 0);
  assert.equal(l.level, 'lax_youth');
  assert.equal(l.streak, 0);
  assert.equal(l.dailyStreakDays, 0);
  assert.deepEqual(l.unlocked, { varsity: false, elite: false });
});

test('per-module daily independence: the two slices are distinct', () => {
  const s = defaultState();
  // Simulate finishing a hockey Daily 5 by stamping only the hockey slice.
  s.perModule.hockey.dailyLastDone = '2026-07-12';
  s.perModule.hockey.dailyStreakDays = 1;

  // The lacrosse daily must be untouched - a hockey Daily 5 does not consume it.
  assert.equal(s.perModule.lacrosse.dailyLastDone, null);
  assert.equal(s.perModule.lacrosse.dailyStreakDays, 0);
});

test('defaultModuleProgress starts each module on its own first rung', () => {
  assert.equal(defaultModuleProgress('hockey').level, 'squirts');
  assert.equal(defaultModuleProgress('lacrosse').level, 'lax_youth');
});

function stateWith(stats: Record<string, ScenarioStats>): SaveState {
  const s = defaultState();
  s.scenarioStats = stats;
  return s;
}

test('picker sport-scoping: a filter keeps a session to one sport', () => {
  const state = defaultState();
  const lax = pickScenarios(state, 8, (s) => sportOf(s) === 'lacrosse');
  assert.ok(lax.length > 0, 'lacrosse pool is non-empty');
  assert.ok(lax.every((s) => sportOf(s) === 'lacrosse'), 'only lacrosse scenarios returned');

  const hockey = pickScenarios(state, 8, (s) => sportOf(s) === 'hockey');
  assert.ok(hockey.every((s) => sportOf(s) === 'hockey'), 'only hockey scenarios returned');
});

test('weakestCategory scoping: hockey and lacrosse weak spots do not cross over', () => {
  const stat: ScenarioStats = { attempts: 3, correct: 0, lastSeen: 1, confidence: 0 };
  // A weak hockey scenario (retrieval) and a weak lacrosse one (dodge).
  const state = stateWith({
    'retrieval-scan': stat,
    'lax-dodge-x-topside': stat,
  });

  assert.equal(weakestCategory(state, 'hockey'), 'retrieval');
  assert.equal(weakestCategory(state, 'lacrosse'), 'dodge');
});
