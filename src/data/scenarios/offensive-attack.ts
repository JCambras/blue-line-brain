import type { Scenario } from '@/types';

export const OFFENSIVE_ATTACK_SCENARIOS: Scenario[] = [
  // ---------- ROOKIE ----------
  {
    id: 'oa-trailer-lane',
    zone: 'offensive',
    category: 'rush-offense',
    difficulty: 'rookie',
    title: 'Fill the Trailer Lane',
    setup: 'You jump into the rush as the fourth attacker. Your winger carries it wide.',
    kind: 'tap',
    tapTargets: [
      {
        x: 48,
        y: 25,
        radius: 7,
        correct: true,
        label: 'High slot',
        feedback:
          'The trailer lane. You arrive late, with speed, into soft ice - the pass everyone forgets to defend.',
      },
      {
        x: 54,
        y: 10,
        radius: 7,
        correct: false,
        label: 'Crease',
        feedback:
          "Your center is already driving there. Two of you in the paint means one checker covers both.",
      },
      {
        x: 82,
        y: 24,
        radius: 8,
        correct: false,
        label: 'Far wall',
        feedback:
          'The far wall is dead ice. The carrier cannot see you there and neither can the play.',
      },
      {
        x: 70,
        y: 35,
        radius: 7,
        correct: false,
        label: 'Blue line',
        feedback:
          "Parking at the line adds nothing. If you join the rush, join it - fill a lane with speed.",
      },
    ],
    coachCue: 'Fill the middle lane, late with speed.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 55, y: 36, label: 'D' },
        { id: 'w', team: 'home', x: 18, y: 24, label: 'W' },
        { id: 'c', team: 'home', x: 45, y: 18, label: 'C' },
        { id: 'd1', team: 'away', x: 40, y: 26, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 18, y: 24 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 52, y: 62 },
            w: { x: 30, y: 60 },
            c: { x: 48, y: 58 },
            d1: { x: 42, y: 40 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 30, y: 60 },
          narration: 'Your winger picks up speed through the neutral zone.',
        },
        {
          t: 3.5,
          players: {
            w: { x: 24, y: 44 },
            c: { x: 46, y: 42 },
            d: { x: 54, y: 52 },
            d1: { x: 41, y: 34 },
          },
          puck: { x: 24, y: 44 },
          narration: 'He carries it wide - your center drives the middle with him.',
        },
        {
          t: 7,
          players: {
            w: { x: 20, y: 32 },
            c: { x: 45, y: 28 },
            d: { x: 55, y: 44 },
            d1: { x: 40, y: 29 },
          },
          puck: { x: 20, y: 32 },
          narration: 'They hit the line with speed - you jump up as the fourth man.',
        },
        {
          t: 11,
          players: {
            w: { x: 18, y: 24 },
            c: { x: 45, y: 18 },
            d: { x: 55, y: 36 },
            d1: { x: 40, y: 26 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 18, y: 24 },
          narration: "The winger gains the zone and their D backs off - there's open ice in the middle...",
        },
        { t: 12.5 },
      ],
      freezeLine: "Freeze it. You're the D joining the rush. Tap the ice you should fill.",
    },
  },
  {
    id: 'oa-entry-clogged',
    zone: 'offensive',
    category: 'entry',
    difficulty: 'rookie',
    title: 'Clogged Blue Line',
    setup: 'You carry through center, but their whole line is standing up at the blue line.',
    kind: 'mcq',
    options: [
      {
        text: 'Stickhandle through the middle of their line',
        correct: false,
        feedback:
          'A turnover at the line is the worst turnover in hockey. Three of them, one of you.',
        trap: 'Beating one guy feels great. Beating three never happens.',
      },
      {
        text: 'Chip it soft behind their D for your winger',
        correct: true,
        feedback:
          "Their line is flat-footed at the blue. The chip turns your winger's speed into a race he wins.",
      },
      {
        text: 'Turn back and regroup with your partner',
        correct: false,
        feedback:
          'Your winger had speed. Turning back kills the rush and lets them change lines.',
        trap: 'Regroups are smart - but not when a teammate is flying.',
      },
    ],
    coachCue: 'Clogged line? Chip it to space.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 58, y: 38, label: 'D' },
        { id: 'w', team: 'home', x: 25, y: 36, label: 'W' },
        { id: 'd1', team: 'away', x: 45, y: 30, label: 'D' },
        { id: 'd2', team: 'away', x: 62, y: 30, label: 'D' },
        { id: 'f1', team: 'away', x: 52, y: 34, label: 'F' },
      ],
      puck: { x: 58, y: 38 },
      arrows: [{ fromX: 25, fromY: 36, toX: 24, toY: 28 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 55, y: 70 },
            w: { x: 25, y: 62 },
            d1: { x: 45, y: 42 },
            d2: { x: 62, y: 42 },
            f1: { x: 52, y: 48 },
          },
          puck: { x: 55, y: 70 },
          narration: 'You pick up the puck and skate it out of your own zone.',
        },
        {
          t: 3.5,
          players: { d: { x: 56, y: 58 }, w: { x: 25, y: 50 }, f1: { x: 52, y: 42 } },
          puck: { x: 56, y: 58 },
          narration: "You've got speed through center - their forward angles toward you.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 57, y: 46 },
            w: { x: 25, y: 42 },
            d1: { x: 45, y: 34 },
            d2: { x: 62, y: 34 },
            f1: { x: 52, y: 37 },
          },
          puck: { x: 57, y: 46 },
          narration: 'Look at their blue line - three defenders standing up shoulder to shoulder.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 58, y: 38 },
            w: { x: 25, y: 36 },
            d1: { x: 45, y: 30 },
            d2: { x: 62, y: 30 },
            f1: { x: 52, y: 34 },
          },
          puck: { x: 58, y: 38 },
          narration: "You're two strides from the line, your winger is flying wide, and the wall is set...",
        },
        { t: 13 },
      ],
      freezeLine: 'Hold it there. The line is clogged. What do you do with the puck?',
    },
  },
  {
    id: 'oa-corner-walkout',
    zone: 'offensive',
    category: 'cycle',
    difficulty: 'rookie',
    title: 'Walk Out of the Corner',
    setup: 'Your pinch won the puck in the corner. You have a step on the beaten winger.',
    kind: 'mcq',
    options: [
      {
        text: 'Walk out toward the net, puck protected',
        correct: true,
        feedback:
          'You beat him once - keep going. Puck on your far hip, walk out, and make the goalie honor you.',
      },
      {
        text: 'Throw it blind into the slot',
        correct: false,
        feedback: 'Blind passes into the slot get picked off and go the other way in a hurry.',
        trap: 'The slot is where goals live - but only if you look first.',
      },
      {
        text: 'Rim it back around to the point',
        correct: false,
        feedback: 'You just won it low. Rimming it high resets all the pressure you created.',
        trap: 'Getting it back to the point feels safe. It is also a surrender.',
      },
    ],
    coachCue: 'Win the wall, then attack off it.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 78, y: 18, label: 'D' },
        { id: 'f1', team: 'away', x: 84, y: 24, label: 'F' },
        { id: 'c', team: 'home', x: 55, y: 14, label: 'C' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 78, y: 18 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 80, y: 34 },
            f1: { x: 86, y: 14 },
            c: { x: 58, y: 20 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 86, y: 14 },
          narration: 'Their winger tries to skate the puck out of the corner, up your wall.',
        },
        {
          t: 3.5,
          players: { d: { x: 81, y: 27 }, f1: { x: 85, y: 20 } },
          puck: { x: 85, y: 20 },
          narration: 'You pinch down the boards to cut him off.',
        },
        {
          t: 7,
          players: { d: { x: 82, y: 22 }, f1: { x: 84, y: 23 }, c: { x: 56, y: 17 } },
          puck: { x: 83, y: 23 },
          narration: 'You get there first and pin him - the puck squirts free along the wall.',
        },
        {
          t: 11,
          players: {
            d: { x: 78, y: 18 },
            f1: { x: 84, y: 24 },
            c: { x: 55, y: 14 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 78, y: 18 },
          narration: 'You come out of the battle with it, a step ahead of the man you just beat...',
        },
        { t: 12.5 },
      ],
      freezeLine: "Stop the tape. You won the pinch. What's next?",
    },
  },
  {
    id: 'oa-rush-pullup',
    zone: 'offensive',
    category: 'rush-offense',
    difficulty: 'rookie',
    title: 'No Support, No Shot',
    setup: 'You led the rush alone off a steal. Your forwards are changing behind you.',
    kind: 'mcq',
    options: [
      {
        text: 'Rip a shot from the bad angle',
        correct: false,
        feedback: 'A bad-angle shot with nobody at the net is a free breakout for them.',
        trap: "You skated all that way, so a shot feels earned. It isn't.",
      },
      {
        text: 'Drive the net one on one',
        correct: false,
        feedback:
          "One against a set defender ends in a corner scrum - and you're the D, way out of position.",
        trap: 'Attacking the net is usually right. Alone, with no backup, it is a donation.',
      },
      {
        text: 'Pull up on the wall, wait for support',
        correct: true,
        feedback:
          'Pulling up freezes the defender and buys the seconds your fresh forwards need to join.',
      },
    ],
    coachCue: 'No support means pull up, not shoot.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 20, y: 22, label: 'D' },
        { id: 'd1', team: 'away', x: 35, y: 18, label: 'D' },
        { id: 'f1', team: 'away', x: 40, y: 34, label: 'F' },
        { id: 'w', team: 'home', x: 55, y: 44, label: 'W' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 20, y: 22 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 30, y: 60 },
            d1: { x: 42, y: 40 },
            f1: { x: 55, y: 55 },
            w: { x: 58, y: 70 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 30, y: 60 },
          narration: 'You strip the puck at center ice and take off up the left side.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 25, y: 46 },
            d1: { x: 40, y: 32 },
            f1: { x: 50, y: 48 },
            w: { x: 57, y: 62 },
          },
          puck: { x: 25, y: 46 },
          narration: "Your tired forwards head for a change - you're leading this rush alone.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 22, y: 32 },
            d1: { x: 37, y: 24 },
            f1: { x: 45, y: 42 },
            w: { x: 56, y: 52 },
          },
          puck: { x: 22, y: 32 },
          narration: 'You gain the line wide, and one defender steers you toward the corner.',
        },
        {
          t: 11,
          players: {
            d: { x: 20, y: 22 },
            d1: { x: 35, y: 18 },
            f1: { x: 40, y: 34 },
            w: { x: 55, y: 44 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 20, y: 22 },
          narration: "You're running out of room on the wall, and fresh legs are only now hopping on...",
        },
        { t: 12.5 },
      ],
      freezeLine: "Freeze. You're all alone on the wall. What's the play?",
    },
  },

  // ---------- VARSITY ----------
  {
    id: 'oa-two-on-one-carry',
    zone: 'offensive',
    category: 'rush-offense',
    difficulty: 'varsity',
    title: 'D on a 2-on-1',
    setup: "You're the puck carrier on a 2-on-1. Their lone D slides toward the pass lane.",
    kind: 'mcq',
    options: [
      {
        text: 'Force the pass through his stick',
        correct: false,
        feedback: "That's exactly what he wants. The sliding D eats it and play goes the other way.",
        trap: "The 2-on-1 pass is the highlight play - but he's already taken it away.",
      },
      {
        text: 'Slow up and wait for a trailer',
        correct: false,
        feedback: 'Slowing down on a 2-on-1 lets the backcheck erase your numbers.',
        trap: 'Patience is a tool. Odd-man rushes have an expiry date.',
      },
      {
        text: 'Toe-drag around the sliding D',
        correct: false,
        feedback: "He's sliding with his stick extended - the dangle gets poked off your blade.",
        trap: "One move and it's a breakaway - except he's positioned exactly for that move.",
      },
      {
        text: 'Shoot - the D took the pass away',
        correct: true,
        feedback: 'Right read. When the D commits to the lane, the shot is yours. Pick a corner.',
      },
    ],
    coachCue: 'D slides to the pass? Shoot it.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 38, y: 22, label: 'D' },
        { id: 'w', team: 'home', x: 65, y: 20, label: 'W' },
        { id: 'd1', team: 'away', x: 52, y: 18, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 38, y: 22 },
      highlights: [{ x: 52, y: 18, radius: 6 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 45, y: 55 },
            w: { x: 68, y: 52 },
            d1: { x: 50, y: 38 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 45, y: 55 },
          narration: 'Turnover at center - you and your winger break out two on one.',
        },
        {
          t: 3.5,
          players: { d: { x: 42, y: 42 }, w: { x: 67, y: 40 }, d1: { x: 51, y: 30 } },
          puck: { x: 42, y: 42 },
          narration: 'You carry it over the line with your winger wide right.',
        },
        {
          t: 7.5,
          players: { d: { x: 40, y: 30 }, w: { x: 66, y: 28 }, d1: { x: 52, y: 24 } },
          puck: { x: 40, y: 30 },
          narration: 'The lone defender backpedals, reading your eyes.',
        },
        {
          t: 11,
          players: {
            d: { x: 38, y: 22 },
            w: { x: 65, y: 20 },
            d1: { x: 52, y: 18 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 38, y: 22 },
          narration: 'Now he commits - he slides across to take away the pass...',
        },
        { t: 12.5 },
      ],
      freezeLine: 'Freeze it right there. The D just slid. Shot or pass?',
    },
  },
  {
    id: 'oa-backdoor-cycle',
    zone: 'offensive',
    category: 'cycle',
    difficulty: 'varsity',
    title: 'Back-Door Ghost',
    setup: "You're the weak-side D on the cycle. Their high forward is glued to the puck.",
    kind: 'mcq',
    options: [
      {
        text: 'Slide down the weak side to the back post',
        correct: true,
        feedback: 'Their high forward lost you. Arrive as the pass does - tap-in city.',
      },
      {
        text: 'Stay at the point and call for it',
        correct: false,
        feedback: "From the point you're a shot into shin pads. The open ice is at the post.",
        trap: 'The point is home base for a D - but the cycle just bought you a free lane.',
      },
      {
        text: 'Sneak halfway down and stop in the circle',
        correct: false,
        feedback: 'The circle is covered ice the second anyone turns around. Go all the way or stay.',
        trap: 'Splitting the difference feels safe. It just makes you easy to find.',
      },
      {
        text: 'Crash the corner to help the battle',
        correct: false,
        feedback: "Your winger already has it. You'd add a body where none is needed and vacate the line.",
        trap: 'Helping the battle feels like work ethic. Here it is just crowding.',
      },
    ],
    coachCue: 'When they puck-watch, ghost the back door.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 32, y: 30, label: 'D' },
        { id: 'w1', team: 'home', x: 80, y: 16, label: 'W' },
        { id: 'f1', team: 'away', x: 83, y: 19, label: 'F' },
        { id: 'f2', team: 'away', x: 48, y: 27, label: 'F' },
        { id: 'g', team: 'away', x: 55, y: 8, label: 'G' },
      ],
      puck: { x: 80, y: 16 },
      highlights: [{ x: 48, y: 27, radius: 6 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 35, y: 33 },
            w1: { x: 85, y: 25 },
            f1: { x: 80, y: 30 },
            f2: { x: 50, y: 30 },
            g: { x: 52, y: 8 },
          },
          puck: { x: 85, y: 25 },
          narration: 'Your winger has it on the right wall, grinding the cycle.',
        },
        {
          t: 3.5,
          players: {
            w1: { x: 82, y: 12 },
            f1: { x: 84, y: 17 },
            f2: { x: 49, y: 28 },
            d: { x: 33, y: 32 },
          },
          puck: { x: 82, y: 12 },
          narration: 'He walks it low - their whole zone shifts with him.',
        },
        {
          t: 7.5,
          players: {
            w1: { x: 74, y: 9 },
            f1: { x: 78, y: 12 },
            f2: { x: 48, y: 27 },
            g: { x: 53, y: 8 },
            d: { x: 32, y: 31 },
          },
          puck: { x: 74, y: 9 },
          narration: "Look at their high forward - eyes glued to the puck, he's lost you completely.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 32, y: 30 },
            w1: { x: 80, y: 16 },
            f1: { x: 83, y: 19 },
            f2: { x: 48, y: 27 },
            g: { x: 55, y: 8 },
          },
          puck: { x: 80, y: 16 },
          narration: 'Your winger curls back up the wall with it, head up, looking for a target...',
        },
        { t: 13 },
      ],
      freezeLine: "Stop it here. You're the weak-side D at the point. Where do you go?",
    },
  },
  {
    id: 'oa-fourth-man-drive',
    zone: 'offensive',
    category: 'rush-offense',
    difficulty: 'varsity',
    title: 'Fourth Man In',
    setup: "Your winger pulls up on the wall off the rush. You're the fourth man at the line.",
    kind: 'mcq',
    options: [
      {
        text: 'Hold the blue line as the safety',
        correct: false,
        feedback:
          "Nobody is threatening a counter - their D is buried low. You're passing up a free chance.",
        trap: 'Staying home is usually right for a D. The freeze says you are the extra attacker.',
      },
      {
        text: 'Skate to the crease and join the screen',
        correct: false,
        feedback: "By the time you get there the moment's gone, and three in the paint is a crowd.",
        trap: 'Net-front is where goals happen - but the open ice is the middle lane, not the paint.',
      },
      {
        text: 'Drive the middle lane late as his outlet',
        correct: true,
        feedback:
          "That's the timing. He pulled up to hit exactly this - fourth man, full speed, into soft ice.",
      },
      {
        text: 'Post up at the far point for a one-timer',
        correct: false,
        feedback: 'The cross-zone pass through four bodies rarely arrives. He needs a lane, not a prayer.',
        trap: 'One-timers are sexy. The seam pass to get you one is not there.',
      },
    ],
    coachCue: 'Winger pulls up - drive the middle late.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 58, y: 34, label: 'D' },
        { id: 'w1', team: 'home', x: 82, y: 20, label: 'W' },
        { id: 'c', team: 'home', x: 52, y: 12, label: 'C' },
        { id: 'd1', team: 'away', x: 56, y: 15, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 82, y: 20 },
      arrows: [{ fromX: 82, fromY: 20, toX: 70, toY: 26, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            w1: { x: 80, y: 50 },
            c: { x: 55, y: 48 },
            d1: { x: 58, y: 32 },
            d: { x: 60, y: 62 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 80, y: 50 },
          narration: 'Three of you come through neutral ice with speed.',
        },
        {
          t: 3.5,
          players: {
            w1: { x: 82, y: 36 },
            c: { x: 54, y: 34 },
            d1: { x: 57, y: 24 },
            d: { x: 59, y: 50 },
          },
          puck: { x: 82, y: 36 },
          narration: 'Your winger takes it wide over the line - the center drives hard to the net.',
        },
        {
          t: 7.5,
          players: {
            w1: { x: 83, y: 26 },
            c: { x: 53, y: 18 },
            d1: { x: 56, y: 18 },
            d: { x: 58, y: 42 },
          },
          puck: { x: 83, y: 26 },
          narration: 'Their D collapses with your center - the winger runs out of room on the wall.',
        },
        {
          t: 11,
          players: {
            w1: { x: 82, y: 20 },
            c: { x: 52, y: 12 },
            d1: { x: 56, y: 15 },
            d: { x: 58, y: 34 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 82, y: 20 },
          narration: 'He pulls up on the wall and looks back for a late man...',
        },
        { t: 12.5 },
      ],
      freezeLine: "Freeze. You're the fourth man over the line. What's your move?",
    },
  },
  {
    id: 'oa-faceoff-quick-shot',
    zone: 'offensive',
    category: 'attack',
    difficulty: 'varsity',
    title: 'Off the Draw',
    setup: 'Offensive-zone draw. Your center wins it clean back to your point.',
    kind: 'mcq',
    options: [
      {
        text: 'Settle it, take a look, then decide',
        correct: false,
        feedback:
          'The half second you spend settling is the half second their winger needs to fill your lane.',
        trap: 'Composure is a virtue - but the draw bought you a lane with a shelf life.',
      },
      {
        text: 'One-touch a low shot through the tie-up',
        correct: true,
        feedback:
          'The puck came back flat and their winger is still stuck on the wall. Shoot before the lane closes.',
      },
      {
        text: 'Walk to the middle for a better angle',
        correct: false,
        feedback: 'The walk invites the release winger right into you. The lane exists now, at this angle.',
        trap: 'A better angle sounds smarter. It trades a real lane for a maybe.',
      },
      {
        text: 'Slide it across to your partner',
        correct: false,
        feedback: 'Every pass gives their box time to form. The set play was designed for your stick.',
        trap: 'D-to-D is the standard reset. A won draw is not a reset.',
      },
    ],
    coachCue: 'Clean win, fresh lane - shoot it now.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 36, y: 30, label: 'D' },
        { id: 'c', team: 'home', x: 30, y: 19, label: 'C' },
        { id: 'c1', team: 'away', x: 30, y: 17, label: 'C' },
        { id: 'w1', team: 'away', x: 22, y: 24, label: 'F' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 36, y: 30 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 36, y: 31 },
            c: { x: 30, y: 18 },
            c1: { x: 30, y: 16 },
            w1: { x: 22, y: 22 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 30, y: 17 },
          narration: "Offensive-zone draw at the left dot - you're set up top at the point.",
        },
        {
          t: 4,
          players: { c: { x: 30, y: 18.5 }, c1: { x: 30, y: 16.5 }, w1: { x: 22, y: 23 } },
          puck: { x: 31, y: 19 },
          narration: 'The puck drops - your center jams the draw and wins it clean!',
        },
        {
          t: 7.5,
          players: { w1: { x: 22, y: 23.5 }, d: { x: 36, y: 30.5 } },
          puck: { x: 34, y: 26 },
          narration: 'It skids back flat toward your tape - their winger still tied to the wall.',
        },
        {
          t: 11,
          players: {
            d: { x: 36, y: 30 },
            c: { x: 30, y: 19 },
            c1: { x: 30, y: 17 },
            w1: { x: 22, y: 24 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 36, y: 30 },
          narration: "It's on your blade, the centers are still tangled, and the lane is wide open...",
        },
        { t: 12.5 },
      ],
      freezeLine: 'Freeze. The win is on your stick. Shoot or settle?',
    },
  },

  // ---------- ELITE ----------
  {
    id: 'oa-cycle-keep-alive',
    zone: 'offensive',
    category: 'cycle',
    difficulty: 'elite',
    title: 'Keep the Cycle Alive',
    setup: 'You pinched down to keep the cycle. Pressure closes and the slot is packed.',
    kind: 'mcq',
    options: [
      {
        text: 'Wheel to the middle and shoot through the box',
        correct: false,
        feedback:
          'Four shin pads and a set goalie. Blocked shot, and the counter goes with you caught low.',
        trap: 'You worked for this touch - but the freeze shows zero net to shoot at.',
      },
      {
        text: 'Throw it to the net-front for a tip',
        correct: false,
        feedback:
          "Their D owns inside position at the crease. It's a 50-50 at best, with you out of position after.",
        trap: 'Get pucks to the net - unless the net-front is theirs. It is.',
      },
      {
        text: 'Hold it and protect until help comes',
        correct: false,
        feedback: 'Their winger is two strides away. Holding gets you crunched and stripped.',
        trap: 'Strong on the wall is a real skill. The clock on this touch is already at zero.',
      },
      {
        text: 'Bump it low to your center, keep the cycle',
        correct: true,
        feedback:
          'The pro play. The bump beats the charge, keeps possession, and re-opens the slot in two seconds.',
      },
    ],
    coachCue: 'Keep the cycle alive under pressure.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 82, y: 20, label: 'D' },
        { id: 'c', team: 'home', x: 86, y: 10, label: 'C' },
        { id: 'f1', team: 'away', x: 75, y: 25, label: 'F' },
        { id: 'd1', team: 'away', x: 63, y: 15, label: 'D' },
        { id: 'g', team: 'away', x: 52, y: 8, label: 'G' },
      ],
      puck: { x: 82, y: 20 },
      arrows: [{ fromX: 75, fromY: 25, toX: 80, toY: 21 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 80, y: 33 },
            c: { x: 88, y: 18 },
            f1: { x: 70, y: 18 },
            d1: { x: 60, y: 12 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 88, y: 18 },
          narration: 'Your center works the puck low on the right wall.',
        },
        {
          t: 3.5,
          players: {
            c: { x: 89, y: 11 },
            f1: { x: 78, y: 14 },
            d: { x: 80, y: 30 },
            d1: { x: 61, y: 13 },
          },
          puck: { x: 89, y: 11 },
          narration: 'He grinds it toward the goal line with a checker on his hip.',
        },
        {
          t: 7,
          players: {
            c: { x: 87, y: 10 },
            d: { x: 81, y: 25 },
            f1: { x: 77, y: 19 },
            g: { x: 51, y: 8 },
          },
          puck: { x: 84, y: 17 },
          narration: 'He bumps it up the wall - you pinch down to meet it.',
        },
        {
          t: 11,
          players: {
            d: { x: 82, y: 20 },
            c: { x: 86, y: 10 },
            f1: { x: 75, y: 25 },
            d1: { x: 63, y: 15 },
            g: { x: 52, y: 8 },
          },
          puck: { x: 82, y: 20 },
          narration:
            "You've got it on the half wall - their winger charges, the slot is packed, the goalie is square...",
        },
        { t: 12.5 },
      ],
      freezeLine: 'Stop it there. Pressure is coming. Force it or keep it alive?',
    },
  },
  {
    id: 'oa-stay-high-safety',
    zone: 'offensive',
    category: 'rush-offense',
    difficulty: 'elite',
    title: 'The Adult in the Room',
    setup: 'The rush is on and your legs want to join as the extra attacker.',
    kind: 'mcq',
    options: [
      {
        text: "Stay at the line - you're the last man",
        correct: true,
        feedback:
          'Right read. Your partner already jumped and their sniper is loitering behind you. Be the adult.',
      },
      {
        text: 'Join - numbers up wins hockey games',
        correct: false,
        feedback:
          "Count again: your partner is already the fourth man. You'd make five up with a cherry-picker behind everyone.",
        trap: 'Numbers up is usually right - but the extra man already went, and it was not you.',
      },
      {
        text: 'Jump, but only to the top of the circles',
        correct: false,
        feedback:
          'Halfway in, you cannot shoot and cannot defend. If their winger takes off, you lose the race.',
        trap: 'Splitting the difference feels balanced. It means late to both jobs.',
      },
      {
        text: 'Call your partner back and jump yourself',
        correct: false,
        feedback: "By the time he hears you, the play's over. Manage the rush that exists.",
        trap: "Maybe you are the better shooter. The rush doesn't care.",
      },
    ],
    coachCue: 'Partner jumps, you stay. One D home.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 62, y: 34, label: 'D' },
        { id: 'p', team: 'home', x: 55, y: 20, label: 'D' },
        { id: 'w1', team: 'home', x: 30, y: 15, label: 'W' },
        { id: 'd1', team: 'away', x: 40, y: 18, label: 'D' },
        { id: 'w2', team: 'away', x: 58, y: 55, label: 'F' },
      ],
      puck: { x: 30, y: 15 },
      highlights: [{ x: 58, y: 55, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            w1: { x: 35, y: 55 },
            p: { x: 50, y: 45 },
            d: { x: 60, y: 58 },
            d1: { x: 42, y: 35 },
            w2: { x: 62, y: 60 },
          },
          puck: { x: 35, y: 55 },
          narration: 'Your winger leads the rush through center, and your partner takes off with him.',
        },
        {
          t: 3.5,
          players: {
            w1: { x: 32, y: 40 },
            p: { x: 52, y: 33 },
            d: { x: 61, y: 47 },
            d1: { x: 41, y: 27 },
            w2: { x: 60, y: 57 },
          },
          puck: { x: 32, y: 40 },
          narration: "Your partner goes! He's joining as the fourth man.",
        },
        {
          t: 7.5,
          players: {
            w1: { x: 31, y: 26 },
            p: { x: 54, y: 25 },
            d: { x: 62, y: 40 },
            d1: { x: 40, y: 21 },
            w2: { x: 59, y: 56 },
          },
          puck: { x: 31, y: 26 },
          narration: 'Zone gained - and look behind the play, their sniper is not backchecking.',
        },
        {
          t: 11.5,
          players: {
            w1: { x: 30, y: 15 },
            p: { x: 55, y: 20 },
            d: { x: 62, y: 34 },
            d1: { x: 40, y: 18 },
            w2: { x: 58, y: 55 },
          },
          puck: { x: 30, y: 15 },
          narration: "He's camped near the far line, waiting on a breakaway pass...",
        },
        { t: 13 },
      ],
      freezeLine: "Freeze. Everything in you wants to join. What's the right read?",
    },
  },
  {
    id: 'oa-rebound-pinch',
    zone: 'offensive',
    category: 'attack',
    difficulty: 'elite',
    title: 'Second Chance at the Crease',
    setup: 'Your point shot spits out a fat rebound. The goalie is down.',
    kind: 'mcq',
    options: [
      {
        text: "Hold the point - D don't chase rebounds",
        correct: false,
        feedback:
          "Look again: your center is already rotating high for you, and you're closest to the puck.",
        trap: 'Position discipline is elite. Reading the cover already happening is more elite.',
      },
      {
        text: 'Yell for your center to get it',
        correct: false,
        feedback: 'By the time he turns, the goalie has recovered. Closest man goes.',
        trap: 'Delegating keeps you home. It also donates the chance.',
      },
      {
        text: "Go now - your center has the point",
        correct: true,
        feedback:
          "That's the read. Goalie down, you're closest, and the freeze shows your center already high. Bury it.",
      },
      {
        text: 'Slide to the middle for the next shot',
        correct: false,
        feedback: 'There is no next shot if nobody claims this puck. Loose crease pucks decide games.',
        trap: 'Staying shot-ready sounds right - but the game state is a free goal, not a next shot.',
      },
    ],
    coachCue: "Goalie down, you're closest - go bury it.",
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 55, y: 26, label: 'D' },
        { id: 'c', team: 'home', x: 62, y: 33, label: 'C' },
        { id: 'w1', team: 'away', x: 68, y: 18, label: 'F' },
        { id: 'g', team: 'away', x: 47, y: 9, label: 'G' },
      ],
      puck: { x: 52, y: 12 },
      highlights: [{ x: 62, y: 33, radius: 6 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 58, y: 31 },
            c: { x: 66, y: 20 },
            w1: { x: 66, y: 24 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 58, y: 31 },
          narration: "You've got the puck at the right point with a screen in place.",
        },
        {
          t: 3.5,
          players: {
            d: { x: 57, y: 29 },
            c: { x: 64, y: 22 },
            w1: { x: 66, y: 23 },
            g: { x: 48, y: 8 },
          },
          puck: { x: 50, y: 8 },
          narration: 'You let a low wrister go through the bodies - the goalie kicks it out!',
        },
        {
          t: 6.5,
          players: {
            d: { x: 56, y: 28 },
            c: { x: 63, y: 26 },
            w1: { x: 67, y: 21 },
            g: { x: 47, y: 9 },
          },
          puck: { x: 52, y: 12 },
          narration: 'A fat rebound sits at the top of the crease - the goalie is down and scrambling.',
        },
        {
          t: 10,
          players: { d: { x: 55.5, y: 27 }, c: { x: 62, y: 30 }, w1: { x: 68, y: 19 } },
          puck: { x: 52, y: 12 },
          narration: 'Your center peels high to cover the point behind you.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 55, y: 26 },
            c: { x: 62, y: 33 },
            w1: { x: 68, y: 18 },
            g: { x: 47, y: 9 },
          },
          puck: { x: 52, y: 12 },
          narration: "Nobody has claimed it - you're the closest man to a wide-open net...",
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze right there. The rebound is sitting. Do you go?',
    },
  },
];
