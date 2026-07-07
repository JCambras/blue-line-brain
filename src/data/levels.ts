import type { LevelKey } from '@/types';

export interface LevelInfo {
  name: string;
  min: number;
  patch: string;
}

export const LEVELS: Record<LevelKey, LevelInfo> = {
  squirts: { name: 'Squirts', min: 0, patch: '🥅' },
  peewees: { name: 'Peewees', min: 200, patch: '🏒' },
  bantams: { name: 'Bantams', min: 600, patch: '🛡️' },
  midgets: { name: 'Midgets', min: 1200, patch: '⭐' },
  juniors: { name: 'Juniors', min: 2200, patch: '🔥' },
  pro: { name: 'Pro', min: 4000, patch: '🏆' },
};

export const LEVEL_ORDER: LevelKey[] = [
  'squirts',
  'peewees',
  'bantams',
  'midgets',
  'juniors',
  'pro',
];

export function levelFromXP(xp: number): LevelKey {
  let current: LevelKey = 'squirts';
  for (const k of LEVEL_ORDER) {
    if (xp >= LEVELS[k].min) current = k;
  }
  return current;
}

export function nextLevelInfo(xp: number): {
  next: LevelInfo;
  prev: LevelInfo;
  pctToNext: number;
} {
  for (let i = 0; i < LEVEL_ORDER.length; i++) {
    const k = LEVEL_ORDER[i];
    if (xp < LEVELS[k].min) {
      const prevK = LEVEL_ORDER[i - 1] ?? LEVEL_ORDER[0];
      const prev = LEVELS[prevK];
      const next = LEVELS[k];
      const pct = ((xp - prev.min) / (next.min - prev.min)) * 100;
      return { next, prev, pctToNext: pct };
    }
  }
  // Maxed out
  const top = LEVELS[LEVEL_ORDER[LEVEL_ORDER.length - 1]];
  return { next: top, prev: top, pctToNext: 100 };
}
