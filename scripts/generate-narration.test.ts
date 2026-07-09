/**
 * Unit tests for the narration generator's logic. The ElevenLabs API layer is
 * injected as a mock, so these never hit the network and never need a key.
 * Run: `npm test`  (node --experimental-strip-types --test)
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Scenario } from '../src/types/index.ts';
import {
  audioFileName,
  contentHash,
  expectedManifest,
  narratedScenarios,
  optionSpeech,
  scenarioClips,
  type VoiceConfig,
} from './narration-manifest.ts';
import { generateNarration, type GenerateDeps } from './narration-core.ts';

const CFG: VoiceConfig = {
  voiceId: 'voice-1',
  modelId: 'model-1',
  outputFormat: 'mp3_22050_32',
  voiceSettings: { stability: 0.35, similarityBoost: 0.85, style: 0.45, useSpeakerBoost: true },
};

/**
 * Minimal scenario carrying just what the generator reads. `narration`
 * undefined -> no animation at all; options are attached only when given.
 */
function scenario(
  id: string,
  narration?: string,
  opts?: { freezeLine?: string; options?: string[]; difficulty?: string; kind?: string }
): Scenario {
  const options = opts?.options?.map((text) => ({ text, correct: false }));
  return {
    id,
    kind: opts?.kind ?? (options ? 'mcq' : 'tap'),
    difficulty: opts?.difficulty ?? 'elite',
    options,
    animation:
      narration === undefined && opts?.freezeLine === undefined
        ? undefined
        : { beats: [], freezeLine: opts?.freezeLine ?? '', narration: narration ?? '' },
  } as unknown as Scenario;
}

/** A deps harness backed by an in-memory audio dir; records API calls. */
function harness(opts: { present?: string[]; hasKey?: boolean } = {}) {
  const files = new Set<string>(opts.present ?? []);
  const calls: string[] = [];
  let manifest: Record<string, string> = {};
  const deps: GenerateDeps = {
    hasKey: opts.hasKey ?? true,
    exists: (f) => files.has(f),
    fetchAudio: async (text) => {
      calls.push(text);
      return new TextEncoder().encode(`audio:${text}`);
    },
    writeAudio: (f) => files.add(f),
    writeManifest: (m) => {
      manifest = m;
    },
    listAudio: () => [...files],
    removeAudio: (f) => files.delete(f),
    log: () => {},
  };
  return { deps, files, calls, manifest: () => manifest };
}

test('narratedScenarios keeps only clips with non-empty text, trimmed', () => {
  const clips = narratedScenarios([
    scenario('a', 'Coach line A.'),
    scenario('b', '   '),
    scenario('c'),
    scenario('d', '  Coach line D.  '),
  ]);
  assert.deepEqual(
    clips,
    [
      { key: 'a', text: 'Coach line A.' },
      { key: 'd', text: 'Coach line D.' },
    ]
  );
});

test('scenarioClips covers voice-over, freeze line, and each read option', () => {
  const s = scenario('sc', 'Play by play.', {
    freezeLine: 'Stop it here.',
    options: ['Hold the line', 'Crash down', 'Reverse it', 'Wheel out'],
    difficulty: 'elite', // 4 choices
    kind: 'mcq',
  });
  assert.deepEqual(scenarioClips(s), [
    { key: 'sc', text: 'Play by play.' },
    { key: 'sc.freeze', text: 'Stop it here.' },
    { key: 'sc.opt.0', text: 'Do you, A: Hold the line' },
    { key: 'sc.opt.1', text: 'B: Crash down' },
    { key: 'sc.opt.2', text: 'C: Reverse it' },
    { key: 'sc.opt.3', text: 'Or, D: Wheel out' },
  ]);
});

test('scenarioClips reads only DIFFICULTY_CONFIG.choices options (rookie = 3)', () => {
  const s = scenario('rk', 'Play.', {
    freezeLine: 'Freeze.',
    options: ['One', 'Two', 'Three', 'Four'],
    difficulty: 'rookie', // 3 choices -> a 4th option is never read
    kind: 'mcq',
  });
  const keys = scenarioClips(s).map((c) => c.key);
  assert.deepEqual(keys, ['rk', 'rk.freeze', 'rk.opt.0', 'rk.opt.1', 'rk.opt.2']);
  // Last read option (index 2 of 3) leads with "Or,".
  assert.equal(optionSpeech(2, 3, 'Three'), 'Or, C: Three');
});

test('audioFileName keys freeze/option clips distinctly from the voice-over', () => {
  assert.equal(audioFileName('back-door', 'abcd1234'), 'back-door.abcd1234.mp3');
  assert.equal(audioFileName('back-door.freeze', 'abcd1234'), 'back-door.freeze.abcd1234.mp3');
  assert.equal(audioFileName('back-door.opt.2', 'abcd1234'), 'back-door.opt.2.abcd1234.mp3');
});

test('contentHash is stable and changes with text or voice config', () => {
  const h = contentHash('hello', CFG);
  assert.equal(h, contentHash('hello', CFG), 'same inputs -> same hash');
  assert.match(h, /^[0-9a-f]{8}$/, '8 hex chars');
  assert.notEqual(h, contentHash('hello!', CFG), 'text change -> new hash');
  assert.notEqual(h, contentHash('hello', { ...CFG, voiceId: 'other' }), 'voice change -> new hash');
  assert.notEqual(h, contentHash('hello', { ...CFG, outputFormat: 'mp3_44100_128' }), 'format change');
  assert.notEqual(
    h,
    contentHash('hello', { ...CFG, voiceSettings: { ...CFG.voiceSettings, style: 0.15 } }),
    'voice settings change -> new hash'
  );
});

test('audioFileName keys the file to scenario id plus hash', () => {
  assert.equal(audioFileName('back-door', 'abcd1234'), 'back-door.abcd1234.mp3');
});

test('generate renders each clip once and maps the manifest to id -> filename', async () => {
  const scenarios = [scenario('a', 'Line A.'), scenario('b', 'Line B.')];
  const { deps, calls, manifest } = harness();
  const res = await generateNarration(scenarios, CFG, deps);

  assert.equal(res.generated.length, 2);
  assert.deepEqual(calls, ['Line A.', 'Line B.'], 'API called once per clip');
  assert.deepEqual(manifest(), expectedManifest(scenarios, CFG));
  assert.equal(manifest().a, audioFileName('a', contentHash('Line A.', CFG)));
});

test('skip-existing: present clips are not re-fetched but stay in the manifest', async () => {
  const scenarios = [scenario('a', 'Line A.'), scenario('b', 'Line B.')];
  const aFile = audioFileName('a', contentHash('Line A.', CFG));
  const { deps, calls, manifest } = harness({ present: [aFile] });
  const res = await generateNarration(scenarios, CFG, deps);

  assert.deepEqual(res.skipped, [aFile], 'a skipped');
  assert.deepEqual(calls, ['Line B.'], 'only b fetched');
  assert.equal(manifest().a, aFile, 'skipped clip still in manifest');
  assert.ok(manifest().b, 'generated clip in manifest');
});

test('changed narration text regenerates (new hash -> new filename), old file pruned', async () => {
  const oldFile = audioFileName('a', contentHash('Old line.', CFG));
  const { deps, calls, manifest, files } = harness({ present: [oldFile] });
  const res = await generateNarration([scenario('a', 'New line.')], CFG, deps);

  const newFile = audioFileName('a', contentHash('New line.', CFG));
  assert.deepEqual(calls, ['New line.'], 'regenerated because hash changed');
  assert.equal(manifest().a, newFile);
  assert.deepEqual(res.pruned, [oldFile], 'stale clip removed');
  assert.ok(!files.has(oldFile) && files.has(newFile));
});

test('no key: nothing rendered, missing reported, manifest holds only existing clips', async () => {
  const scenarios = [scenario('a', 'Line A.'), scenario('b', 'Line B.')];
  const aFile = audioFileName('a', contentHash('Line A.', CFG));
  const { deps, calls, manifest } = harness({ present: [aFile], hasKey: false });
  const res = await generateNarration(scenarios, CFG, deps);

  assert.deepEqual(calls, [], 'no API calls without a key');
  assert.deepEqual(res.generated, []);
  assert.deepEqual(res.missing, [audioFileName('b', contentHash('Line B.', CFG))]);
  assert.equal(manifest().a, aFile, 'existing clip mapped');
  assert.equal(manifest().b, undefined, 'un-rendered clip left out -> silent, not broken');
});

test('no key + edited text: old committed clip is NOT pruned (no data loss)', async () => {
  const oldFile = audioFileName('a', contentHash('Old line.', CFG));
  const { deps, manifest, files } = harness({ present: [oldFile], hasKey: false });
  const res = await generateNarration([scenario('a', 'New line.')], CFG, deps);

  const newFile = audioFileName('a', contentHash('New line.', CFG));
  assert.deepEqual(res.missing, [newFile], 'new clip could not be rendered');
  assert.deepEqual(res.pruned, [], 'nothing pruned while manifest is incomplete');
  assert.ok(files.has(oldFile), 'old committed clip preserved');
  assert.equal(manifest().a, undefined, 'scenario silent this run, but recoverable');
});

test('API error aborts and preserves already-rendered clips (skip-existing on rerun)', async () => {
  const scenarios = [scenario('a', 'Line A.'), scenario('b', 'Line B.'), scenario('c', 'Line C.')];
  const { deps, files } = harness();
  deps.fetchAudio = async (text) => {
    if (text === 'Line B.') throw new Error('ElevenLabs API 401 Unauthorized');
    return new TextEncoder().encode(text);
  };

  await assert.rejects(() => generateNarration(scenarios, CFG, deps), /401/);
  // 'a' was written before 'b' failed; a rerun would skip it and not re-charge.
  assert.ok(files.has(audioFileName('a', contentHash('Line A.', CFG))), 'a persisted');
  assert.ok(!files.has(audioFileName('c', contentHash('Line C.', CFG))), 'c never reached');
});

test('generate is a no-op (no fetch) when every clip already exists', async () => {
  const scenarios = [scenario('a', 'Line A.'), scenario('b', 'Line B.')];
  const present = Object.values(expectedManifest(scenarios, CFG));
  const { deps, calls, manifest } = harness({ present });
  const res = await generateNarration(scenarios, CFG, deps);

  assert.deepEqual(calls, [], 'nothing fetched');
  assert.equal(res.generated.length, 0);
  assert.equal(res.skipped.length, 2);
  assert.deepEqual(manifest(), expectedManifest(scenarios, CFG));
});
