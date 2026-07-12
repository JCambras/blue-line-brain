import type { Scenario } from '@/types';

/**
 * Lacrosse attack - FINISHING (zone `finish`, category `shot`).
 * You are the trainee shooter, id `a`, on team `home`, attacking the TOP goal.
 * The away goalie is `g` near (50, 7-8). See AUTHORING.md for the contract.
 */
export const LACROSSE_FINISH_SCENARIOS: Scenario[] = [
  {
    id: 'lax-shot-selection',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'rookie',
    title: 'Pick Your Spot',
    setup: 'Inside with a step; the goalie sets and squares to you.',
    kind: 'mcq',
    options: [
      {
        text: 'Rip it chest-high',
        correct: false,
        feedback: 'Chest-high is right where his hands are. Easy save.',
        trap: 'A hard high shot feels powerful, but you shot it at his strength.',
      },
      {
        text: 'Big windup for max power',
        correct: false,
        feedback: 'The windup tips your shot and gives him time to set his feet.',
        trap: 'More power feels like more goals, but placement beats power here.',
      },
      {
        text: 'Shoot low to the far pipe, away from him',
        correct: true,
        feedback: 'You shoot where the goalie is not - low and far, the hardest save.',
      },
    ],
    coachCue: 'Shoot where the goalie is not.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 58, y: 16, label: 'A' },
        { id: 'g', team: 'away', x: 52, y: 8, label: 'G' },
      ],
      puck: { x: 58, y: 16 },
      arrows: [{ fromX: 58, fromY: 16, toX: 47, toY: 9, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 62, y: 30 }, g: { x: 50, y: 8 } },
          puck: { x: 62, y: 30 },
          narration: 'You catch it on the right side and drive downhill to the goal.',
        },
        {
          t: 4,
          players: { a: { x: 60, y: 24 }, g: { x: 51, y: 8 } },
          puck: { x: 60, y: 24 },
          narration: 'You get a step inside and the goalie starts to track you.',
        },
        {
          t: 8,
          players: { a: { x: 58, y: 18 }, g: { x: 52, y: 8 } },
          puck: { x: 58, y: 18 },
          narration: 'He squares up and sets his feet, filling the near side.',
        },
        {
          t: 11.5,
          players: { a: { x: 58, y: 16 }, g: { x: 52, y: 8 } },
          puck: { x: 58, y: 16 },
          narration: 'You are inside with a step and a set goalie in front...',
        },
        { t: 13 },
      ],
      freezeLine: "You're inside with a step and he's set. Where's the shot?",
      narration:
        'You catch it on the right side and drive downhill to the goal. You get a step inside and the goalie starts to track you. He squares up and sets his feet, filling the near side. Now you are in tight with a step, a set goalie standing right in front of you.',
    },
  },
  {
    id: 'lax-finish-quick-stick',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'rookie',
    title: 'Quick-Stick It',
    setup: 'The feed arrives while the goalie is still sliding across.',
    kind: 'mcq',
    options: [
      {
        text: 'Catch-and-shoot in one motion before he sets',
        correct: true,
        feedback: 'You shoot before he can set, into the net he has not covered yet.',
      },
      {
        text: 'Cradle, then wind up',
        correct: false,
        feedback: 'The extra cradle lets him slide across and square up. Save.',
        trap: 'Settling it feels controlled, but you gave him the time he needed.',
      },
      {
        text: 'Pass it back out top',
        correct: false,
        feedback: 'You pass up an open net because you did not trust the quick shot.',
        trap: 'Resetting feels safe, but the goalie was out of position right then.',
      },
    ],
    coachCue: 'Quick-stick before he gets set.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 58, y: 14, label: 'A' },
        { id: 'a2', team: 'home', x: 30, y: 14, label: 'A' },
        { id: 'g', team: 'away', x: 46, y: 8, label: 'G' },
      ],
      puck: { x: 58, y: 14 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 58, y: 14 }, a2: { x: 34, y: 26 }, g: { x: 50, y: 8 } },
          puck: { x: 34, y: 26 },
          narration: 'Your teammate dodges down the left side and draws the goalie over.',
        },
        {
          t: 4,
          players: { a2: { x: 31, y: 19 }, g: { x: 48, y: 8 } },
          puck: { x: 31, y: 19 },
          narration: 'He gets to GLE and the goalie slides hard to cover the near post.',
        },
        {
          t: 8,
          players: { a2: { x: 30, y: 14 }, g: { x: 46, y: 8 } },
          puck: { x: 30, y: 14 },
          narration: 'He skips it across to you on the back side, and here it comes.',
        },
        {
          t: 11.5,
          players: { a: { x: 58, y: 14 }, a2: { x: 30, y: 14 }, g: { x: 46, y: 8 } },
          puck: { x: 58, y: 14 },
          narration: 'The ball hits your stick with the goalie still mid-slide...',
        },
        { t: 13 },
      ],
      freezeLine: 'The feed arrives and the goalie is still sliding. What now?',
      narration:
        'Your teammate dodges down the left side and draws the goalie over. He gets to GLE and the goalie slides hard to cover the near post. He skips it across to you on the back side. The ball hits your stick with the goalie still mid-slide, the far side wide open.',
    },
  },
  {
    id: 'lax-finish-against-grain',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'rookie',
    title: 'Shoot Against the Grain',
    setup: 'A skip pass finds you backside; the goalie is still leaning where it came from.',
    kind: 'mcq',
    options: [
      {
        text: 'Shoot where he is sliding to',
        correct: false,
        feedback: 'You shoot into his momentum and he gets there with the slide.',
        trap: 'Following the ball feels natural, but you shot right where he is going.',
      },
      {
        text: 'Shoot against his momentum, into the side he vacated',
        correct: true,
        feedback: 'He is leaning one way; you shoot back the other, where he left the net.',
      },
      {
        text: 'Force it back to your strong side',
        correct: false,
        feedback: 'Resetting to strong hand gives him time to recover his angle.',
        trap: 'Strong side feels safe, but the open net is against the grain right now.',
      },
    ],
    coachCue: 'Shoot against his momentum.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 62, y: 15, label: 'A' },
        { id: 'a2', team: 'home', x: 32, y: 16, label: 'A' },
        { id: 'g', team: 'away', x: 46, y: 9, label: 'G' },
      ],
      puck: { x: 62, y: 15 },
      arrows: [{ fromX: 62, fromY: 15, toX: 54, toY: 8, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 62, y: 15 }, a2: { x: 36, y: 28 }, g: { x: 50, y: 8 } },
          puck: { x: 36, y: 28 },
          narration: 'The ball is on the left side as your teammate drives the alley.',
        },
        {
          t: 4,
          players: { a2: { x: 33, y: 21 }, g: { x: 48, y: 8 } },
          puck: { x: 33, y: 21 },
          narration: 'The goalie leans and slides left to follow the ball down.',
        },
        {
          t: 8,
          players: { a2: { x: 32, y: 16 }, g: { x: 46, y: 9 } },
          puck: { x: 32, y: 16 },
          narration: 'He skips it cross-field to you, backside and wide open.',
        },
        {
          t: 11.5,
          players: { a: { x: 62, y: 15 }, a2: { x: 32, y: 16 }, g: { x: 46, y: 9 } },
          puck: { x: 62, y: 15 },
          narration: 'It arrives with the goalie still drifting the other way...',
        },
        { t: 13 },
      ],
      freezeLine: 'You catch it backside and he is leaning. Where do you shoot?',
      narration:
        'The ball is on the left side as your teammate drives the alley. The goalie leans and slides left to follow it down. He skips it cross-field to you, backside and open. It arrives with the goalie still drifting the other way, his weight all going away from your side.',
    },
  },
  {
    id: 'lax-finish-time-and-room',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'varsity',
    title: 'Time and Room',
    setup: 'Free look up top, nobody pressuring you.',
    kind: 'mcq',
    options: [
      {
        text: 'Rip it max-power high',
        correct: false,
        feedback: 'A high bomb sails or gets eaten. Power without a target is a miss.',
        trap: 'A bomb feels exciting, but from up top you need a placed shot.',
      },
      {
        text: 'Take the time-and-room shot, hard but placed low to a corner',
        correct: true,
        feedback: 'With time you pick a corner and drive it low and hard. High percentage.',
      },
      {
        text: 'Dodge in closer into help',
        correct: false,
        feedback: 'You give up a clean look and dodge into the traffic you avoided.',
        trap: 'Closer feels higher-percentage, but you traded a free look for a crowd.',
      },
      {
        text: 'Pass up the look',
        correct: false,
        feedback: 'You had time and room and moved it. That is the shot you want.',
        trap: 'Moving it feels unselfish, but this is exactly the look you shoot.',
      },
    ],
    coachCue: 'Time and room: place it low.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 50, y: 24, label: 'A' },
        { id: 'g', team: 'away', x: 50, y: 8, label: 'G' },
      ],
      puck: { x: 50, y: 24 },
      arrows: [{ fromX: 50, fromY: 24, toX: 46, toY: 9, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 38, y: 32 }, g: { x: 50, y: 8 } },
          puck: { x: 38, y: 32 },
          narration: 'You catch a swing pass up top with the defense sagged way off.',
        },
        {
          t: 4,
          players: { a: { x: 43, y: 29 }, g: { x: 50, y: 8 } },
          puck: { x: 43, y: 29 },
          narration: 'You step into it, and nobody closes out to pressure you.',
        },
        {
          t: 8,
          players: { a: { x: 48, y: 26 }, g: { x: 50, y: 8 } },
          puck: { x: 48, y: 26 },
          narration: 'You have a clean, unhurried look from the top of the box.',
        },
        {
          t: 11.5,
          players: { a: { x: 50, y: 24 }, g: { x: 50, y: 8 } },
          puck: { x: 50, y: 24 },
          narration: 'You settle into a pocket with all the time in the world...',
        },
        { t: 13 },
      ],
      freezeLine: "You've got time and room up top. What kind of shot?",
      narration:
        'You catch a swing pass up top with the defense sagged way off. You step into it and nobody closes out. You have a clean, unhurried look from the top of the box. You settle into a pocket with all the time in the world and a goalie waiting sixteen yards away.',
    },
  },
  {
    id: 'lax-finish-shot-fake',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'varsity',
    title: 'Freeze Him With a Fake',
    setup: 'A big, aggressive goalie is set to challenge your shot.',
    kind: 'mcq',
    options: [
      {
        text: 'Shoot clean into the set goalie',
        correct: false,
        feedback: 'He is big and squared. A clean shot is right into his chest.',
        trap: 'You have a look so you feel you should shoot, but he is filling the net.',
      },
      {
        text: 'No fake, force past the recovering pole',
        correct: false,
        feedback: 'Rushing it lets the goalie stay set and the pole get a piece.',
        trap: 'Quick feels like beating the recovery, but you never moved the goalie.',
      },
      {
        text: 'Hold the fake too long',
        correct: false,
        feedback: 'A long fake lets the recovering defender arrive and check you.',
        trap: 'A bigger fake feels convincing, but the check gets there first.',
      },
      {
        text: 'Hard shot fake to commit him, then shoot the opening',
        correct: true,
        feedback: 'The fake makes the big goalie move first, then you shoot where he left.',
      },
    ],
    coachCue: 'Fake him, then shoot the opening.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 48, y: 16, label: 'A' },
        { id: 'g', team: 'away', x: 50, y: 10, label: 'G' },
      ],
      puck: { x: 48, y: 16 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 48, y: 30 }, g: { x: 50, y: 8 } },
          puck: { x: 48, y: 30 },
          narration: 'You dodge into the middle with a look at the cage.',
        },
        {
          t: 4,
          players: { a: { x: 48, y: 23 }, g: { x: 50, y: 9 } },
          puck: { x: 48, y: 23 },
          narration: 'Their goalie is huge and steps out aggressively to challenge.',
        },
        {
          t: 8,
          players: { a: { x: 48, y: 18 }, g: { x: 50, y: 10 } },
          puck: { x: 48, y: 18 },
          narration: 'He is way out of his crease, filling the whole net in your face.',
        },
        {
          t: 11.5,
          players: { a: { x: 48, y: 16 }, g: { x: 50, y: 10 } },
          puck: { x: 48, y: 16 },
          narration: 'He is set, big, and daring you to beat him clean...',
        },
        { t: 13 },
      ],
      freezeLine: 'The big goalie is set and challenging. How do you beat him?',
      narration:
        'You dodge into the middle with a look at the cage. Their goalie is huge and steps out aggressively to challenge. He is way out of his crease, filling the whole net in your face. He is set, big, and daring you to try to beat him with a clean shot.',
    },
  },
  {
    id: 'lax-finish-far-pipe',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'varsity',
    title: 'He Cheats Near, Go Far',
    setup: 'The goalie shades hard to your near pipe.',
    kind: 'mcq',
    options: [
      {
        text: 'Shoot back across to the far pipe he left',
        correct: true,
        feedback: 'He overcommitted near. You shoot to the far pipe he just abandoned.',
      },
      {
        text: 'Near pipe where he sits',
        correct: false,
        feedback: 'That is exactly the post he is cheating to. Straight into him.',
        trap: 'The nearest pipe looks easiest, but it is the one he took away.',
      },
      {
        text: 'Chest-high',
        correct: false,
        feedback: 'High and central plays into a set goalie with his hands up.',
        trap: 'High and hard feels powerful, but center is his strength.',
      },
      {
        text: 'Pass off and reset',
        correct: false,
        feedback: 'You give up a shot with half the net open because he cheated.',
        trap: 'Ball movement feels unselfish, but he handed you the far pipe.',
      },
    ],
    coachCue: 'He cheats near, go far.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 60, y: 15, label: 'A' },
        { id: 'g', team: 'away', x: 53, y: 8, label: 'G' },
      ],
      puck: { x: 60, y: 15 },
      arrows: [{ fromX: 60, fromY: 15, toX: 47, toY: 9, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 64, y: 28 }, g: { x: 50, y: 8 } },
          puck: { x: 64, y: 28 },
          narration: 'You drive the right side, angling in toward the goal.',
        },
        {
          t: 4,
          players: { a: { x: 62, y: 21 }, g: { x: 51, y: 8 } },
          puck: { x: 62, y: 21 },
          narration: 'The goalie slides to protect the near post against your angle.',
        },
        {
          t: 8,
          players: { a: { x: 60, y: 17 }, g: { x: 53, y: 8 } },
          puck: { x: 60, y: 17 },
          narration: 'He cheats hard to the near pipe, overplaying your shooting side.',
        },
        {
          t: 11.5,
          players: { a: { x: 60, y: 15 }, g: { x: 53, y: 8 } },
          puck: { x: 60, y: 15 },
          narration: 'He is sitting on the near pipe, far side hanging open...',
        },
        { t: 13 },
      ],
      freezeLine: 'He is cheating your near pipe. Where does it go?',
      narration:
        'You drive the right side, angling in toward the goal. The goalie slides to protect the near post against your angle. He cheats hard to the near pipe, overplaying your shooting side. He is sitting on the near pipe now, and the far side of the net is hanging open.',
    },
  },
  {
    id: 'lax-finish-only-window',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'elite',
    title: 'Find the Only Window',
    setup: 'The goalie is set square AND a defender recovers to your hands.',
    kind: 'mcq',
    options: [
      {
        text: 'High near over him',
        correct: false,
        feedback: 'High near is where his top hand and the recovering stick both are.',
        trap: 'The quickest release feels best, but it is straight into two obstacles.',
      },
      {
        text: 'Bounce it into the traffic',
        correct: false,
        feedback: "A bounce shot here catches the recovering pole's stick in the lane.",
        trap: "A bounce feels sneaky, but the defender's stick blocks the low lane.",
      },
      {
        text: 'Wait and reposition',
        correct: false,
        feedback: 'Waiting lets the pole finish recovering and the window closes.',
        trap: 'Patience feels safe, but every beat you wait shrinks the only opening.',
      },
      {
        text: 'Low far corner, away from his body and the stick',
        correct: true,
        feedback: 'The one open window is low and far, past both the goalie and the check.',
      },
    ],
    coachCue: 'Low far, away from stick and goalie.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 56, y: 15, label: 'A' },
        { id: 'g', team: 'away', x: 51, y: 8, label: 'G' },
        { id: 'xa', team: 'away', x: 58, y: 17, label: 'D' },
      ],
      puck: { x: 56, y: 15 },
      arrows: [{ fromX: 56, fromY: 15, toX: 47, toY: 9, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 60, y: 28 }, g: { x: 50, y: 8 }, xa: { x: 64, y: 24 } },
          puck: { x: 60, y: 28 },
          narration: 'You split into the middle looking for your finish.',
        },
        {
          t: 4,
          players: { a: { x: 58, y: 21 }, g: { x: 51, y: 8 }, xa: { x: 61, y: 20 } },
          puck: { x: 58, y: 21 },
          narration: 'The goalie squares up perfectly as you close on the cage.',
        },
        {
          t: 8,
          players: { a: { x: 56, y: 17 }, xa: { x: 59, y: 18 } },
          puck: { x: 56, y: 17 },
          narration: 'A defender recovers hard and gets his stick back to your hands.',
        },
        {
          t: 11.5,
          players: { a: { x: 56, y: 15 }, g: { x: 51, y: 8 }, xa: { x: 58, y: 17 } },
          puck: { x: 56, y: 15 },
          narration: 'Set goalie in front, a stick on your hands, one window left...',
        },
        { t: 13 },
      ],
      freezeLine: 'Set goalie and a stick on your hands. Where is the window?',
      narration:
        'You split into the middle looking for your finish. The goalie squares up perfectly as you close on the cage. A defender recovers hard and gets his stick back to your hands. Now there is a set goalie in front and a check on your hands, with only one window left in the net.',
    },
  },
  {
    id: 'lax-finish-bounce-screen',
    sport: 'lacrosse',
    zone: 'finish',
    category: 'shot',
    difficulty: 'elite',
    title: 'Bounce It Through the Screen',
    setup: 'A wall of bodies screens the goalie in front of the cage.',
    kind: 'mcq',
    options: [
      {
        text: 'Shoot high over the screen',
        correct: false,
        feedback: 'High clears the bodies but the goalie sees it all the way. Save.',
        trap: 'Over the crowd feels clean, but he tracks a high shot the whole flight.',
      },
      {
        text: 'Wait for a clear lane',
        correct: false,
        feedback: 'It never clears, and the pole checking you strips it while you wait.',
        trap: 'Waiting feels smart, but you are being checked and the lane stays clogged.',
      },
      {
        text: 'Bounce it low through the screen to a corner',
        correct: true,
        feedback: 'A low bounce through the bodies hides it late; he cannot track it.',
      },
      {
        text: 'Pass into the pile',
        correct: false,
        feedback: 'Feeding into the crowd of sticks is a turnover waiting to happen.',
        trap: 'Feeding the crease feels aggressive, but the pile is all traffic.',
      },
    ],
    coachCue: 'Bounce it low through the screen.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 50, y: 22, label: 'A' },
        { id: 'a2', team: 'home', x: 46, y: 13, label: 'A' },
        { id: 'xa', team: 'away', x: 49, y: 12, label: 'D' },
        { id: 'x2', team: 'away', x: 53, y: 12, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 8, label: 'G' },
      ],
      puck: { x: 50, y: 22 },
      arrows: [{ fromX: 50, fromY: 22, toX: 45, toY: 9, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 46, y: 34 },
            a2: { x: 46, y: 13 },
            xa: { x: 49, y: 12 },
            x2: { x: 53, y: 12 },
            g: { x: 50, y: 8 },
          },
          puck: { x: 46, y: 34 },
          narration: 'You catch it up top with a crowd already forming at the crease.',
        },
        {
          t: 4,
          players: { a: { x: 47, y: 29 } },
          puck: { x: 47, y: 29 },
          narration: 'You step down into shooting range as the bodies pile in.',
        },
        {
          t: 8,
          players: { a: { x: 49, y: 25 } },
          puck: { x: 49, y: 25 },
          narration: 'Sticks and shoulders wall off the goalie right in his sightline.',
        },
        {
          t: 11.5,
          players: { a: { x: 50, y: 22 } },
          puck: { x: 50, y: 22 },
          narration: 'The goalie is fully screened and cannot see the ball...',
        },
        { t: 13 },
      ],
      freezeLine: 'A wall of bodies screens the goalie. What is your shot?',
      narration:
        'You catch it up top with a crowd already forming at the crease. You step down into shooting range as the bodies pile in. Sticks and shoulders wall off the goalie right in his sightline. He is fully screened now and cannot pick the ball up out of your stick.',
    },
  },
];
