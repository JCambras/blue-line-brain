/**
 * Mechanical invariant checks for the scenario bank.
 * Run: node --experimental-strip-types scripts/validate-scenarios.ts
 * (wired into `npm run build` — the bank must be valid to ship)
 */
import { SCENARIOS, DIFFICULTY_CONFIG } from '../src/data/scenarios/index.ts';
import type { Scenario } from '../src/types/index.ts';

const errors: string[] = [];
const err = (id: string, msg: string) => errors.push(`[${id}] ${msg}`);

const inRange = (v: number) => v >= 0 && v <= 100;

function checkVisual(s: Scenario) {
  const ids = new Set<string>();
  for (const p of s.visual.players) {
    if (ids.has(p.id)) err(s.id, `duplicate player id "${p.id}" in visual`);
    ids.add(p.id);
    if (!inRange(p.x) || !inRange(p.y)) err(s.id, `player "${p.id}" out of 0–100 range`);
  }
  if (!inRange(s.visual.puck.x) || !inRange(s.visual.puck.y)) {
    err(s.id, 'puck out of 0–100 range');
  }
  if (!s.visual.youId) {
    err(s.id, 'missing visual.youId (which player are you?)');
  } else {
    const you = s.visual.players.find((p) => p.id === s.visual.youId);
    if (!you) err(s.id, `youId "${s.visual.youId}" matches no player`);
    else if (you.team !== 'home') err(s.id, `youId "${s.visual.youId}" is not a home player`);
  }
}

function checkOptions(s: Scenario) {
  if (s.kind === 'mcq') {
    if (!s.options || s.options.length === 0) return err(s.id, 'mcq without options');
    const expected = DIFFICULTY_CONFIG[s.difficulty].choices;
    if (s.options.length !== expected) {
      err(s.id, `${s.difficulty} needs ${expected} options, has ${s.options.length}`);
    }
    const correct = s.options.filter((o) => o.correct).length;
    if (correct !== 1) err(s.id, `needs exactly 1 correct option, has ${correct}`);
    for (const o of s.options) {
      if (!o.feedback) err(s.id, `option "${o.text}" missing feedback`);
    }
  } else if (s.kind === 'tap') {
    if (!s.tapTargets || s.tapTargets.length === 0) return err(s.id, 'tap without targets');
    const correct = s.tapTargets.filter((t) => t.correct).length;
    if (correct !== 1) err(s.id, `needs exactly 1 correct tap target, has ${correct}`);
    for (const t of s.tapTargets) {
      if (!inRange(t.x) || !inRange(t.y)) err(s.id, 'tap target out of range');
      if (!t.feedback) err(s.id, 'tap target missing feedback');
    }
  }
}

function checkAnimation(s: Scenario) {
  const anim = s.animation;
  if (!anim) return err(s.id, 'missing animation (every scenario should have one)');
  if (!anim.freezeLine) err(s.id, 'missing freezeLine');
  if (anim.beats.length < 3) err(s.id, `only ${anim.beats.length} beats`);

  const playerIds = new Set(s.visual.players.map((p) => p.id));
  let prevT = -1;
  for (const b of anim.beats) {
    if (b.t <= prevT) err(s.id, `beats not strictly increasing at t=${b.t}`);
    prevT = b.t;
    for (const [pid, pos] of Object.entries(b.players ?? {})) {
      if (!playerIds.has(pid)) err(s.id, `beat t=${b.t} moves unknown player "${pid}"`);
      if (!inRange(pos.x) || !inRange(pos.y)) err(s.id, `beat t=${b.t} "${pid}" out of range`);
    }
    if (b.puck && (!inRange(b.puck.x) || !inRange(b.puck.y))) {
      err(s.id, `beat t=${b.t} puck out of range`);
    }
  }

  const first = anim.beats[0];
  if (first.t !== 0) err(s.id, `first beat must be t=0, got t=${first.t}`);

  const dur = anim.beats[anim.beats.length - 1].t;
  if (dur < 10 || dur > 16) err(s.id, `animation is ${dur}s, want 10–16s`);

  // Resolve final positions with carry-forward and compare to the freeze frame.
  const finalPlayers: Record<string, { x: number; y: number }> = {};
  for (const p of s.visual.players) finalPlayers[p.id] = { x: p.x, y: p.y }; // t=0 default
  let finalPuck = { x: s.visual.puck.x, y: s.visual.puck.y };
  let touchedPuck = false;
  const touched = new Set<string>();
  for (const b of anim.beats) {
    for (const [pid, pos] of Object.entries(b.players ?? {})) {
      finalPlayers[pid] = pos;
      touched.add(pid);
    }
    if (b.puck) {
      finalPuck = b.puck;
      touchedPuck = true;
    }
  }
  for (const p of s.visual.players) {
    if (!touched.has(p.id)) continue; // never moved → stays at visual position, fine
    const f = finalPlayers[p.id];
    if (Math.abs(f.x - p.x) > 0.01 || Math.abs(f.y - p.y) > 0.01) {
      err(s.id, `player "${p.id}" ends at (${f.x},${f.y}) but freeze frame is (${p.x},${p.y})`);
    }
  }
  if (touchedPuck) {
    if (
      Math.abs(finalPuck.x - s.visual.puck.x) > 0.01 ||
      Math.abs(finalPuck.y - s.visual.puck.y) > 0.01
    ) {
      err(
        s.id,
        `puck ends at (${finalPuck.x},${finalPuck.y}) but freeze frame is (${s.visual.puck.x},${s.visual.puck.y})`
      );
    }
  }

  const narrated = anim.beats.filter((b) => b.narration).length;
  if (narrated < 3) err(s.id, `only ${narrated} narrated beats — want play-by-play throughout`);
}

// ---- run ----
const seen = new Set<string>();
for (const s of SCENARIOS) {
  if (seen.has(s.id)) err(s.id, 'duplicate scenario id');
  seen.add(s.id);
  if (!s.coachCue) err(s.id, 'missing coachCue');
  if (!s.setup) err(s.id, 'missing setup');
  checkVisual(s);
  checkOptions(s);
  checkAnimation(s);
}

const byDiff: Record<string, number> = {};
for (const s of SCENARIOS) byDiff[s.difficulty] = (byDiff[s.difficulty] ?? 0) + 1;
const byZone: Record<string, number> = {};
for (const s of SCENARIOS) byZone[s.zone] = (byZone[s.zone] ?? 0) + 1;

console.log(
  `${SCENARIOS.length} scenarios | ` +
    Object.entries(byDiff)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ') +
    ' | ' +
    Object.entries(byZone)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
);

if (errors.length > 0) {
  console.error(`\n${errors.length} validation error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('All scenarios valid.');
