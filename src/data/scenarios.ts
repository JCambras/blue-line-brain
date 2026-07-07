import type { Scenario, Difficulty } from '@/types';

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
      {
        text: 'Throw it blindly up the boards',
        correct: false,
        feedback: 'Coin flip. Coaches call this "hope hockey."',
        trap: 'Glass-and-out feels safe, but it gives the puck back half the time.',
      },
    ],
    coachCue: 'Scan early. Know pressure before first touch.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 50, y: 88, label: 'D' },
        { id: 'f1', team: 'away', x: 42, y: 78, label: 'F' },
        { id: 'w', team: 'home', x: 22, y: 75, label: 'W' },
      ],
      puck: { x: 60, y: 92 },
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
          puck: { x: 16, y: 82 },
          narration: "It's rolling around the boards behind your net.",
        },
        {
          t: 7,
          players: { d: { x: 50, y: 84 }, f1: { x: 38, y: 71 }, w: { x: 23, y: 71 } },
          puck: { x: 38, y: 95 },
          narration: "You're first man back — their forechecker is coming in hard.",
        },
        {
          t: 11,
          players: { d: { x: 50, y: 88 }, f1: { x: 42, y: 78 }, w: { x: 22, y: 75 } },
          puck: { x: 60, y: 92 },
          narration: 'The puck settles behind the net, pressure closing fast...',
        },
        { t: 12.5 },
      ],
      freezeLine:
        "Let's stop it right there. You're the D going back for that puck. What do you do?",
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
      {
        text: 'Rim it around the boards blindly',
        correct: false,
        feedback: "You had a play. Rims are for when you don't.",
        trap: 'Rims are a tool — not a default.',
      },
    ],
    coachCue: 'Pass hard. Hit tape. Then move.',
    visual: {
      rinkZone: 'defensive',
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
    },
  },
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
          narration: "You're backing up — your partner is even with you.",
        },
        {
          t: 11.5,
          players: { f: { x: 38, y: 38 }, d1: { x: 40, y: 60 }, d2: { x: 60, y: 60 } },
          puck: { x: 38, y: 38 },
          narration: "He's attacking your blue line right now...",
        },
        { t: 13 },
      ],
      freezeLine: "Freeze. You're the strong-side D. How do you play him?",
    },
  },
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
      freezeLine: "Freeze it. Puck's on your backhand. Quick — what do you do?",
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
          narration: "Turnover at their blue line — they're off the other way!",
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
          narration: 'They cross center with speed — carrier left, trailer wide right.',
        },
        {
          t: 11.5,
          players: { a1: { x: 35, y: 45 }, a2: { x: 65, y: 45 }, d: { x: 50, y: 65 } },
          puck: { x: 35, y: 45 },
          narration: "It's a clean two-on-one bearing down on you...",
        },
        { t: 13 },
      ],
      freezeLine: 'Stop it there. Two on one, your goalie is set. What do you take away?',
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
  // -------- Tap-the-ice scenario --------
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
      players: [
        { id: 'puck-c', team: 'away', x: 18, y: 78, label: 'F' },
        { id: 'partner', team: 'home', x: 22, y: 78, label: 'D' },
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
            g: { x: 50, y: 94 },
          },
          puck: { x: 15, y: 48 },
          narration: 'They control the entry wide on the far side.',
        },
        {
          t: 4,
          players: { 'puck-c': { x: 12, y: 64 }, partner: { x: 25, y: 68 } },
          puck: { x: 12, y: 64 },
          narration: 'The carrier drives down the far wall — your partner tracks him.',
        },
        {
          t: 8,
          players: { 'puck-c': { x: 16, y: 74 }, partner: { x: 22, y: 75 } },
          puck: { x: 16, y: 74 },
          narration: 'He pulls up on the half-wall, head up, surveying.',
        },
        {
          t: 11.5,
          players: {
            'puck-c': { x: 18, y: 78 },
            partner: { x: 22, y: 78 },
            g: { x: 50, y: 95 },
          },
          puck: { x: 18, y: 78 },
          narration: "Puck's on the far wall, opposite side from you...",
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze it. Tap the spot on the ice where you need to be.',
    },
  },
];
