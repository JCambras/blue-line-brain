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
  exactly **4** (matches `DIFFICULTY_CONFIG.choices` - the UI truncates extras).
- Exactly **one** option is `correct: true`.
- Vary which position (A/B/C/D) holds the correct answer across scenarios.
- Every wrong option gets `feedback` (what goes wrong, 1-2 punchy sentences)
  and `trap` (why the option is tempting - the best distractors are mistakes
  real players actually make).
- Options are read aloud by TTS, so keep each under ~12 words.

## Decision (tap)

- 3-4 `tapTargets`, exactly one `correct: true`, radius 7-9, each with a
  short `label` and `feedback`.

## Visual (freeze frame)

2-5 players plus the puck, positioned so the decision is legible at a glance.
Use `arrows` (dashed = pass/intent) and `highlights` sparingly to hint the
tension, not the answer.

## Animation (the 12-14s play sequence)

- `beats[0]` has `t: 0` and sets starting positions for **all** players and
  the puck.
- Middle beats every 3-4 seconds. Skaters move ~2-8 units/second (cinematic,
  not teleporting); a pass can jump 20-40 units between beats.
- The **last positioned beat** (t around 11-12.5) must land **exactly** on the
  `visual` positions - players and puck - so the freeze frame matches.
- After it, add one bare beat `{ t: <prev + 1.5> }` (no positions, no
  narration) so the final line has air before the freeze.
- Every beat except that bare last one carries `narration`: broadcast
  play-by-play, present tense, building tension. The final narrated line ends
  with `...` teeing up the freeze.
- `freezeLine` stops the tape and hands the player the decision:
  "Stop it here. You're the D on the wall. What's your move?"

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
