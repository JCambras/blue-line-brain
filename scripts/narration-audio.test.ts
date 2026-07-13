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
  /** Overridable so a test can simulate the platform refusing a prime/play. */
  shouldFail: () => boolean = () => false;
  play(): Promise<void> {
    this.playCalls++;
    if (this.shouldFail()) return Promise.reject(new Error('NotAllowedError'));
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

function makeHarness(opts: { manifest?: Record<string, string>; refetch?: () => Record<string, string> } = {}) {
  const created: FakeAudio[] = [];
  const timers = new Map<number, () => void>();
  const state = { failPlays: false };
  let nextId = 1;
  let refetchCalls = 0;
  const narration = new NarrationAudio({
    createAudio: () => {
      const a = new FakeAudio();
      a.shouldFail = () => state.failPlays;
      created.push(a);
      return a;
    },
    audioBase: '/audio/',
    fetchManifest: () => Promise.resolve(opts.manifest ?? MANIFEST),
    refetchManifest: () => {
      refetchCalls++;
      return Promise.resolve(opts.refetch ? opts.refetch() : opts.manifest ?? MANIFEST);
    },
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
  return { narration, created, flushFades, state, refetchCount: () => refetchCalls };
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

test('unlock() stops priming once a prime has resolved', async () => {
  const { narration, created } = makeHarness();
  narration.unlock();
  await settle(); // let a prime resolve so `unlocked` latches
  const calls = created.map((a) => a.playCalls);
  narration.unlock();
  assert.deepEqual(
    created.map((a) => a.playCalls),
    calls,
    'no extra play() once the pool is unlocked'
  );
});

test('a rejected in-gesture prime does not latch unlocked; a later gesture retries', async () => {
  const { narration, created, state } = makeHarness();
  state.failPlays = true; // platform refuses the first gesture's prime
  narration.unlock();
  await settle();
  const afterFail = created.map((a) => a.playCalls);
  assert.ok(afterFail.every((n) => n >= 1), 'the rejected prime was still attempted');

  // A later gesture, now that playback is permitted, must prime again rather
  // than staying silent forever (the bug the optimistic latch would have caused).
  state.failPlays = false;
  narration.unlock();
  await settle();
  assert.ok(
    created.some((a, i) => a.playCalls > afterFail[i]),
    're-primes on a later gesture'
  );

  // And real playback works on the now-unlocked pool.
  narration.play('a');
  await settle();
  const el = created.find((a) => a.src.endsWith('a.mp3'));
  assert.ok(el && !el.paused, 'a real clip plays after the retry unlock');
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

test('a clip that 404s from a stale manifest refetches and retries the fresh file', async () => {
  // Startup manifest points at a filename the redeploy has since pruned.
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a-old.mp3' },
    refetch: () => ({ a: 'a-new.mp3' }),
  });
  narration.play('a');
  await settle();
  const first = created.find((x) => x.src.endsWith('a-old.mp3'));
  assert.ok(first, 'the stale clip was attempted');
  // Simulate the pruned file 404ing on load.
  first!.onerror?.();
  await settle();

  assert.equal(refetchCount(), 1, 'the manifest was refetched from the network once');
  const retry = created.find((x) => x.src.endsWith('a-new.mp3'));
  assert.ok(retry, 'the clip retried with the fresh filename');
  assert.ok(!retry!.paused, 'the fresh clip actually plays');
  assert.equal(retry!.volume, 1, 'the fresh clip is audible');
});

test('a 404 with no fresh mapping stays silent and does not retry-loop', async () => {
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' },
    refetch: () => ({ a: 'a.mp3' }), // truly gone; refetch offers nothing new
  });
  const done = narration.playAndWait('a');
  await settle();
  const first = created.find((x) => x.src.endsWith('a.mp3'));
  first!.onerror?.();
  await done; // resolves rather than hanging

  assert.equal(refetchCount(), 1, 'refetched exactly once');
  assert.equal(
    created.filter((x) => x.src.endsWith('a.mp3')).length,
    1,
    'no retry storm: the clip was loaded only once'
  );
});

test('a key missing from a stale manifest refetches and plays the newly added clip', async () => {
  // The cached manifest predates this clip; the network manifest has it.
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' }, // no 'b' yet (stale cache)
    refetch: () => ({ a: 'a.mp3', b: 'b.mp3' }), // deploy added 'b'
  });
  narration.play('b');
  await settle();

  assert.equal(refetchCount(), 1, 'a missing key triggers one network refetch');
  const clip = created.find((x) => x.src.endsWith('b.mp3'));
  assert.ok(clip, 'the newly added clip is played after the refetch');
  assert.ok(!clip!.paused, 'the clip actually plays');
});

test('a key absent even after refetch stays silent without playing anything', async () => {
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' },
    refetch: () => ({ a: 'a.mp3' }), // 'z' really does not exist
  });
  await narration.playAndWait('z'); // resolves rather than hanging
  assert.equal(refetchCount(), 1, 'refetched once to check for the key');
  assert.equal(
    created.some((x) => x.playCalls > 0),
    false,
    'nothing plays for a genuinely unknown key'
  );
});

test('repeated plays of a genuinely absent key refetch only once', async () => {
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' },
    refetch: () => ({ a: 'a.mp3' }), // 'z' does not exist anywhere
  });
  await narration.playAndWait('z');
  await narration.playAndWait('z');
  await narration.playAndWait('z');
  assert.equal(refetchCount(), 1, 'later plays resolve instantly without new fetches');
  assert.equal(
    created.some((x) => x.playCalls > 0),
    false,
    'nothing plays for the absent key'
  );
});

test('a failed refetch does not negative-cache the key; it recovers once online', async () => {
  // browserEnv maps network errors / non-ok responses to an empty manifest.
  let network: Record<string, string> = {}; // offline: the refetch fails
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' }, // stale cache without 'b'
    refetch: () => network,
  });
  await narration.playAndWait('b'); // silent for now, but not blocklisted
  assert.equal(refetchCount(), 1);
  assert.equal(
    created.some((x) => x.playCalls > 0),
    false,
    'the failed refetch stays silent for this attempt'
  );

  network = { a: 'a.mp3', b: 'b.mp3' }; // connectivity returns
  narration.play('b'); // the miss must refetch again, not stay poisoned
  await settle();
  assert.equal(refetchCount(), 2, 'a later play retries the refetch');
  const clip = created.find((x) => x.src.endsWith('b.mp3'));
  assert.ok(clip, 'the clip is recovered once the network is back');
  assert.ok(!clip!.paused, 'the recovered clip plays');
});

test('adopting a new deploy manifest clears the negative key cache', async () => {
  let network: Record<string, string> = { a: 'a.mp3' };
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a.mp3' },
    refetch: () => network,
  });
  await narration.playAndWait('b'); // absent everywhere -> negative-cached
  assert.equal(refetchCount(), 1);
  network = { a: 'a.mp3', b: 'b.mp3' }; // a new deploy adds 'b'
  await narration.playAndWait('c'); // another miss refetches and adopts the new manifest
  assert.equal(refetchCount(), 2);
  narration.play('b'); // no longer blocklisted; served from the adopted manifest
  await settle();
  assert.equal(refetchCount(), 2, 'the adopted manifest answers without another fetch');
  const clip = created.find((x) => x.src.endsWith('b.mp3'));
  assert.ok(clip, 'the newly deployed clip is loaded');
  assert.ok(!clip!.paused, 'the newly deployed clip plays');
});

test('a blocked play() stays silent without a manifest refetch', async () => {
  const { narration, created, state, refetchCount } = makeHarness();
  state.failPlays = true; // autoplay policy rejects (pool never unlocked)
  await narration.playAndWait('a'); // resolves rather than hanging
  const el = created.find((x) => x.src.endsWith('a.mp3'));
  assert.ok(el, 'the clip was attempted');
  assert.equal(refetchCount(), 0, 'no spurious network refetch for an autoplay block');
});

test('a load error after stop() is ignored without a manifest refetch', async () => {
  const { narration, created, refetchCount } = makeHarness({
    manifest: { a: 'a-old.mp3' },
    refetch: () => ({ a: 'a-new.mp3' }),
  });
  narration.play('a');
  await settle();
  const first = created.find((x) => x.src.endsWith('a-old.mp3'))!;
  narration.stop(); // cancels the attempt before the error lands
  first.onerror?.();
  await settle();
  assert.equal(refetchCount(), 0, 'a cancelled attempt never hits the network');
  assert.equal(
    created.some((x) => x.src.endsWith('a-new.mp3')),
    false,
    'no retry after stop()'
  );
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
