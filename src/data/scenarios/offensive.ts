import type { Scenario } from '@/types';

export const OFFENSIVE_SCENARIOS: Scenario[] = [
  {
    id: 'blue-line-decision',
    zone: 'offensive',
    category: 'offense',
    difficulty: 'varsity',
    title: 'Blue Line Decision',
    setup: 'You catch the puck at the blue line. A defender is square in your shooting lane.',
    kind: 'mcq',
    options: [
      {
        text: 'Fire it through him and hope for a deflection',
        correct: false,
        feedback: 'Shin pads. Puck out of zone. Odd-man rush the other way.',
        trap: 'Shoot-the-puck is not always the answer.',
      },
      {
        text: 'Walk laterally and find a new lane',
        correct: true,
        feedback: 'One step sideways changes everything. Now you have a clear lane or a pass option.',
      },
      {
        text: 'Pass it back to your partner immediately',
        correct: false,
        feedback: 'Sometimes right — but here you give up your own chance without trying.',
        trap: 'Not wrong, just not the best read.',
      },
      {
        text: 'Dump it deep',
        correct: false,
        feedback: "You had possession at their blue line. Don't give it away.",
        trap: 'Dumps are a last resort, not a first instinct.',
      },
    ],
    coachCue: "Don't shoot into shin pads.",
    visual: {
      rinkZone: 'offensive',
      players: [
        { id: 'd', team: 'home', x: 50, y: 32, label: 'D' },
        { id: 'opp', team: 'away', x: 50, y: 22, label: 'F' },
        { id: 'partner', team: 'home', x: 28, y: 32, label: 'D' },
      ],
      puck: { x: 50, y: 32 },
      arrows: [{ fromX: 50, fromY: 32, toX: 65, toY: 30, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 50, y: 36 }, partner: { x: 28, y: 36 }, opp: { x: 42, y: 16 } },
          puck: { x: 18, y: 10 },
          narration: 'Your forwards are cycling it low in the offensive corner.',
        },
        {
          t: 4,
          players: { d: { x: 50, y: 34 }, opp: { x: 45, y: 18 } },
          puck: { x: 22, y: 16 },
          narration: 'The winger gets pinned — he looks up for a release valve.',
        },
        {
          t: 7.5,
          players: { d: { x: 50, y: 33 }, opp: { x: 47, y: 20 } },
          puck: { x: 38, y: 27 },
          narration: 'He rims it back to you at the point.',
        },
        {
          t: 11,
          players: { d: { x: 50, y: 32 }, partner: { x: 28, y: 32 }, opp: { x: 50, y: 22 } },
          puck: { x: 50, y: 32 },
          narration: 'You catch it — but their forward steps right into your shooting lane...',
        },
        { t: 12.5 },
      ],
      freezeLine: "Stop right there. The lane is blocked. What's your move?",
    },
  },
  {
    id: 'pinch-decision',
    zone: 'offensive',
    category: 'offense',
    difficulty: 'elite',
    title: 'Pinch Decision',
    setup: 'You can pinch on the wall to keep the puck in. Your partner is caught up ice and not set.',
    kind: 'mcq',
    options: [
      {
        text: 'Pinch hard — keep the puck in',
        correct: false,
        feedback: "You missed. Now it's a 2-on-1 the other way and your partner isn't there.",
        trap: 'Aggression rewards itself most of the time — but support is the price of admission.',
      },
      {
        text: 'Hold the line, no pinch',
        correct: true,
        feedback: 'Without partner support, the math says back off. Reset and live to defend.',
      },
      {
        text: 'Pinch but only halfway',
        correct: false,
        feedback: '"Halfway" pinches are the worst — you\'re neither in the play nor defending.',
        trap: "Commit or don't. Halfway = caught in between.",
      },
      {
        text: 'Yell at your partner and pinch anyway',
        correct: false,
        feedback: "Yelling doesn't teleport him back. Bad math is bad math.",
        trap: "Communication is good. Bailing yourself out with words isn't.",
      },
    ],
    coachCue: 'No support = no pinch.',
    visual: {
      rinkZone: 'offensive',
      players: [
        { id: 'd', team: 'home', x: 80, y: 32, label: 'D' },
        { id: 'partner', team: 'home', x: 50, y: 12, label: 'D' },
        { id: 'opp', team: 'away', x: 78, y: 38, label: 'F' },
      ],
      puck: { x: 78, y: 38 },
      highlights: [{ x: 50, y: 12, radius: 6 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 80, y: 38 }, partner: { x: 62, y: 8 }, opp: { x: 76, y: 18 } },
          puck: { x: 86, y: 20 },
          narration: "Puck's being battled on the far wall, deep in their zone.",
        },
        {
          t: 4,
          players: { opp: { x: 80, y: 26 }, partner: { x: 58, y: 9 } },
          puck: { x: 83, y: 27 },
          narration: 'Their winger digs it loose and starts up the boards.',
        },
        {
          t: 8,
          players: { d: { x: 80, y: 34 }, opp: { x: 79, y: 33 }, partner: { x: 54, y: 10 } },
          puck: { x: 81, y: 34 },
          narration: "It's squirting up your wall — you could step up and pinch.",
        },
        {
          t: 11.5,
          players: { d: { x: 80, y: 32 }, opp: { x: 78, y: 38 }, partner: { x: 50, y: 12 } },
          puck: { x: 78, y: 38 },
          narration: "But look up ice — your partner is caught deep and isn't set...",
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze. Pinch or hold the line? Make the call.',
    },
  },
  {
    id: 'shot-traffic',
    zone: 'offensive',
    category: 'offense',
    difficulty: 'varsity',
    title: 'Shot Through Traffic',
    setup: 'You have the puck at the offensive blue line. Bodies in front of the net.',
    kind: 'mcq',
    options: [
      {
        text: 'Slap shot high glove side',
        correct: false,
        feedback: 'High shots get caught or fly out of zone. No rebound.',
        trap: 'Highlight reel — but bad for rebounds and bad for traffic.',
      },
      {
        text: 'Low wrist shot for a tip or rebound',
        correct: true,
        feedback: 'Low and on net = tip, screen, or fat rebound. Chaos = goals.',
      },
      {
        text: 'Hold and look for a better shot',
        correct: false,
        feedback: 'Defender closes, lane shuts, puck out of zone.',
        trap: 'Patience burns lanes you already have.',
      },
      {
        text: 'Pass to your partner instead',
        correct: false,
        feedback: "You had traffic and a lane. Don't outsmart the play.",
        trap: 'Sometimes the simple shot is the play.',
      },
    ],
    coachCue: 'Low and on net. Shots create chaos.',
    visual: {
      rinkZone: 'offensive',
      players: [
        { id: 'd', team: 'home', x: 50, y: 32, label: 'D' },
        { id: 'f1', team: 'home', x: 45, y: 18, label: 'F' },
        { id: 'opp1', team: 'away', x: 52, y: 22, label: 'F' },
        { id: 'g', team: 'away', x: 50, y: 8, label: 'G' },
      ],
      puck: { x: 50, y: 32 },
      arrows: [{ fromX: 50, fromY: 32, toX: 50, toY: 10 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 55, y: 36 },
            f1: { x: 62, y: 12 },
            opp1: { x: 56, y: 16 },
            g: { x: 50, y: 8 },
          },
          puck: { x: 80, y: 14 },
          narration: 'Your line is grinding away in the offensive corner.',
        },
        {
          t: 4,
          players: { d: { x: 53, y: 35 }, f1: { x: 56, y: 13 }, opp1: { x: 54, y: 17 } },
          puck: { x: 72, y: 9 },
          narration: 'Your center wins the battle and cycles it up the wall.',
        },
        {
          t: 7.5,
          players: { d: { x: 51, y: 33 }, f1: { x: 50, y: 15 }, opp1: { x: 53, y: 19 } },
          puck: { x: 62, y: 22 },
          narration: 'He spots you at the point — the puck is coming up top.',
        },
        {
          t: 11,
          players: {
            d: { x: 50, y: 32 },
            f1: { x: 45, y: 18 },
            opp1: { x: 52, y: 22 },
            g: { x: 50, y: 8 },
          },
          puck: { x: 50, y: 32 },
          narration: "You've got it at the blue line with bodies piling up at the net...",
        },
        { t: 12.5 },
      ],
      freezeLine: "Freeze. Traffic everywhere in front. What's your best shot?",
    },
  },
];
