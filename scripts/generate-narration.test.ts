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
  type VoiceConfig,
} from './narration-manifest.ts';
import { generateNarration, type GenerateDeps } from './narration-core.ts';

const CFG: VoiceConfig = {
  voiceId: 'voice-1',
  modelId: 'model-1',
  outputFormat: 'mp3_22050_32',
};

/** Minimal scenario carrying just what the generator reads. */
function scenario(id: string, narration?: string): Scenario {
  return {
    id,
    animation: narration === undefined ? undefined : { beats: [], freezeLine: 'x', narration },
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

test('narratedScenarios keeps only scenarios with non-empty narration, trimmed', () => {
  const clips = narratedScenarios([
    scenario('a', 'Coach line A.'),
    scenario('b', '   '),
    scenario('c'),
    scenario('d', '  Coach line D.  '),
  ]);
  assert.deepEqual(
    clips,
    [
      { id: 'a', text: 'Coach line A.' },
      { id: 'd', text: 'Coach line D.' },
    ]
  );
});

test('contentHash is stable and changes with text or voice config', () => {
  const h = contentHash('hello', CFG);
  assert.equal(h, contentHash('hello', CFG), 'same inputs -> same hash');
  assert.match(h, /^[0-9a-f]{8}$/, '8 hex chars');
  assert.notEqual(h, contentHash('hello!', CFG), 'text change -> new hash');
  assert.notEqual(h, contentHash('hello', { ...CFG, voiceId: 'other' }), 'voice change -> new hash');
  assert.notEqual(h, contentHash('hello', { ...CFG, outputFormat: 'mp3_44100_128' }), 'format change');
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
