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
- Pre-rendered coach voice-over narration (ElevenLabs, build-time only)
- Installable PWA - offline-capable via a Workbox service worker (`vite-plugin-pwa`)

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
    ├── sw.ts                     # hand-written Workbox service worker (offline caching)
    ├── types/
    │   └── index.ts              # Scenario, SaveState, etc.
    ├── data/
    │   ├── scenarios/            # scenario bank (per-zone files + real-game examples) + AUTHORING.md
    │   ├── levels.ts             # Squirts → Pro
    │   └── badges.ts             # jersey patches
    ├── lib/
    │   ├── storage.ts            # localStorage save/load
    │   ├── picker.ts             # scenario selection (pool + unlock gating)
    │   ├── scenarioOrdering.ts   # spaced-repetition bias + strong shuffle
    │   ├── sfx.ts                # Web Audio sound effects
    │   ├── narrationAudio.ts     # plays pre-rendered coach voice-over MP3s
    │   ├── narrationTiming.ts    # pure playback timing constants + fade helper
    │   └── swRangeStrip.ts       # pure Range-strip/206-restore helpers for sw.ts
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
4. **Retention compounds.** A bounded spaced-repetition bias surfaces weak/old/unseen scenarios first, while a strong shuffle keeps similar-mastery scenarios reordering freely from run to run.

## Adding scenarios

Add to the matching zone file in `src/data/scenarios/` and follow
`src/data/scenarios/AUTHORING.md` (animation beats, puck placement, voice).
Real-game examples (moments from the player's own games) go in
`real-examples.ts` instead: one `Scenario` entry with the optional `realGame`
field routes it into the home screen's opt-in Real Examples section - no UI
work needed. `npm run validate` enforces the mechanical rules. Every scenario
needs:

- `id` — unique slug
- `zone` — `defensive | neutral | offensive | skills`
- `category` — used for weakness detection (retrieval, gap, coverage, etc.)
- `difficulty` — `rookie | varsity | elite`
- `kind` — `mcq | tap`
- `options[]` (for mcq) with `feedback` and `trap` (the "I see why you'd pick this" insight)
- `coachCue` — the ONE thing to remember
- `visual` — normalized 0–100 coordinates (full rink, defensive zone is high-y)

## Narration audio

Everything spoken is the one ElevenLabs coach voice - there is no browser
speech. Each scenario renders four kinds of clip: the `animation.narration`
voice-over that plays during the animation phase, the `freezeLine` prompt, each
answer option (both read aloud during the reveal phase), and the results-beat
feedback (`<id>.fb` - the correct answer stated plus its rationale, which
`FeedbackScreen` plays after a rotating generic opener for both right and wrong
answers). The MP3s in `public/audio/` and their `manifest.json` are committed
build artifacts, so the
app and CI never need an API key, and the client only ever loads those static
files (it never calls ElevenLabs). Regenerate clips only after editing narration,
freeze-line, option, or correct-answer feedback text:

```bash
cp .env.example .env   # add your ELEVENLABS_API_KEY
npm run narrate        # renders changed clips to public/audio/
```

Runs are skip-existing (keyed to a content hash of the text and voice), so
unchanged clips are never re-charged. The generator's logic is unit-tested with
the API mocked (`npm test`). See `src/data/scenarios/AUTHORING.md` for writing
guidance.

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

## Install & offline (PWA)

The app is an installable PWA that runs offline after the first load. `npm run
build` bundles the hand-written Workbox service worker (`src/sw.ts`, via
`vite-plugin-pwa` in `injectManifest` mode) into `dist/sw.js` plus a web
manifest. It precaches the app shell and runtime-caches the narration MP3s and
Google Fonts, so any clip you have heard once online replays with no network
(clips cache lazily as they play - the ~18 MB set is not force-precached). The
SW strips the `Range` header on clip fetches so they cache as full responses;
without that the Cache API rejects the `206` partial that `<audio>` range
requests produce, which is what previously left the installed app silent
offline. The audio element's range request is still answered with a genuine
`206` carved from the full body - on cache hits and misses alike - since
iOS Safari's media loader requires one. Cached clips never age out (the cache
is bounded by entry count alone), so audio keeps playing at offline rinks all
season. Plugin config lives in `vite.config.ts` (`vite-plugin-pwa`); the
caching routes live in `src/sw.ts`. Updates are hands-off: the service worker
registers with `autoUpdate` and the app silently reloads itself once when a
new deploy takes control, so returning users (including installed iOS
home-screen PWAs) pick up the new version on their next visit with no refresh
prompt. If a cached audio manifest goes stale across a deploy - a clip's
filename was pruned (404) or a newly added clip's key is missing - narration
refetches the manifest from the network and retries once, so a redeploy never
permanently silences a session.
The service worker is disabled in dev, so verify installability/offline against
a production build:

```bash
npm run build && npm run preview
```

Manifest icons in `public/` are committed artifacts rasterized from
`public/favicon.svg`; regenerate them with the one-liner in the header of
`scripts/generate-icons.mjs`.

## What's next

- Coach Mode authoring UI (drag players onto rink, build scenarios in-app)
- Replay the right read after feedback (the frozen rink's ↺ Replay button already re-runs the setup animation + narration; this would animate the correct answer executing)
- More tap-the-ice scenarios (stronger pedagogically than MCQ for spatial reads)
- Team scenario packs (coach authors → JSON export → team imports)
