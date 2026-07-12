// ============================================================
// Core types for Blue Line Brain
// ============================================================

/** Which sport a scenario belongs to. Absent on a scenario means hockey. */
export type Sport = 'hockey' | 'lacrosse';
/** The four hockey zones (the original `Zone`). */
export type HockeyZone = 'defensive' | 'neutral' | 'offensive' | 'skills';
/** The four lacrosse-attack skill tracks. */
export type LacrosseTrack = 'dodge' | 'offball' | 'finish' | 'ride';
export type Zone = HockeyZone | LacrosseTrack;
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
  /**
   * Author a carried puck at the carrier's exact coordinates - the renderer
   * shifts it onto that player's stick when drawing (see `puckOnStick` in
   * RinkDiagram.tsx and "Puck placement" in src/data/scenarios/AUTHORING.md).
   */
  puck: { x: number; y: number };
  arrows?: Arrow[];
  highlights?: Highlight[];
  /**
   * Id of the home player the question puts you in the skates of
   * ("You're the defenseman here") — rendered with a YOU tag on the rink.
   */
  youId?: string;
}

// ---------- Play animation ----------
// A scenario can open with an animated play sequence (10–15s) that ends on
// the freeze frame defined by `visual`. Positions tween between beats.

export interface AnimBeat {
  /** Seconds from animation start at which these positions are reached. */
  t: number;
  /**
   * Target positions by player id (ids from visual.players).
   * Omitted players hold their previous spot.
   */
  players?: Record<string, { x: number; y: number }>;
  /** Carried pucks follow the same convention as `RinkVisual.puck`. */
  puck?: { x: number; y: number };
  /**
   * Play-by-play line spoken (and captioned) when the timeline reaches this
   * beat — it should describe the movement happening after this beat.
   */
  narration?: string;
}

export interface PlayAnimation {
  /**
   * The first beat (t=0) sets starting positions; players/puck not mentioned
   * there start at their `visual` positions. The last beat must land on the
   * `visual` positions so the freeze frame matches the static diagram.
   */
  beats: AnimBeat[];
  /** Spoken at the freeze, straight into the decision (no "stop it here" opener), e.g. "You're the D. What do you do?" */
  freezeLine: string;
  /**
   * One short coach voice-over (2-4 sentences) for the whole animated play,
   * written for a 10-14 year old. Pre-rendered to an MP3 at build time by
   * `scripts/generate-narration.ts` (keyed to the scenario id) and played over
   * the animation phase; see `src/data/scenarios/AUTHORING.md`. Missing MP3 =
   * silent, no error.
   */
  narration: string;
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
  /** Which sport module this scenario belongs to; absent = hockey. */
  sport?: Sport;
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
  /** Optional animated play sequence that runs before the question. */
  animation?: PlayAnimation;
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
export type SessionMode = 'daily5' | 'boss' | 'weakest' | Zone;

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
