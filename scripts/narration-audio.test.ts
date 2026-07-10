/**
 * Unit tests for the coach-voice playback engine (src/lib/narrationAudio.ts),
 * driven through its injected `NarrationEnv` with a fake audio element and fake
 * timers - no DOM needed. These lock down the two things that made narration
 * fail in the field:
 *   1. Autoplay unlock: `unlock()` must actually play a clip on each pooled
 *      element (inside a gesture) or iOS/Safari blocks every later clip -> total
 *      silence. A regression here would show no play() on the primed elements.
 *   2. The stop() fade must taper the OUTGOING clip only, never the freshly
 *      started one - the started clip must stay at full volume and keep playing.
 * Run: `npm test`
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NarrationAudio, type AudioLike } from '../src/lib/narrationAudio.ts';

class FakeAudio implements AudioLike {
  volume = 1;
  muted = false;
  preload = '';
  src = '';
  currentTime = 0;
  paused = true;
  ended = false;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  playCalls = 0;
  play(): Promise<void> {
    this.playCalls++;
    this.paused = false;
    this.ended = false;
    return Promise.resolve();
  }
  pause(): void {
    this.paused = true;
  }
}

const MANIFEST: Record<string, string> = {
  a: 'a.mp3',
  b: 'b.mp3',
  c: 'c.mp3',
};

function makeHarness() {
  const created: FakeAudio[] = [];
  const timers = new Map<number, () => void>();
  let nextId = 1;
  const narration = new NarrationAudio({
    createAudio: () => {
      const a = new FakeAudio();
      created.push(a);
      return a;
    },
    audioBase: '/audio/',
    fetchManifest: () => Promise.resolve(MANIFEST),
    setInterval: (fn) => {
      const id = nextId++;
      timers.set(id, fn);
      return id;
    },
    clearInterval: (id) => {
      timers.delete(id);
    },
  });
  // Advance every live fade interval `n` times.
  const flushFades = (n: number) => {
    for (let i = 0; i < n; i++) for (const fn of [...timers.values()]) fn();
  };
  return { narration, created, flushFades };
}

/** Let the (fake) manifest promise + the play chain settle. */
const settle = async () => {
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
};

test('unlock() primes every pooled element inside the gesture (autoplay unlock)', () => {
  const { narration, created } = makeHarness();
  narration.unlock();
  assert.equal(created.length, 2, 'a small pool is created');
  for (const a of created) {
    assert.ok(a.playCalls >= 1, 'each element is played once to unlock it');
    assert.ok(a.src.startsWith('data:audio'), 'primed with the silent clip, not a real one');
  }
});

test('unlock() is idempotent - a second call does not re-prime', () => {
  const { narration, created } = makeHarness();
  narration.unlock();
  const calls = created.map((a) => a.playCalls);
  narration.unlock();
  assert.deepEqual(
    created.map((a) => a.playCalls),
    calls,
    'no extra play() on the second unlock'
  );
});

test('a started clip plays at full volume and is not silenced', async () => {
  const { narration, created } = makeHarness();
  narration.play('a');
  await settle();
  const el = created.find((a) => a.src.endsWith('a.mp3'));
  assert.ok(el, 'the clip was loaded onto a pool element');
  assert.equal(el!.volume, 1, 'audible, not left at zero');
  assert.equal(el!.muted, false);
  assert.ok(!el!.paused, 'actually playing');
  assert.ok(el!.playCalls >= 1);
});

test('cutting a clip fades the outgoing element but never the incoming one', async () => {
  const { narration, created, flushFades } = makeHarness();
  narration.play('a');
  await settle();
  const first = created.find((a) => a.src.endsWith('a.mp3'))!;

  narration.play('b'); // interrupts 'a'
  await settle();
  const second = created.find((a) => a.src.endsWith('b.mp3'))!;

  assert.notEqual(first, second, 'the new clip uses the other pool element');
  assert.equal(second.volume, 1, 'incoming clip starts at full volume');
  assert.ok(!second.paused, 'incoming clip is playing');

  flushFades(1);
  assert.ok(first.volume < 1, 'outgoing clip is fading down');
  assert.equal(second.volume, 1, 'incoming clip is untouched by the fade');

  flushFades(20);
  assert.ok(first.paused, 'outgoing clip is fully stopped after the fade');
  assert.equal(second.volume, 1, 'incoming clip still at full volume');
  assert.ok(!second.paused, 'incoming clip still playing');
});

test('a clip that already ended is released without a fade, next clip is clean', async () => {
  const { narration, created, flushFades } = makeHarness();
  narration.play('a');
  await settle();
  const first = created.find((a) => a.src.endsWith('a.mp3'))!;
  // Simulate natural end of 'a'.
  first.ended = true;
  first.paused = true;
  first.onended?.();

  narration.play('b');
  await settle();
  const second = created.find((a) => a.src.endsWith('b.mp3'))!;
  assert.equal(second.volume, 1);
  assert.ok(!second.paused);
  // No fade timer should have altered the already-ended clip's volume.
  flushFades(5);
  assert.equal(second.volume, 1, 'incoming clip stays audible');
});

test('missing key and disabled sound stay silent without throwing', async () => {
  const { narration, created } = makeHarness();
  narration.enabled = false;
  await narration.playAndWait('a'); // resolves immediately, nothing plays
  assert.equal(
    created.some((a) => a.playCalls > 0),
    false,
    'nothing plays while sound is off'
  );

  narration.enabled = true;
  await narration.playAndWait('does-not-exist');
  assert.equal(
    created.some((a) => a.src.includes('does-not-exist')),
    false,
    'a missing clip loads nothing'
  );
});
