import type { Scenario } from '@/types';

export const DEFENSIVE_SCENARIOS: Scenario[] = [
  {
    id: 'retrieval-scan',
    zone: 'defensive',
    category: 'retrieval',
    difficulty: 'rookie',
    title: 'Retrieval Scan',
    setup: 'Puck is rimmed behind your net. A forechecker is closing fast.',
    kind: 'mcq',
    options: [
      {
        text: 'Skate full speed straight to the puck',
        correct: false,
        feedback: 'Eyes on puck only = blind to pressure. You arrive without a plan.',
        trap: 'Speed feels right, but speed without info = bad pass or turnover.',
      },
      {
        text: 'Scan over your shoulder before the first touch',
        correct: true,
        feedback:
          'You know where the forechecker is and where your support is — pass picks itself.',
      },
      {
        text: 'Stop behind the net and wait',
        correct: false,
        feedback: 'You give the forechecker time to pin you. No exit.',
        trap: 'Patience is a virtue — but not with a forecheck bearing down.',
      },
    ],
    coachCue: 'Scan early. Know pressure before first touch.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 50, y: 88, label: 'D' },
        { id: 'f1', team: 'away', x: 42, y: 78, label: 'F' },
        { id: 'w', team: 'home', x: 22, y: 75, label: 'W' },
      ],
      puck: { x: 58, y: 97.5 },
      arrows: [{ fromX: 42, fromY: 78, toX: 52, toY: 88 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 45, y: 68 }, f1: { x: 30, y: 48 }, w: { x: 26, y: 58 } },
          puck: { x: 12, y: 58 },
          narration: "Puck's rimmed hard down the left wall into your zone.",
        },
        {
          t: 3.5,
          players: { d: { x: 48, y: 78 }, f1: { x: 34, y: 62 }, w: { x: 24, y: 66 } },
          puck: { x: 11, y: 92 },
          narration: "It's rolling around the boards behind your net.",
        },
        {
          t: 7,
          players: { d: { x: 50, y: 84 }, f1: { x: 38, y: 71 }, w: { x: 23, y: 71 } },
          puck: { x: 40, y: 98 },
          narration: "You're first man back — their forechecker is coming in hard.",
        },
        {
          t: 11,
          players: { d: { x: 50, y: 88 }, f1: { x: 42, y: 78 }, w: { x: 22, y: 75 } },
          puck: { x: 58, y: 97.5 },
          narration: 'The puck settles behind the net, pressure closing fast...',
        },
        { t: 12.5 },
      ],
      freezeLine:
        "Let's stop it right there. You're the D going back for that puck. What do you do?",
      narration:
        "The puck's rimmed hard down the wall and rolling behind your net. You're first man back, and their forechecker is coming in hot. The puck settles behind the cage, and here comes the pressure.",
    },
  },
  {
    id: 'back-door',
    zone: 'defensive',
    category: 'coverage',
    difficulty: 'rookie',
    title: 'Back Door Coverage',
    setup: 'Puck is on the far boards. A forward is creeping behind you near the post.',
    kind: 'mcq',
    options: [
      {
        text: 'Watch the puck and stay puck-side',
        correct: false,
        feedback: 'Puck-watching = back-door tap-in. The forward you ignored just scored.',
        trap: 'Eyes on the puck feels active — but the danger is behind you.',
      },
      {
        text: 'Stay goal-side and protect the back door',
        correct: true,
        feedback:
          'Body between forward and net. Stick on his stick. You take away the easy goal.',
      },
      {
        text: 'Pressure the puck carrier on the wall',
        correct: false,
        feedback: 'You leave the slot wide open. One pass, one goal.',
        trap: 'Help your partner — but not by abandoning your assignment.',
      },
    ],
    coachCue: 'Protect the back door before watching the puck.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 58, y: 80, label: 'D' },
        { id: 'fwd', team: 'away', x: 56, y: 88, label: 'F' },
        { id: 'puck-carrier', team: 'away', x: 18, y: 78, label: 'F' },
        { id: 'partner', team: 'home', x: 22, y: 80, label: 'D' },
      ],
      puck: { x: 18, y: 78 },
      highlights: [{ x: 56, y: 88, radius: 9 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            'puck-carrier': { x: 30, y: 45 },
            partner: { x: 36, y: 55 },
            fwd: { x: 70, y: 52 },
            d: { x: 55, y: 60 },
          },
          puck: { x: 30, y: 45 },
          narration: 'They gain your zone down the far side with control.',
        },
        {
          t: 4,
          players: {
            'puck-carrier': { x: 20, y: 64 },
            partner: { x: 28, y: 70 },
            fwd: { x: 66, y: 70 },
            d: { x: 56, y: 70 },
          },
          puck: { x: 20, y: 64 },
          narration: 'The carrier walks the wall — your partner steps up on him.',
        },
        {
          t: 8,
          players: {
            'puck-carrier': { x: 18, y: 74 },
            partner: { x: 24, y: 76 },
            fwd: { x: 61, y: 81 },
            d: { x: 57, y: 77 },
          },
          puck: { x: 18, y: 74 },
          narration: 'Watch the weak side — their winger is sneaking in behind you.',
        },
        {
          t: 12,
          players: {
            'puck-carrier': { x: 18, y: 78 },
            partner: { x: 22, y: 80 },
            fwd: { x: 56, y: 88 },
            d: { x: 58, y: 80 },
          },
          puck: { x: 18, y: 78 },
          narration: "He's creeping to the far post, right off your shoulder...",
        },
        { t: 13.5 },
      ],
      freezeLine:
        "Stop it here. You're the weak-side D and the puck is across the ice. What's your read?",
      narration:
        "They gain your zone down the far side and walk the wall. Your partner steps up on the carrier. But watch the weak side - their winger is sneaking in behind you, creeping to the far post right off your shoulder.",
    },
  },
  {
    id: 'breakout-pass',
    zone: 'defensive',
    category: 'breakout',
    difficulty: 'rookie',
    title: 'Breakout Pass',
    setup: 'You win the puck below the goal line. Your winger is open on the wall.',
    kind: 'mcq',
    options: [
      {
        text: 'Soft saucer to the winger',
        correct: false,
        feedback: 'A soft pass invites a pick. Hard tape makes the play.',
        trap: 'Saucer is sexy, but flat hard passes win breakouts.',
      },
      {
        text: 'Hard pass on the tape, then move your feet',
        correct: true,
        feedback:
          'Hard tape pass + skating support = clean exit and you become an option again.',
      },
      {
        text: 'Skate it up yourself',
        correct: false,
        feedback: 'You skate into the forecheck. Puck dies on the wall.',
        trap: 'Confidence is good. Tunnel vision is not.',
      },
    ],
    coachCue: 'Pass hard. Hit tape. Then move.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 48, y: 90, label: 'D' },
        { id: 'w', team: 'home', x: 18, y: 72, label: 'W' },
        { id: 'f1', team: 'away', x: 60, y: 80, label: 'F' },
      ],
      puck: { x: 48, y: 90 },
      arrows: [{ fromX: 48, fromY: 90, toX: 18, toY: 72 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 52, y: 70 }, w: { x: 30, y: 52 }, f1: { x: 55, y: 42 } },
          puck: { x: 70, y: 48 },
          narration: 'They dump it in on your side and change lines.',
        },
        {
          t: 4,
          players: { d: { x: 56, y: 82 }, w: { x: 24, y: 62 }, f1: { x: 58, y: 60 } },
          puck: { x: 74, y: 82 },
          narration: 'You wheel back to pick it up — one forechecker on the chase.',
        },
        {
          t: 8,
          players: { d: { x: 52, y: 91 }, w: { x: 19, y: 68 }, f1: { x: 59, y: 72 } },
          puck: { x: 58, y: 94 },
          narration: 'You win the race below the goal line and get it on your stick.',
        },
        {
          t: 11.5,
          players: { d: { x: 48, y: 90 }, w: { x: 18, y: 72 }, f1: { x: 60, y: 80 } },
          puck: { x: 48, y: 90 },
          narration: 'Your winger posts up on the wall — the forechecker is closing...',
        },
        { t: 13 },
      ],
      freezeLine:
        "Hold it there. You've got the puck and one beat to make a play. What is it?",
      narration:
        "They dump it in on your side and change lines. You wheel back with one forechecker on the chase and win the race below the goal line. Puck's on your stick, your winger posts up on the wall, and the forechecker is closing.",
    },
  },
  {
    id: 'net-front',
    zone: 'defensive',
    category: 'coverage',
    difficulty: 'varsity',
    title: 'Net Front Battle',
    setup: 'Shot is incoming. Forward is parked at the top of the crease.',
    kind: 'mcq',
    options: [
      {
        text: 'Cross-check him hard from behind',
        correct: false,
        feedback: "Penalty. Power play against. Don't do it.",
        trap: 'Physical is fine. Dumb is not.',
      },
      {
        text: 'Tie up his stick first, then body him',
        correct: true,
        feedback: 'Stick neutralized = no tip, no rebound. Body second seals the box-out.',
      },
      {
        text: 'Body him hard, ignore his stick',
        correct: false,
        feedback: 'His stick is free. Tip goal or rebound goal.',
        trap: 'Strength matters, but the stick scores the goal.',
      },
      {
        text: 'Stand in front of the goalie',
        correct: false,
        feedback: 'You screen your own goalie. Worst-case outcome.',
        trap: 'Position matters — wrong position is worse than none.',
      },
    ],
    coachCue: 'Stick first. Always.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 48, y: 78, label: 'D' },
        { id: 'fwd', team: 'away', x: 50, y: 82, label: 'F' },
        { id: 'g', team: 'home', x: 50, y: 92, label: 'G' },
        { id: 'shooter', team: 'away', x: 30, y: 65, label: 'F' },
      ],
      puck: { x: 30, y: 65 },
      arrows: [{ fromX: 30, fromY: 65, toX: 50, toY: 90, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            shooter: { x: 14, y: 80 },
            fwd: { x: 42, y: 68 },
            d: { x: 44, y: 72 },
            g: { x: 48, y: 93 },
          },
          puck: { x: 14, y: 80 },
          narration: 'They work it low on the half-wall in your end.',
        },
        {
          t: 4,
          players: { shooter: { x: 22, y: 72 }, fwd: { x: 46, y: 75 }, d: { x: 46, y: 75 } },
          puck: { x: 22, y: 72 },
          narration: 'Their shooter walks off the wall — the big winger heads for your crease.',
        },
        {
          t: 8,
          players: {
            shooter: { x: 28, y: 67 },
            fwd: { x: 49, y: 80 },
            d: { x: 47, y: 77 },
            g: { x: 49, y: 92 },
          },
          puck: { x: 28, y: 67 },
          narration: 'He parks at the top of the paint, right on your goalie.',
        },
        {
          t: 11.5,
          players: {
            shooter: { x: 30, y: 65 },
            fwd: { x: 50, y: 82 },
            d: { x: 48, y: 78 },
            g: { x: 50, y: 92 },
          },
          puck: { x: 30, y: 65 },
          narration: "The shooter's winding up — shot is coming through...",
        },
        { t: 13 },
      ],
      freezeLine: "Hold it. You've got the net-front man. What's the play?",
      narration:
        "They work it low on the half-wall in your end. Their shooter walks off the wall while the big winger heads for your crease and parks right on your goalie. The shooter's winding up, and the shot is coming through.",
    },
  },
  {
    id: 'tap-defensive-stance',
    zone: 'defensive',
    category: 'positioning',
    difficulty: 'elite',
    title: 'Where Do You Stand?',
    setup: 'Puck is on the wall, opposite side. Tap the spot on the ice where you should be.',
    kind: 'tap',
    tapTargets: [
      {
        x: 50,
        y: 80,
        radius: 9,
        correct: true,
        feedback: 'Slot. Goal-side. Stick in the lane. This is "the house."',
        label: 'The House',
      },
      {
        x: 25,
        y: 78,
        radius: 9,
        correct: false,
        feedback: "You doubled-up on the puck side. Slot is empty — that's the goal.",
        label: 'Puck side',
      },
      {
        x: 75,
        y: 70,
        radius: 9,
        correct: false,
        feedback: 'Way too far from the net. Back-door tap-in available.',
        label: 'High far-side',
      },
      {
        x: 55,
        y: 92,
        radius: 9,
        correct: false,
        feedback: "Crease-hugging. You're screening your goalie.",
        label: 'Crease',
      },
    ],
    coachCue: 'Protect the house.',
    visual: {
      rinkZone: 'defensive',
      youId: 'you',
      players: [
        { id: 'puck-c', team: 'away', x: 18, y: 78, label: 'F' },
        { id: 'partner', team: 'home', x: 22, y: 78, label: 'D' },
        { id: 'you', team: 'home', x: 72, y: 84, label: 'D' },
        { id: 'g', team: 'home', x: 50, y: 95, label: 'G' },
      ],
      puck: { x: 18, y: 78 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            'puck-c': { x: 15, y: 48 },
            partner: { x: 30, y: 55 },
            you: { x: 62, y: 42 },
            g: { x: 50, y: 94 },
          },
          puck: { x: 15, y: 48 },
          narration: 'They control the entry wide on the far side.',
        },
        {
          t: 4,
          players: {
            'puck-c': { x: 12, y: 64 },
            partner: { x: 25, y: 68 },
            you: { x: 66, y: 62 },
          },
          puck: { x: 12, y: 64 },
          narration: 'The carrier drives down the far wall — your partner tracks him.',
        },
        {
          t: 8,
          players: {
            'puck-c': { x: 16, y: 74 },
            partner: { x: 22, y: 75 },
            you: { x: 70, y: 76 },
          },
          puck: { x: 16, y: 74 },
          narration: 'He pulls up on the half-wall, head up, surveying.',
        },
        {
          t: 11.5,
          players: {
            'puck-c': { x: 18, y: 78 },
            partner: { x: 22, y: 78 },
            you: { x: 72, y: 84 },
            g: { x: 50, y: 95 },
          },
          puck: { x: 18, y: 78 },
          narration: "Puck's on the far wall, opposite side from you...",
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze it. Tap the spot on the ice where you need to be.',
      narration:
        "They control the entry wide on the far side and drive down the wall. Your partner tracks the carrier, who pulls up on the half-wall with his head up. The puck's on the far wall, opposite side from you.",
    },
  },
];
