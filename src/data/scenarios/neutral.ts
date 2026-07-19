import type { Scenario } from '@/types';

export const NEUTRAL_SCENARIOS: Scenario[] = [
  {
    id: 'gap-control',
    zone: 'neutral',
    category: 'gap',
    difficulty: 'varsity',
    title: 'Gap Control',
    setup: 'A forward attacks with speed toward your blue line. Your partner is even with you.',
    kind: 'mcq',
    options: [
      {
        text: 'Back off to the top of your circles, give him room',
        correct: false,
        feedback: 'You concede the blue line. He has speed, time, and options.',
        trap: 'Caution feels safer, but a big gap = a zone entry every time.',
      },
      {
        text: 'Close the gap early and angle him outside',
        correct: true,
        feedback:
          'You meet him at your blue line, take away the middle, force a dump or a board battle.',
      },
      {
        text: 'Go for the big hit at center ice',
        correct: false,
        feedback: 'Miss = breakaway. Coaches hate hero hits.',
        trap: 'Hits are loud. Angles are quiet and effective.',
      },
      {
        text: 'Try to poke check and back off',
        correct: false,
        feedback: 'One-handed pokes from a distance rarely work and you lose the gap.',
        trap: 'Sticks are tools, not strategies.',
      },
    ],
    coachCue: 'Own the blue line.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 40, y: 60, label: 'D' },
        { id: 'd2', team: 'home', x: 60, y: 60, label: 'D' },
        { id: 'f', team: 'away', x: 38, y: 38, label: 'F' },
      ],
      puck: { x: 38, y: 38 },
      arrows: [{ fromX: 38, fromY: 38, toX: 40, toY: 58 }],
      highlights: [{ x: 40, y: 50, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 42, y: 10 }, d1: { x: 41, y: 46 }, d2: { x: 59, y: 46 } },
          puck: { x: 42, y: 10 },
          narration: 'Their winger takes off out of his own end with speed.',
        },
        {
          t: 4,
          players: { f: { x: 39, y: 20 }, d1: { x: 41, y: 50 }, d2: { x: 59, y: 50 } },
          puck: { x: 39, y: 20 },
          narration: "He's through the neutral zone middle with a full head of steam.",
        },
        {
          t: 8,
          players: { f: { x: 38, y: 30 }, d1: { x: 40, y: 55 }, d2: { x: 60, y: 55 } },
          puck: { x: 38, y: 30 },
          narration: "You're backing up - your partner is even with you.",
        },
        {
          t: 11.5,
          players: { f: { x: 38, y: 38 }, d1: { x: 40, y: 60 }, d2: { x: 60, y: 60 } },
          puck: { x: 38, y: 38 },
          narration: "He's attacking your blue line right now...",
        },
        { t: 13 },
      ],
      freezeLine: "You're the strong-side D. How do you play him?",
      narration: "Their winger jumps out of his own end with real speed and drives the middle of the neutral zone. You're backing up, your partner even with you. Now he's coming right at your blue line.",
    },
  },
  {
    id: 'two-on-one',
    zone: 'neutral',
    category: 'rush-defense',
    difficulty: 'elite',
    title: '2-on-1 Rush',
    setup: "Two attackers crossing the red line. You're alone. Goalie is set.",
    kind: 'mcq',
    options: [
      {
        text: 'Slide to block the shot immediately',
        correct: false,
        feedback: 'Easy pass to the open man = empty net.',
        trap: 'Sacrificing the body feels heroic. It also feeds the tap-in.',
      },
      {
        text: 'Take away the pass, force the shot, trust your goalie',
        correct: true,
        feedback:
          "Stick in the lane, body between attackers. Shot from the outside is your goalie's save.",
      },
      {
        text: 'Challenge the puck carrier hard',
        correct: false,
        feedback: "You bite, he passes, it's 1-on-0. Catastrophic.",
        trap: 'Pressure works in 1-on-1s. Not in 2-on-1s.',
      },
      {
        text: 'Skate backward and watch',
        correct: false,
        feedback: 'Passive = they pick you apart. Be patient, not passive.',
        trap: "There's a difference between reading the play and surrendering it.",
      },
    ],
    coachCue: 'Stick in lane. Give up the shot.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 50, y: 65, label: 'D' },
        { id: 'a1', team: 'away', x: 35, y: 45, label: 'F' },
        { id: 'a2', team: 'away', x: 65, y: 45, label: 'F' },
      ],
      puck: { x: 35, y: 45 },
      arrows: [{ fromX: 35, fromY: 45, toX: 65, toY: 45, dashed: true }],
      highlights: [{ x: 50, y: 50, radius: 8 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a1: { x: 30, y: 12 }, a2: { x: 70, y: 15 }, d: { x: 50, y: 42 } },
          puck: { x: 30, y: 12 },
          narration: "Turnover at their blue line - they're off the other way!",
        },
        {
          t: 4,
          players: { a1: { x: 32, y: 25 }, a2: { x: 68, y: 27 }, d: { x: 50, y: 50 } },
          puck: { x: 32, y: 25 },
          narration: "Two on one. You're the only man back.",
        },
        {
          t: 8,
          players: { a1: { x: 34, y: 36 }, a2: { x: 66, y: 37 }, d: { x: 50, y: 58 } },
          puck: { x: 34, y: 36 },
          narration: 'They cross center with speed - carrier left, trailer wide right.',
        },
        {
          t: 11.5,
          players: { a1: { x: 35, y: 45 }, a2: { x: 65, y: 45 }, d: { x: 50, y: 65 } },
          puck: { x: 35, y: 45 },
          narration: "It's a clean two-on-one bearing down on you...",
        },
        { t: 13 },
      ],
      freezeLine: 'Two on one, your goalie is set. What do you take away?',
      narration: "Turnover at their line and they're gone the other way. It's two on one, and you're the only man back. They cross center with speed, carrier on the left, trailer wide right, bearing down on you.",
    },
  },
];
