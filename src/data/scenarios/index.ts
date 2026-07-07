import type { Scenario, Difficulty } from '@/types';
import { DEFENSIVE_SCENARIOS } from './defensive.ts';
import { DEFENSIVE_BREAKOUT_SCENARIOS } from './defensive-breakouts.ts';
import { DEFENSIVE_COVERAGE_SCENARIOS } from './defensive-coverage.ts';
import { NEUTRAL_SCENARIOS } from './neutral.ts';
import { NEUTRAL_RUSH_SCENARIOS } from './neutral-rush.ts';
import { NEUTRAL_TRANSITION_SCENARIOS } from './neutral-transition.ts';
import { EVEN_STRENGTH_SCENARIOS } from './even-strength.ts';
import { OFFENSIVE_SCENARIOS } from './offensive.ts';
import { OFFENSIVE_POINT_SCENARIOS } from './offensive-point.ts';
import { OFFENSIVE_ATTACK_SCENARIOS } from './offensive-attack.ts';
import { SKILLS_SCENARIOS } from './skills.ts';
import { SKILLS_DECISION_SCENARIOS } from './skills-decisions.ts';
import { SITUATION_SCENARIOS } from './situations.ts';
import { REAL_EXAMPLE_SCENARIOS } from './real-examples.ts';
import { LACROSSE_DODGE_SCENARIOS } from './lacrosse-dodge.ts';
import { LACROSSE_OFFBALL_SCENARIOS } from './lacrosse-offball.ts';
import { LACROSSE_FINISH_SCENARIOS } from './lacrosse-finish.ts';
import { LACROSSE_RIDE_SCENARIOS } from './lacrosse-ride.ts';
import { LACROSSE_TAP_SCENARIOS } from './lacrosse-taps.ts';

/** Boss Battle rules — single source of truth for question count and win line. */
export const BOSS_RULES = { questions: 10, toWin: 8 };

/** Player-facing names for scenario categories (never show raw slugs in the UI). */
export const CATEGORY_LABELS: Record<string, string> = {
  retrieval: 'Puck Retrievals',
  coverage: 'D-Zone Coverage',
  breakout: 'Breakouts',
  gap: 'Gap Control',
  offense: 'Offensive Blue Line',
  skills: 'Skills',
  'rush-defense': 'Defending the Rush',
  positioning: 'Positioning',
};

/** Look up a category's display name, falling back to a cleaned-up slug. */
export function categoryLabel(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}

/**
 * Difficulty config: timer (seconds) and number of MCQ choices.
 * Timer is mandatory at every level — speed is the skill.
 */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { timer: number; choices: number; label: string; cssVar: string }
> = {
  rookie: { timer: 25, choices: 3, label: 'Rookie', cssVar: 'var(--ink-rookie)' },
  varsity: { timer: 18, choices: 4, label: 'Varsity', cssVar: 'var(--ink-varsity)' },
  elite: { timer: 11, choices: 4, label: 'Elite', cssVar: 'var(--ink-elite)' },
};

/**
 * Coordinate system: 0–100 normalized.
 * y=0 is offensive end (top of rink), y=100 is defensive end (bottom).
 * Defensive zone roughly y > 67, neutral 33–67, offensive y < 33.
 */
export const SCENARIOS: Scenario[] = [
  ...DEFENSIVE_SCENARIOS,
  ...DEFENSIVE_BREAKOUT_SCENARIOS,
  ...DEFENSIVE_COVERAGE_SCENARIOS,
  ...NEUTRAL_SCENARIOS,
  ...NEUTRAL_RUSH_SCENARIOS,
  ...NEUTRAL_TRANSITION_SCENARIOS,
  ...EVEN_STRENGTH_SCENARIOS,
  ...OFFENSIVE_SCENARIOS,
  ...OFFENSIVE_POINT_SCENARIOS,
  ...OFFENSIVE_ATTACK_SCENARIOS,
  ...SKILLS_SCENARIOS,
  ...SKILLS_DECISION_SCENARIOS,
  ...SITUATION_SCENARIOS,
  ...REAL_EXAMPLE_SCENARIOS,
  ...LACROSSE_DODGE_SCENARIOS,
  ...LACROSSE_OFFBALL_SCENARIOS,
  ...LACROSSE_FINISH_SCENARIOS,
  ...LACROSSE_RIDE_SCENARIOS,
  ...LACROSSE_TAP_SCENARIOS,
];
