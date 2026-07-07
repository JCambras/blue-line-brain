# Scenario Authoring Guide

Every scenario is one `Scenario` object (see `src/types/index.ts`). Study 2-3
complete examples in `defensive.ts` before writing. Validate with
`npm run validate` - it enforces most rules below mechanically.

## Perspective

The player being trained is a **defenseman on team `home`**, almost always the
player with id `d` (or `d1`). `setup`, options, narration, and `freezeLine` are
written in second person ("You're the weak-side D..."). Team `home` defends the
net at the bottom of the diagram; team `away` are the opponents.

## Coordinate system

0-100 in both axes. `y = 0` is the opponent's end (top), `y = 100` is your own
end (bottom). Your goalie sits near `(50, 92-95)`, the opponent goalie near
`(50, 5-8)`. Zones: defensive `y > 67`, neutral `33-67`, offensive `y < 33`.
`visual.rinkZone` is the zone where the play freezes (it may differ from the
scenario's `zone` tag, e.g. skills scenarios).

## Decision (MCQ)

- `rookie` scenarios have exactly **3** options; `varsity` and `elite` have
  exactly **4** (matches `DIFFICULTY_CONFIG.choices` - the UI always keeps the
  correct option and randomly drops extra wrong ones).
- Exactly **one** option is `correct: true`.
- The UI shuffles option order per question, so the on-screen A/B/C/D slot
  never depends on data order - write options in whatever order reads best.
- Every wrong option gets `feedback` (what goes wrong, 1-2 punchy sentences)
  and `trap` (why the option is tempting - the best distractors are mistakes
  real players actually make).
- The correct option's `feedback` is the rationale spoken on the results beat
  (after the stated answer), so give it a clear one-line "why".
- Options are read aloud by TTS, so keep each under ~12 words.
- **Safe-play rule (hockey):** the taught/correct play must **never** be a pass
  across the middle of the ice in your own end - cross-ice through the slot,
  through the middle of the defensive zone, or across the front of your own net.
  Coach the safer out instead (up the boards, off the glass, reverse behind the
  net, D-to-D when safe, chip it deep, perimeter rim to the weak side). A
  cross-middle pass is fine and encouraged as a **wrong** distractor. Offensive-
  zone scoring passes (seam / backdoor one-timers in front of the opponent's
  net) are the exception - those stay. Neutral-zone up-ice passes are also
  fine: a north-south pass up the middle seam in the neutral zone (for example
  a tempo play to beat a trap before it sets) is not an own-end cross-ice pass
  and stays.

## Decision (tap)

- 3-4 `tapTargets`, exactly one `correct: true`, radius 7-9, each with a
  short `label` and `feedback`.

## Visual (freeze frame)

2-5 players plus the puck, positioned so the decision is legible at a glance.
Use `arrows` (dashed = pass/intent) and `highlights` sparingly to hint the
tension, not the answer.

`visual.youId` (required) names the home player the `setup` addresses as
"you" - the rink renders a gold YOU tag on that player throughout the
animation and freeze frame. It must match a `team: 'home'` player id.

## Animation (the 12-14s play sequence)

- `beats[0]` has `t: 0` and sets starting positions for **all** players and
  the puck.
- Middle beats every 3-4 seconds. Skaters move ~2-8 units/second (cinematic,
  not teleporting); a pass can jump 20-40 units between beats.
- The **last positioned beat** (t around 11-12.5) must land **exactly** on the
  `visual` positions - players and puck - so the freeze frame matches.
- After it, add one bare beat `{ t: <prev + 1.5> }` (no positions, no
  narration) so the final line has air before the freeze.
- Every beat carries `narration` - broadcast play-by-play, present tense,
  building tension - except that bare last one and any bare waypoint beats
  (see rims and chips under Puck placement). The final narrated line ends
  with `...` teeing up the freeze.
- `freezeLine` hands the player the decision. Go **straight into the
  situation/question** - no "Stop it here" / "Freeze" / "Hold it" transition
  opener (the whistle and freeze frame already stop the tape):
  "You're the D on the wall. What's your move?"

## Narration (spoken coach voice-over)

`animation.narration` (required) is one short coach voice-over for the whole
play - 2 to 4 sentences, ~15-65 words, spoken over the animation as it runs.
Write it for a 10-14 year old: warm rink-coach voice, second person, present
tense, plain dashes (never em-dashes). Cover the same play the beats do in a
smooth read, and end open so it hands off to `freezeLine` (do not ask the
decision question here - that is `freezeLine`'s job). The beat `narration`
lines are the on-screen captions; this field is the single audio track.

At build time `scripts/generate-narration.ts` (run via `npm run narrate`)
renders every clip a scenario needs to `public/audio/`, all in the same coach
voice: the `animation.narration` voice-over, the `freezeLine` prompt, each
answer option (`SessionScreen` reads these during the reveal phase), and the
results-beat feedback `<id>.fb` - the correct answer stated plus its rationale
(the correct option's/target's `feedback`), which `FeedbackScreen` plays after a
rotating generic opener (`fb.correct.*` / `fb.wrong.*`, from `STATIC_OPENER_CLIPS`)
for both right and wrong answers. Each clip is keyed to the scenario id plus a
content hash - editing the narration, freeze line, an option's text, or the
correct option's `feedback` regenerates just the affected clip(s), and the
committed MP3s mean the app never needs an API key. Missing audio plays silent.
Regenerate after editing: `npm run narrate` (needs `ELEVENLABS_API_KEY` in
`.env`; see `.env.example`).

## Puck placement

- **Carried**: put the puck at the carrier's exact coordinates in every beat
  he has it (the renderer draws it on his stick, at the rim of the disc).
  Never let a carried puck trail its carrier by more than ~2 units.
- **Passes and shots**: the puck stays at the passer through the beat whose
  narration announces the pass, then lands at the receiver (or mid-lane, for
  a freeze mid-flight) at the next beat. One segment, 3.5s or less - a pass
  that drifts across two segments reads as a detached, floating puck.
- **Loose pucks** (dumps, rims, rebounds, 50/50 races) go where the play
  says they are - they do not need a player nearby, but the narration must
  explain why they are loose.
- **Rims and chips "around the boards"** must actually follow the boards:
  keep the puck within ~10 units of the edge and add a waypoint beat (no
  narration needed) at each corner so the straight-line tween never cuts
  across the middle of the zone. When the narration says the puck rims
  "behind the net", route it *behind* the net - between the net and the end
  boards (home `y` ~97.5-98, away `y` ~2.5) - never across the front of the
  crease. Push the waypoints past the goalie toward the end boards so the
  tween never tracks through the net's own depth.
- If the narration names a teammate doing something with the puck ("your
  winger works the wall"), that player must exist in `visual.players` and be
  at the puck.

## Voice

Punchy rink-coach voice. Short sentences. `coachCue` is the one thing to
remember next game, 8 words max. Use plain dashes, never em-dashes, in new
content. Everything is spoken by TTS - write for the ear.

## Difficulty

- `rookie`: one clearly right habit, 25s timer, 3 options.
- `varsity`: requires a read (support? pressure? numbers?), 18s timer.
- `elite`: the right answer hinges on a detail of the freeze frame (partner
  caught up ice, goalie set, shot lane blocked). 11s timer. Wrong options
  should be defensible-sounding.

## Real-game examples

Scenarios with the optional `realGame` field (`RealGameExample` in
`src/types/index.ts`) are real moments from the player's own games. They live
in `real-examples.ts`, not the zone files, and follow every rule above plus an
encouraging, never-shaming tone - the lesson is always "make the smarter play
next time". See the header comment in `real-examples.ts`.
