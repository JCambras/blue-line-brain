import type { Scenario } from '@/types';

export const DEFENSIVE_BREAKOUT_SCENARIOS: Scenario[] = [
  // ---------------------------------------------------------- rookie
  {
    id: 'bo-d-to-d-net',
    zone: 'defensive',
    category: 'd-to-d',
    difficulty: 'rookie',
    title: 'D-to-D Behind the Net',
    setup:
      'You retrieve in the right corner. One forechecker angles down your wall. Your partner is posted behind the net.',
    kind: 'mcq',
    options: [
      {
        text: 'Rim it hard around the boards',
        correct: false,
        feedback:
          'A blind rim is a coin flip. Their point man pinches and it never leaves the zone.',
        trap: 'The rim feels safe, but you are giving the puck away with extra steps.',
      },
      {
        text: 'Try to beat him up the wall yourself',
        correct: false,
        feedback:
          'His angle has the wall sealed. You skate into the hit and the puck squirts loose.',
        trap: 'Legs feel good, but he picked that angle for a reason.',
      },
      {
        text: 'Slide it to your partner behind the net',
        correct: true,
        feedback:
          'One forechecker cannot take both sides. Your partner walks out the weak side with time.',
      },
    ],
    coachCue: "One forechecker can't take both sides.",
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 66, y: 90, label: 'D' },
        { id: 'd2', team: 'home', x: 34, y: 94, label: 'D' },
        { id: 'f1', team: 'away', x: 58, y: 76, label: 'F' },
      ],
      puck: { x: 66, y: 91 },
      arrows: [{ fromX: 66, fromY: 91, toX: 38, toY: 94, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 55, y: 70 }, d2: { x: 42, y: 70 }, f1: { x: 62, y: 45 } },
          puck: { x: 80, y: 55 },
          narration: 'They dump it into your right corner and give chase.',
        },
        {
          t: 3.5,
          players: { d: { x: 60, y: 80 }, d2: { x: 38, y: 80 }, f1: { x: 60, y: 60 } },
          puck: { x: 84, y: 78 },
          narration: 'You turn back for it - your partner heads for the far post.',
        },
        {
          t: 7.5,
          players: { d: { x: 64, y: 87 }, d2: { x: 35, y: 89 }, f1: { x: 59, y: 69 } },
          puck: { x: 76, y: 89 },
          narration: 'The first forechecker angles down your wall, steering you wide.',
        },
        {
          t: 11.5,
          players: { d: { x: 66, y: 90 }, d2: { x: 34, y: 94 }, f1: { x: 58, y: 76 } },
          puck: { x: 66, y: 91 },
          narration: 'You get to it in the corner - pressure coming down the wall...',
        },
        { t: 13 },
      ],
      freezeLine:
        "Stop it there. You've got the puck in the corner and one man on you. Where does it go?",
    },
  },
  {
    id: 'bo-goalie-sets-it',
    zone: 'defensive',
    category: 'retrieval',
    difficulty: 'rookie',
    title: 'Let the Goalie Set It',
    setup:
      'A hard rim is screaming around your wall with a forechecker chasing it. Your goalie slides out behind the net.',
    kind: 'mcq',
    options: [
      {
        text: 'Let your goalie stop it and set it',
        correct: true,
        feedback:
          'The goalie kills the rim. You pick up a still puck with your head up instead of a bouncer at speed.',
      },
      {
        text: 'Chase down the moving rim at full speed',
        correct: false,
        feedback:
          'Playing a bouncing puck at top speed with a hit coming is how turnovers happen.',
        trap: 'Urgency feels right, but the goalie is already doing that job for you.',
      },
      {
        text: 'Let it rim through to the far corner',
        correct: false,
        feedback:
          'Now it is a race to the far wall, and their winger has the better angle to it.',
        trap: 'A free relay around the boards looks easy until someone else gets there first.',
      },
    ],
    coachCue: 'Goalie stops it. You get a still puck.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 60, y: 88, label: 'D' },
        { id: 'g', team: 'home', x: 46, y: 96, label: 'G' },
        { id: 'f1', team: 'away', x: 68, y: 74, label: 'F' },
      ],
      puck: { x: 75, y: 85 },
      arrows: [{ fromX: 75, fromY: 85, toX: 55, toY: 97, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 52, y: 68 }, g: { x: 50, y: 93 }, f1: { x: 72, y: 42 } },
          puck: { x: 85, y: 40 },
          narration: 'They rim it hard around your right wall.',
        },
        {
          t: 3.5,
          players: { d: { x: 56, y: 76 }, g: { x: 48, y: 95 }, f1: { x: 70, y: 55 } },
          puck: { x: 88, y: 68 },
          narration: 'The puck is flying around the boards - your goalie slides out behind the net.',
        },
        {
          t: 7.5,
          players: { d: { x: 58, y: 83 }, g: { x: 46, y: 96 }, f1: { x: 69, y: 66 } },
          puck: { x: 82, y: 80 },
          narration: 'Their forechecker chases the rim down the wall.',
        },
        {
          t: 11.5,
          players: { d: { x: 60, y: 88 }, g: { x: 46, y: 96 }, f1: { x: 68, y: 74 } },
          puck: { x: 75, y: 85 },
          narration: 'Your goalie is set behind the net, ready to trap it...',
        },
        { t: 13 },
      ],
      freezeLine: "Freeze. The rim's coming around with a man chasing. What do you do?",
    },
  },
  {
    id: 'bo-pk-glass-out',
    zone: 'defensive',
    category: 'clear',
    difficulty: 'rookie',
    title: 'Shorthanded Clear',
    setup:
      "You're killing a penalty and win the puck in the corner. Two attackers collapse on you and nobody is open.",
    kind: 'mcq',
    options: [
      {
        text: 'Look for a pass through the middle',
        correct: false,
        feedback:
          'A middle pass shorthanded gets picked off in the slot. That is a grade-A chance against.',
        trap: 'Possession sounds nice, but the middle of your zone on the kill is a minefield.',
      },
      {
        text: 'Chip it high off the glass and out',
        correct: true,
        feedback:
          'Shorthanded and swarmed, off the glass is the right play. Kill clock, change your tired forwards.',
      },
      {
        text: 'Hold it and take the hit',
        correct: false,
        feedback:
          'You get buried on the wall and they keep possession in your end, a man up.',
        trap: 'Eating the puck buys time at even strength. On the kill it just resets their power play.',
      },
    ],
    coachCue: 'Shorthanded and swarmed? Glass and out.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 30, y: 90, label: 'D' },
        { id: 'f1', team: 'away', x: 38, y: 82, label: 'F' },
        { id: 'f2', team: 'away', x: 24, y: 78, label: 'F' },
        { id: 'g', team: 'home', x: 50, y: 94, label: 'G' },
      ],
      puck: { x: 30, y: 90 },
      highlights: [{ x: 30, y: 90, radius: 8 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 38, y: 78 },
            f1: { x: 30, y: 60 },
            f2: { x: 55, y: 70 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 18, y: 68 },
          narration: "You're a man down - their power play works the left wall.",
        },
        {
          t: 4,
          players: {
            d: { x: 34, y: 84 },
            f1: { x: 26, y: 72 },
            f2: { x: 48, y: 76 },
            g: { x: 50, y: 94 },
          },
          puck: { x: 16, y: 84 },
          narration: 'The puck is chipped low into your corner - you get there first.',
        },
        {
          t: 8,
          players: {
            d: { x: 31, y: 88 },
            f1: { x: 34, y: 78 },
            f2: { x: 28, y: 74 },
            g: { x: 50, y: 94 },
          },
          puck: { x: 26, y: 89 },
          narration: 'You dig it off the wall - both of them turn and collapse on you.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 30, y: 90 },
            f1: { x: 38, y: 82 },
            f2: { x: 24, y: 78 },
            g: { x: 50, y: 94 },
          },
          puck: { x: 30, y: 90 },
          narration: 'Nobody is open, and two of them are closing in...',
        },
        { t: 13 },
      ],
      freezeLine:
        "Stop it there. You're shorthanded with the puck and no outlet. What's the play?",
    },
  },
  {
    id: 'bo-fake-and-cut',
    zone: 'defensive',
    category: 'retrieval',
    difficulty: 'rookie',
    title: 'Fake and Cut',
    setup:
      "You're first to a dumped puck. The forechecker is charging in behind you on a straight line at full speed.",
    kind: 'mcq',
    options: [
      {
        text: 'Turn straight up the wall at full speed',
        correct: false,
        feedback:
          'You turn right into his hit lane - exactly where he is aiming. Puck and teeth go flying.',
        trap: 'Fast feels safe, but he is faster and he picked that line first.',
      },
      {
        text: 'Pin the puck on the boards and protect it',
        correct: false,
        feedback:
          'You invite the pin. The play dies on the wall and the best you get is a faceoff in your end.',
        trap: 'Protecting the puck sounds smart, but you had an escape and gave it up.',
      },
      {
        text: 'Fake to the wall, then cut back inside',
        correct: true,
        feedback:
          'At full speed he cannot turn. One shoulder fake and he flies past while you skate into open ice.',
      },
    ],
    coachCue: "Speed can't turn. Fake and cut.",
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 72, y: 88, label: 'D' },
        { id: 'f1', team: 'away', x: 66, y: 78, label: 'F' },
        { id: 'w', team: 'home', x: 30, y: 74, label: 'W' },
      ],
      puck: { x: 72, y: 89 },
      arrows: [{ fromX: 66, fromY: 78, toX: 72, toY: 87 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { d: { x: 55, y: 66 }, f1: { x: 58, y: 40 }, w: { x: 35, y: 55 } },
          puck: { x: 65, y: 42 },
          narration: "The puck's dumped in behind you - it's a footrace.",
        },
        {
          t: 3.5,
          players: { d: { x: 62, y: 76 }, f1: { x: 61, y: 53 }, w: { x: 32, y: 64 } },
          puck: { x: 78, y: 72 },
          narration: "You're winning the race back - their forechecker builds up steam behind you.",
        },
        {
          t: 7.5,
          players: { d: { x: 68, y: 84 }, f1: { x: 64, y: 66 }, w: { x: 31, y: 70 } },
          puck: { x: 74, y: 84 },
          narration: "He's coming in on a straight line, full speed.",
        },
        {
          t: 11.5,
          players: { d: { x: 72, y: 88 }, f1: { x: 66, y: 78 }, w: { x: 30, y: 74 } },
          puck: { x: 72, y: 89 },
          narration: "You're on the puck, and he's right on your back...",
        },
        { t: 13 },
      ],
      freezeLine: "Hold it there. He's flying in behind you. What's your first move?",
    },
  },
  {
    id: 'bo-center-low',
    zone: 'defensive',
    category: 'support',
    difficulty: 'rookie',
    title: 'Center Swings Low',
    setup:
      "You're stuck on the half-wall with your winger covered up ahead. Your center swings low through the middle.",
    kind: 'mcq',
    options: [
      {
        text: 'Short pass to your center swinging low',
        correct: true,
        feedback:
          'The low center is your release valve. He takes it with speed, facing up ice, and the zone opens.',
      },
      {
        text: 'Force it up to the covered winger',
        correct: false,
        feedback:
          'A pass into coverage is a turnover at your own blue line - the worst spot on the ice.',
        trap: 'The winger is the drilled breakout target, but covered is covered.',
      },
      {
        text: 'Retreat behind your net with it',
        correct: false,
        feedback:
          'You re-trap yourself. The forecheck resets and the second wave arrives with you going backward.',
        trap: 'Buying time feels safe, but you skate away from your own support.',
      },
    ],
    coachCue: 'Center swings low. Use the middle.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 24, y: 84, label: 'D' },
        { id: 'c', team: 'home', x: 44, y: 80, label: 'C' },
        { id: 'w', team: 'home', x: 16, y: 68, label: 'W' },
        { id: 'aw', team: 'away', x: 13, y: 64, label: 'F' },
        { id: 'f1', team: 'away', x: 32, y: 76, label: 'F' },
      ],
      puck: { x: 24, y: 84 },
      arrows: [{ fromX: 55, fromY: 88, toX: 44, toY: 80 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 40, y: 72 },
            c: { x: 52, y: 60 },
            w: { x: 20, y: 55 },
            aw: { x: 16, y: 50 },
            f1: { x: 45, y: 55 },
          },
          puck: { x: 22, y: 68 },
          narration: "Turnover at your blue line - the puck's chipped into your left corner.",
        },
        {
          t: 4,
          players: {
            d: { x: 30, y: 80 },
            c: { x: 50, y: 70 },
            w: { x: 18, y: 60 },
            aw: { x: 14, y: 56 },
            f1: { x: 40, y: 64 },
          },
          puck: { x: 14, y: 84 },
          narration: 'You peel back to get it - their first forechecker follows you in.',
        },
        {
          t: 8,
          players: {
            d: { x: 22, y: 86 },
            c: { x: 48, y: 80 },
            w: { x: 17, y: 65 },
            aw: { x: 13, y: 61 },
            f1: { x: 34, y: 72 },
          },
          puck: { x: 22, y: 87 },
          narration: 'You come out the near side, but their winger has your wall outlet blanketed.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 24, y: 84 },
            c: { x: 44, y: 80 },
            w: { x: 16, y: 68 },
            aw: { x: 13, y: 64 },
            f1: { x: 32, y: 76 },
          },
          puck: { x: 24, y: 84 },
          narration: 'Your center swings low through the middle, calling for it...',
        },
        { t: 13 },
      ],
      freezeLine: "Stop right there. You're stuck on the half-wall. Where's the puck going?",
    },
  },
  // ---------------------------------------------------------- varsity
  {
    id: 'bo-reverse-pressure',
    zone: 'defensive',
    category: 'reverse',
    difficulty: 'varsity',
    title: 'Reverse Against the Grain',
    setup:
      'You carry behind your net with a forechecker chasing hard on your hip. Your partner peels into the corner you just left.',
    kind: 'mcq',
    options: [
      {
        text: 'Keep skating and outrun him around the net',
        correct: false,
        feedback:
          'He has the angle and the speed. You get pinned at the far post with the puck in your feet.',
        trap: 'Your legs feel good, but a chase you are losing does not improve with distance.',
      },
      {
        text: 'Reverse it hard back to your partner',
        correct: true,
        feedback:
          'His momentum carries him one way, the puck goes the other. Your partner takes it with time and space.',
      },
      {
        text: 'Flip it off the far glass',
        correct: false,
        feedback:
          'You bail out of a play you were winning. Their point man holds the line and it comes right back.',
        trap: 'Glass-and-out is for when you have nothing. You have a partner in acres of space.',
      },
      {
        text: 'Stop behind the net and protect it',
        correct: false,
        feedback:
          'Stopping lets him close. Now you are pinned behind your own net with the second wave arriving.',
        trap: 'The net feels like a shield - right up until they seal both sides of it.',
      },
    ],
    coachCue: 'Chased hard? Reverse against the grain.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 56, y: 95, label: 'D' },
        { id: 'd2', team: 'home', x: 74, y: 88, label: 'D' },
        { id: 'f1', team: 'away', x: 66, y: 90, label: 'F' },
        { id: 'w', team: 'home', x: 14, y: 72, label: 'W' },
      ],
      puck: { x: 55, y: 96 },
      arrows: [{ fromX: 66, fromY: 90, toX: 58, toY: 94 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 58, y: 72 },
            d2: { x: 60, y: 64 },
            f1: { x: 70, y: 45 },
            w: { x: 20, y: 58 },
          },
          puck: { x: 82, y: 60 },
          narration: 'In it comes on your right side - you and the forechecker both take off.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 66, y: 82 },
            d2: { x: 64, y: 74 },
            f1: { x: 68, y: 60 },
            w: { x: 16, y: 66 },
          },
          puck: { x: 86, y: 84 },
          narration: "You'll get there first, but not by much.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 74, y: 92 },
            d2: { x: 68, y: 82 },
            f1: { x: 70, y: 74 },
            w: { x: 15, y: 70 },
          },
          puck: { x: 75, y: 93 },
          narration: "You collect it and take it behind the net - he's chasing hard on your hip.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 56, y: 95 },
            d2: { x: 74, y: 88 },
            f1: { x: 66, y: 90 },
            w: { x: 14, y: 72 },
          },
          puck: { x: 55, y: 96 },
          narration: 'Your partner peels into the corner you just left...',
        },
        { t: 13 },
      ],
      freezeLine: "Freeze it. He's chasing you behind the net at full speed. What now?",
    },
  },
  {
    id: 'bo-wheel-play',
    zone: 'defensive',
    category: 'wheel',
    difficulty: 'varsity',
    title: 'The Wheel',
    setup:
      'You retrieve with a full head of steam. The lone forechecker takes a flat angle across, and the lane behind the net is open.',
    kind: 'mcq',
    options: [
      {
        text: 'Stop up and set it behind the net',
        correct: false,
        feedback:
          'You kill your own speed advantage. The forecheck gets organized while you stand still.',
        trap: 'Setting the puck feels calm, but calm is what the forecheck wants from you.',
      },
      {
        text: 'Pass D-to-D to your partner',
        correct: false,
        feedback:
          'Your partner is standing still at the post. You trade all your speed for a stationary puck.',
        trap: 'D-to-D is the default - but defaults are for when you do not have a step.',
      },
      {
        text: 'Rim it around the strong-side wall',
        correct: false,
        feedback:
          'You rim it into a 50/50 wall battle while you were clean with the puck. Why gamble?',
        trap: 'The rim feels safe, but it turns your possession into a coin flip.',
      },
      {
        text: 'Keep your speed and wheel it out',
        correct: true,
        feedback:
          'His flat angle cannot catch a moving target. You wheel behind the net and carry it out clean.',
      },
    ],
    coachCue: 'Got speed and the net? Wheel it.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 62, y: 93, label: 'D' },
        { id: 'f1', team: 'away', x: 44, y: 80, label: 'F' },
        { id: 'd2', team: 'home', x: 30, y: 88, label: 'D' },
        { id: 'c', team: 'home', x: 55, y: 60, label: 'C' },
      ],
      puck: { x: 63, y: 94 },
      arrows: [{ fromX: 44, fromY: 80, toX: 56, toY: 88 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 52, y: 62 },
            f1: { x: 40, y: 50 },
            d2: { x: 36, y: 66 },
            c: { x: 50, y: 45 },
          },
          puck: { x: 78, y: 55 },
          narration: 'The dump-in rattles around your right corner.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 60, y: 74 },
            f1: { x: 42, y: 62 },
            d2: { x: 33, y: 76 },
            c: { x: 52, y: 52 },
          },
          puck: { x: 84, y: 80 },
          narration: 'You build speed on the retrieval - their forechecker takes a flat angle across.',
        },
        {
          t: 7.5,
          players: {
            d: { x: 68, y: 88 },
            f1: { x: 43, y: 72 },
            d2: { x: 31, y: 83 },
            c: { x: 54, y: 56 },
          },
          puck: { x: 69, y: 89 },
          narration: "You scoop it up at full stride - he's cutting across, not down.",
        },
        {
          t: 11.5,
          players: {
            d: { x: 62, y: 93 },
            f1: { x: 44, y: 80 },
            d2: { x: 30, y: 88 },
            c: { x: 55, y: 60 },
          },
          puck: { x: 63, y: 94 },
          narration: 'The back of the net is wide open in front of you...',
        },
        { t: 13 },
      ],
      freezeLine: "Hold it. You've got speed and a step on him. What's your play?",
    },
  },
  {
    id: 'bo-rim-or-pass',
    zone: 'defensive',
    category: 'rim-read',
    difficulty: 'varsity',
    title: 'Rim or Pass',
    setup:
      'You cut off a dump in your right corner. Your winger posts on the wall, but their D is pinching down hard on his back.',
    kind: 'mcq',
    options: [
      {
        text: 'Rim it hard and high past the pinch',
        correct: true,
        feedback:
          'The hard rim beats the pinching D over his stick. Your winger chips it by and now it is behind everyone.',
      },
      {
        text: 'Firm tape-to-tape pass to the winger',
        correct: false,
        feedback:
          'The pass arrives at the same time as the pinching D. Your winger gets buried and the puck stays in.',
        trap: 'Tape-to-tape is usually the answer - not when a defenseman is on his back.',
      },
      {
        text: 'Go back to your partner and reset',
        correct: false,
        feedback:
          'You already beat the first wave. Resetting hands the forecheck time to reload and come again.',
        trap: 'Patience sounds mature, but you are giving back ice you already won.',
      },
      {
        text: 'Carry it up the middle yourself',
        correct: false,
        feedback:
          'The middle of your own zone is the highest-risk ice on the rink. One poke check and it is a chance against.',
        trap: 'The middle looks open right until their center closes it.',
      },
    ],
    coachCue: 'Pinch on the wall? Rim it hard and high.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 78, y: 88, label: 'D' },
        { id: 'w', team: 'home', x: 84, y: 66, label: 'W' },
        { id: 'pd', team: 'away', x: 86, y: 58, label: 'D' },
        { id: 'f1', team: 'away', x: 66, y: 80, label: 'F' },
      ],
      puck: { x: 78, y: 88 },
      arrows: [{ fromX: 86, fromY: 58, toX: 85, toY: 65 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 66, y: 74 },
            w: { x: 76, y: 58 },
            pd: { x: 86, y: 44 },
            f1: { x: 55, y: 60 },
          },
          puck: { x: 84, y: 45 },
          narration: 'Their point man walks the line on your right side.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 72, y: 80 },
            w: { x: 80, y: 60 },
            pd: { x: 86, y: 50 },
            f1: { x: 60, y: 68 },
          },
          puck: { x: 88, y: 72 },
          narration: "He throws it at the net - it's wide, ringing around the wall.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 77, y: 86 },
            w: { x: 83, y: 63 },
            pd: { x: 86, y: 54 },
            f1: { x: 63, y: 74 },
          },
          puck: { x: 79, y: 88 },
          narration: 'You cut it off in the corner - your winger posts up on the wall.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 78, y: 88 },
            w: { x: 84, y: 66 },
            pd: { x: 86, y: 58 },
            f1: { x: 66, y: 80 },
          },
          puck: { x: 78, y: 88 },
          narration: "Their D is pinching right down your winger's back...",
        },
        { t: 13 },
      ],
      freezeLine: 'Stop it. Winger on the wall, their D pinching on him. Tape or wall?',
    },
  },
  {
    id: 'bo-faceoff-quick-up',
    zone: 'defensive',
    category: 'faceoff',
    difficulty: 'varsity',
    title: 'Won Draw, Now What',
    setup:
      'Defensive-zone draw, left dot. Your center wins it clean back to you in the corner. Their forwards are still in faceoff spots.',
    kind: 'mcq',
    options: [
      {
        text: 'Hold it and let things develop',
        correct: false,
        feedback:
          'The win bought you two seconds. Waiting spends them, and their forwards release into a full forecheck.',
        trap: 'Composure is great - but a won draw is a head start, not a rest stop.',
      },
      {
        text: 'Rim it around to the far side',
        correct: false,
        feedback:
          "Their far winger's first job off a lost draw is to jump that rim. You feed him the puck.",
        trap: 'Switching sides sounds clever, but the weak-side rim is the most scouted play in hockey.',
      },
      {
        text: 'Quick up the wall to your releasing winger',
        correct: true,
        feedback:
          'The set play. Your winger seals his check and the puck is out before their forwards recover from the dot.',
      },
      {
        text: 'Walk it behind the net to switch sides',
        correct: false,
        feedback:
          'Their center comes straight off the lost draw at you. You skate a clean win into a forecheck.',
        trap: 'Time and space behind the net - except the clock started the moment the puck dropped.',
      },
    ],
    coachCue: 'Win the draw, get it out fast.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 18, y: 88, label: 'D' },
        { id: 'c', team: 'home', x: 30, y: 80, label: 'C' },
        { id: 'ac', team: 'away', x: 32, y: 78, label: 'C' },
        { id: 'w', team: 'home', x: 12, y: 70, label: 'W' },
        { id: 'af', team: 'away', x: 20, y: 60, label: 'F' },
      ],
      puck: { x: 18, y: 88 },
      arrows: [{ fromX: 18, fromY: 88, toX: 13, toY: 74, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 24, y: 84 },
            c: { x: 29, y: 79 },
            ac: { x: 31, y: 77 },
            w: { x: 16, y: 74 },
            af: { x: 20, y: 66 },
          },
          puck: { x: 30, y: 78 },
          narration: 'Defensive-zone draw, left dot - your center leans in.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 22, y: 85 },
            c: { x: 30, y: 80 },
            ac: { x: 32, y: 78 },
            w: { x: 15, y: 72 },
            af: { x: 20, y: 63 },
          },
          puck: { x: 20, y: 86 },
          narration: "He wins it clean - the puck's back to you in the corner.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 19, y: 87 },
            c: { x: 30, y: 80 },
            ac: { x: 32, y: 78 },
            w: { x: 13, y: 71 },
            af: { x: 20, y: 62 },
          },
          puck: { x: 19, y: 88 },
          narration: 'The centers are tied up - your winger seals his man on the wall.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 18, y: 88 },
            c: { x: 30, y: 80 },
            ac: { x: 32, y: 78 },
            w: { x: 12, y: 70 },
            af: { x: 20, y: 60 },
          },
          puck: { x: 18, y: 88 },
          narration: 'Their wingers are still flat-footed at the top of the circle...',
        },
        { t: 13 },
      ],
      freezeLine: 'Freeze it right there. Clean win back to you. Where does it go?',
    },
  },
  // ---------------------------------------------------------- elite
  {
    id: 'bo-weak-side-switch',
    zone: 'defensive',
    category: 'breakout',
    difficulty: 'elite',
    title: 'Break Out the Other Side',
    setup:
      'You have the puck behind your net with one beat. Their D has pinched down on your right winger, and a forechecker curls in after you.',
    kind: 'mcq',
    options: [
      {
        text: 'Quick up to your strong-side winger',
        correct: false,
        feedback:
          'Look at the freeze - their pinching D is glued to his back. That pass is a turnover at the wall.',
        trap: 'The strong-side quick-up is the drilled play. The pinch is exactly why it is off.',
      },
      {
        text: 'Rim it hard around the strong side',
        correct: false,
        feedback:
          'Their D is already low on the boards. The rim goes straight into his skates and stays in.',
        trap: 'A hard rim usually beats a pinch - not when he has already finished pinching.',
      },
      {
        text: 'Skate it out through the middle',
        correct: false,
        feedback:
          "The forechecker curling in cuts off the middle before your second stride. You carry into the fence.",
        trap: 'The ice in front of you looks open - for exactly one more second.',
      },
      {
        text: 'Hit the weak-side winger on the far wall',
        correct: true,
        feedback:
          'Everything they have is stacked on the right. One crisp pass and your left winger walks out into a vacated point.',
      },
    ],
    coachCue: 'They overload one side? Break out the other.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 54, y: 95, label: 'D' },
        { id: 'f1', team: 'away', x: 64, y: 86, label: 'F' },
        { id: 'rw', team: 'home', x: 86, y: 70, label: 'W' },
        { id: 'pd', team: 'away', x: 88, y: 64, label: 'D' },
        { id: 'lw', team: 'home', x: 14, y: 70, label: 'W' },
      ],
      puck: { x: 54, y: 95 },
      arrows: [
        { fromX: 88, fromY: 64, toX: 87, toY: 69 },
        { fromX: 64, fromY: 86, toX: 58, toY: 92 },
      ],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 60, y: 72 },
            f1: { x: 68, y: 48 },
            rw: { x: 80, y: 52 },
            pd: { x: 88, y: 42 },
            lw: { x: 25, y: 55 },
          },
          puck: { x: 80, y: 60 },
          narration: 'They flip it into your right corner and send one man.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 70, y: 84 },
            f1: { x: 66, y: 62 },
            rw: { x: 83, y: 58 },
            pd: { x: 87, y: 48 },
            lw: { x: 20, y: 62 },
          },
          puck: { x: 84, y: 82 },
          narration: 'You go back for it - their right D creeps down the boards.',
        },
        {
          t: 7.5,
          players: {
            d: { x: 66, y: 92 },
            f1: { x: 65, y: 74 },
            rw: { x: 85, y: 64 },
            pd: { x: 88, y: 56 },
            lw: { x: 16, y: 66 },
          },
          puck: { x: 66, y: 93 },
          narration: 'You pick it up and duck behind the net - their D pinches down on your winger.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 54, y: 95 },
            f1: { x: 64, y: 86 },
            rw: { x: 86, y: 70 },
            pd: { x: 88, y: 64 },
            lw: { x: 14, y: 70 },
          },
          puck: { x: 54, y: 95 },
          narration: 'The whole right side is packed - their forechecker curls in after you...',
        },
        { t: 13 },
      ],
      freezeLine: 'Stop the tape. Look at the ice. Where does this puck go?',
    },
  },
  {
    id: 'bo-overrun-escape',
    zone: 'defensive',
    category: 'escape',
    difficulty: 'elite',
    title: 'He Overran It',
    setup:
      'You win the race to the left corner. The first forechecker slides past you below the goal line, and their second man sags toward your partner.',
    kind: 'mcq',
    options: [
      {
        text: 'Reverse it to your partner behind the net',
        correct: false,
        feedback:
          'Check the freeze - their second forward is already dropping onto that lane. The reverse arrives with a hit.',
        trap: 'The reverse is the textbook answer against a chase. They scouted the textbook.',
      },
      {
        text: 'Turn up the wall and skate it out',
        correct: true,
        feedback:
          'He overskated below the puck. The wall above you is the emptiest ice on the rink - take it.',
      },
      {
        text: 'Keep going around behind the net',
        correct: false,
        feedback:
          'You skate away from the ice the overrun just gave you and into the second forechecker instead.',
        trap: 'Momentum says keep going, but the open door is behind you now.',
      },
      {
        text: 'Bank it off the far glass and out',
        correct: false,
        feedback:
          'From below your goal line that is a blind prayer - and it lands right at their point man.',
        trap: 'When in doubt, glass. But you are not in doubt - you have a clean exit.',
      },
    ],
    coachCue: 'He overskates, you walk out.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 20, y: 90, label: 'D' },
        { id: 'f1', team: 'away', x: 13, y: 96, label: 'F' },
        { id: 'd2', team: 'home', x: 60, y: 94, label: 'D' },
        { id: 'f2', team: 'away', x: 62, y: 82, label: 'F' },
      ],
      puck: { x: 20, y: 91 },
      arrows: [
        { fromX: 13, fromY: 96, toX: 10, toY: 98 },
        { fromX: 62, fromY: 82, toX: 61, toY: 89 },
      ],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 42, y: 68 },
            f1: { x: 35, y: 42 },
            d2: { x: 58, y: 70 },
            f2: { x: 55, y: 45 },
          },
          puck: { x: 25, y: 55 },
          narration: 'The dump comes down your left side with a forechecker flying after it.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 32, y: 80 },
            f1: { x: 30, y: 58 },
            d2: { x: 58, y: 80 },
            f2: { x: 56, y: 58 },
          },
          puck: { x: 12, y: 78 },
          narration: "You've got the inside line - he's coming in hot.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 23, y: 88 },
            f1: { x: 24, y: 76 },
            d2: { x: 59, y: 88 },
            f2: { x: 60, y: 70 },
          },
          puck: { x: 21, y: 89 },
          narration: 'You touch it first - he launches in for the finish.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 20, y: 90 },
            f1: { x: 13, y: 96 },
            d2: { x: 60, y: 94 },
            f2: { x: 62, y: 82 },
          },
          puck: { x: 20, y: 91 },
          narration: 'He slides right past you, below the goal line...',
        },
        { t: 13 },
      ],
      freezeLine: "Freeze. Look where the first forechecker just ended up. What's your move?",
    },
  },
  {
    id: 'bo-tap-two-man',
    zone: 'defensive',
    category: 'forecheck',
    difficulty: 'elite',
    title: 'Beat the Two-Man Forecheck',
    setup:
      'A 2-1-2 forecheck: one man on you behind the net, the second peeling onto your partner, their winger locking the right wall. Tap where the puck goes.',
    kind: 'tap',
    tapTargets: [
      {
        x: 46,
        y: 76,
        radius: 8,
        correct: true,
        feedback:
          'Both their forwards are below the puck. The bump to your center in the middle beats the whole forecheck.',
        label: 'Middle',
      },
      {
        x: 78,
        y: 88,
        radius: 8,
        correct: false,
        feedback:
          'Their second forward is already on your partner. The reverse arrives with a freight train.',
        label: 'Partner',
      },
      {
        x: 88,
        y: 70,
        radius: 8,
        correct: false,
        feedback:
          'On a 2-1-2 their winger locks that wall. The rim dies on his stick every time.',
        label: 'Strong wall',
      },
      {
        x: 14,
        y: 64,
        radius: 8,
        correct: false,
        feedback:
          'A long backhand heave across the zone - their weak-side D reads it all the way.',
        label: 'Far wall',
      },
    ],
    coachCue: 'Two men deep? The middle is yours.',
    visual: {
      rinkZone: 'defensive',
      players: [
        { id: 'd', team: 'home', x: 54, y: 96, label: 'D' },
        { id: 'd2', team: 'home', x: 78, y: 88, label: 'D' },
        { id: 'c', team: 'home', x: 46, y: 76, label: 'C' },
        { id: 'f1', team: 'away', x: 60, y: 90, label: 'F' },
        { id: 'f2', team: 'away', x: 72, y: 84, label: 'F' },
      ],
      puck: { x: 54, y: 96 },
      arrows: [
        { fromX: 60, fromY: 90, toX: 56, toY: 94 },
        { fromX: 72, fromY: 84, toX: 76, toY: 87 },
      ],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 52, y: 66 },
            d2: { x: 62, y: 62 },
            c: { x: 50, y: 50 },
            f1: { x: 58, y: 42 },
            f2: { x: 66, y: 44 },
          },
          puck: { x: 70, y: 50 },
          narration: 'They send two men in hard behind the dump.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 58, y: 78 },
            d2: { x: 68, y: 74 },
            c: { x: 48, y: 58 },
            f1: { x: 60, y: 56 },
            f2: { x: 68, y: 58 },
          },
          puck: { x: 82, y: 76 },
          narration: "The first forechecker hunts you - the second one's coming too.",
        },
        {
          t: 7.5,
          players: {
            d: { x: 66, y: 90 },
            d2: { x: 74, y: 82 },
            c: { x: 47, y: 66 },
            f1: { x: 61, y: 72 },
            f2: { x: 70, y: 70 },
          },
          puck: { x: 67, y: 91 },
          narration: 'You get to it first and tuck behind the net - both of them keep coming.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 54, y: 96 },
            d2: { x: 78, y: 88 },
            c: { x: 46, y: 76 },
            f1: { x: 60, y: 90 },
            f2: { x: 72, y: 84 },
          },
          puck: { x: 54, y: 96 },
          narration: 'The second man peels onto your partner, and your center bumps into the middle...',
        },
        { t: 13 },
      ],
      freezeLine: 'Stop it there. Two men deep on you. Tap where this puck goes.',
    },
  },
];
