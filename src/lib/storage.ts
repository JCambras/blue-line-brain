import type { ModuleId, ModuleProgress, SaveState } from '@/types';
import { firstLevel } from '../data/levels.ts';

// Key is intentionally unchanged across the v1 -> v2 migration so existing
// players keep their save. `loadState` migrates any v1 blob it finds.
const STORAGE_KEY = 'blb-save-v1';

export function defaultModuleProgress(moduleId: ModuleId): ModuleProgress {
  return {
    xp: 0,
    level: firstLevel(moduleId),
    unlocked: { varsity: false, elite: false },
    dailyLastDone: null,
    dailyStreakDays: 0,
    streak: 0,
    bestStreak: 0,
  };
}

export function defaultState(): SaveState {
  return {
    version: 2,
    activeModule: 'hockey',
    perModule: {
      hockey: defaultModuleProgress('hockey'),
      lacrosse: defaultModuleProgress('lacrosse'),
    },
    badges: [],
    scenarioStats: {},
    soundOn: true,
  };
}

/** The legacy (v1) save shape, before per-module progression. */
interface SaveStateV1 {
  xp: number;
  streak: number;
  bestStreak: number;
  level: string;
  badges?: string[];
  scenarioStats?: Record<string, unknown>;
  unlocked?: { varsity: boolean; elite: boolean };
  dailyLastDone?: string | null;
  dailyStreakDays?: number;
  soundOn?: boolean;
}

/**
 * Migrate a v1 save into the v2 shape. All legacy top-level progression lands
 * in `perModule.hockey` (the existing player must lose nothing); lacrosse starts
 * fresh and the app opens on hockey.
 */
export function migrateV1(v1: SaveStateV1): SaveState {
  const base = defaultState();
  return {
    ...base,
    perModule: {
      hockey: {
        xp: v1.xp ?? 0,
        level: (v1.level as ModuleProgress['level']) ?? firstLevel('hockey'),
        unlocked: v1.unlocked ?? { varsity: false, elite: false },
        dailyLastDone: v1.dailyLastDone ?? null,
        dailyStreakDays: v1.dailyStreakDays ?? 0,
        streak: v1.streak ?? 0,
        bestStreak: v1.bestStreak ?? 0,
      },
      lacrosse: defaultModuleProgress('lacrosse'),
    },
    badges: v1.badges ?? [],
    scenarioStats: (v1.scenarioStats as SaveState['scenarioStats']) ?? {},
    soundOn: v1.soundOn ?? true,
  };
}

export function loadState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SaveState> & Partial<SaveStateV1>;
      if ((parsed as SaveState).version === 2 && (parsed as SaveState).perModule) {
        // Merge onto defaults so any newly added module slice is filled in.
        const base = defaultState();
        return {
          ...base,
          ...(parsed as SaveState),
          perModule: {
            hockey: { ...base.perModule.hockey, ...(parsed as SaveState).perModule?.hockey },
            lacrosse: { ...base.perModule.lacrosse, ...(parsed as SaveState).perModule?.lacrosse },
          },
        };
      }
      // No version field -> legacy v1 blob. Migrate it.
      return migrateV1(parsed as SaveStateV1);
    }
  } catch {
    // fall through
  }
  return defaultState();
}

export function saveState(s: SaveState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage might be unavailable; fail silently
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayKey(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}
