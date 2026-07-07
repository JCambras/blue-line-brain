// ============================================================
// Core types for Blue Line Brain
// ============================================================

export type Zone = 'defensive' | 'neutral' | 'offensive' | 'skills';
export type Difficulty = 'rookie' | 'varsity' | 'elite';
export type InteractionKind = 'mcq' | 'tap';

// ---------- Visual (rink diagram) ----------
// Coordinate system: 0–100 in both axes.
// y = 0 is offensive end (top), y = 100 is defensive end (bottom).
// Defensive zone is roughly y > 67, neutral zone 33–67, offensive zone y < 33.

export interface Player {
  id: string;
  team: 'home' | 'away';
  x: number;
  y: number;
  label?: string;
}

export interface Arrow {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  dashed?: boolean;
}

export interface Highlight {
  x: number;
  y: number;
  radius: number;
}

export interface RinkVisual {
  rinkZone: Zone;
  players: Player[];
  puck: { x: number; y: number };
  arrows?: Arrow[];
  highlights?: Highlight[];
}

// ---------- Decision options ----------
export interface MCQOption {
  text: string;
  correct: boolean;
  /** Why this option is right or wrong. */
  feedback: string;
  /** For wrong options: "I see why you'd pick this, but…" — explains the appeal of the trap. */
  trap?: string;
}

export interface TapTarget {
  x: number;
  y: number;
  radius: number;
  correct: boolean;
  feedback: string;
  label?: string;
}

// ---------- Scenario ----------
export interface Scenario {
  id: string;
  zone: Zone;
  category: string;
  difficulty: Difficulty;
  title: string;
  setup: string;
  kind: InteractionKind;
  options?: MCQOption[];
  tapTargets?: TapTarget[];
  /** The single thing to remember next game. */
  coachCue: string;
  visual: RinkVisual;
}

// ---------- Persistent state ----------
export interface ScenarioStats {
  attempts: number;
  correct: number;
  /** Unix ms timestamp of last attempt. */
  lastSeen: number;
  /** SM-2-lite confidence, 0..5. Higher = surface less often. */
  confidence: number;
}

export type LevelKey = 'squirts' | 'peewees' | 'bantams' | 'midgets' | 'juniors' | 'pro';

export interface SaveState {
  xp: number;
  streak: number;
  bestStreak: number;
  level: LevelKey;
  badges: string[];
  scenarioStats: Record<string, ScenarioStats>;
  unlocked: { varsity: boolean; elite: boolean };
  /** YYYY-MM-DD of last completed Daily 5. */
  dailyLastDone: string | null;
  dailyStreakDays: number;
  soundOn: boolean;
}

// ---------- Session ----------
export type SessionMode =
  | 'daily5'
  | 'defensive'
  | 'neutral'
  | 'offensive'
  | 'skills'
  | 'boss'
  | 'weakest';

export interface SessionResult {
  scenarioId: string;
  correct: boolean;
  timeMs: number;
}

// ---------- Screen routing ----------
export type Screen =
  | { kind: 'home' }
  | {
      kind: 'session';
      mode: SessionMode;
      scenarios: Scenario[];
      idx: number;
      results: SessionResult[];
    }
  | {
      kind: 'feedback';
      scenario: Scenario;
      correct: boolean;
      optionIdx?: number;
      tapIdx?: number;
      timeMs: number;
      results: SessionResult[];
      session: { mode: SessionMode; scenarios: Scenario[]; idx: number };
    }
  | {
      kind: 'results';
      mode: SessionMode;
      results: SessionResult[];
      xpEarned: number;
      newBadges: string[];
      leveledUp: LevelKey | null;
    }
  | { kind: 'coach' };
