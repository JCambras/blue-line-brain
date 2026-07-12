import type { LevelKey, ModuleId } from '@/types';

export interface LevelInfo {
  name: string;
  min: number;
  patch: string;
}

export interface LevelLadder {
  order: LevelKey[];
  levels: Record<string, LevelInfo>;
}

/**
 * Per-module level ladders. Both share the same XP thresholds so switching
 * sports feels consistent; only the names and patches differ.
 */
export const LADDERS: Record<ModuleId, LevelLadder> = {
  hockey: {
    order: ['squirts', 'peewees', 'bantams', 'midgets', 'juniors', 'pro'],
    levels: {
      squirts: { name: 'Squirts', min: 0, patch: '🥅' },
      peewees: { name: 'Peewees', min: 200, patch: '🏒' },
      bantams: { name: 'Bantams', min: 600, patch: '🛡️' },
      midgets: { name: 'Midgets', min: 1200, patch: '⭐' },
      juniors: { name: 'Juniors', min: 2200, patch: '🔥' },
      pro: { name: 'Pro', min: 4000, patch: '🏆' },
    },
  },
  lacrosse: {
    order: ['lax_youth', 'lax_jv', 'lax_varsity', 'lax_allconf', 'lax_allamerican'],
    levels: {
      lax_youth: { name: 'Youth', min: 0, patch: '🥍' },
      lax_jv: { name: 'JV', min: 200, patch: '🧤' },
      lax_varsity: { name: 'Varsity', min: 600, patch: '⭐' },
      lax_allconf: { name: 'All-Conference', min: 1200, patch: '🔥' },
      lax_allamerican: { name: 'All-American', min: 2200, patch: '🏆' },
    },
  },
};

export function ladderFor(moduleId: ModuleId): LevelLadder {
  return LADDERS[moduleId];
}

/** The starting level key for a module (its first rung). */
export function firstLevel(moduleId: ModuleId): LevelKey {
  return LADDERS[moduleId].order[0];
}

export function levelFromXP(xp: number, moduleId: ModuleId): LevelKey {
  const ladder = LADDERS[moduleId];
  let current: LevelKey = ladder.order[0];
  for (const k of ladder.order) {
    if (xp >= ladder.levels[k].min) current = k;
  }
  return current;
}

export function nextLevelInfo(
  xp: number,
  moduleId: ModuleId
): {
  next: LevelInfo;
  prev: LevelInfo;
  pctToNext: number;
} {
  const ladder = LADDERS[moduleId];
  for (let i = 0; i < ladder.order.length; i++) {
    const k = ladder.order[i];
    if (xp < ladder.levels[k].min) {
      const prevK = ladder.order[i - 1] ?? ladder.order[0];
      const prev = ladder.levels[prevK];
      const next = ladder.levels[k];
      const pct = ((xp - prev.min) / (next.min - prev.min)) * 100;
      return { next, prev, pctToNext: pct };
    }
  }
  // Maxed out
  const top = ladder.levels[ladder.order[ladder.order.length - 1]];
  return { next: top, prev: top, pctToNext: 100 };
}
