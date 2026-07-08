# Blue Line Brain

Hockey IQ training for youth defensemen (ages 10–14). Short scenarios, fast decisions, real reps.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- LocalStorage persistence (no backend)

## Project layout

```
hockey-brain/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                  # app entry
    ├── App.tsx                   # top-level state machine
    ├── types/
    │   └── index.ts              # Scenario, SaveState, etc.
    ├── data/
    │   ├── scenarios/            # scenario bank (per-zone files) + AUTHORING.md
    │   ├── levels.ts             # Squirts → Pro
    │   └── badges.ts             # jersey patches
    ├── lib/
    │   ├── storage.ts            # localStorage save/load
    │   ├── picker.ts             # SM-2-lite scenario selection
    │   └── sfx.ts                # Web Audio sound effects
    ├── components/
    │   ├── RinkDiagram.tsx       # SVG rink + players + tap targets
    │   ├── Scoreboard.tsx        # top header
    │   ├── ProgressStrip.tsx     # XP bar
    │   ├── HomeScreen.tsx        # dashboard
    │   ├── SessionScreen.tsx     # active scenario
    │   ├── FeedbackScreen.tsx    # post-answer
    │   ├── ResultsScreen.tsx     # session summary
    │   ├── CoachMode.tsx         # JSON export + spec
    │   └── Onboard.tsx           # first-run modal
    └── styles/
        └── index.css             # Tailwind + custom CSS
```

## Game design principles

1. **Pattern → Decision → Outcome.** Every scenario teaches one thing.
2. **Speed is the skill.** Timer is mandatory at every difficulty level.
3. **Wrong is fine.** Every miss explains the trap and shows the right read.
4. **Retention compounds.** SM-2-lite spaced repetition surfaces weak/old scenarios first.

## Adding scenarios

Add to the matching zone file in `src/data/scenarios/` and follow
`src/data/scenarios/AUTHORING.md` (animation beats, puck placement, voice).
`npm run validate` enforces the mechanical rules. Every scenario needs:

- `id` — unique slug
- `zone` — `defensive | neutral | offensive | skills`
- `category` — used for weakness detection (retrieval, gap, coverage, etc.)
- `difficulty` — `rookie | varsity | elite`
- `kind` — `mcq | tap`
- `options[]` (for mcq) with `feedback` and `trap` (the "I see why you'd pick this" insight)
- `coachCue` — the ONE thing to remember
- `visual` — normalized 0–100 coordinates (full rink, defensive zone is high-y)

## Scoring

- Correct: +10 XP
- Fast (<6s): +5 XP bonus
- Streak of 3: +10 XP bonus
- 10-streak: Head Up Hero badge
- Wrong: streak resets, scenario surfaces again sooner

## Difficulty unlocks

- 80% accuracy on Rookie → unlocks Varsity
- 80% accuracy on Varsity → unlocks Elite

## Persistence

Everything saves to `localStorage` under `blb-save-v1`. Reset from the home screen if you want a clean slate.

## What's next

- Coach Mode authoring UI (drag players onto rink, build scenarios in-app)
- Replay animation after feedback (show the right read execute)
- More tap-the-ice scenarios (stronger pedagogically than MCQ for spatial reads)
- Team scenario packs (coach authors → JSON export → team imports)
