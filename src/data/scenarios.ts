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
      players: [{ id: 'd', team: 'home', x: 60, y: 30, label: 'D' }],
      puck: { x: 60, y: 30 },
      arrows: [{ fromX: 60, fromY: 30, toX: 50, toY: 30, dashed: true }],
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
  },
];
