import type { Scenario, SessionMode, Sport } from '@/types';
import { SCENARIOS } from './scenarios';

/**
 * A sport module packages everything the shared pedagogical engine needs to
 * render one sport: which scenarios belong to it, how the home screen labels
 * its skill tracks, and which field surface to draw. The scenario -> animation
 * -> freeze -> decision -> feedback loop, the picker, XP, badges and the PWA
 * are all sport-agnostic and reused verbatim across modules.
 */
export type ModuleId = 'hockey' | 'lacrosse';

export interface ModuleTrack {
  /** The session mode this card starts (a zone/track tag). */
  key: SessionMode;
  label: string;
  sub: string;
  accent: string;
}

export interface AppModule {
  id: ModuleId;
  sport: Sport;
  /** Label shown in the module switcher row. */
  switchLabel: string;
  /** Heading above the track cards ("PICK A ZONE" / "PICK A SKILL"). */
  trackHeading: string;
  tracks: ModuleTrack[];
  cheatSheet: string[];
  /** Which field surface the diagrams draw. */
  fieldKind: 'rink' | 'lacrosse';
}

/** The sport a scenario belongs to; absent `sport` means hockey. */
export function sportOf(s: Scenario): Sport {
  return s.sport ?? 'hockey';
}

const HOCKEY_MODULE: AppModule = {
  id: 'hockey',
  sport: 'hockey',
  switchLabel: '🏒 Hockey · D',
  trackHeading: 'PICK A ZONE',
  tracks: [
    {
      key: 'defensive',
      label: 'DEFENSIVE ZONE',
      sub: 'Retrieval · coverage · breakouts',
      accent: '#1f4ed8',
    },
    {
      key: 'neutral',
      label: 'NEUTRAL ZONE',
      sub: 'Gap · rush defense · transition',
      accent: '#6b21a8',
    },
    {
      key: 'offensive',
      label: 'OFFENSIVE ZONE',
      sub: 'Blue line · pinching · shots',
      accent: '#b91c1c',
    },
    {
      key: 'skills',
      label: 'SKILLS LAB',
      sub: 'Hands · feet · stick details',
      accent: '#0f766e',
    },
  ],
  cheatSheet: [
    'Scan before you touch.',
    'Protect the house.',
    'Hard tape passes.',
    'Move after you pass.',
    'Head up at the blue line.',
  ],
  fieldKind: 'rink',
};

const LACROSSE_MODULE: AppModule = {
  id: 'lacrosse',
  sport: 'lacrosse',
  switchLabel: '🥍 Lax · Attack',
  trackHeading: 'PICK A SKILL',
  tracks: [
    {
      key: 'dodge',
      label: 'DODGING & INITIATING',
      sub: 'From X · beat your man · draw the slide',
      accent: '#b45309',
    },
    {
      key: 'offball',
      label: 'OFF-BALL',
      sub: 'Cutting · spacing · backdoor timing',
      accent: '#0f766e',
    },
    {
      key: 'finish',
      label: 'FINISHING',
      sub: 'Shot selection · beat the goalie',
      accent: '#b91c1c',
    },
    {
      key: 'ride',
      label: 'THE RIDE',
      sub: 'Angles · take the outlet · win it back',
      accent: '#4338ca',
    },
  ],
  cheatSheet: [
    'Dodge away from his pressure.',
    'Draw two, feed one.',
    'Be a threat without the ball.',
    'Shoot where the goalie is not.',
    'On the ride, angle him to the sideline.',
  ],
  fieldKind: 'lacrosse',
};

export const MODULES: AppModule[] = [HOCKEY_MODULE, LACROSSE_MODULE];

export const DEFAULT_MODULE_ID: ModuleId = 'hockey';

export function moduleById(id: ModuleId): AppModule {
  return MODULES.find((m) => m.id === id) ?? HOCKEY_MODULE;
}

/** All scenarios whose sport matches the given module. */
export function scenariosForModule(id: ModuleId): Scenario[] {
  const sport = moduleById(id).sport;
  return SCENARIOS.filter((s) => sportOf(s) === sport);
}
