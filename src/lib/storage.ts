import type { SaveState } from '@/types';

const STORAGE_KEY = 'blb-save-v1';

export function defaultState(): SaveState {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    level: 'squirts',
    badges: [],
    scenarioStats: {},
    unlocked: { varsity: false, elite: false },
    dailyLastDone: null,
    dailyStreakDays: 0,
    soundOn: true,
  };
}

export function loadState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SaveState>;
      return { ...defaultState(), ...parsed };
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
