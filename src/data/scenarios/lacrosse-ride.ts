import type { Scenario } from '@/types';

/**
 * Lacrosse attack - THE RIDE (zone `ride`, category `ride`).
 * Possession has flipped: the away team is clearing up the field and you, the
 * trainee (id `a`, team `home`), are riding to win the ball back. The clear
 * moves downfield (increasing y); the away carrier is `x1`. See AUTHORING.md.
 */
export const LACROSSE_RIDE_SCENARIOS: Scenario[] = [
  {
    id: 'lax-ride-breakdown',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'rookie',
    title: 'Break Down on the Ball',
    setup: "You're first man back, closing fast on the carrier.",
    kind: 'mcq',
    options: [
      {
        text: 'Sprint through him full speed',
        correct: false,
        feedback: 'You overrun him and he sidesteps into open field. Ride broken.',
        trap: 'Closing speed feels aggressive, but full steam lets him dodge you clean.',
      },
      {
        text: 'Stop early and give him room',
        correct: false,
        feedback: 'Backing off hands him a free runway up the field.',
        trap: 'Staying back feels safe, but you let the clear build downhill speed.',
      },
      {
        text: 'Break down under control, chop your feet, mirror him',
        correct: true,
        feedback: 'You gather under control so you can mirror his move instead of lunging.',
      },
    ],
    coachCue: 'Break down, do not overrun.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 42, y: 34, label: 'A' },
        { id: 'x1', team: 'away', x: 40, y: 30, label: 'D' },
      ],
      puck: { x: 40, y: 30 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 38, y: 46 }, x1: { x: 40, y: 14 } },
          puck: { x: 40, y: 14 },
          narration: 'They win the ball and their defender turns up field to clear.',
        },
        {
          t: 4,
          players: { a: { x: 40, y: 40 }, x1: { x: 40, y: 22 } },
          puck: { x: 40, y: 22 },
          narration: 'You are the first man back and you sprint up to meet him.',
        },
        {
          t: 8,
          players: { a: { x: 42, y: 36 }, x1: { x: 40, y: 28 } },
          puck: { x: 40, y: 28 },
          narration: 'You are closing fast and the gap is shrinking in a hurry.',
        },
        {
          t: 11.5,
          players: { a: { x: 42, y: 34 }, x1: { x: 40, y: 30 } },
          puck: { x: 40, y: 30 },
          narration: 'You are right on top of him now, still at full speed...',
        },
        { t: 13 },
      ],
      freezeLine: "You're closing on the carrier fast. How do you approach?",
      narration:
        'They win the ball and their defender turns up field to clear. You are the first man back and you sprint up to meet him. You are closing fast and the gap is shrinking in a hurry. You are right on top of him now, still carrying all that closing speed.',
    },
  },
  {
    id: 'lax-ride-strong-hand',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'rookie',
    title: 'Take His Strong Hand',
    setup: 'A righty turns to clear up his strong side.',
    kind: 'mcq',
    options: [
      {
        text: 'Angle to take away his strong hand, force him weak',
        correct: true,
        feedback: 'You wall off his strong hand so he has to go to his weaker side.',
      },
      {
        text: 'Concede the strong hand and the middle',
        correct: false,
        feedback: 'You let a righty run his best hand right up the gut. Easy clear.',
        trap: 'Giving ground feels safe, but you gave him his best hand and the middle.',
      },
      {
        text: 'Run straight at his chest',
        correct: false,
        feedback: 'No angle means he picks either hand and goes around you.',
        trap: 'Direct feels tough, but head-on gives him a choice of both sides.',
      },
    ],
    coachCue: 'Take away his strong hand.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 64, y: 30, label: 'A' },
        { id: 'x1', team: 'away', x: 58, y: 26, label: 'D' },
      ],
      puck: { x: 58, y: 26 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 60, y: 44 }, x1: { x: 56, y: 12 } },
          puck: { x: 56, y: 12 },
          narration: 'Their righty scoops it and turns up the right side to clear.',
        },
        {
          t: 4,
          players: { a: { x: 62, y: 38 }, x1: { x: 57, y: 18 } },
          puck: { x: 57, y: 18 },
          narration: 'He builds speed with the ball high in his strong right hand.',
        },
        {
          t: 8,
          players: { a: { x: 64, y: 32 }, x1: { x: 58, y: 23 } },
          puck: { x: 58, y: 23 },
          narration: 'You close the gap as he drives up the strong side.',
        },
        {
          t: 11.5,
          players: { a: { x: 64, y: 30 }, x1: { x: 58, y: 26 } },
          puck: { x: 58, y: 26 },
          narration: 'He is coming right at you with that strong hand loaded...',
        },
        { t: 13 },
      ],
      freezeLine: 'A righty is clearing his strong side. How do you ride him?',
      narration:
        'Their righty scoops it and turns up the right side to clear. He builds speed with the ball high in his strong right hand. You close the gap as he drives up the strong side. He is coming right at you now with that strong hand loaded and ready to run.',
    },
  },
  {
    id: 'lax-ride-cover-nearest',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'rookie',
    title: 'Deny Your Outlet',
    setup: 'The ball is on the far side; your nearest outlet drifts open near you.',
    kind: 'mcq',
    options: [
      {
        text: 'Sprint across to double the ball',
        correct: false,
        feedback: 'You leave your man and the carrier just hits him for a clean outlet.',
        trap: 'Two on the ball feels like pressure, but you opened your own man.',
      },
      {
        text: 'Drop all the way back on defense',
        correct: false,
        feedback: 'Bailing out concedes the clear before the ride even gets a chance.',
        trap: 'Getting back feels responsible, but you quit on the ride too early.',
      },
      {
        text: 'Stay and deny your nearest outlet',
        correct: true,
        feedback: 'You take away the easy pass near you so the carrier has nowhere to go.',
      },
    ],
    coachCue: 'Deny your outlet, do not ball-chase.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 60, y: 30, label: 'A' },
        { id: 'x1', team: 'away', x: 24, y: 28, label: 'D' },
        { id: 'x2', team: 'away', x: 64, y: 26, label: 'M' },
        { id: 'a2', team: 'home', x: 26, y: 32, label: 'A' },
      ],
      puck: { x: 24, y: 28 },
      highlights: [{ x: 64, y: 26, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 60, y: 20 },
            x1: { x: 24, y: 14 },
            x2: { x: 64, y: 14 },
            a2: { x: 26, y: 20 },
          },
          puck: { x: 24, y: 14 },
          narration: 'They clear it up the far side and your teammate rides the ball.',
        },
        {
          t: 4,
          players: { a: { x: 60, y: 26 }, x1: { x: 24, y: 20 }, x2: { x: 64, y: 20 }, a2: { x: 26, y: 26 } },
          puck: { x: 24, y: 20 },
          narration: 'Your teammate pressures the carrier hard on the left side.',
        },
        {
          t: 8,
          players: { x1: { x: 24, y: 26 }, x2: { x: 64, y: 24 } },
          puck: { x: 24, y: 26 },
          narration: 'On your side, the man you cover drifts open, calling for it.',
        },
        {
          t: 11.5,
          players: {
            a: { x: 60, y: 30 },
            x1: { x: 24, y: 28 },
            x2: { x: 64, y: 26 },
            a2: { x: 26, y: 32 },
          },
          puck: { x: 24, y: 28 },
          narration: 'The carrier is trapped and hunting for that outlet near you...',
        },
        { t: 13 },
      ],
      freezeLine: 'Ball on the far side, your man open near you. What do you do?',
      narration:
        'They clear it up the far side and your teammate rides the ball. Your teammate pressures the carrier hard on the left side. On your side, the man you cover drifts open, calling for it. The carrier is trapped and hunting for that easy outlet standing right next to you.',
    },
  },
  {
    id: 'lax-ride-angle',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'varsity',
    title: 'Angle the Clear',
    setup: 'You are the first rider on the clearing defender.',
    kind: 'mcq',
    options: [
      {
        text: 'Sprint straight at him head-on',
        correct: false,
        feedback: 'No angle means one dodge splits you and he is gone up the middle.',
        trap: 'Direct pressure feels aggressive, but head-on gives him both sides.',
      },
      {
        text: 'Drop off and get back on defense',
        correct: false,
        feedback: 'You concede the clear without ever making him earn it.',
        trap: 'It sounds responsible, but you gave up the ride for free.',
      },
      {
        text: 'Chase from directly behind',
        correct: false,
        feedback: 'Trailing him gives you no leverage and no way to turn him.',
        trap: 'Staying attached feels right, but from behind you cannot steer him.',
      },
      {
        text: 'Angle your approach to force him to the sideline',
        correct: true,
        feedback: 'You use the boundary as an extra defender and shrink his field.',
      },
    ],
    coachCue: 'Angle him to the sideline.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 46, y: 34, label: 'A' },
        { id: 'x1', team: 'away', x: 50, y: 28, label: 'D' },
      ],
      puck: { x: 50, y: 28 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 44, y: 46 }, x1: { x: 50, y: 12 } },
          puck: { x: 50, y: 12 },
          narration: 'Their defender clears it and drives straight up the middle.',
        },
        {
          t: 4,
          players: { a: { x: 45, y: 40 }, x1: { x: 50, y: 18 } },
          puck: { x: 50, y: 18 },
          narration: 'He picks up speed with green grass right up the gut.',
        },
        {
          t: 8,
          players: { a: { x: 46, y: 36 }, x1: { x: 50, y: 24 } },
          puck: { x: 50, y: 24 },
          narration: 'You are the first rider back with a chance to steer him.',
        },
        {
          t: 11.5,
          players: { a: { x: 46, y: 34 }, x1: { x: 50, y: 28 } },
          puck: { x: 50, y: 28 },
          narration: 'He is coming downhill in the middle with room both ways...',
        },
        { t: 13 },
      ],
      freezeLine: "You're the first rider and he's up the middle. How do you take him?",
      narration:
        'Their defender clears it and drives straight up the middle. He picks up speed with green grass right up the gut. You are the first rider back with a chance to steer him. He is coming downhill in the middle of the field with room to go either way.',
    },
  },
  {
    id: 'lax-ride-goalie-outlet',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'varsity',
    title: 'Ride the Goalie',
    setup: 'Their goalie steps behind the cage to outlet the ball.',
    kind: 'mcq',
    options: [
      {
        text: 'Charge him in his crease',
        correct: false,
        feedback: 'Charging the goalie lets him dump it past you before you arrive.',
        trap: 'Attacking the ball feels aggressive, but he just throws around you.',
      },
      {
        text: 'Stand flat and let him pick',
        correct: false,
        feedback: 'Giving him a clean look lets him pick out any outlet he wants.',
        trap: 'Staying home feels safe, but a free goalie completes every clear.',
      },
      {
        text: 'Sprint at his best outlet and leave the goalie',
        correct: false,
        feedback: 'You take one man and the goalie simply runs it up himself.',
        trap: 'Denying the top guy feels smart, but you left the ball carrier free.',
      },
      {
        text: 'Angle your ride to take away his easy outlet',
        correct: true,
        feedback: 'You force the goalie off his easy pass and into a low-percentage throw.',
      },
    ],
    coachCue: "Take away the goalie's easy outlet.",
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 44, y: 14, label: 'A' },
        { id: 'g', team: 'away', x: 50, y: 4, label: 'G' },
        { id: 'x1', team: 'away', x: 36, y: 16, label: 'D' },
        { id: 'x2', team: 'away', x: 60, y: 30, label: 'M' },
      ],
      puck: { x: 50, y: 4 },
      highlights: [{ x: 36, y: 16, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 40, y: 26 },
            g: { x: 50, y: 8 },
            x1: { x: 36, y: 16 },
            x2: { x: 60, y: 26 },
          },
          puck: { x: 50, y: 8 },
          narration: 'Their goalie makes the save and looks to spark the clear.',
        },
        {
          t: 4,
          players: { a: { x: 42, y: 20 }, g: { x: 50, y: 5 } },
          puck: { x: 50, y: 5 },
          narration: 'He steps behind his cage to buy room and find an outlet.',
        },
        {
          t: 8,
          players: { a: { x: 44, y: 16 }, g: { x: 50, y: 4 }, x2: { x: 60, y: 30 } },
          puck: { x: 50, y: 4 },
          narration: 'His easy outlet is open short while his best man is up top.',
        },
        {
          t: 11.5,
          players: {
            a: { x: 44, y: 14 },
            g: { x: 50, y: 4 },
            x1: { x: 36, y: 16 },
            x2: { x: 60, y: 30 },
          },
          puck: { x: 50, y: 4 },
          narration: 'You are the lone rider on a goalie with the ball behind the net...',
        },
        { t: 13 },
      ],
      freezeLine: 'The goalie is behind the cage to outlet. How do you ride him?',
      narration:
        'Their goalie makes the save and looks to spark the clear. He steps behind his cage to buy room and find an outlet. His easy short outlet is open while his best man waits up top. You are the lone rider on a goalie holding the ball behind his own net.',
    },
  },
  {
    id: 'lax-ride-numbers',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'varsity',
    title: 'When the Ride Is Beaten',
    setup: 'The clear breaks through past midfield with numbers.',
    kind: 'mcq',
    options: [
      {
        text: "Recognize it's beaten: sprint back, even the numbers, protect the middle",
        correct: true,
        feedback: 'The ride is done. Get back, take away the middle, and even it up.',
      },
      {
        text: 'Keep chasing the ball from behind',
        correct: false,
        feedback: 'Chasing from behind never catches it and leaves your defense down a man.',
        trap: 'Chasing feels like effort, but you are just trailing the play uselessly.',
      },
      {
        text: 'Foul the carrier to stop it',
        correct: false,
        feedback: 'A foul stops the clear but hands them a man-up in transition.',
        trap: 'Stopping it at all costs feels urgent, but now they are a man up.',
      },
      {
        text: 'Peel to the far wing man',
        correct: false,
        feedback: 'Chasing a wing opens the middle where the numbers are headed.',
        trap: 'Covering a man feels responsible, but the danger is up the middle.',
      },
    ],
    coachCue: 'Ride beaten - get back, protect middle.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 40, y: 40, label: 'A' },
        { id: 'x1', team: 'away', x: 45, y: 54, label: 'D' },
        { id: 'x2', team: 'away', x: 58, y: 52, label: 'M' },
      ],
      puck: { x: 45, y: 54 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 42, y: 28 }, x1: { x: 40, y: 32 }, x2: { x: 56, y: 34 } },
          puck: { x: 40, y: 32 },
          narration: 'The clear slips past the first wave of your ride with speed.',
        },
        {
          t: 4,
          players: { a: { x: 41, y: 34 }, x1: { x: 42, y: 42 }, x2: { x: 57, y: 42 } },
          puck: { x: 42, y: 42 },
          narration: 'They push it through the middle with an extra man in support.',
        },
        {
          t: 8,
          players: { a: { x: 40, y: 38 }, x1: { x: 44, y: 50 }, x2: { x: 58, y: 50 } },
          puck: { x: 44, y: 50 },
          narration: 'They cross midfield with numbers and you are trailing the ball.',
        },
        {
          t: 11.5,
          players: { a: { x: 40, y: 40 }, x1: { x: 45, y: 54 }, x2: { x: 58, y: 52 } },
          puck: { x: 45, y: 54 },
          narration: 'The ride is beaten and they are coming with an odd-man look...',
        },
        { t: 13 },
      ],
      freezeLine: 'The clear beat your ride with numbers. What do you do?',
      narration:
        'The clear slips past the first wave of your ride with speed. They push it through the middle with an extra man in support. They cross midfield with numbers and you are trailing the ball. The ride is beaten and they are coming at your defense with an odd-man look.',
    },
  },
  {
    id: 'lax-ride-force-to-trap',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'elite',
    title: 'Funnel Him Into Help',
    setup: 'Your teammate waits up the sideline, ready to jump.',
    kind: 'mcq',
    options: [
      {
        text: 'Force him the other way into open field',
        correct: false,
        feedback: 'You push him away from your help into all that green grass. Clear.',
        trap: 'Away from the ball pressure feels safe, but you sent him to open space.',
      },
      {
        text: 'Funnel him toward your teammate and the boundary, spring the double',
        correct: true,
        feedback: 'You steer him into your waiting help and the sideline for the double.',
      },
      {
        text: 'Straight-up pressure with no angle',
        correct: false,
        feedback: 'No angle lets him choose his escape and avoid your help entirely.',
        trap: 'It feels aggressive, but without a plan he just picks the open side.',
      },
      {
        text: 'Peel off to cover an outlet',
        correct: false,
        feedback: 'Leaving the ball lets him walk out of the trap you had set.',
        trap: 'Covering a pass feels team-oriented, but you gave up the double.',
      },
    ],
    coachCue: 'Funnel him into your help.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 44, y: 30, label: 'A' },
        { id: 'x1', team: 'away', x: 34, y: 28, label: 'D' },
        { id: 'a2', team: 'home', x: 14, y: 30, label: 'A' },
      ],
      puck: { x: 34, y: 28 },
      highlights: [{ x: 14, y: 30, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 48, y: 42 }, x1: { x: 40, y: 12 }, a2: { x: 14, y: 30 } },
          puck: { x: 40, y: 12 },
          narration: 'Their carrier turns up field to clear as your ride sets up.',
        },
        {
          t: 4,
          players: { a: { x: 46, y: 36 }, x1: { x: 38, y: 18 } },
          puck: { x: 38, y: 18 },
          narration: 'He drives toward the middle, looking for a lane to run.',
        },
        {
          t: 8,
          players: { a: { x: 45, y: 32 }, x1: { x: 36, y: 24 } },
          puck: { x: 36, y: 24 },
          narration: 'Your teammate lurks near the sideline, hidden and ready.',
        },
        {
          t: 11.5,
          players: { a: { x: 44, y: 30 }, x1: { x: 34, y: 28 }, a2: { x: 14, y: 30 } },
          puck: { x: 34, y: 28 },
          narration: 'You have the angle to send him wherever you want...',
        },
        { t: 13 },
      ],
      freezeLine: 'Your help waits on the sideline. Which way do you steer him?',
      narration:
        'Their carrier turns up field to clear as your ride sets up. He drives toward the middle, looking for a lane to run. Your teammate lurks near the sideline, hidden and ready to jump. You have the angle to send this carrier wherever you want him to go.',
    },
  },
  {
    id: 'lax-ride-anticipate',
    sport: 'lacrosse',
    zone: 'ride',
    category: 'ride',
    difficulty: 'elite',
    title: 'Jump the Outlet',
    setup: 'You gave a cushion on purpose; the carrier winds up to hit his wing.',
    kind: 'mcq',
    options: [
      {
        text: 'Stay locked on the carrier only',
        correct: false,
        feedback: 'Eyes only on the ball lets the outlet pass go without a challenge.',
        trap: 'Pressuring the ball feels like the job, but the pass is the play here.',
      },
      {
        text: 'Gamble early and sprint at the receiver',
        correct: false,
        feedback: 'Jump too soon and the carrier just hits the man behind you instead.',
        trap: 'Anticipating feels right, but early tips your hand and he counters.',
      },
      {
        text: 'Read the outlet and break on the pass, take it away',
        correct: true,
        feedback: 'You bait the throw, then break as it leaves his stick and pick it off.',
      },
      {
        text: 'Drop off and concede',
        correct: false,
        feedback: 'Backing off hands them the completion and a clean clear.',
        trap: 'Playing it safe feels responsible, but you gave up a jumpable ball.',
      },
    ],
    coachCue: 'Read the outlet and jump it.',
    visual: {
      rinkZone: 'neutral',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 56, y: 32, label: 'A' },
        { id: 'x1', team: 'away', x: 44, y: 30, label: 'D' },
        { id: 'x2', team: 'away', x: 68, y: 34, label: 'M' },
      ],
      puck: { x: 44, y: 30 },
      arrows: [{ fromX: 44, fromY: 30, toX: 66, toY: 34, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 54, y: 22 }, x1: { x: 40, y: 14 }, x2: { x: 66, y: 22 } },
          puck: { x: 40, y: 14 },
          narration: 'Their carrier clears up the middle as his wing runs alongside.',
        },
        {
          t: 4,
          players: { a: { x: 55, y: 26 }, x1: { x: 42, y: 20 }, x2: { x: 67, y: 28 } },
          puck: { x: 42, y: 20 },
          narration: 'You give a cushion on purpose, baiting him to make the pass.',
        },
        {
          t: 8,
          players: { a: { x: 56, y: 30 }, x1: { x: 44, y: 27 }, x2: { x: 68, y: 32 } },
          puck: { x: 44, y: 27 },
          narration: 'He lifts his head and loads up to hit his wing on the run.',
        },
        {
          t: 11.5,
          players: { a: { x: 56, y: 32 }, x1: { x: 44, y: 30 }, x2: { x: 68, y: 34 } },
          puck: { x: 44, y: 30 },
          narration: 'The pass is loaded and the lane to his wing is right there...',
        },
        { t: 13 },
      ],
      freezeLine: "He's winding up to hit his wing. What's your move?",
      narration:
        'Their carrier clears up the middle as his wing runs alongside. You give a cushion on purpose, baiting him to make the pass. He lifts his head and loads up to hit his wing on the run. The pass is loaded and the lane to his wing is sitting right there in front of you.',
    },
  },
];
