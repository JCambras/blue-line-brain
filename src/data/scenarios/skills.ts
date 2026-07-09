import type { Scenario } from '@/types';

export const SKILLS_SCENARIOS: Scenario[] = [
  {
    id: 'backhand-catch',
    zone: 'skills',
    category: 'skills',
    difficulty: 'rookie',
    title: 'Backhand Catch',
    setup: 'Pass arrives on your backhand at the offensive blue line.',
    kind: 'mcq',
    options: [
      {
        text: 'Try to one-time a backhand shot',
        correct: false,
        feedback: 'Low percentage and you give up possession most of the time.',
        trap: 'Looks cool. Rarely works.',
      },
      {
        text: 'Push the puck quickly to your forehand',
        correct: true,
        feedback: 'Forehand = more options, more power, better control. Get there fast.',
      },
      {
        text: 'Hold it on backhand and survey',
        correct: false,
        feedback: "You're vulnerable on backhand. Forecheck arrives, puck dies.",
        trap: 'Survey is good — but not from a weak position.',
      },
    ],
    coachCue: 'Get to your forehand fast.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 60, y: 30, label: 'D' },
        { id: 'partner', team: 'home', x: 30, y: 32, label: 'D' },
      ],
      puck: { x: 60, y: 30 },
      arrows: [{ fromX: 60, fromY: 30, toX: 50, toY: 30, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 62, y: 34 }, partner: { x: 24, y: 34 } },
          puck: { x: 24, y: 34 },
          narration: 'Your partner walks the offensive blue line with it.',
        },
        {
          t: 4,
          players: { d: { x: 61, y: 32 }, partner: { x: 30, y: 33 } },
          puck: { x: 30, y: 33 },
          narration: "He's under pressure and looks cross-ice at you.",
        },
        {
          t: 7.5,
          players: { d: { x: 60, y: 31 }, partner: { x: 30, y: 32 } },
          puck: { x: 45, y: 31 },
          narration: 'Here comes the pass — and it drifts to your backhand side.',
        },
        {
          t: 10.5,
          players: { d: { x: 60, y: 30 } },
          puck: { x: 60, y: 30 },
          narration: 'It lands on your backhand at the line...',
        },
        { t: 12 },
      ],
      freezeLine: "Puck's on your backhand. Quick - what do you do?",
      narration: "Your partner walks the offensive blue line under pressure and looks cross-ice at you. Here comes the pass, and it drifts to your backhand side. It lands on your backhand right at the line.",
    },
  },
];
