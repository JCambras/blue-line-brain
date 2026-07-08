import type { Scenario } from '@/types';

export const NEUTRAL_TRANSITION_SCENARIOS: Scenario[] = [
  // ---------------------------------------------------------- rookie
  {
    id: 'tr-d-to-d-regroup',
    zone: 'neutral',
    category: 'regroup',
    difficulty: 'rookie',
    title: 'D-to-D Regroup',
    setup: 'Your center backs the puck up to you at center ice. A forechecker angles at you.',
    kind: 'mcq',
    options: [
      {
        text: 'Skate it up the same side into the angle',
        correct: false,
        feedback: 'You carry straight into his angle. The puck dies on the wall.',
        trap: 'Moving your feet feels proactive - but his angle is already set.',
      },
      {
        text: 'Slide it D-to-D and change the point of attack',
        correct: true,
        feedback:
          'One pass beats his whole angle. Your partner attacks the open side with time and speed.',
      },
      {
        text: 'Fire it hard off the glass and out',
        correct: false,
        feedback: 'You just gave away the puck your forwards worked to keep.',
        trap: 'Glass-and-out is a panic play. This is a possession moment, not a crisis.',
      },
    ],
    coachCue: 'Regroups change sides. Use your partner.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 32, y: 58, label: 'D' },
        { id: 'd2', team: 'home', x: 62, y: 58, label: 'D' },
        { id: 'c', team: 'home', x: 50, y: 46, label: 'C' },
        { id: 'f1', team: 'away', x: 38, y: 46, label: 'F' },
      ],
      puck: { x: 32, y: 58 },
      arrows: [{ fromX: 32, fromY: 58, toX: 62, toY: 58, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            c: { x: 44, y: 30 },
            d1: { x: 35, y: 62 },
            d2: { x: 60, y: 62 },
            f1: { x: 50, y: 22 },
          },
          puck: { x: 44, y: 30 },
          narration: 'Your center runs out of room at their blue line and turns back.',
        },
        {
          t: 3.5,
          players: {
            c: { x: 46, y: 40 },
            d1: { x: 34, y: 60 },
            d2: { x: 61, y: 60 },
            f1: { x: 46, y: 30 },
          },
          puck: { x: 46, y: 40 },
          narration: 'He backs it up through the middle, looking for a regroup.',
        },
        {
          t: 7,
          players: {
            c: { x: 49, y: 45 },
            d1: { x: 33, y: 59 },
            d2: { x: 61, y: 59 },
            f1: { x: 42, y: 38 },
          },
          puck: { x: 34, y: 59 },
          narration: 'He drops it back to you at center ice.',
        },
        {
          t: 11.5,
          players: {
            c: { x: 50, y: 46 },
            d1: { x: 32, y: 58 },
            d2: { x: 62, y: 58 },
            f1: { x: 38, y: 46 },
          },
          puck: { x: 32, y: 58 },
          narration: 'Their forechecker turns and angles hard at you, taking away the wall...',
        },
        { t: 13 },
      ],
      freezeLine:
        "Freeze it there. You've got the puck at center with a man angling in. What's the play?",
      narration:
        "Your center runs out of room and turns the puck back to you at center ice. Now their forechecker reads it and angles hard, taking away the wall. You've got your partner wide open on the other side, and here comes the pressure.",
    },
  },
  {
    id: 'tr-headman-early',
    zone: 'neutral',
    category: 'transition',
    difficulty: 'rookie',
    title: 'Headman the Puck',
    setup: 'You carry out of your zone. Your winger breaks up ice with speed ahead of you.',
    kind: 'mcq',
    options: [
      {
        text: 'Headman it to the winger now, in stride',
        correct: true,
        feedback:
          'Early puck means he attacks with all his speed. Their D has to back off the whole rush.',
      },
      {
        text: 'Carry it to the red line, then decide',
        correct: false,
        feedback: 'By the red line the lane is gone and the backchecker has caught you.',
        trap: 'Holding it feels safe - but every stride you keep it, his lane shrinks.',
      },
      {
        text: 'Slow up and let the whole line organize',
        correct: false,
        feedback: "You kill your winger's speed and give their trap time to set.",
        trap: "'Set it up' sounds smart. Speed IS the setup.",
      },
    ],
    coachCue: 'Move it early. Speed dies waiting.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 46, y: 62, label: 'D' },
        { id: 'w', team: 'home', x: 30, y: 40, label: 'W' },
        { id: 'f1', team: 'away', x: 54, y: 56, label: 'F' },
        { id: 'ad', team: 'away', x: 36, y: 22, label: 'D' },
      ],
      puck: { x: 46, y: 62 },
      arrows: [{ fromX: 46, fromY: 62, toX: 30, toY: 40, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 54, y: 80 },
            w: { x: 34, y: 66 },
            f1: { x: 60, y: 74 },
            ad: { x: 40, y: 34 },
          },
          puck: { x: 54, y: 80 },
          narration: 'You strip it clean in your own corner and start up ice.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 50, y: 72 },
            w: { x: 32, y: 56 },
            f1: { x: 57, y: 66 },
            ad: { x: 38, y: 30 },
          },
          puck: { x: 50, y: 72 },
          narration: "You're skating it out - your winger takes off through neutral ice.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 48, y: 66 },
            w: { x: 31, y: 47 },
            f1: { x: 55, y: 60 },
            ad: { x: 37, y: 26 },
          },
          puck: { x: 48, y: 66 },
          narration: "He's got a step on their D and he is flying.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 46, y: 62 },
            w: { x: 30, y: 40 },
            f1: { x: 54, y: 56 },
            ad: { x: 36, y: 22 },
          },
          puck: { x: 46, y: 62 },
          narration: "A backchecker is closing on you from behind, and your winger's still open...",
        },
        { t: 13 },
      ],
      freezeLine:
        "Stop the tape. You've got the puck and a winger in stride. What do you do?",
      narration:
        "You strip it clean in your own corner and start up ice. Your winger takes off through the neutral zone with a step on their D, and he is flying. A backchecker is closing on you from behind, and your winger is still open.",
    },
  },
  {
    id: 'tr-chip-past-pressure',
    zone: 'neutral',
    category: 'pressure',
    difficulty: 'rookie',
    title: 'Chip Past Pressure',
    setup: 'You carry to your own blue line. A forechecker steps up right in your face.',
    kind: 'mcq',
    options: [
      {
        text: 'Force a pass through the middle to your center',
        correct: false,
        feedback: 'Through a body and a stick - picked off in the worst spot on the ice.',
        trap: 'The middle pass looks like the skill play. It is the turnover play.',
      },
      {
        text: 'Turn back toward your own net',
        correct: false,
        feedback: 'You invite the whole forecheck back into your zone and lose the line you earned.',
        trap: 'Turning back buys time - and hands them all the ice you just gained.',
      },
      {
        text: 'Chip it off the wall behind him to your winger',
        correct: true,
        feedback: 'Soft chip past the pressure. Your winger runs onto it and the exit lives.',
      },
    ],
    coachCue: 'Pressure at the line? Chip and go.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 26, y: 64, label: 'D' },
        { id: 'f1', team: 'away', x: 28, y: 56, label: 'F' },
        { id: 'w', team: 'home', x: 20, y: 46, label: 'W' },
        { id: 'c', team: 'home', x: 48, y: 52, label: 'C' },
      ],
      puck: { x: 26, y: 64 },
      arrows: [{ fromX: 28, fromY: 56, toX: 26, toY: 63 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 40, y: 86 },
            f1: { x: 36, y: 60 },
            w: { x: 16, y: 64 },
            c: { x: 50, y: 66 },
          },
          puck: { x: 40, y: 86 },
          narration: 'You pick it up behind your own net and wheel.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 33, y: 78 },
            f1: { x: 32, y: 66 },
            w: { x: 18, y: 58 },
            c: { x: 49, y: 60 },
          },
          puck: { x: 33, y: 78 },
          narration: 'Up the left side - their forechecker reads it and cuts across.',
        },
        {
          t: 7.5,
          players: {
            d: { x: 29, y: 70 },
            f1: { x: 29, y: 60 },
            w: { x: 19, y: 52 },
            c: { x: 48, y: 56 },
          },
          puck: { x: 29, y: 70 },
          narration: "You're closing on your own blue line - and so is he.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 26, y: 64 },
            f1: { x: 28, y: 56 },
            w: { x: 20, y: 46 },
            c: { x: 48, y: 52 },
          },
          puck: { x: 26, y: 64 },
          narration: "He's right in your face at the line, stick out...",
        },
        { t: 13 },
      ],
      freezeLine:
        "Hold it there. You're on the wall at your blue line with pressure. What's your out?",
      narration:
        "You pick it up behind your own net and wheel up the left side. Their forechecker reads it and cuts across to meet you at the blue line. Now he's right in your face, stick out, and the wall is running out.",
    },
  },
  {
    id: 'tr-no-icing-tired',
    zone: 'neutral',
    category: 'puck-management',
    difficulty: 'rookie',
    title: 'No Icing on Tired Legs',
    setup: "A checker closes on you near center ice. It's the end of a long shift.",
    kind: 'mcq',
    options: [
      {
        text: 'Rip it hard down the ice and change',
        correct: false,
        feedback:
          "You're behind the red line - that's icing. Faceoff in your end and no change allowed.",
        trap: 'It relieves pressure now and punishes you five seconds later.',
      },
      {
        text: 'Flip it soft so it dies in their corner',
        correct: true,
        feedback:
          'The flip lands and dies before the goal line. No icing, fresh legs come on, they start from a dead puck.',
      },
      {
        text: 'Cut to the middle and beat the checker',
        correct: false,
        feedback: 'A turnover at center on tired legs is an odd-man rush the other way.',
        trap: 'One move fixes everything - until it does not.',
      },
    ],
    coachCue: 'No icings on tired legs.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 56, y: 54, label: 'D' },
        { id: 'f1', team: 'away', x: 50, y: 49, label: 'F' },
        { id: 'w', team: 'home', x: 76, y: 44, label: 'W' },
        { id: 'ad', team: 'away', x: 62, y: 30, label: 'D' },
      ],
      puck: { x: 56, y: 54 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 60, y: 70 },
            f1: { x: 44, y: 44 },
            w: { x: 70, y: 58 },
            ad: { x: 58, y: 22 },
          },
          puck: { x: 60, y: 70 },
          narration: 'Long shift for your group - you take the pass at the top of your zone.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 58, y: 63 },
            f1: { x: 46, y: 47 },
            w: { x: 73, y: 52 },
            ad: { x: 60, y: 25 },
          },
          puck: { x: 58, y: 63 },
          narration: 'You push it up the right side on heavy legs.',
        },
        {
          t: 7.5,
          players: {
            d: { x: 57, y: 58 },
            f1: { x: 48, y: 48 },
            w: { x: 75, y: 48 },
            ad: { x: 61, y: 27 },
          },
          puck: { x: 57, y: 58 },
          narration: 'Their center turns and comes right at you.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 56, y: 54 },
            f1: { x: 50, y: 49 },
            w: { x: 76, y: 44 },
            ad: { x: 62, y: 30 },
          },
          puck: { x: 56, y: 54 },
          narration: "You're a stride short of the red line and he's on you...",
        },
        { t: 13 },
      ],
      freezeLine:
        "Freeze. You're just shy of the red line with a checker closing. What do you do with it?",
      narration:
        "Long shift for your group and the legs are heavy. You take the pass at the top of your zone and push it up the right side. Their center turns and comes right at you. You're a stride short of the red line and he's on you.",
    },
  },

  // ---------------------------------------------------------- varsity
  {
    id: 'tr-hinge-read',
    zone: 'neutral',
    category: 'regroup',
    difficulty: 'varsity',
    title: 'Hinge Against the Trap',
    setup: 'Their 1-2-2 has your side of the ice locked. Your partner hinges below you.',
    kind: 'mcq',
    options: [
      {
        text: 'Rim it hard around to your strong-side winger',
        correct: false,
        feedback: "Their wall winger is standing on that rim. That's exactly the puck the trap wants.",
        trap: 'Rims feel safe. Against a set trap, the wall is the bait.',
      },
      {
        text: 'Attack the seam yourself between their forwards',
        correct: false,
        feedback: 'You skate into three sticks. Strip, counter, odd-man rush against.',
        trap: 'F1 committed to you, so the ice looks open - the second layer is waiting.',
      },
      {
        text: 'Long stretch pass through the middle of the trap',
        correct: false,
        feedback: 'Through the whole 1-2-2? Tipped, picked, and going the other way.',
        trap: 'The home run ball beats the trap once a season. It feeds it every night.',
      },
      {
        text: 'Hinge it back to your partner, swing it weak side',
        correct: true,
        feedback:
          'Your partner has time behind you. The trap has to shift, and the weak side opens before it can.',
      },
    ],
    coachCue: 'Beat the trap side to side, not through it.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 26, y: 56, label: 'D' },
        { id: 'd2', team: 'home', x: 42, y: 66, label: 'D' },
        { id: 'f1', team: 'away', x: 31, y: 47, label: 'F' },
        { id: 'f2', team: 'away', x: 16, y: 42, label: 'F' },
        { id: 'm', team: 'away', x: 46, y: 42, label: 'F' },
      ],
      puck: { x: 26, y: 56 },
      arrows: [{ fromX: 26, fromY: 56, toX: 42, toY: 66, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d1: { x: 30, y: 66 },
            d2: { x: 48, y: 72 },
            f1: { x: 34, y: 34 },
            f2: { x: 14, y: 34 },
            m: { x: 50, y: 32 },
          },
          puck: { x: 30, y: 66 },
          narration: 'They drop into their one-two-two across the neutral zone.',
        },
        {
          t: 3.5,
          players: {
            d1: { x: 28, y: 60 },
            d2: { x: 46, y: 70 },
            f1: { x: 32, y: 42 },
            f2: { x: 15, y: 38 },
            m: { x: 48, y: 36 },
          },
          puck: { x: 28, y: 60 },
          narration: 'You carry up the wall - their first forward starts down at you.',
        },
        {
          t: 7.5,
          players: {
            d1: { x: 27, y: 57 },
            d2: { x: 44, y: 68 },
            f1: { x: 31, y: 45 },
            f2: { x: 16, y: 40 },
            m: { x: 47, y: 39 },
          },
          puck: { x: 27, y: 57 },
          narration: 'The wall is closing. Your partner peels off and hinges underneath you.',
        },
        {
          t: 11.5,
          players: {
            d1: { x: 26, y: 56 },
            d2: { x: 42, y: 66 },
            f1: { x: 31, y: 47 },
            f2: { x: 16, y: 42 },
            m: { x: 46, y: 42 },
          },
          puck: { x: 26, y: 56 },
          narration: 'F1 is committed to you and the whole trap leans your way...',
        },
        { t: 13 },
      ],
      freezeLine: 'Stop it. The trap is loaded on your side. Where does the puck go?',
      narration:
        "They drop into their one-two-two across the neutral zone. You carry up the wall and their first forward starts down at you as the wall closes. Your partner peels off and hinges underneath you. F1 is committed, and the whole trap is leaning your way.",
    },
  },
  {
    id: 'tr-stretch-or-regroup',
    zone: 'neutral',
    category: 'transition',
    difficulty: 'varsity',
    title: 'Stretch or Regroup?',
    setup: 'You retrieve the puck. Their D pinched deep and your stretch man slips out behind him.',
    kind: 'mcq',
    options: [
      {
        text: 'Rifle it to the stretch forward now',
        correct: true,
        feedback:
          'Their pinching D is caught below you. One flat pass and your winger attacks two-on-one behind the pinch.',
      },
      {
        text: 'Regroup D-to-D and slow it down',
        correct: false,
        feedback: 'You pass up numbers. By the time you swing it, their D has recovered.',
        trap: 'Regroup is the safe habit - the read says the seam is open right now.',
      },
      {
        text: 'Carry it to center yourself',
        correct: false,
        feedback: 'The window closes while you skate, and now nobody is back if it turns over.',
        trap: 'Carrying feels aggressive. The pass is faster than your feet.',
      },
      {
        text: 'Chip it into their zone and chase',
        correct: false,
        feedback: 'You trade a clean seam pass for a fifty-fifty race. Bad trade.',
        trap: 'North is usually right - not when a teammate is already open north.',
      },
    ],
    coachCue: 'When they pinch, the stretch is on.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 44, y: 62, label: 'D' },
        { id: 'w', team: 'home', x: 72, y: 36, label: 'W' },
        { id: 'f1', team: 'away', x: 38, y: 54, label: 'F' },
        { id: 'ad1', team: 'away', x: 24, y: 60, label: 'D' },
        { id: 'ad2', team: 'away', x: 48, y: 44, label: 'D' },
      ],
      puck: { x: 44, y: 62 },
      arrows: [{ fromX: 44, fromY: 62, toX: 72, toY: 36, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d1: { x: 50, y: 78 },
            w: { x: 60, y: 52 },
            f1: { x: 30, y: 44 },
            ad1: { x: 30, y: 40 },
            ad2: { x: 52, y: 34 },
          },
          puck: { x: 50, y: 78 },
          narration: 'You retrieve at the top of your circle and scan up ice.',
        },
        {
          t: 3.5,
          players: {
            d1: { x: 47, y: 70 },
            w: { x: 65, y: 46 },
            f1: { x: 33, y: 49 },
            ad1: { x: 27, y: 48 },
            ad2: { x: 50, y: 38 },
          },
          puck: { x: 47, y: 70 },
          narration: 'Their left D pinches down hard, trying to keep the play alive.',
        },
        {
          t: 7.5,
          players: {
            d1: { x: 45, y: 65 },
            w: { x: 69, y: 41 },
            f1: { x: 36, y: 52 },
            ad1: { x: 25, y: 55 },
            ad2: { x: 49, y: 41 },
          },
          puck: { x: 45, y: 65 },
          narration: 'Your winger slips out behind the pinch and stretches the ice.',
        },
        {
          t: 11.5,
          players: {
            d1: { x: 44, y: 62 },
            w: { x: 72, y: 36 },
            f1: { x: 38, y: 54 },
            ad1: { x: 24, y: 60 },
            ad2: { x: 48, y: 44 },
          },
          puck: { x: 44, y: 62 },
          narration: 'One of their D is caught deep, your stretch man is all alone at their line...',
        },
        { t: 13 },
      ],
      freezeLine: "Hold it. Their D is caught below you. What's the play?",
      narration:
        "You retrieve at the top of your circle and scan up ice. Their left D pinches down hard to keep the play alive. Your winger slips out behind that pinch and stretches the ice. Now their D is caught deep and your stretch man is all alone at their line.",
    },
  },
  {
    id: 'tr-backside-support',
    zone: 'neutral',
    category: 'support',
    difficulty: 'varsity',
    title: 'Backside Support',
    setup: 'Your partner carries through neutral ice. Tap the spot where you should be.',
    kind: 'tap',
    tapTargets: [
      {
        x: 52,
        y: 60,
        radius: 8,
        correct: true,
        feedback:
          'Staggered in the middle lane behind him. He has a bail-out pass and you see the whole ice.',
        label: 'Trail the middle',
      },
      {
        x: 65,
        y: 50,
        radius: 8,
        correct: false,
        feedback: 'Flat with him means no bail-out pass, and one seam takes you both out of the play.',
        label: 'Flat, far side',
      },
      {
        x: 50,
        y: 78,
        radius: 8,
        correct: false,
        feedback: "Sagging this deep leaves him with no outlet. You're a spectator, not support.",
        label: 'Sag deep',
      },
      {
        x: 25,
        y: 38,
        radius: 8,
        correct: false,
        feedback: 'You crowd his lane and leave the back door wide open if it turns over.',
        label: 'Join his wall',
      },
    ],
    coachCue: 'Support from behind, not beside.',
    visual: {
      rinkZone: 'neutral',
      youId: 'you',
      players: [
        { id: 'd2', team: 'home', x: 35, y: 50, label: 'D' },
        { id: 'you', team: 'home', x: 68, y: 72, label: 'D' },
        { id: 'f1', team: 'away', x: 48, y: 42, label: 'F' },
        { id: 'ad', team: 'away', x: 38, y: 28, label: 'D' },
      ],
      puck: { x: 35, y: 50 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d2: { x: 46, y: 74 },
            you: { x: 60, y: 84 },
            f1: { x: 52, y: 30 },
            ad: { x: 40, y: 16 },
          },
          puck: { x: 46, y: 74 },
          narration: 'Your partner picks it up off the breakout and starts skating.',
        },
        {
          t: 3.5,
          players: {
            d2: { x: 42, y: 64 },
            you: { x: 63, y: 80 },
            f1: { x: 50, y: 36 },
            ad: { x: 39, y: 20 },
          },
          puck: { x: 42, y: 64 },
          narration: 'He carries through center with speed.',
        },
        {
          t: 7.5,
          players: {
            d2: { x: 38, y: 56 },
            you: { x: 66, y: 76 },
            f1: { x: 49, y: 40 },
            ad: { x: 38, y: 24 },
          },
          puck: { x: 38, y: 56 },
          narration: 'Their backchecker starts tracking him through the middle.',
        },
        {
          t: 11.5,
          players: {
            d2: { x: 35, y: 50 },
            you: { x: 68, y: 72 },
            f1: { x: 48, y: 42 },
            ad: { x: 38, y: 28 },
          },
          puck: { x: 35, y: 50 },
          narration: "He's crossing into their half with the puck on a string...",
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze it. Your partner has the puck - tap the spot where you should be.',
      narration:
        "Your partner picks it up off the breakout and carries through center with speed. Their backchecker starts tracking him through the middle. He's crossing into their half with the puck on a string, and now it's on you to find your spot.",
    },
  },
  {
    id: 'tr-rim-receive',
    zone: 'neutral',
    category: 'wall-play',
    difficulty: 'varsity',
    title: 'Rim at the Center Wall',
    setup: 'A rim comes up your wall to center ice. Their center is two strides away.',
    kind: 'mcq',
    options: [
      {
        text: 'Catch it and turn up ice with it',
        correct: false,
        feedback: 'You turn straight into the hit. Puck, and maybe teeth, end up on the glass.',
        trap: "It's the right play when you have time. You don't.",
      },
      {
        text: 'Let it rim on past you',
        correct: false,
        feedback: 'Their winger is stepping down the wall right onto it. Free puck for them.',
        trap: "'Let the puck do the work' - only when a teammate is at the other end of it.",
      },
      {
        text: 'One-touch it inside to your center',
        correct: true,
        feedback:
          'Bump it to support before contact. Your center takes it facing up ice and the checker hits air.',
      },
      {
        text: 'Pin it against the wall and eat it',
        correct: false,
        feedback: "No whistle is coming at center ice. You're just starting a battle you don't need.",
        trap: 'That works in your D-zone corner. Here it just stalls your own exit.',
      },
    ],
    coachCue: 'Know your out before the rim arrives.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 14, y: 50, label: 'D' },
        { id: 'f1', team: 'away', x: 22, y: 58, label: 'F' },
        { id: 'c', team: 'home', x: 30, y: 42, label: 'C' },
        { id: 'f2', team: 'away', x: 12, y: 36, label: 'F' },
      ],
      puck: { x: 14, y: 55 },
      arrows: [{ fromX: 22, fromY: 58, toX: 15, toY: 51 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 20, y: 72 },
            f1: { x: 34, y: 70 },
            c: { x: 36, y: 60 },
            f2: { x: 10, y: 20 },
          },
          puck: { x: 18, y: 86 },
          narration: 'Your partner rims it hard around the wall to get it out of trouble.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 17, y: 64 },
            f1: { x: 29, y: 66 },
            c: { x: 34, y: 54 },
            f2: { x: 11, y: 26 },
          },
          puck: { x: 15, y: 76 },
          narration: "It's riding the boards up the left side - you climb to meet it.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 15, y: 56 },
            f1: { x: 25, y: 62 },
            c: { x: 32, y: 48 },
            f2: { x: 11, y: 31 },
          },
          puck: { x: 14, y: 66 },
          narration: "You're at the center wall waiting on it, and their center has you lined up.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 14, y: 50 },
            f1: { x: 22, y: 58 },
            c: { x: 30, y: 42 },
            f2: { x: 12, y: 36 },
          },
          puck: { x: 14, y: 55 },
          narration: "The rim is almost on your stick and he's two strides away...",
        },
        { t: 13 },
      ],
      freezeLine: "Stop it there. Rim coming to you, checker closing. What's your first touch?",
      narration:
        "Your partner rims it hard around the boards to get it out of trouble. It's riding the wall up the left side, so you climb to the center wall to meet it. Their center has you lined up. The rim is almost on your stick and he's two strides away.",
    },
  },

  // ---------------------------------------------------------- elite
  {
    id: 'tr-fourth-attacker',
    zone: 'neutral',
    category: 'activation',
    difficulty: 'elite',
    title: 'The Fourth Attacker',
    setup: 'You feed your center and the rush builds. Their winger is peeling for the bench.',
    kind: 'mcq',
    options: [
      {
        text: 'Hold the blue line, let your three forwards go',
        correct: false,
        feedback:
          'Their backcheck is sitting on the bench. You just declined a free four-on-two.',
        trap: "'D stay back' is the peewee rule. Elite D read when numbers are free.",
      },
      {
        text: 'Jump the middle lane as the fourth attacker',
        correct: true,
        feedback:
          'Their line is mid-change and your partner holds the line behind you. Free numbers - take them.',
      },
      {
        text: 'Trail slowly, stay above the circles',
        correct: false,
        feedback: 'Half-joining means you arrive too late to attack and too far up to defend.',
        trap: 'It feels like the responsible compromise. It is neither job done well.',
      },
      {
        text: 'Call it back and slow the rush down',
        correct: false,
        feedback: 'You give their fresh line time to hop on and set up. Advantage gone.',
        trap: 'Possession brain - but slowing down is exactly what their bench needs.',
      },
    ],
    coachCue: 'Bad change for them? Jump. Numbers do not wait.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 48, y: 58, label: 'D' },
        { id: 'c', team: 'home', x: 45, y: 40, label: 'C' },
        { id: 'd2', team: 'home', x: 58, y: 56, label: 'D' },
        { id: 'f1', team: 'away', x: 88, y: 47, label: 'F' },
        { id: 'ad', team: 'away', x: 50, y: 26, label: 'D' },
      ],
      puck: { x: 45, y: 40 },
      highlights: [{ x: 88, y: 47, radius: 8 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d1: { x: 50, y: 74 },
            c: { x: 52, y: 60 },
            d2: { x: 62, y: 70 },
            f1: { x: 60, y: 40 },
            ad: { x: 50, y: 34 },
          },
          puck: { x: 50, y: 74 },
          narration: 'You start the break out of your own end with control.',
        },
        {
          t: 3.5,
          players: {
            d1: { x: 49, y: 68 },
            c: { x: 48, y: 52 },
            d2: { x: 60, y: 64 },
            f1: { x: 70, y: 42 },
            ad: { x: 50, y: 31 },
          },
          puck: { x: 48, y: 52 },
          narration: 'You feed your center and the rush is on - their winger peels for the bench!',
        },
        {
          t: 7.5,
          players: {
            d1: { x: 48, y: 62 },
            c: { x: 46, y: 45 },
            d2: { x: 59, y: 60 },
            f1: { x: 80, y: 45 },
            ad: { x: 50, y: 28 },
          },
          puck: { x: 46, y: 45 },
          narration: 'Their whole line is changing on the far side of the ice.',
        },
        {
          t: 11.5,
          players: {
            d1: { x: 48, y: 58 },
            c: { x: 45, y: 40 },
            d2: { x: 58, y: 56 },
            f1: { x: 88, y: 47 },
            ad: { x: 50, y: 26 },
          },
          puck: { x: 45, y: 40 },
          narration: 'Your center crosses the red line and the middle lane is wide open...',
        },
        { t: 13 },
      ],
      freezeLine: "Freeze. Look at their bench side. You're the strong-side D - what do you do?",
      narration:
        "You start the break out of your own end with control and feed your center. The rush is on, and their winger peels off for the bench. Their whole line is changing on the far side. Your center crosses the red line and the middle lane is wide open.",
    },
  },
  {
    id: 'tr-bad-change-flip',
    zone: 'neutral',
    category: 'puck-management',
    difficulty: 'elite',
    title: 'Caught in a Bad Change',
    setup: 'Your line is mid-change and their fresh checkers turn up ice at you.',
    kind: 'mcq',
    options: [
      {
        text: 'Turn back and regroup behind your own net',
        correct: false,
        feedback:
          'You invite a fresh forecheck onto a team that is half on the bench. Five seconds of chaos.',
        trap: "It's the possession play - with the wrong personnel on the ice.",
      },
      {
        text: 'Carry it at the fresh checkers yourself',
        correct: false,
        feedback: 'One tired D against two fresh forwards. That puck is gone at the red line.',
        trap: 'Brave, but the freeze frame says two on one against you.',
      },
      {
        text: 'Rim it hard around the left-wing boards',
        correct: false,
        feedback: 'Look left - their D is stationed on that wall. The rim goes right to his tape.',
        trap: 'The rim is the default out. Check who is standing on the rail first.',
      },
      {
        text: 'Flip it high and deep, let the change finish',
        correct: true,
        feedback:
          "You're a stride past center, so no icing. The puck hangs, dies deep, and your fresh line lands the forecheck.",
      },
    ],
    coachCue: 'Bad change? Buy time with height.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 55, y: 48, label: 'D' },
        { id: 'f1', team: 'away', x: 70, y: 40, label: 'F' },
        { id: 'f2', team: 'away', x: 78, y: 33, label: 'F' },
        { id: 'ad', team: 'away', x: 16, y: 30, label: 'D' },
        { id: 'w', team: 'home', x: 91, y: 51, label: 'W' },
      ],
      puck: { x: 55, y: 48 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d1: { x: 50, y: 70 },
            f1: { x: 92, y: 44 },
            f2: { x: 93, y: 38 },
            ad: { x: 18, y: 22 },
            w: { x: 62, y: 56 },
          },
          puck: { x: 50, y: 70 },
          narration: 'You carry out of your zone as your line heads for a change.',
        },
        {
          t: 3.5,
          players: {
            d1: { x: 52, y: 62 },
            f1: { x: 86, y: 43 },
            f2: { x: 88, y: 37 },
            ad: { x: 17, y: 25 },
            w: { x: 72, y: 54 },
          },
          puck: { x: 52, y: 62 },
          narration: "Your winger is still ten feet from the bench - and their fresh line jumps on.",
        },
        {
          t: 7.5,
          players: {
            d1: { x: 54, y: 54 },
            f1: { x: 78, y: 41 },
            f2: { x: 84, y: 35 },
            ad: { x: 16, y: 27 },
            w: { x: 82, y: 53 },
          },
          puck: { x: 54, y: 54 },
          narration: 'Two fresh checkers turn and come straight at you.',
        },
        {
          t: 11.5,
          players: {
            d1: { x: 55, y: 48 },
            f1: { x: 70, y: 40 },
            f2: { x: 78, y: 33 },
            ad: { x: 16, y: 30 },
            w: { x: 91, y: 51 },
          },
          puck: { x: 55, y: 48 },
          narration: "You're one stride past center with nobody to pass to...",
        },
        { t: 13 },
      ],
      freezeLine: "Stop it here. You're caught mid-change with fresh pressure coming. What's the play?",
      narration:
        "You carry out of your zone as your line heads for a change. Your winger is still ten feet from the bench when their fresh line jumps on. Two fresh checkers turn and come straight at you. You're one stride past center with nobody to pass to.",
    },
  },
  {
    id: 'tr-beat-the-trap',
    zone: 'neutral',
    category: 'tempo',
    difficulty: 'elite',
    title: 'Before the Trap Sets',
    setup: 'You retrieve their dump-in and turn up ice. Their forwards are still swinging back.',
    kind: 'mcq',
    options: [
      {
        text: 'Snap it to your center in the middle seam now',
        correct: true,
        feedback:
          'Their F1 has not reached his spot yet - the middle is open for one more second. Play beats structure.',
      },
      {
        text: 'Swing behind your net and set a slow regroup',
        correct: false,
        feedback: 'By the time you swing it, all five are set and the middle is gone.',
        trap: "'Be patient' is coaching gospel - patience is what the trap is begging for.",
      },
      {
        text: 'Dump it deep and send the forwards chasing',
        correct: false,
        feedback: 'You hand back possession against a structure that is not even built yet.',
        trap: 'Dump and chase beats a set trap. This trap is not set.',
      },
      {
        text: 'Hold it and wait for your winger to swing',
        correct: false,
        feedback: 'Those two seconds are exactly what their forwards need to get home.',
        trap: 'More support sounds better. The clock on the seam says otherwise.',
      },
    ],
    coachCue: 'Play fast before the trap breathes.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd1',
      players: [
        { id: 'd1', team: 'home', x: 48, y: 64, label: 'D' },
        { id: 'c', team: 'home', x: 52, y: 44, label: 'C' },
        { id: 'f1', team: 'away', x: 38, y: 40, label: 'F' },
        { id: 'f2', team: 'away', x: 62, y: 38, label: 'F' },
        { id: 'ad', team: 'away', x: 50, y: 22, label: 'D' },
      ],
      puck: { x: 48, y: 64 },
      arrows: [{ fromX: 48, fromY: 64, toX: 52, toY: 45, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d1: { x: 52, y: 80 },
            c: { x: 46, y: 62 },
            f1: { x: 42, y: 68 },
            f2: { x: 70, y: 54 },
            ad: { x: 50, y: 26 },
          },
          puck: { x: 60, y: 90 },
          narration: 'They dump it deep and you go back for it.',
        },
        {
          t: 3.5,
          players: {
            d1: { x: 56, y: 86 },
            c: { x: 48, y: 56 },
            f1: { x: 41, y: 58 },
            f2: { x: 68, y: 48 },
            ad: { x: 50, y: 25 },
          },
          puck: { x: 56, y: 86 },
          narration: 'You scoop it and turn up ice - their forwards peel back to build the trap.',
        },
        {
          t: 7.5,
          players: {
            d1: { x: 52, y: 74 },
            c: { x: 50, y: 50 },
            f1: { x: 40, y: 48 },
            f2: { x: 65, y: 42 },
            ad: { x: 50, y: 23 },
          },
          puck: { x: 52, y: 74 },
          narration: 'Their first forward is still swinging back toward his spot in the middle.',
        },
        {
          t: 11.5,
          players: {
            d1: { x: 48, y: 64 },
            c: { x: 52, y: 44 },
            f1: { x: 38, y: 40 },
            f2: { x: 62, y: 38 },
            ad: { x: 50, y: 22 },
          },
          puck: { x: 48, y: 64 },
          narration: 'The trap is only half-built, and your center is climbing through the middle...',
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze it. One second before their trap sets. What do you do?',
      narration:
        "They dump it deep and you go back to scoop it, turning up ice as their forwards peel back to build the trap. Their first forward is still swinging toward his spot in the middle. The trap is only half-built, and your center is climbing through the middle.",
    },
  },
];
