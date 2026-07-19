import type { Scenario } from '@/types';

export const EVEN_STRENGTH_SCENARIOS: Scenario[] = [
  // ============================================================ defensive
  {
    id: 'dz-net-front-boxout',
    zone: 'defensive',
    category: 'net-front',
    difficulty: 'varsity',
    title: 'Box Out the Net Front',
    setup:
      'Their point man is loading a shot. Their winger is camped on your net front, hunting a tip.',
    kind: 'mcq',
    options: [
      {
        text: 'Leave him and charge out at the point shot',
        correct: false,
        feedback: 'You never get there. Now your man is alone at the crease for the rebound.',
        trap: 'Blocking the shot feels brave, but you abandoned the real danger.',
      },
      {
        text: 'Drop low to screen the shot for your goalie',
        correct: false,
        feedback: 'You blind your own goalie and let your man walk to the front untouched.',
        trap: 'Getting in the lane sounds helpful - screening your own goalie never is.',
      },
      {
        text: 'Puck-watch and react once it is on net',
        correct: false,
        feedback: 'Watch the puck, lose the man. He gets inside position and buries the tip.',
        trap: 'Tracking the shot feels alert - the net-front battle was already lost.',
      },
      {
        text: 'Body him to the net side and tie up his stick',
        correct: true,
        feedback:
          'Seal him off the paint, stick on stick. No tip, no rebound, no second chance.',
      },
    ],
    coachCue: 'Find your man, seal him net-side.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'pt', team: 'away', x: 42, y: 70, label: 'D' },
        { id: 'nf', team: 'away', x: 52, y: 84, label: 'F' },
        { id: 'd', team: 'home', x: 49, y: 87, label: 'D' },
        { id: 'g', team: 'home', x: 50, y: 93, label: 'G' },
      ],
      puck: { x: 42, y: 70 },
      arrows: [{ fromX: 42, fromY: 70, toX: 51, toY: 91, dashed: true }],
      highlights: [{ x: 52, y: 84, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            pt: { x: 55, y: 58 },
            nf: { x: 40, y: 74 },
            d: { x: 46, y: 80 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 55, y: 58 },
          narration: 'They set up in your zone and swing it back to the point.',
        },
        {
          t: 4,
          players: { pt: { x: 48, y: 66 }, nf: { x: 46, y: 80 }, d: { x: 48, y: 84 } },
          puck: { x: 48, y: 66 },
          narration: 'The point man slides to the middle, looking for a shooting lane.',
        },
        {
          t: 8,
          players: { pt: { x: 44, y: 69 }, nf: { x: 50, y: 82 }, d: { x: 49, y: 85 } },
          puck: { x: 44, y: 69 },
          narration: 'Their winger plants himself right on your doorstep, stick down for a tip.',
        },
        {
          t: 11.5,
          players: {
            pt: { x: 42, y: 70 },
            nf: { x: 52, y: 84 },
            d: { x: 49, y: 87 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 42, y: 70 },
          narration: 'The point man loads up, your man screening tight on the crease...',
        },
        { t: 13 },
      ],
      freezeLine: "Shot's loading and their winger owns your net front. What's your job?",
      narration:
        'They set up in your zone and swing it back to the point. The point man slides to the middle hunting a lane while their winger plants himself right on your doorstep. Now the shot is loading and your man is screening tight on the crease.',
    },
  },
  {
    id: 'dz-backside-weakside-seal',
    zone: 'defensive',
    category: 'coverage',
    difficulty: 'varsity',
    title: 'Seal the Backdoor',
    setup:
      'The puck is worked on the far wall. A backdoor forward is sneaking to the weak-side post on your side.',
    kind: 'mcq',
    options: [
      {
        text: 'Slide across to help pressure the puck',
        correct: false,
        feedback: 'You leave the backdoor wide open. One pass across and it is a tap-in.',
        trap: 'Helping on the puck feels active - it is exactly what they want you to do.',
      },
      {
        text: 'Ball-watch the puck on the far wall',
        correct: false,
        feedback: 'Eyes on the puck, your man slips in behind you for the empty net.',
        trap: 'Watching the play feels natural - the danger is the man you forgot.',
      },
      {
        text: 'Stay tight to the backdoor man at the weak-side post',
        correct: true,
        feedback:
          'Head on a swivel, body on his hip. The cross-ice pass finds nobody but you.',
      },
      {
        text: 'Collapse into the crease beside your goalie',
        correct: false,
        feedback: 'Too deep. Your man gets the post and a clean lane the moment the pass comes.',
        trap: 'The crease feels safe - it hands your man the ice that actually scores.',
      },
    ],
    coachCue: 'Weak-side goals come from the backdoor man.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'pc', team: 'away', x: 18, y: 78, label: 'F' },
        { id: 'bd', team: 'away', x: 60, y: 86, label: 'F' },
        { id: 'p', team: 'home', x: 24, y: 78, label: 'D' },
        { id: 'd', team: 'home', x: 56, y: 84, label: 'D' },
        { id: 'g', team: 'home', x: 50, y: 93, label: 'G' },
      ],
      puck: { x: 18, y: 78 },
      arrows: [{ fromX: 18, fromY: 78, toX: 60, toY: 86, dashed: true }],
      highlights: [{ x: 60, y: 86, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            pc: { x: 30, y: 60 },
            bd: { x: 66, y: 58 },
            p: { x: 36, y: 64 },
            d: { x: 60, y: 62 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 30, y: 60 },
          narration: 'They work it into your end, moving it to the far wall.',
        },
        {
          t: 4,
          players: {
            pc: { x: 22, y: 70 },
            bd: { x: 64, y: 72 },
            p: { x: 28, y: 72 },
            d: { x: 58, y: 74 },
          },
          puck: { x: 22, y: 70 },
          narration: 'The carrier settles low on the strong-side wall, your partner on him.',
        },
        {
          t: 8,
          players: {
            pc: { x: 18, y: 76 },
            bd: { x: 62, y: 80 },
            p: { x: 24, y: 77 },
            d: { x: 57, y: 80 },
          },
          puck: { x: 18, y: 76 },
          narration: 'Watch the weak side - their forward is sneaking to your back post.',
        },
        {
          t: 11.5,
          players: {
            pc: { x: 18, y: 78 },
            bd: { x: 60, y: 86 },
            p: { x: 24, y: 78 },
            d: { x: 56, y: 84 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 18, y: 78 },
          narration: 'He is stopping at the backdoor, stick down, calling for it cross-ice...',
        },
        { t: 13 },
      ],
      freezeLine: "Puck's on the far wall and a man's sliding to your back post. Where are you?",
      narration:
        'They work it into your end and move it to the far wall, where the carrier settles low with your partner on him. Watch the weak side - their forward is sneaking to your back post, stopping there with his stick down, calling for it cross-ice.',
    },
  },
  {
    id: 'dz-dtod-under-forecheck',
    zone: 'defensive',
    category: 'breakout',
    difficulty: 'varsity',
    title: 'D-to-D Under Pressure',
    setup:
      'You retrieve behind your net. Their F1 forechecks hard on your strong side. Your partner is open on the far side.',
    kind: 'mcq',
    options: [
      {
        text: 'Force it up the pressured strong-side wall',
        correct: false,
        feedback: 'You throw it into the forecheck. It gets stopped at the wall and stays in.',
        trap: 'The wall is the drilled outlet - not when a forechecker is sitting on it.',
      },
      {
        text: 'Slide it D-to-D to your open partner',
        correct: true,
        feedback:
          'One forechecker cannot cover both sides. Your partner takes it with time and skates it out.',
      },
      {
        text: 'Blind rim it around the boards',
        correct: false,
        feedback: 'A blind rim is a coin flip. Their point man pinches and it never leaves.',
        trap: 'The rim feels safe, but you are giving it away with extra steps.',
      },
      {
        text: 'Skate straight at the forechecker to beat him',
        correct: false,
        feedback: 'You skate into the hit. The puck squirts loose right in front of your net.',
        trap: 'Your legs feel good - but he took that angle for a reason.',
      },
    ],
    coachCue: "One forechecker can't cover both sides.",
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 60, y: 96, label: 'D' },
        { id: 'p', team: 'home', x: 30, y: 86, label: 'D' },
        { id: 'f1', team: 'away', x: 52, y: 88, label: 'F' },
        { id: 'g', team: 'home', x: 50, y: 95, label: 'G' },
      ],
      puck: { x: 60, y: 96 },
      arrows: [{ fromX: 60, fromY: 96, toX: 32, toY: 87, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 70, y: 74 },
            p: { x: 38, y: 74 },
            f1: { x: 60, y: 50 },
            g: { x: 50, y: 95 },
          },
          puck: { x: 84, y: 64 },
          narration: 'They dump it into your right corner and send a man on the forecheck.',
        },
        {
          t: 4,
          players: { d: { x: 72, y: 86 }, p: { x: 34, y: 80 }, f1: { x: 60, y: 66 } },
          puck: { x: 86, y: 82 },
          narration: 'You wheel back to collect it, your partner reads it and heads far side.',
        },
        {
          t: 8,
          players: { d: { x: 66, y: 94 }, p: { x: 31, y: 84 }, f1: { x: 56, y: 80 } },
          puck: { x: 70, y: 92 },
          narration: 'F1 angles down your strong side, taking away the wall.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 60, y: 96 },
            p: { x: 30, y: 86 },
            f1: { x: 52, y: 88 },
            g: { x: 50, y: 95 },
          },
          puck: { x: 60, y: 96 },
          narration: 'You have it behind the net, pressure closing, your partner wide open far side...',
        },
        { t: 13 },
      ],
      freezeLine: "F1's on your strong side and your partner's open far side. Where's the puck?",
      narration:
        'They dump it into your right corner and send a man in hard. You wheel back behind your net to collect it while your partner reads the play and heads far side. F1 angles down your strong side to take away the wall, and now you have it behind the net with your partner wide open the other way.',
    },
  },
  {
    id: 'dz-reverse-under-pressure',
    zone: 'defensive',
    category: 'breakout',
    difficulty: 'elite',
    title: 'Reverse the Forecheck',
    setup:
      'You reach a dump-in on the wall first. F1 is bearing down on your hip. Your winger is stopped up the wall above you.',
    kind: 'mcq',
    options: [
      {
        text: 'Wheel up the wall into the forechecker',
        correct: false,
        feedback: 'You turn straight into his check. Puck loose, and he is between you and your net.',
        trap: 'Beating him up the wall feels fast - he has the angle and the hit.',
      },
      {
        text: 'Reverse it hard off the wall the other way',
        correct: true,
        feedback:
          'His momentum carries him past. The reverse goes against the grain into open ice for your D.',
      },
      {
        text: 'Bank it blindly off the glass into traffic',
        correct: false,
        feedback: 'A blind bank up the middle finds their forward as often as yours. Chance against.',
        trap: 'Glass-and-out feels safe - blind into traffic is just a giveaway.',
      },
      {
        text: 'Force it up the wall to your stopped winger',
        correct: false,
        feedback: 'He is flat-footed with a checker on him. The pass dies right at the wall.',
        trap: 'The winger is the outlet - not when he is stopped and covered.',
      },
    ],
    coachCue: 'Beat to the wall? Reverse off the boards.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 84, y: 84, label: 'D' },
        { id: 'f1', team: 'away', x: 80, y: 78, label: 'F' },
        { id: 'd2', team: 'home', x: 60, y: 94, label: 'D' },
        { id: 'w', team: 'home', x: 86, y: 62, label: 'W' },
      ],
      puck: { x: 84, y: 84 },
      arrows: [{ fromX: 84, fromY: 84, toX: 64, toY: 93, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 74, y: 62 },
            f1: { x: 66, y: 44 },
            d2: { x: 56, y: 72 },
            w: { x: 84, y: 46 },
          },
          puck: { x: 88, y: 52 },
          narration: 'The puck is dumped down your right wall, and it is a race to get it.',
        },
        {
          t: 4,
          players: {
            d: { x: 80, y: 74 },
            f1: { x: 74, y: 62 },
            d2: { x: 58, y: 82 },
            w: { x: 85, y: 54 },
          },
          puck: { x: 90, y: 74 },
          narration: 'You win it by a step, F1 coming in hot right on your hip.',
        },
        {
          t: 8,
          players: {
            d: { x: 85, y: 80 },
            f1: { x: 82, y: 72 },
            d2: { x: 59, y: 88 },
            w: { x: 86, y: 58 },
          },
          puck: { x: 85, y: 80 },
          narration: 'Your winger stops up the wall, but a checker steps in front of him.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 84, y: 84 },
            f1: { x: 80, y: 78 },
            d2: { x: 60, y: 94 },
            w: { x: 86, y: 62 },
          },
          puck: { x: 84, y: 84 },
          narration: 'You are on the puck, he is flying past your hip, your partner low and open...',
        },
        { t: 13 },
      ],
      freezeLine: "He's flying past your hip on the wall. How do you beat his momentum?",
      narration:
        'The puck is dumped down your right wall and it is a race to get there. You win it by a step with F1 coming in hot on your hip. Your winger stops up the wall but a checker steps in front of him, and now you are on the puck with the forechecker flying past you.',
    },
  },
  {
    id: 'dz-middle-drive-funnel',
    zone: 'defensive',
    category: 'gap',
    difficulty: 'varsity',
    title: 'Funnel the Middle Drive',
    setup:
      'A rush comes with a forward driving the middle lane at your net. You are the strong-side D.',
    kind: 'mcq',
    options: [
      {
        text: 'Dive at the puck to knock it off him',
        correct: false,
        feedback: 'You miss and end up on the ice. He walks into the slot with a clear lane.',
        trap: 'A big poke ends it - if you get it. Miss, and you gave up the middle.',
      },
      {
        text: 'Overcommit to the outside to force a turnover',
        correct: false,
        feedback: 'He cuts back inside off your overcommit and is gone through the middle.',
        trap: 'Pressuring hard feels aggressive - it opens the exact lane he wanted.',
      },
      {
        text: 'Keep inside position and funnel him outside',
        correct: true,
        feedback:
          'Stay net-side, steer him wide toward your help. He gets the outside, never the middle.',
      },
      {
        text: 'Back all the way to the net and give ground',
        correct: false,
        feedback: 'You concede the whole slot. He picks his spot and shoots at will.',
        trap: 'Protecting the crease early feels safe - it just hands him the danger zone.',
      },
    ],
    coachCue: 'Inside position. Funnel him to your help.',
    visual: {
      rinkZone: 'defensive',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 46, y: 66, label: 'F' },
        { id: 'd', team: 'home', x: 50, y: 74, label: 'D' },
        { id: 'd2', team: 'home', x: 68, y: 76, label: 'D' },
        { id: 'g', team: 'home', x: 50, y: 93, label: 'G' },
      ],
      puck: { x: 46, y: 66 },
      arrows: [{ fromX: 46, fromY: 66, toX: 48, toY: 82 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 48, y: 34 },
            d: { x: 50, y: 52 },
            d2: { x: 66, y: 50 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 48, y: 34 },
          narration: 'They gain the zone with a forward carrying down the middle.',
        },
        {
          t: 4,
          players: { a1: { x: 47, y: 48 }, d: { x: 50, y: 60 }, d2: { x: 67, y: 58 } },
          puck: { x: 47, y: 48 },
          narration: 'He drives straight at your net, eyeing the slot.',
        },
        {
          t: 8,
          players: { a1: { x: 46, y: 58 }, d: { x: 50, y: 68 }, d2: { x: 68, y: 68 } },
          puck: { x: 46, y: 58 },
          narration: 'You are backing up square, keeping your body between him and the net.',
        },
        {
          t: 11.5,
          players: {
            a1: { x: 46, y: 66 },
            d: { x: 50, y: 74 },
            d2: { x: 68, y: 76 },
            g: { x: 50, y: 93 },
          },
          puck: { x: 46, y: 66 },
          narration: 'He is bearing down the middle lane, still coming, help off your shoulder...',
        },
        { t: 13 },
      ],
      freezeLine: "He's driving the middle on you. How do you take away the danger?",
      narration:
        'They gain the zone with a forward carrying down the middle. He drives straight at your net, eyeing the slot, and you back up square with your body between him and the goal. Now he is bearing down the middle lane, still coming, your help off your shoulder.',
    },
  },
  // ============================================================ neutral
  {
    id: 'nz-stretch-pass-stepup',
    zone: 'neutral',
    category: 'gap',
    difficulty: 'elite',
    title: 'Step Up on the Stretch',
    setup:
      'They chip a stretch pass toward a winger cheating up your wall. You have inside position, your partner is even with you.',
    kind: 'mcq',
    options: [
      {
        text: 'Step up at the line and body the winger',
        correct: true,
        feedback:
          'You have inside position and support. Kill it at the line before he ever turns up ice.',
      },
      {
        text: 'Back off and give him the blue line',
        correct: false,
        feedback: 'You hand him a clean entry with speed. Now you are defending a rush for nothing.',
        trap: 'Backing off never gets beat wide - it also concedes the zone for free.',
      },
      {
        text: 'Turn and skate back with him toward your net',
        correct: false,
        feedback: 'You give up your inside edge and race a faster man to your own end.',
        trap: 'Retreating feels safe with speed coming - here you already had him beaten.',
      },
      {
        text: 'Reach for the stretch pass with your stick',
        correct: false,
        feedback: 'You lunge, miss, and he catches it behind you with a full head of steam.',
        trap: 'Picking off the pass looks clean - a miss turns into a breakaway.',
      },
    ],
    coachCue: 'Inside position and help? Step up.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'bd', team: 'away', x: 45, y: 20, label: 'D' },
        { id: 'w', team: 'away', x: 22, y: 55, label: 'F' },
        { id: 'd', team: 'home', x: 26, y: 62, label: 'D' },
        { id: 'd2', team: 'home', x: 50, y: 62, label: 'D' },
      ],
      puck: { x: 45, y: 20 },
      arrows: [{ fromX: 45, fromY: 20, toX: 22, toY: 55, dashed: true }],
      highlights: [{ x: 22, y: 55, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            bd: { x: 52, y: 14 },
            w: { x: 28, y: 44 },
            d: { x: 32, y: 50 },
            d2: { x: 52, y: 50 },
          },
          puck: { x: 52, y: 14 },
          narration: 'Their D retrieves deep in their own end and looks to spring a man up ice.',
        },
        {
          t: 4,
          players: { bd: { x: 48, y: 17 }, w: { x: 24, y: 50 }, d: { x: 28, y: 56 }, d2: { x: 51, y: 56 } },
          puck: { x: 48, y: 17 },
          narration: 'Their winger cheats up your wall, leaning for the stretch.',
        },
        {
          t: 8,
          players: { bd: { x: 46, y: 19 }, w: { x: 22, y: 53 }, d: { x: 27, y: 60 }, d2: { x: 50, y: 60 } },
          puck: { x: 46, y: 19 },
          narration: 'You read it early, sliding inside of him, your partner even with you.',
        },
        {
          t: 11.5,
          players: {
            bd: { x: 45, y: 20 },
            w: { x: 22, y: 55 },
            d: { x: 26, y: 62 },
            d2: { x: 50, y: 62 },
          },
          puck: { x: 45, y: 20 },
          narration: 'The D winds up to chip it, their winger loading up your wall...',
        },
        { t: 13 },
      ],
      freezeLine: "You've got him inside with help even. What do you do at the line?",
      narration:
        'Their D retrieves deep in their own end and looks to spring a man up ice. Their winger cheats up your wall, leaning for the stretch, and you read it early, sliding inside of him with your partner even. Now the D winds up to chip it as the winger loads up your wall.',
    },
  },
  {
    id: 'nz-read-the-trailer',
    zone: 'neutral',
    category: 'rush',
    difficulty: 'elite',
    title: 'Read the Trailer',
    setup:
      "A 2-on-2 rush: the front winger races wide to the net while a late trailer drives the middle behind. Your partner has the carrier - you're the weak-side D.",
    kind: 'mcq',
    options: [
      {
        text: 'Jump the puck carrier with your partner',
        correct: false,
        feedback: 'Two of you on the puck. The trailer walks into the slot completely alone.',
        trap: 'Doubling the puck kills the rush - it also leaves the delayed man wide open.',
      },
      {
        text: 'Cover the front winger racing to the net',
        correct: false,
        feedback: 'Your partner already reads that man. The trailer is the free one behind.',
        trap: 'The net driver looks dangerous - the trailer is the guy nobody has.',
      },
      {
        text: 'Retreat to the crease and wait it out',
        correct: false,
        feedback: 'You concede the whole high slot. The trailer gets a free shooting lane.',
        trap: 'Guarding the net feels responsible - the danger is up in the slot, not the paint.',
      },
      {
        text: 'Pick up the late trailer driving behind',
        correct: true,
        feedback:
          'The delay means someone is coming late. Your partner has the puck - you own the trailer.',
      },
    ],
    coachCue: 'Partner has the carrier. Take the trailer.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'ca', team: 'away', x: 30, y: 60, label: 'F' },
        { id: 'tr', team: 'away', x: 58, y: 48, label: 'F' },
        { id: 'p', team: 'home', x: 34, y: 62, label: 'D' },
        { id: 'd', team: 'home', x: 60, y: 62, label: 'D' },
      ],
      puck: { x: 30, y: 60 },
      arrows: [{ fromX: 58, fromY: 48, toX: 58, toY: 62, dashed: true }],
      highlights: [{ x: 58, y: 48, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            ca: { x: 34, y: 30 },
            tr: { x: 56, y: 16 },
            p: { x: 38, y: 44 },
            d: { x: 58, y: 44 },
          },
          puck: { x: 34, y: 30 },
          narration: 'Two forwards come at you with a third man trailing behind.',
        },
        {
          t: 4,
          players: { ca: { x: 32, y: 44 }, tr: { x: 57, y: 30 }, p: { x: 36, y: 52 }, d: { x: 59, y: 52 } },
          puck: { x: 32, y: 44 },
          narration: 'The carrier attacks your partner, the front man swinging wide.',
        },
        {
          t: 8,
          players: { ca: { x: 30, y: 54 }, tr: { x: 58, y: 40 }, p: { x: 34, y: 58 }, d: { x: 60, y: 58 } },
          puck: { x: 30, y: 54 },
          narration: 'Your partner steps up on the puck, and here comes the trailer.',
        },
        {
          t: 11.5,
          players: {
            ca: { x: 30, y: 60 },
            tr: { x: 58, y: 48 },
            p: { x: 34, y: 62 },
            d: { x: 60, y: 62 },
          },
          puck: { x: 30, y: 60 },
          narration: 'Partner has the carrier, the late man building speed into the middle...',
        },
        { t: 13 },
      ],
      freezeLine: "Your partner has the puck and a trailer's driving behind. Who's yours?",
      narration:
        'Two forwards come at you with a third man trailing behind. The carrier attacks your partner while the front man swings wide. Your partner steps up on the puck, and here comes the trailer, building speed into the middle behind the play.',
    },
  },
  {
    id: 'nz-gap-vs-wide-drive',
    zone: 'neutral',
    category: 'gap',
    difficulty: 'rookie',
    title: 'Steer the Wide Drive',
    setup: 'A winger tries to beat you wide up the boards, one-on-one, with your gap tight.',
    kind: 'mcq',
    options: [
      {
        text: 'Reach in and poke at the puck early',
        correct: false,
        feedback: 'You lunge, he pulls it around you, and now he is gone up the wall.',
        trap: 'The puck looks close - reaching early is how wide guys beat you.',
      },
      {
        text: 'Match his feet and steer him into the wall',
        correct: true,
        feedback:
          'Skate his line, inside shoulder on him. The boards become your second defender.',
      },
      {
        text: 'Back in and give him the blue line',
        correct: false,
        feedback: 'He keeps the wall and all his speed. Free entry, deep possession.',
        trap: 'Backing off feels safe - he never wanted the middle anyway.',
      },
    ],
    coachCue: 'Match his feet. Steer him wide.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 82, y: 52, label: 'F' },
        { id: 'd', team: 'home', x: 74, y: 60, label: 'D' },
        { id: 'd2', team: 'home', x: 50, y: 62, label: 'D' },
      ],
      puck: { x: 82, y: 52 },
      arrows: [{ fromX: 82, fromY: 52, toX: 86, toY: 66 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 78, y: 16 }, d: { x: 70, y: 40 }, d2: { x: 52, y: 42 } },
          puck: { x: 78, y: 16 },
          narration: 'Their winger carries up the right wall with speed.',
        },
        {
          t: 4,
          players: { f: { x: 80, y: 30 }, d: { x: 72, y: 48 }, d2: { x: 51, y: 50 } },
          puck: { x: 80, y: 30 },
          narration: 'He stays wide, hunting the outside lane on the boards.',
        },
        {
          t: 8,
          players: { f: { x: 81, y: 42 }, d: { x: 73, y: 55 }, d2: { x: 50, y: 56 } },
          puck: { x: 81, y: 42 },
          narration: 'Your gap is tight, one-on-one, him against you on the wall.',
        },
        {
          t: 11.5,
          players: { f: { x: 82, y: 52 }, d: { x: 74, y: 60 }, d2: { x: 50, y: 62 } },
          puck: { x: 82, y: 52 },
          narration: 'He tries to blow by you wide, the boards right beside him...',
        },
        { t: 13 },
      ],
      freezeLine: "He's going for the outside on you. How do you take him?",
      narration:
        'Their winger carries up the right wall with speed. He stays wide, hunting the outside lane, and your gap is tight one-on-one on the boards. Now he tries to blow by you wide, the wall right beside him.',
    },
  },
  // ============================================================ offensive
  {
    id: 'oz-pinch-or-bail',
    zone: 'offensive',
    category: 'pinch',
    difficulty: 'elite',
    title: 'Pinch or Bail',
    setup:
      'You are at the strong-side point. A loose puck is chipped to the wall. Your center is back covering for you.',
    kind: 'mcq',
    options: [
      {
        text: 'Bail back to the neutral zone to be safe',
        correct: false,
        feedback: 'You have support behind you. Bailing gives up the zone you did not need to.',
        trap: 'Never getting beat is a rule - here your center already has your back.',
      },
      {
        text: 'Puck-watch and let it settle first',
        correct: false,
        feedback: 'You freeze on the line. Their winger scoops it and skates out clean.',
        trap: 'Reading the play sounds smart - hesitation just hands them the exit.',
      },
      {
        text: 'Pinch hard to keep it in the zone',
        correct: true,
        feedback:
          'Your center is back covering. With support behind you, the pinch keeps it in and kills their break.',
      },
      {
        text: 'Retreat to the middle and cover the far point',
        correct: false,
        feedback: 'You leave the puck battle uncontested. It walks right out of your zone.',
        trap: 'Protecting the middle feels responsible - it concedes the puck you could keep.',
      },
    ],
    coachCue: 'Support behind you? Pinch to keep it in.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 85, y: 31, label: 'D' },
        { id: 'aw', team: 'away', x: 86, y: 22, label: 'F' },
        { id: 'c', team: 'home', x: 66, y: 42, label: 'C' },
        { id: 'd2', team: 'home', x: 30, y: 26, label: 'D' },
      ],
      puck: { x: 88, y: 27 },
      highlights: [{ x: 88, y: 27, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 84, y: 30 },
            aw: { x: 84, y: 18 },
            c: { x: 60, y: 44 },
            d2: { x: 30, y: 26 },
          },
          puck: { x: 84, y: 18 },
          narration: 'You are pressuring in their zone, holding the line to keep the puck in.',
        },
        {
          t: 4,
          players: { d: { x: 85, y: 30 }, aw: { x: 85, y: 20 }, c: { x: 63, y: 43 } },
          puck: { x: 86, y: 22 },
          narration: 'Their winger chips a loose puck up the wall toward your point.',
        },
        {
          t: 8,
          players: { d: { x: 85, y: 31 }, aw: { x: 86, y: 21 }, c: { x: 65, y: 42 } },
          puck: { x: 87, y: 25 },
          narration: 'It hugs the boards, climbing your way, your center sliding back to cover.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 85, y: 31 },
            aw: { x: 86, y: 22 },
            c: { x: 66, y: 42 },
            d2: { x: 30, y: 26 },
          },
          puck: { x: 88, y: 27 },
          narration: 'The puck climbs toward you at the line, their winger chasing, your center back...',
        },
        { t: 13 },
      ],
      freezeLine: 'Loose puck on your wall and your center is back. Pinch or bail?',
      narration:
        'You are pressuring in their zone, holding the line to keep the puck in. Their winger chips a loose puck up the wall toward your point, and it hugs the boards climbing your way. Your center slides back to cover as the puck reaches you at the line with their winger chasing.',
    },
  },
  {
    id: 'oz-activate-as-trailer',
    zone: 'offensive',
    category: 'attack',
    difficulty: 'varsity',
    title: 'Activate as the Trailer',
    setup:
      'Your team has possession low. A lane opens from the point, and a high forward is covering back for you.',
    kind: 'mcq',
    options: [
      {
        text: 'Sneak down into the soft ice as the trailer',
        correct: true,
        feedback:
          'A forward has your point covered. Slide into the open slot for a real scoring chance.',
      },
      {
        text: 'Fire a low-percentage point shot into shins',
        correct: false,
        feedback: 'Bodies in the lane block it and it rims out. Nothing gained, rush the other way.',
        trap: 'Getting pucks on net is coached - not blindly into a wall of shins.',
      },
      {
        text: 'Stay static at the point and hold',
        correct: false,
        feedback: 'The soft ice sits there empty. You pass up a chance the coverage gave you.',
        trap: 'Playing it safe feels disciplined - here it wastes free ice in front.',
      },
      {
        text: 'Pass cross-ice to the far point and reset',
        correct: false,
        feedback: 'You move the puck away from the open ice. The scoring window closes.',
        trap: 'Swinging it around looks patient - it kills the seam that just opened.',
      },
    ],
    coachCue: 'Covered up top? Activate into the slot.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 54, y: 30, label: 'D' },
        { id: 'lf', team: 'home', x: 20, y: 26, label: 'F' },
        { id: 'hf', team: 'home', x: 40, y: 36, label: 'F' },
        { id: 'ad', team: 'away', x: 60, y: 14, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 20, y: 26 },
      arrows: [{ fromX: 54, fromY: 30, toX: 52, toY: 20, dashed: true }],
      highlights: [{ x: 52, y: 18, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 56, y: 32 },
            lf: { x: 30, y: 20 },
            hf: { x: 46, y: 26 },
            ad: { x: 58, y: 18 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 30, y: 20 },
          narration: 'Your team owns the puck low in their zone, working it down the wall.',
        },
        {
          t: 4,
          players: { d: { x: 55, y: 31 }, lf: { x: 24, y: 24 }, hf: { x: 44, y: 30 }, ad: { x: 60, y: 16 } },
          puck: { x: 24, y: 24 },
          narration: 'Your winger settles it in the corner, drawing coverage low.',
        },
        {
          t: 8,
          players: { d: { x: 54, y: 30 }, lf: { x: 21, y: 25 }, hf: { x: 42, y: 34 }, ad: { x: 61, y: 15 } },
          puck: { x: 21, y: 25 },
          narration: 'A lane opens from the point, your high forward dropping back to cover.',
        },
        {
          t: 11.5,
          players: {
            d: { x: 54, y: 30 },
            lf: { x: 20, y: 26 },
            hf: { x: 40, y: 36 },
            ad: { x: 60, y: 14 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 20, y: 26 },
          narration: 'The slot is soft ahead of you, your forward set behind you to cover...',
        },
        { t: 13 },
      ],
      freezeLine: "The slot's open and a forward has your back. What do you do?",
      narration:
        'Your team owns the puck low in their zone, working it down the wall. Your winger settles it in the corner, drawing coverage low, and a lane opens from the point. Your high forward drops back to cover, and now the slot is soft ahead of you with support behind.',
    },
  },
];
