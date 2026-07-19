import type { Scenario } from '@/types';

export const NEUTRAL_RUSH_SCENARIOS: Scenario[] = [
  // ---------------------------------------------------------------- rookie
  {
    id: 'nz-angle-to-boards',
    zone: 'neutral',
    category: 'angling',
    difficulty: 'rookie',
    title: 'Angle Him to the Wall',
    setup: 'A winger carries wide up the wall, 1-on-1 against you.',
    kind: 'mcq',
    options: [
      {
        text: 'Lunge in for the poke check now',
        correct: false,
        feedback: 'You reach, he pulls it around you, and now he is behind you.',
        trap: 'The puck looks close. Reaching is how wide guys beat you.',
      },
      {
        text: 'Skate his line and steer him into the boards',
        correct: true,
        feedback:
          'Inside shoulder on him, stick on the puck side. The wall becomes your second defender.',
      },
      {
        text: 'Back straight off and protect the middle',
        correct: false,
        feedback: 'He keeps the wall and all his speed. Free entry, deep possession.',
        trap: 'Middle-first sounds smart, but he never wanted the middle.',
      },
    ],
    coachCue: 'Inside-out. Let the wall finish the check.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 20, y: 42, label: 'F' },
        { id: 'd', team: 'home', x: 32, y: 55, label: 'D' },
        { id: 'd2', team: 'home', x: 62, y: 58, label: 'D' },
      ],
      puck: { x: 20, y: 42 },
      arrows: [{ fromX: 20, fromY: 42, toX: 16, toY: 58 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 30, y: 6 }, d: { x: 40, y: 36 }, d2: { x: 62, y: 40 } },
          puck: { x: 30, y: 6 },
          narration: 'Their winger breaks out of his end and heads up the left wall.',
        },
        {
          t: 4,
          players: { f: { x: 25, y: 20 }, d: { x: 37, y: 44 }, d2: { x: 62, y: 46 } },
          puck: { x: 25, y: 20 },
          narration: "He's staying wide, building speed along the boards.",
        },
        {
          t: 8,
          players: { f: { x: 22, y: 32 }, d: { x: 34, y: 50 }, d2: { x: 62, y: 52 } },
          puck: { x: 22, y: 32 },
          narration: "It's you against him - one-on-one on the wall side.",
        },
        {
          t: 11.5,
          players: { f: { x: 20, y: 42 }, d: { x: 32, y: 55 }, d2: { x: 62, y: 58 } },
          puck: { x: 20, y: 42 },
          narration: "He's crossing the red line, hugging the boards...",
        },
        { t: 13 },
      ],
      freezeLine: "You've got him one-on-one on the wall. How do you kill this rush?",
      narration:
        "Their winger breaks out and heads up the left wall. He stays wide, building speed along the boards. Now it's you against him, one-on-one, and he's crossing the red line hugging the wall.",
    },
  },
  {
    id: 'nz-backskate-stick',
    zone: 'neutral',
    category: 'stick-position',
    difficulty: 'rookie',
    title: 'Stick While Backskating',
    setup: "You're skating backward on a carrier through the neutral zone. Where's your stick?",
    kind: 'mcq',
    options: [
      {
        text: 'Blade on the ice, filling his puck lane',
        correct: true,
        feedback:
          'An on-ice blade shrinks his options every stride and keeps a real poke ready.',
      },
      {
        text: 'Two hands across your body, ready to hit',
        correct: false,
        feedback: 'A carried stick takes away nothing. He walks the puck right past it.',
        trap: 'Feels strong and ready - but a dead stick defends zero ice.',
      },
      {
        text: 'Swing one-handed pokes as he closes in',
        correct: false,
        feedback: 'Fishing pulls you off balance and opens your hips. One cutback and he is gone.',
        trap: 'Active stick, sure - but swinging is not the same as threatening.',
      },
    ],
    coachCue: 'Blade on the ice, in his lane.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 44, y: 42, label: 'F' },
        { id: 'd', team: 'home', x: 48, y: 58, label: 'D' },
        { id: 'd2', team: 'home', x: 64, y: 60, label: 'D' },
      ],
      puck: { x: 44, y: 42 },
      highlights: [{ x: 46, y: 50, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 50, y: 10 }, d: { x: 50, y: 38 }, d2: { x: 64, y: 42 } },
          puck: { x: 50, y: 10 },
          narration: 'Their center collects it and comes up the middle of the ice.',
        },
        {
          t: 3.5,
          players: { f: { x: 47, y: 22 }, d: { x: 49, y: 45 }, d2: { x: 64, y: 48 } },
          puck: { x: 47, y: 22 },
          narration: "You're backing up with him, keeping the gap honest.",
        },
        {
          t: 7,
          players: { f: { x: 45, y: 33 }, d: { x: 48, y: 52 }, d2: { x: 64, y: 54 } },
          puck: { x: 45, y: 33 },
          narration: 'He crosses center, eyeing you up, looking for a lane.',
        },
        {
          t: 11,
          players: { f: { x: 44, y: 42 }, d: { x: 48, y: 58 }, d2: { x: 64, y: 60 } },
          puck: { x: 44, y: 42 },
          narration: "It's a straight-up battle now - him against your feet and your stick...",
        },
        { t: 12.5 },
      ],
      freezeLine:
        "You're backskating on him. What are you doing with your stick?",
      narration:
        "Their center collects it and comes up the middle. You're backing up, keeping the gap honest. He crosses center and eyes you up, hunting for a lane. Now it's a straight-up battle, him against your feet and your stick.",
    },
  },
  {
    id: 'nz-force-dump-race',
    zone: 'neutral',
    category: 'dump-in',
    difficulty: 'rookie',
    title: 'You Forced the Dump',
    setup: 'Your tight gap just forced him to dump it in behind you.',
    kind: 'mcq',
    options: [
      {
        text: 'Turn and watch the puck all the way in',
        correct: false,
        feedback: 'Puck-watching costs you two strides. He blows past and wins the race.',
        trap: 'You want to track the bounce - but your feet stop while his do not.',
      },
      {
        text: 'Step into the dumper and finish the hit',
        correct: false,
        feedback: 'He already released it. That is interference, and nobody gets the puck.',
        trap: 'Making him pay feels right - two seconds too late it is a penalty.',
      },
      {
        text: 'Pivot now and sprint your route to the puck',
        correct: true,
        feedback:
          'You forced the dump - now win it. Early pivot, hard route, shoulder check on the way.',
      },
    ],
    coachCue: 'Force the dump, then win the race.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 48, y: 45, label: 'F' },
        { id: 'd', team: 'home', x: 55, y: 55, label: 'D' },
        { id: 'd2', team: 'home', x: 68, y: 58, label: 'D' },
      ],
      puck: { x: 75, y: 60 },
      arrows: [{ fromX: 75, fromY: 60, toX: 82, toY: 80, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 45, y: 12 }, d: { x: 52, y: 36 }, d2: { x: 68, y: 42 } },
          puck: { x: 45, y: 12 },
          narration: 'Their winger comes out of the zone with the puck on his forehand.',
        },
        {
          t: 4,
          players: { f: { x: 46, y: 25 }, d: { x: 53, y: 44 }, d2: { x: 68, y: 48 } },
          puck: { x: 46, y: 25 },
          narration: "You've got a tight gap on him - no room in the middle.",
        },
        {
          t: 8,
          players: { f: { x: 47, y: 36 }, d: { x: 54, y: 50 }, d2: { x: 68, y: 54 } },
          puck: { x: 47, y: 36 },
          narration: "He's running out of ice - nowhere to carry it.",
        },
        {
          t: 11.5,
          players: { f: { x: 48, y: 45 }, d: { x: 55, y: 55 }, d2: { x: 68, y: 58 } },
          puck: { x: 75, y: 60 },
          narration: 'He gives up and flips it hard around the wall behind you...',
        },
        { t: 13 },
      ],
      freezeLine: "The dump is in and he's chasing. What do you do?",
      narration:
        "Their winger comes out of the zone on his forehand. You've got a tight gap, no room for him in the middle. He runs out of ice with nowhere to carry it, so he flips it hard around the wall behind you.",
    },
  },
  {
    id: 'nz-chip-and-chase',
    zone: 'neutral',
    category: 'chip-chase',
    difficulty: 'rookie',
    title: 'Chip Behind You',
    setup: 'He chips the puck softly past your feet and jumps outside to chase it.',
    kind: 'mcq',
    options: [
      {
        text: 'Grab a handful of jersey to slow him down',
        correct: false,
        feedback: 'Holding. Two minutes. You turned a footrace into a power play.',
        trap: 'One little tug feels harmless - the ref sees it every time.',
      },
      {
        text: 'Turn with him and take the inside lane to the puck',
        correct: true,
        feedback:
          'Quick pivot, body between him and the puck. Inside position wins even against faster feet.',
      },
      {
        text: 'Reach back one-handed and fish for the puck',
        correct: false,
        feedback: 'You are gliding blind with one hand while he sprints. He is gone.',
        trap: 'The puck is right there - but reaching backward kills your feet.',
      },
    ],
    coachCue: 'Turn, take inside ice, win the race.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 18, y: 48, label: 'F' },
        { id: 'd', team: 'home', x: 35, y: 52, label: 'D' },
        { id: 'd2', team: 'home', x: 60, y: 58, label: 'D' },
      ],
      puck: { x: 30, y: 62 },
      arrows: [{ fromX: 18, fromY: 48, toX: 24, toY: 64 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 25, y: 10 }, d: { x: 36, y: 34 }, d2: { x: 60, y: 38 } },
          puck: { x: 25, y: 10 },
          narration: 'Their speedy winger carries it up the left side.',
        },
        {
          t: 4,
          players: { f: { x: 23, y: 24 }, d: { x: 35, y: 42 }, d2: { x: 60, y: 46 } },
          puck: { x: 23, y: 24 },
          narration: 'You slide over to meet him - the gap is closing.',
        },
        {
          t: 8,
          players: { f: { x: 21, y: 36 }, d: { x: 35, y: 48 }, d2: { x: 60, y: 52 } },
          puck: { x: 21, y: 36 },
          narration: "You've got him lined up one-on-one near the wall.",
        },
        {
          t: 11.5,
          players: { f: { x: 18, y: 48 }, d: { x: 35, y: 52 }, d2: { x: 60, y: 58 } },
          puck: { x: 30, y: 62 },
          narration: 'He chips it soft past your feet and jumps outside...',
        },
        { t: 13 },
      ],
      freezeLine:
        "The puck is behind you and he's burning wide. What's your move?",
      narration:
        "Their speedy winger carries it up the left side. You slide over to meet him and the gap is closing. You've got him lined up one-on-one near the wall, then he chips it soft past your feet and jumps outside.",
    },
  },
  // --------------------------------------------------------------- varsity
  {
    id: 'nz-speed-pivot',
    zone: 'neutral',
    category: 'pivot-timing',
    difficulty: 'varsity',
    title: 'Match the Flyer',
    setup: 'A burner is flying at you with a big head of speed. Your gap is stretching.',
    kind: 'mcq',
    options: [
      {
        text: 'Keep backpedaling and protect the blue line',
        correct: false,
        feedback: 'Backward top speed loses to forward top speed. He goes around you like a cone.',
        trap: 'Staying square feels textbook - until the flyer hits another gear.',
      },
      {
        text: 'Lunge for a poke check as he reaches you',
        correct: false,
        feedback: 'At that speed one reach and he is by you clean. Breakaway.',
        trap: 'One good poke ends it - except he is moving twice your speed.',
      },
      {
        text: 'Pivot early and skate forward with him',
        correct: true,
        feedback:
          'Turn before he is on your hip. Now you match his speed and steer him wide all day.',
      },
      {
        text: 'Pivot at the last second so he cannot cut back',
        correct: false,
        feedback: 'A late pivot is a slow pivot. He is past your shoulder before you finish it.',
        trap: 'Waiting sounds patient - but the pivot itself takes time you no longer have.',
      },
    ],
    coachCue: 'Beat him to the pivot, not the puck.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f', team: 'away', x: 30, y: 40, label: 'F' },
        { id: 'd', team: 'home', x: 42, y: 54, label: 'D' },
        { id: 'd2', team: 'home', x: 62, y: 50, label: 'D' },
      ],
      puck: { x: 30, y: 40 },
      arrows: [{ fromX: 30, fromY: 40, toX: 26, toY: 56 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { f: { x: 38, y: 2 }, d: { x: 45, y: 30 }, d2: { x: 62, y: 32 } },
          puck: { x: 38, y: 2 },
          narration: 'Their fastest forward takes off from deep in his own end.',
        },
        {
          t: 3.5,
          players: { f: { x: 34, y: 17 }, d: { x: 44, y: 38 }, d2: { x: 62, y: 38 } },
          puck: { x: 34, y: 17 },
          narration: "Listen to those crossovers - he's absolutely flying.",
        },
        {
          t: 7,
          players: { f: { x: 32, y: 29 }, d: { x: 43, y: 46 }, d2: { x: 62, y: 44 } },
          puck: { x: 32, y: 29 },
          narration: "You're backing up but the gap is getting away from you.",
        },
        {
          t: 11,
          players: { f: { x: 30, y: 40 }, d: { x: 42, y: 54 }, d2: { x: 62, y: 50 } },
          puck: { x: 30, y: 40 },
          narration: "He hits the red line at full speed, coming right down your side...",
        },
        { t: 12.5 },
      ],
      freezeLine:
        "He's faster than you and he knows it. What do you do with your feet?",
      narration:
        "Their fastest forward takes off from deep in his own end. Listen to those crossovers, he's absolutely flying. You're backing up but the gap is getting away from you, and now he hits the red line at full speed, coming right down your side.",
    },
  },
  {
    id: 'nz-three-on-two-sort',
    zone: 'neutral',
    category: 'rush-defense',
    difficulty: 'varsity',
    title: '3-on-2: Who Takes Who?',
    setup:
      "3-on-2 rush. Carrier is wide on your partner's side, their center drives the middle at you.",
    kind: 'mcq',
    options: [
      {
        text: 'Slide over and double-team the puck carrier',
        correct: false,
        feedback: 'Two on the puck leaves the middle wide open. One seam pass, tap-in goal.',
        trap: 'Killing the puck feels decisive - but your partner already has him.',
      },
      {
        text: 'Pick up the wide winger on your side',
        correct: false,
        feedback: 'The wide man is the least dangerous. The net driver walks in free.',
        trap: "He's the guy in your lane - but he's not the guy driving your net.",
      },
      {
        text: 'Back all the way in and block the far post',
        correct: false,
        feedback: 'You concede the whole high slot. They pick their shot at leisure.',
        trap: 'Protecting the house early sounds safe - it is just surrender with structure.',
      },
      {
        text: 'Sag to the middle and take the net driver',
        correct: true,
        feedback:
          'Partner takes puck, you own the middle drive and stay net-side. The wide man is the shot you can live with.',
      },
    ],
    coachCue: 'Partner takes puck. You take the middle.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 22, y: 44, label: 'F' },
        { id: 'a2', team: 'away', x: 50, y: 46, label: 'F' },
        { id: 'a3', team: 'away', x: 72, y: 38, label: 'F' },
        { id: 'd', team: 'home', x: 55, y: 58, label: 'D' },
        { id: 'd2', team: 'home', x: 30, y: 56, label: 'D' },
      ],
      puck: { x: 22, y: 44 },
      arrows: [{ fromX: 50, fromY: 46, toX: 50, toY: 62 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 25, y: 8 },
            a2: { x: 50, y: 6 },
            a3: { x: 70, y: 10 },
            d: { x: 55, y: 34 },
            d2: { x: 35, y: 34 },
          },
          puck: { x: 25, y: 8 },
          narration: 'They break out three across - this is a full line rush.',
        },
        {
          t: 4,
          players: {
            a1: { x: 24, y: 21 },
            a2: { x: 50, y: 20 },
            a3: { x: 71, y: 20 },
            d: { x: 55, y: 42 },
            d2: { x: 33, y: 42 },
          },
          puck: { x: 24, y: 21 },
          narration: "Three on two - the carrier is wide on your partner's side.",
        },
        {
          t: 8,
          players: {
            a1: { x: 23, y: 33 },
            a2: { x: 50, y: 33 },
            a3: { x: 72, y: 29 },
            d: { x: 55, y: 50 },
            d2: { x: 31, y: 50 },
          },
          puck: { x: 23, y: 33 },
          narration: 'Their center drives the middle lane hard, third man wide right.',
        },
        {
          t: 11.5,
          players: {
            a1: { x: 22, y: 44 },
            a2: { x: 50, y: 46 },
            a3: { x: 72, y: 38 },
            d: { x: 55, y: 58 },
            d2: { x: 30, y: 56 },
          },
          puck: { x: 22, y: 44 },
          narration: 'They hit the red line with numbers, everything still in front of you...',
        },
        { t: 13 },
      ],
      freezeLine: "You're the weak-side D on a three-on-two. Who is yours?",
      narration:
        "They break out three across, a full line rush. It's three on two, and the carrier is wide on your partner's side. Their center drives the middle lane hard with the third man wide right. They hit the red line with numbers, everything still in front of you.",
    },
  },
  {
    id: 'nz-stretch-denial',
    zone: 'neutral',
    category: 'stretch-pass',
    difficulty: 'varsity',
    title: 'Kill the Stretch Pass',
    setup:
      'Their D breaks out while a winger cherry-picks at your blue line. Tap where you should be.',
    kind: 'tap',
    tapTargets: [
      {
        x: 70,
        y: 69,
        radius: 7,
        correct: true,
        feedback:
          'Goal-side of the stretch man, stick in the lane. He catches nothing behind you.',
        label: 'Goal-side',
      },
      {
        x: 68,
        y: 52,
        radius: 7,
        correct: false,
        feedback: 'Fronting him looks aggressive, but one lofted rim floats over you and he is in alone.',
        label: 'Front him',
      },
      {
        x: 46,
        y: 36,
        radius: 8,
        correct: false,
        feedback: 'You stepped up on the breakout. The bomb sails past you and it is a footrace you lose.',
        label: 'Step up',
      },
      {
        x: 32,
        y: 60,
        radius: 8,
        correct: false,
        feedback: 'Holding the line puck-side leaves the stretch man free. Cross-ice bomb, clean entry.',
        label: 'Puck side',
      },
    ],
    coachCue: 'Sag goal-side. Nobody gets behind you.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd2',
      players: [
        { id: 'bd', team: 'away', x: 40, y: 12, label: 'D' },
        { id: 'st', team: 'away', x: 70, y: 62, label: 'F' },
        { id: 'f1', team: 'home', x: 45, y: 14, label: 'F' },
        { id: 'd2', team: 'home', x: 35, y: 55, label: 'D' },
      ],
      puck: { x: 40, y: 12 },
      highlights: [{ x: 70, y: 62, radius: 8 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            bd: { x: 55, y: 8 },
            st: { x: 65, y: 40 },
            f1: { x: 48, y: 22 },
            d2: { x: 38, y: 48 },
          },
          puck: { x: 55, y: 8 },
          narration: 'Their D retrieves it behind his own net, looking to break out.',
        },
        {
          t: 4,
          players: {
            bd: { x: 45, y: 10 },
            st: { x: 68, y: 50 },
            f1: { x: 46, y: 18 },
            d2: { x: 37, y: 52 },
          },
          puck: { x: 45, y: 10 },
          narration: 'Your forechecker pressures him - he wheels and buys time.',
        },
        {
          t: 8,
          players: {
            bd: { x: 42, y: 11 },
            st: { x: 70, y: 57 },
            f1: { x: 45, y: 15 },
            d2: { x: 36, y: 54 },
          },
          puck: { x: 42, y: 11 },
          narration: 'Look high - their winger is stretching the ice at your blue line.',
        },
        {
          t: 11.5,
          players: {
            bd: { x: 40, y: 12 },
            st: { x: 70, y: 62 },
            f1: { x: 45, y: 14 },
            d2: { x: 35, y: 55 },
          },
          puck: { x: 40, y: 12 },
          narration: "He's got his stick out, calling for the stretch bomb...",
        },
        { t: 13 },
      ],
      freezeLine:
        "You're the back D against that stretch man. Tap the spot where you need to be.",
      narration:
        "Their D retrieves it behind his own net, looking to break out. Your forechecker pressures him, so he wheels and buys time. Look high, their winger is stretching the ice at your blue line with his stick out, calling for the bomb.",
    },
  },
  {
    id: 'nz-drop-pass',
    zone: 'neutral',
    category: 'drop-pass',
    difficulty: 'varsity',
    title: 'The Drop Pass',
    setup: 'The carrier drops the puck for his trailer and keeps driving toward your net.',
    kind: 'mcq',
    options: [
      {
        text: 'Stay with the first man driving your net',
        correct: false,
        feedback: 'He is a decoy without the puck. The new carrier walks in with all day to shoot.',
        trap: 'Finishing your check feels disciplined - but the danger just changed hands.',
      },
      {
        text: 'Let the driver go and square up the new carrier',
        correct: true,
        feedback:
          'The puck is the threat. Your partner and backpressure handle the decoy - you reset the gap.',
      },
      {
        text: 'Lunge at the drop pass with your stick',
        correct: false,
        feedback: 'You are stretched out between two men. The trailer pulls it wide and you are done.',
        trap: 'The loose puck looks stealable - for about a tenth of a second.',
      },
      {
        text: 'Back in and give them your blue line',
        correct: false,
        feedback: 'You concede a clean entry with speed against a set drop play. They own the zone.',
        trap: 'Not getting deked feels safe - but free entries lose games slowly.',
      },
    ],
    coachCue: 'Defend the puck, not the decoy.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 40, y: 52, label: 'F' },
        { id: 'a2', team: 'away', x: 50, y: 40, label: 'F' },
        { id: 'd', team: 'home', x: 44, y: 60, label: 'D' },
        { id: 'd2', team: 'home', x: 60, y: 58, label: 'D' },
      ],
      puck: { x: 50, y: 40 },
      arrows: [{ fromX: 40, fromY: 52, toX: 38, toY: 66 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 45, y: 8 },
            a2: { x: 55, y: 4 },
            d: { x: 46, y: 36 },
            d2: { x: 60, y: 38 },
          },
          puck: { x: 45, y: 8 },
          narration: 'They regroup and attack with a trailer in the hip pocket.',
        },
        {
          t: 4,
          players: {
            a1: { x: 43, y: 22 },
            a2: { x: 53, y: 15 },
            d: { x: 45, y: 44 },
            d2: { x: 60, y: 45 },
          },
          puck: { x: 43, y: 22 },
          narration: 'The carrier drives at you with his buddy trailing the play.',
        },
        {
          t: 8,
          players: {
            a1: { x: 41, y: 36 },
            a2: { x: 51, y: 27 },
            d: { x: 44, y: 52 },
            d2: { x: 60, y: 52 },
          },
          puck: { x: 41, y: 36 },
          narration: "Watch the drop - he's slowing up as he crosses the red line.",
        },
        {
          t: 11.5,
          players: {
            a1: { x: 40, y: 52 },
            a2: { x: 50, y: 40 },
            d: { x: 44, y: 60 },
            d2: { x: 60, y: 58 },
          },
          puck: { x: 50, y: 40 },
          narration: 'There it is - he leaves it for the trailer and drives your net without it...',
        },
        { t: 13 },
      ],
      freezeLine:
        "The drop is made - one man at your net, one man with the puck. Who's yours?",
      narration:
        "They regroup and attack with a trailer in the hip pocket. The carrier drives right at you with his buddy trailing the play. Watch the drop, he slows up as he crosses the red line, then leaves it for the trailer and keeps driving your net without it.",
    },
  },
  // ----------------------------------------------------------------- elite
  {
    id: 'nz-red-line-step',
    zone: 'neutral',
    category: 'step-up',
    difficulty: 'elite',
    title: 'Step Up or Retreat?',
    setup:
      'The carrier fumbles the puck into his skates at the red line. Your center is chasing him hard.',
    kind: 'mcq',
    options: [
      {
        text: 'Step up now and kill it at the red line',
        correct: true,
        feedback:
          'Head down, puck in his feet, help right behind him. Even if he slips you, your center cleans it up.',
      },
      {
        text: 'Retreat to the blue line and set your gap',
        correct: false,
        feedback: 'You gave him two free seconds to recover the puck and his head. Chance gone.',
        trap: 'Backing off is the safe habit - but safe against a bobbled puck is a gift.',
      },
      {
        text: 'Wait and stand him up at the blue line',
        correct: false,
        feedback: 'By the blue line the puck is back on his blade and his wingers have caught up.',
        trap: 'Standing guys up at the line is a real play - just not while he is vulnerable now.',
      },
      {
        text: 'Back off and cover the pass behind you',
        correct: false,
        feedback: 'There is no pass. The puck is in his skates and his eyes are on the ice.',
        trap: 'Respecting the seam sounds smart - but read what is actually happening.',
      },
    ],
    coachCue: 'Bobbled puck plus backup equals attack.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'f1', team: 'away', x: 45, y: 48, label: 'F' },
        { id: 'c', team: 'home', x: 40, y: 38, label: 'C' },
        { id: 'd', team: 'home', x: 48, y: 60, label: 'D' },
        { id: 'd2', team: 'home', x: 65, y: 60, label: 'D' },
      ],
      puck: { x: 44, y: 47 },
      highlights: [{ x: 44, y: 47, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            f1: { x: 50, y: 14 },
            c: { x: 45, y: 6 },
            d: { x: 50, y: 40 },
            d2: { x: 66, y: 42 },
          },
          puck: { x: 50, y: 14 },
          narration: 'Their winger escapes the zone with your center chasing him.',
        },
        {
          t: 4,
          players: {
            f1: { x: 48, y: 26 },
            c: { x: 43, y: 17 },
            d: { x: 49, y: 47 },
            d2: { x: 66, y: 48 },
          },
          puck: { x: 48, y: 26 },
          narration: 'He carries through center ice - your center is closing from behind.',
        },
        {
          t: 8,
          players: {
            f1: { x: 46, y: 38 },
            c: { x: 41, y: 28 },
            d: { x: 48, y: 54 },
            d2: { x: 65, y: 54 },
          },
          puck: { x: 45, y: 37 },
          narration: 'The puck starts rolling on him - it rattles into his feet.',
        },
        {
          t: 11.5,
          players: {
            f1: { x: 45, y: 48 },
            c: { x: 40, y: 38 },
            d: { x: 48, y: 60 },
            d2: { x: 65, y: 60 },
          },
          puck: { x: 44, y: 47 },
          narration: 'Head down at the red line, kicking at the puck, your center a stride away...',
        },
        { t: 13 },
      ],
      freezeLine: "His head is down and you've got backup. What's your move?",
      narration:
        "Their winger escapes the zone with your center chasing him. He carries through center ice as your center closes from behind. Then the puck starts rolling and rattles into his feet. His head is down at the red line, kicking at it, your center a stride away.",
    },
  },
  {
    id: 'nz-crisscross-sort',
    zone: 'neutral',
    category: 'entry-sort',
    difficulty: 'elite',
    title: 'Sort the Criss-Cross',
    setup:
      "Two forwards scissor at your blue line. The carrier swings to your partner's side, his buddy cuts into your lane.",
    kind: 'mcq',
    options: [
      {
        text: 'Follow your original man across the ice',
        correct: false,
        feedback: 'You and your partner cross, screen each other, and both attackers come out free.',
        trap: 'Man-to-man loyalty sounds honest. The cross exists to punish exactly that.',
      },
      {
        text: 'Jump the carrier mid-cross and end it',
        correct: false,
        feedback: 'You vacate your lane at the moment his buddy is sprinting into it. Odd-man behind you.',
        trap: 'The exchange looks vulnerable - but your partner is already squared to it.',
      },
      {
        text: 'Hold your lane and take whoever enters it',
        correct: true,
        feedback:
          'You and your partner pass them off like zone defense. Nobody crosses, nobody gets picked.',
      },
      {
        text: 'Back off and let the play declare itself',
        correct: false,
        feedback: 'It already declared. Backing off hands them the line with speed.',
        trap: 'Patience is a tool - here it is just a free entry.',
      },
    ],
    coachCue: 'Defend lanes, not jerseys.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 38, y: 46, label: 'F' },
        { id: 'a2', team: 'away', x: 58, y: 44, label: 'F' },
        { id: 'd', team: 'home', x: 58, y: 58, label: 'D' },
        { id: 'd2', team: 'home', x: 40, y: 58, label: 'D' },
      ],
      puck: { x: 38, y: 46 },
      arrows: [
        { fromX: 38, fromY: 46, toX: 30, toY: 58, dashed: true },
        { fromX: 58, fromY: 44, toX: 64, toY: 58, dashed: true },
      ],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 62, y: 8 },
            a2: { x: 38, y: 10 },
            d: { x: 58, y: 34 },
            d2: { x: 42, y: 34 },
          },
          puck: { x: 62, y: 8 },
          narration: 'Two forwards come with speed, one on each side of center ice.',
        },
        {
          t: 4,
          players: {
            a1: { x: 58, y: 22 },
            a2: { x: 42, y: 23 },
            d: { x: 58, y: 42 },
            d2: { x: 42, y: 42 },
          },
          puck: { x: 58, y: 22 },
          narration: 'The carrier is on your side, his winger opposite - so far so simple.',
        },
        {
          t: 8,
          players: {
            a1: { x: 50, y: 34 },
            a2: { x: 48, y: 35 },
            d: { x: 58, y: 50 },
            d2: { x: 41, y: 50 },
          },
          puck: { x: 50, y: 34 },
          narration: "Here comes the criss-cross - they're scissoring right in front of you.",
        },
        {
          t: 11.5,
          players: {
            a1: { x: 38, y: 46 },
            a2: { x: 58, y: 44 },
            d: { x: 58, y: 58 },
            d2: { x: 40, y: 58 },
          },
          puck: { x: 38, y: 46 },
          narration: "The carrier swings to your partner's side and his buddy cuts into your lane...",
        },
        { t: 13 },
      ],
      freezeLine: "They've traded sides at your line. Who do you take?",
      narration:
        "Two forwards come with speed, one on each side of center ice. The carrier's on your side, his winger opposite, so far so simple. Then here comes the criss-cross, scissoring right in front of you as the carrier swings to your partner's side and his buddy cuts into your lane.",
    },
  },
  {
    id: 'nz-middle-drive',
    zone: 'neutral',
    category: 'middle-lane',
    difficulty: 'elite',
    title: 'The Middle Drive',
    setup:
      'Your partner has the carrier pinned wide. Their second forward is driving the middle lane at your net.',
    kind: 'mcq',
    options: [
      {
        text: 'Slide over and help your partner on the puck',
        correct: false,
        feedback: 'Look at the freeze - partner has him angled and pinned. You just donated the slot.',
        trap: 'Pressuring the puck is instinct. Read your partner first: he does not need you.',
      },
      {
        text: 'Stand up at the blue line to deny the entry',
        correct: false,
        feedback: 'The driver blows past a flat-footed D at the line and now he is behind you.',
        trap: 'Holding the line is great against a controlled carry - not against a sprinter.',
      },
      {
        text: 'Retreat straight back to your net front',
        correct: false,
        feedback: 'You leave the whole high slot open behind you. The cutback pass finds it.',
        trap: 'Protecting the crease early feels responsible - the seam behind you disagrees.',
      },
      {
        text: 'Skate with the driver, stick in the seam lane',
        correct: true,
        feedback:
          'Puck is contained wide, so the driver is the play. Match him stride for stride, kill the seam pass.',
      },
    ],
    coachCue: 'Puck contained? The driver is yours.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 15, y: 52, label: 'F' },
        { id: 'a2', team: 'away', x: 48, y: 44, label: 'F' },
        { id: 'd2', team: 'home', x: 24, y: 50, label: 'D' },
        { id: 'd', team: 'home', x: 52, y: 56, label: 'D' },
      ],
      puck: { x: 15, y: 52 },
      arrows: [{ fromX: 15, fromY: 52, toX: 50, toY: 60, dashed: true }],
      highlights: [{ x: 48, y: 44, radius: 8 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 30, y: 10 },
            a2: { x: 52, y: 8 },
            d2: { x: 34, y: 32 },
            d: { x: 54, y: 32 },
          },
          puck: { x: 30, y: 10 },
          narration: 'They come out of their zone two abreast with speed.',
        },
        {
          t: 4,
          players: {
            a1: { x: 22, y: 25 },
            a2: { x: 50, y: 21 },
            d2: { x: 30, y: 40 },
            d: { x: 53, y: 41 },
          },
          puck: { x: 22, y: 25 },
          narration: 'Your partner steps out and starts angling the carrier to the wall.',
        },
        {
          t: 8,
          players: {
            a1: { x: 18, y: 40 },
            a2: { x: 49, y: 33 },
            d2: { x: 26, y: 45 },
            d: { x: 52, y: 49 },
          },
          puck: { x: 18, y: 40 },
          narration: 'The second forward is driving the middle lane, straight at your net.',
        },
        {
          t: 11.5,
          players: {
            a1: { x: 15, y: 52 },
            a2: { x: 48, y: 44 },
            d2: { x: 24, y: 50 },
            d: { x: 52, y: 56 },
          },
          puck: { x: 15, y: 52 },
          narration: "Partner's got the carrier pinned wide - the driver is coming through the guts...",
        },
        { t: 13 },
      ],
      freezeLine:
        "Check the freeze - your partner has the puck man pinned. What's your job?",
      narration:
        "They come out of their zone two abreast with speed. Your partner steps out and starts angling the carrier to the wall. Their second forward drives the middle lane straight at your net. Partner's got the carrier pinned wide, and the driver is coming through the guts.",
    },
  },
  {
    id: 'nz-steam-close',
    zone: 'neutral',
    category: 'closing',
    difficulty: 'elite',
    title: 'Close With Backside Help',
    setup:
      'A carrier with a head of steam bears down on you. Your backchecker is one stride off his hip.',
    kind: 'mcq',
    options: [
      {
        text: 'Close him now and squeeze him into the backchecker',
        correct: true,
        feedback:
          'The backchecker changes the math. Attack, steer him to the wall - even beaten, help swallows him.',
      },
      {
        text: 'Respect his speed - retreat and protect the line',
        correct: false,
        feedback: 'You wasted your backchecker. He gets a free runway and your partner is still up ice.',
        trap: '"Never get beat wide" is the rule alone. You are not alone - look at the freeze.',
      },
      {
        text: 'Slide feet-first to cut off the wide lane',
        correct: false,
        feedback: 'Desperation with zero reason. He hops the slide and now nobody is between him and the net.',
        trap: 'The slide is a last resort - you have not used your first resorts yet.',
      },
      {
        text: 'Steer him to the middle toward your partner',
        correct: false,
        feedback: 'Check the far side - your partner is caught up ice from the pinch. The middle is empty.',
        trap: 'Funneling to a partner is textbook - when the partner is actually there.',
      },
    ],
    coachCue: 'Backpressure means attack, not retreat.',
    visual: {
      rinkZone: 'neutral',
      youId: 'd',
      players: [
        { id: 'a1', team: 'away', x: 35, y: 44, label: 'F' },
        { id: 'w', team: 'home', x: 39, y: 38, label: 'W' },
        { id: 'd', team: 'home', x: 40, y: 56, label: 'D' },
        { id: 'd2', team: 'home', x: 70, y: 36, label: 'D' },
      ],
      puck: { x: 35, y: 44 },
      highlights: [{ x: 39, y: 38, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a1: { x: 40, y: 6 },
            w: { x: 46, y: 4 },
            d: { x: 45, y: 32 },
            d2: { x: 78, y: 14 },
          },
          puck: { x: 40, y: 6 },
          narration: 'Your partner pinched and lost it - their winger takes off the other way.',
        },
        {
          t: 4,
          players: {
            a1: { x: 38, y: 19 },
            w: { x: 43, y: 16 },
            d: { x: 44, y: 40 },
            d2: { x: 76, y: 22 },
          },
          puck: { x: 38, y: 19 },
          narration: 'He turns the corner with a full head of steam - your winger gives chase.',
        },
        {
          t: 8,
          players: {
            a1: { x: 36, y: 32 },
            w: { x: 41, y: 28 },
            d: { x: 42, y: 48 },
            d2: { x: 73, y: 29 },
          },
          puck: { x: 36, y: 32 },
          narration: "Your partner's still caught up ice, but that backchecker is closing fast.",
        },
        {
          t: 11.5,
          players: {
            a1: { x: 35, y: 44 },
            w: { x: 39, y: 38 },
            d: { x: 40, y: 56 },
            d2: { x: 70, y: 36 },
          },
          puck: { x: 35, y: 44 },
          narration: "The backchecker's right on his hip now, flyer bearing down on you...",
        },
        { t: 13 },
      ],
      freezeLine:
        "Look at the ice - who's around him, and where's your partner? What's your play?",
      narration:
        "Your partner pinched and lost it, so their winger takes off the other way. He turns the corner with a full head of steam while your winger gives chase. Your partner's still caught up ice, but that backchecker is right on his hip now, the flyer bearing down on you.",
    },
  },
];
