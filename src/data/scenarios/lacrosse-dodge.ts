import type { Scenario } from '@/types';

/**
 * Lacrosse attack - DODGING & INITIATING (zone `dodge`).
 * You are the trainee attacker, id `a`, on team `home`, attacking the TOP goal
 * (small y). X is behind that goal (y ~3-5); the crease sits at (50, 8).
 * See src/data/scenarios/AUTHORING.md for the mechanical contract.
 */
export const LACROSSE_DODGE_SCENARIOS: Scenario[] = [
  {
    id: 'lax-dodge-x-topside',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'rookie',
    title: 'Dodge From X',
    setup: 'At X behind the goal, your man seals your strong right hand.',
    kind: 'mcq',
    options: [
      {
        text: 'Force strong right into him',
        correct: false,
        feedback: 'You dodge straight into his checks. He walls you off with no angle.',
        trap: 'Your strong hand feels natural, but he is already sitting on it.',
      },
      {
        text: 'Roll back left and attack topside to GLE',
        correct: true,
        feedback: 'You dodge away from his pressure into open space and turn the corner.',
      },
      {
        text: 'Throw it back out top and reset',
        correct: false,
        feedback: 'You had him leaning. Bailing out wastes the advantage you created.',
        trap: 'Passing feels safe, but you just gave back a dodge you were winning.',
      },
    ],
    coachCue: 'Dodge away from his pressure.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 38, y: 12, label: 'A' },
        { id: 'x1', team: 'away', x: 44, y: 9, label: 'D' },
        { id: 'a2', team: 'home', x: 50, y: 22, label: 'A' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 38, y: 12 },
      arrows: [{ fromX: 38, fromY: 12, toX: 30, toY: 10, dashed: false }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 50, y: 4 }, x1: { x: 56, y: 5 }, a2: { x: 50, y: 22 }, g: { x: 50, y: 7 } },
          puck: { x: 50, y: 4 },
          narration: 'You catch it at X, behind the cage, sizing up your matchup.',
        },
        {
          t: 4,
          players: { a: { x: 46, y: 4 }, x1: { x: 54, y: 5 } },
          puck: { x: 46, y: 4 },
          narration: 'He jumps your right hand hard and seals that side off.',
        },
        {
          t: 8,
          players: { a: { x: 40, y: 8 }, x1: { x: 48, y: 7 } },
          puck: { x: 40, y: 8 },
          narration: 'You roll back the other way toward the empty side of the net.',
        },
        {
          t: 11.5,
          players: { a: { x: 38, y: 12 }, x1: { x: 44, y: 9 } },
          puck: { x: 38, y: 12 },
          narration: 'Now you are coming out front topside with a step on him...',
        },
        { t: 13 },
      ],
      freezeLine: "You're at X with your strong hand sealed. What's your move?",
      narration:
        'You catch it at X behind the cage and size up your man. He jumps your strong right hand and seals it off. So you roll back the other way toward the open side, turning the corner as you come out front with a step on him.',
    },
  },
  {
    id: 'lax-dodge-topside-vs-soft',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'rookie',
    title: 'Take the Room He Gives',
    setup: 'You catch up top in the right alley; your man sags to protect inside.',
    kind: 'mcq',
    options: [
      {
        text: 'Drive topside into the space he gave',
        correct: true,
        feedback: 'He conceded the outside, so you get downhill before help can arrive.',
      },
      {
        text: 'Swing it and reset',
        correct: false,
        feedback: 'He gave you a free lane and you passed it up. Take what he gives.',
        trap: 'Resetting feels patient, but patience wastes an open driving lane.',
      },
      {
        text: 'Dodge underneath into his cushion',
        correct: false,
        feedback: 'You drive right into the help he is protecting. No angle to the cage.',
        trap: 'Going inside feels like a win, but that is exactly where he wants you.',
      },
    ],
    coachCue: 'Attack the space he gives you.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 72, y: 18, label: 'A' },
        { id: 'x1', team: 'away', x: 64, y: 20, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 72, y: 18 },
      arrows: [{ fromX: 72, fromY: 18, toX: 66, toY: 10, dashed: false }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 74, y: 30 }, x1: { x: 66, y: 26 }, g: { x: 50, y: 7 } },
          puck: { x: 74, y: 30 },
          narration: 'You catch it up top in the right alley, squared to the cage.',
        },
        {
          t: 4,
          players: { a: { x: 73, y: 24 }, x1: { x: 65, y: 23 } },
          puck: { x: 73, y: 24 },
          narration: 'Watch his feet. He sags inside to wall off the middle.',
        },
        {
          t: 8,
          players: { a: { x: 72, y: 20 }, x1: { x: 64, y: 21 } },
          puck: { x: 72, y: 20 },
          narration: 'That leaves the whole topside lane wide open for you.',
        },
        {
          t: 11.5,
          players: { a: { x: 72, y: 18 }, x1: { x: 64, y: 20 } },
          puck: { x: 72, y: 18 },
          narration: 'You plant and get ready to attack the room he gave you...',
        },
        { t: 13 },
      ],
      freezeLine: "You're up top and he's sagging inside. Where do you go?",
      narration:
        'You catch it up top in the right alley, squared to the cage. Watch his feet, he sags inside to protect the middle. That leaves the whole topside lane open. You plant, ready to attack the room he just handed you before help slides over.',
    },
  },
  {
    id: 'lax-dodge-protect-stick',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'rookie',
    title: 'Protect Your Stick',
    setup: 'Driving to GLE, the defender throws checks at your stick.',
    kind: 'mcq',
    options: [
      {
        text: 'Cradle high where he can reach it',
        correct: false,
        feedback: 'A high cradle is a target. One check and the ball is on the turf.',
        trap: 'Holding it high feels strong, but it hangs the stick right in his lane.',
      },
      {
        text: 'Blind spin back into him',
        correct: false,
        feedback: 'You spin into the check and lose sight of the field. Turnover.',
        trap: 'A spin feels protective, but blind into pressure is how you get stripped.',
      },
      {
        text: 'Stick to the far side, body between, feet moving',
        correct: true,
        feedback: 'Your body shields the stick and your feet keep the angle to the cage.',
      },
    ],
    coachCue: 'Body between him and your stick.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 40, y: 12, label: 'A' },
        { id: 'x1', team: 'away', x: 46, y: 13, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 40, y: 12 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 30, y: 26 }, x1: { x: 36, y: 24 }, g: { x: 50, y: 7 } },
          puck: { x: 30, y: 26 },
          narration: 'You turn the corner on the left wing and head downhill to GLE.',
        },
        {
          t: 4,
          players: { a: { x: 35, y: 19 }, x1: { x: 41, y: 19 } },
          puck: { x: 35, y: 19 },
          narration: 'He recovers on your hands and starts hacking at your stick.',
        },
        {
          t: 8,
          players: { a: { x: 38, y: 15 }, x1: { x: 44, y: 15 } },
          puck: { x: 38, y: 15 },
          narration: 'The checks keep coming as you push toward the goal line.',
        },
        {
          t: 11.5,
          players: { a: { x: 40, y: 12 }, x1: { x: 46, y: 13 } },
          puck: { x: 40, y: 12 },
          narration: 'You are a step from GLE with his stick raining on yours...',
        },
        { t: 13 },
      ],
      freezeLine: "He's checking your stick to GLE. How do you keep it?",
      narration:
        'You turn the corner on the left wing and head downhill toward GLE. He recovers on your hands and starts hacking at your stick. The checks keep coming as you push to the goal line. You are a step away, his stick raining down on yours the whole way.',
    },
  },
  {
    id: 'lax-initiate-vs-slide-feed',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'feed',
    difficulty: 'varsity',
    title: 'Draw Two, Feed One',
    setup: 'You beat your man to GLE; the crease defender steps up to stop you.',
    kind: 'mcq',
    options: [
      {
        text: 'Shoot near pipe over the slide',
        correct: false,
        feedback: 'You shoot into a set defender and goalie. Low-percentage, contested.',
        trap: 'The shot feels earned after the dodge, but the slide took it away.',
      },
      {
        text: 'Reset it back to X',
        correct: false,
        feedback: 'You had two defenders on you and an open man. Resetting wastes it.',
        trap: 'Keeping possession feels safe, but you just erased a two-on-one.',
      },
      {
        text: 'Feed the open man on the backside pipe',
        correct: true,
        feedback: 'The slide left his man. You draw two and hit the one they abandoned.',
      },
      {
        text: 'Bull into the help for a foul',
        correct: false,
        feedback: 'You lower your shoulder into a set defender and get called for it.',
        trap: 'Contact feels tough, but you turn a scoring chance into your foul.',
      },
    ],
    coachCue: 'Draw two, feed one.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 38, y: 13, label: 'A' },
        { id: 'x1', team: 'away', x: 43, y: 11, label: 'D' },
        { id: 'x2', team: 'away', x: 50, y: 13, label: 'D' },
        { id: 'a2', team: 'home', x: 64, y: 13, label: 'A' },
      ],
      puck: { x: 38, y: 13 },
      arrows: [{ fromX: 38, fromY: 13, toX: 62, toY: 13, dashed: true }],
      highlights: [{ x: 64, y: 13, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 28, y: 24 },
            x1: { x: 34, y: 22 },
            x2: { x: 52, y: 10 },
            a2: { x: 64, y: 13 },
          },
          puck: { x: 28, y: 24 },
          narration: 'You dodge downhill from the left wing with a step on your man.',
        },
        {
          t: 4,
          players: { a: { x: 33, y: 18 }, x1: { x: 39, y: 16 } },
          puck: { x: 33, y: 18 },
          narration: 'You get a full step and turn the corner toward GLE.',
        },
        {
          t: 8,
          players: { a: { x: 38, y: 13 }, x1: { x: 43, y: 11 }, x2: { x: 50, y: 13 } },
          puck: { x: 38, y: 13 },
          narration: 'The crease defender jumps off his man and steps up to stop you.',
        },
        {
          t: 11.5,
          players: {
            a: { x: 38, y: 13 },
            x1: { x: 43, y: 11 },
            x2: { x: 50, y: 13 },
            a2: { x: 64, y: 13 },
          },
          puck: { x: 38, y: 13 },
          narration: 'Now two defenders are on you and your man is alone backside...',
        },
        { t: 13 },
      ],
      freezeLine: "You drew the slide at GLE. What's the play?",
      narration:
        'You dodge downhill from the left wing with a step on your man. You turn the corner toward GLE. The crease defender jumps off his man to stop you. Now two are on the ball and your teammate stands alone on the backside pipe, waiting.',
    },
  },
  {
    id: 'lax-dodge-change-of-pace',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'varsity',
    title: 'Change of Pace',
    setup: 'Isolated up top, he matches you stride for stride.',
    kind: 'mcq',
    options: [
      {
        text: 'Try to outrun him at one speed',
        correct: false,
        feedback: 'Same speed the whole way lets him ride you out. No separation.',
        trap: 'More speed feels obvious, but a good defender just matches it.',
      },
      {
        text: 'Hesitate to freeze his feet, then explode by',
        correct: true,
        feedback: 'The change of pace freezes him for a beat, and the beat is your window.',
      },
      {
        text: 'Force a low-angle shot from up top',
        correct: false,
        feedback: 'A shot from the top with him draped on you has almost no chance.',
        trap: 'You feel you must do something, but forcing it just ends the possession.',
      },
      {
        text: 'Bail out backwards and reset',
        correct: false,
        feedback: 'Retreating against a good matchup hands the advantage right back.',
        trap: 'Resetting feels safe versus a tough cover, but you never made him move.',
      },
    ],
    coachCue: 'Change pace to freeze his feet.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 50, y: 20, label: 'A' },
        { id: 'x1', team: 'away', x: 50, y: 15, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 50, y: 20 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: { a: { x: 50, y: 34 }, x1: { x: 50, y: 28 }, g: { x: 50, y: 7 } },
          puck: { x: 50, y: 34 },
          narration: 'You catch it up top, isolated, one on one against a good pole.',
        },
        {
          t: 4,
          players: { a: { x: 48, y: 26 }, x1: { x: 48, y: 21 } },
          puck: { x: 48, y: 26 },
          narration: 'You drive left and he slides his feet, matching you step for step.',
        },
        {
          t: 8,
          players: { a: { x: 52, y: 23 }, x1: { x: 52, y: 18 } },
          puck: { x: 52, y: 23 },
          narration: 'Back the other way, still no separation, he is right there.',
        },
        {
          t: 11.5,
          players: { a: { x: 50, y: 20 }, x1: { x: 50, y: 15 } },
          puck: { x: 50, y: 20 },
          narration: 'He is squared and comfortable, riding your every move...',
        },
        { t: 13 },
      ],
      freezeLine: "He's matching you stride for stride. How do you beat him?",
      narration:
        'You catch it up top, isolated one on one against a good pole. You drive left and he slides his feet, matching you step for step. Back the other way, still no separation. He is squared up and comfortable, riding every move you make.',
    },
  },
  {
    id: 'lax-dodge-reset-vs-recover',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'varsity',
    title: 'When the Dodge Does Not Beat Him',
    setup: 'He slides his feet and recovers to good position in front of you.',
    kind: 'mcq',
    options: [
      {
        text: 'Force the contested shot through him',
        correct: false,
        feedback: 'You shoot through a set defender into the goalie. Easy save or block.',
        trap: 'You started the dodge, so you feel you must finish it. Live to dodge again.',
      },
      {
        text: 'Bull into his chest for a call',
        correct: false,
        feedback: 'You initiate the contact and the whistle goes against you.',
        trap: 'Contact feels tough, but you gift them the ball and a free clear.',
      },
      {
        text: 'Jam a feed through his stick',
        correct: false,
        feedback: 'Forcing it through a defender in the lane gets picked or knocked down.',
        trap: 'Forcing inside feels aggressive, but the lane is covered.',
      },
      {
        text: 'Pull it out, swing it, make them defend again',
        correct: true,
        feedback: 'A covered dodge is not a shot. Reset and dodge from a new angle.',
      },
    ],
    coachCue: 'Do not force a covered dodge.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 44, y: 18, label: 'A' },
        { id: 'x1', team: 'away', x: 46, y: 14, label: 'D' },
        { id: 'a2', team: 'home', x: 72, y: 22, label: 'A' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 44, y: 18 },
      arrows: [{ fromX: 44, fromY: 18, toX: 66, toY: 21, dashed: true }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 32, y: 30 },
            x1: { x: 40, y: 27 },
            a2: { x: 72, y: 22 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 32, y: 30 },
          narration: 'You start your dodge from up top, looking to get downhill.',
        },
        {
          t: 4,
          players: { a: { x: 40, y: 22 }, x1: { x: 45, y: 20 } },
          puck: { x: 40, y: 22 },
          narration: 'He slides his feet with you and never lets you turn the corner.',
        },
        {
          t: 8,
          players: { a: { x: 44, y: 19 }, x1: { x: 46, y: 15 } },
          puck: { x: 44, y: 19 },
          narration: 'He beats you to the spot and recovers square, right in front.',
        },
        {
          t: 11.5,
          players: { a: { x: 44, y: 18 }, x1: { x: 46, y: 14 } },
          puck: { x: 44, y: 18 },
          narration: 'The lane is gone and he is set, your teammate spotted up top...',
        },
        { t: 13 },
      ],
      freezeLine: "Your dodge is covered and he's set. Now what?",
      narration:
        'You start your dodge from up top, looking to get downhill. He slides his feet with you and never lets you turn the corner. He beats you to the spot and recovers square. The lane is gone, he is set, and a teammate is spotted up top ready to swing.',
    },
  },
  {
    id: 'lax-dodge-early-slide-skip',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'feed',
    difficulty: 'elite',
    title: 'Punish the Early Slide',
    setup: 'You get a step and the crease defender slides far too early.',
    kind: 'mcq',
    options: [
      {
        text: 'Skip it past the early slide to the far pipe',
        correct: true,
        feedback: 'The early slide abandoned the far man. One skip pass and he is wide open.',
      },
      {
        text: 'Keep dodging hard to the cage',
        correct: false,
        feedback: 'You drive into the slide that already left. Now you are covered again.',
        trap: 'You feel you can still beat him, but the help is already set in your path.',
      },
      {
        text: 'Feed the adjacent crease man',
        correct: false,
        feedback: 'That man still has his defender. The wide-open one is across the field.',
        trap: 'The first inside pass you see feels right, but it is the covered one.',
      },
      {
        text: 'Shoot near now',
        correct: false,
        feedback: 'You settle for a contested angle when a teammate is uncovered far side.',
        trap: 'An angle looks available, but the skip is the far higher-percentage play.',
      },
    ],
    coachCue: 'Punish the early slide - skip it.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 34, y: 16, label: 'A' },
        { id: 'x1', team: 'away', x: 40, y: 15, label: 'D' },
        { id: 'x2', team: 'away', x: 46, y: 14, label: 'D' },
        { id: 'a2', team: 'home', x: 70, y: 15, label: 'A' },
      ],
      puck: { x: 34, y: 16 },
      arrows: [{ fromX: 34, fromY: 16, toX: 68, toY: 15, dashed: true }],
      highlights: [{ x: 70, y: 15, radius: 7 }],
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 26, y: 26 },
            x1: { x: 32, y: 24 },
            x2: { x: 58, y: 13 },
            a2: { x: 70, y: 15 },
          },
          puck: { x: 26, y: 26 },
          narration: 'You attack from the left wing and get a clean step on your man.',
        },
        {
          t: 4,
          players: { a: { x: 30, y: 20 }, x1: { x: 36, y: 18 } },
          puck: { x: 30, y: 20 },
          narration: 'You are turning the corner with a step, downhill to the cage.',
        },
        {
          t: 8,
          players: { a: { x: 34, y: 16 }, x2: { x: 46, y: 14 } },
          puck: { x: 34, y: 16 },
          narration: 'The far crease pole panics and slides across way too soon.',
        },
        {
          t: 11.5,
          players: {
            a: { x: 34, y: 16 },
            x1: { x: 40, y: 15 },
            x2: { x: 46, y: 14 },
            a2: { x: 70, y: 15 },
          },
          puck: { x: 34, y: 16 },
          narration: 'His man is stranded all alone on the far pipe now...',
        },
        { t: 13 },
      ],
      freezeLine: 'The slide came early. Where does the ball go?',
      narration:
        'You attack from the left wing and get a clean step on your man. You turn the corner downhill to the cage. The far crease pole panics and slides across way too soon. His man is now stranded, wide open on the far pipe, with the whole net behind him.',
    },
  },
  {
    id: 'lax-dodge-invert-mismatch',
    sport: 'lacrosse',
    zone: 'dodge',
    category: 'dodge',
    difficulty: 'elite',
    title: 'Hunt the Mismatch',
    setup: 'You inverted from X and drew a short-stick onto you up top.',
    kind: 'mcq',
    options: [
      {
        text: 'Dodge at the close-defense pole',
        correct: false,
        feedback: 'You attack the tougher cover and give back the edge you created.',
        trap: 'Beating the pole feels like the bigger win, but the short-stick is the target.',
      },
      {
        text: 'Attack the short-stick and dodge him in space',
        correct: true,
        feedback: 'You inverted on purpose to get here. Go at the weaker cover with room.',
      },
      {
        text: 'Swing the ball away',
        correct: false,
        feedback: 'You move the ball off the exact mismatch you worked to create.',
        trap: 'Ball movement always feels right, but here it erases your advantage.',
      },
      {
        text: 'Force it inside into the double',
        correct: false,
        feedback: 'You dodge into two defenders and cough it up in traffic.',
        trap: 'Going inside feels aggressive, but the edge is one on one in space.',
      },
    ],
    coachCue: 'Hunt the short-stick matchup.',
    visual: {
      rinkZone: 'offensive',
      youId: 'a',
      players: [
        { id: 'a', team: 'home', x: 58, y: 22, label: 'A' },
        { id: 'x1', team: 'away', x: 58, y: 17, label: 'M' },
        { id: 'x2', team: 'away', x: 40, y: 14, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 58, y: 22 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            a: { x: 50, y: 4 },
            x1: { x: 40, y: 20 },
            x2: { x: 44, y: 8 },
            g: { x: 50, y: 7 },
          },
          puck: { x: 50, y: 4 },
          narration: 'You catch it at X and carry it up the right side, inverting.',
        },
        {
          t: 4,
          players: { a: { x: 56, y: 14 }, x1: { x: 50, y: 18 }, x2: { x: 42, y: 12 } },
          puck: { x: 56, y: 14 },
          narration: 'As you climb, their short-stick has to pick you up top.',
        },
        {
          t: 8,
          players: { a: { x: 58, y: 20 }, x1: { x: 58, y: 16 }, x2: { x: 40, y: 14 } },
          puck: { x: 58, y: 20 },
          narration: 'The mismatch is set, a short pole alone on you in space.',
        },
        {
          t: 11.5,
          players: { a: { x: 58, y: 22 }, x1: { x: 58, y: 17 }, x2: { x: 40, y: 14 } },
          puck: { x: 58, y: 22 },
          narration: 'You have the matchup you wanted with room to work...',
        },
        { t: 13 },
      ],
      freezeLine: "You inverted a short-stick onto you. What's the play?",
      narration:
        'You catch it at X and carry it up the right side, inverting the defense. As you climb, their short-stick has to pick you up top. The mismatch is set, a short pole alone on you with space. You have exactly the matchup you worked to create.',
    },
  },
];
