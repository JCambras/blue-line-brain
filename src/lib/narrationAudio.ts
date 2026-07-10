/**
 * Plays pre-rendered narration MP3s (built by scripts/generate-narration.ts):
 * the animation voice-over, the freeze-line prompt, and each answer option.
 * Loads only static files from public/audio/ via a manifest — it NEVER calls
 * the ElevenLabs API. Missing manifest or clip = silent, no error. Respects the
 * sound toggle through `enabled`.
 *
 * Autoplay unlock (iOS/Safari especially): a browser only lets an <audio>
 * element play programmatically once that element has played inside a real user
 * gesture. Our clips start from timers/effects (the animation voice-over, the
 * reveal sequence) — never synchronously inside a click — so a freshly-created
 * `new Audio()` would be blocked and the whole app would be silent. To avoid
 * that we keep a small POOL of audio elements and prime them once, inside the
 * first user gesture, via `unlock()`. Every clip then reuses a primed element,
 * which the browser allows outside a gesture. The pool is ping-ponged so a clip
 * that is cut can fade out on its own element while the next clip starts cleanly
 * on the other one.
 *
 * The browser bindings (Audio, timers, fetch, base URL) are injected through
 * `NarrationEnv` so the pool/fade/sequencing logic is unit-testable with fakes
 * (see scripts/narration-audio.test.ts); production uses `browserEnv()`.
 *
 * Manifest keys match scripts/narration-manifest.ts:
 *   `<id>` (voice-over), `<id>.freeze` (prompt), `<id>.opt.<i>` (option i),
 *   `<id>.fb` (results-beat feedback), `fb.correct.<i>` / `fb.wrong.<i>`
 *   (generic results openers, rotated by `nextFeedbackOpener`).
 */
// Explicit .ts extension (allowed by allowImportingTsExtensions) so this module
// also resolves under Node's type stripping in scripts/narration-audio.test.ts.
import { CLIP_FADE_MS, CLIP_FADE_STEP_MS, fadeRamp } from './narrationTiming.ts';

type Manifest = Record<string, string>;

/** The minimal audio-element surface the engine drives (a real HTMLAudioElement fits). */
export interface AudioLike {
  volume: number;
  muted: boolean;
  preload: string;
  src: string;
  currentTime: number;
  readonly paused: boolean;
  readonly ended: boolean;
  onended: (() => void) | null;
  onerror: (() => void) | null;
  play: () => Promise<void> | undefined;
  pause: () => void;
}

/** Injected browser bindings, so the engine can be exercised without a DOM. */
export interface NarrationEnv {
  createAudio: () => AudioLike;
  audioBase: string;
  fetchManifest: (url: string) => Promise<Manifest>;
  setInterval: (fn: () => void, ms: number) => number;
  clearInterval: (id: number) => void;
}

/**
 * Two elements: one plays the current clip, the other is free to take the next
 * one while the outgoing clip fades on its own element (a clean crossfade). Two
 * is enough — we never sound more than one clip plus a brief fade at a time.
 */
const POOL_SIZE = 2;

/**
 * ~50ms of PCM silence. Played on each pool element inside the first gesture to
 * satisfy the browser's autoplay policy without any audible blip; the elements
 * are then reused for real clips outside a gesture.
 */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

class NarrationAudio {
  enabled = true;
  private env: NarrationEnv;
  private manifest: Manifest | null = null;
  private manifestLoad: Promise<Manifest> | null = null;
  /** Reusable, pre-unlocked audio elements (see module header). */
  private pool: AudioLike[] = [];
  /** Round-robin cursor so consecutive clips land on alternating elements. */
  private poolIdx = 0;
  /** Per-element fade interval id, so reusing an element cancels its fade. */
  private fades = new Map<AudioLike, number>();
  private unlocked = false;
  private current: AudioLike | null = null;
  /** Resolver for the in-flight playAndWait, called on stop so awaiters unblock. */
  private currentResolve: (() => void) | null = null;
  /** Bumped on every play()/stop() so a slow manifest fetch can't start stale audio. */
  private token = 0;
  /** Rotating results-beat opener index per verdict, so the coach isn't monotonous. */
  private openerIdx: { correct: number; wrong: number } = { correct: 0, wrong: 0 };

  constructor(env: NarrationEnv = browserEnv()) {
    this.env = env;
  }

  /**
   * Manifest key for the next generic results-beat opener, rotating through the
   * three variants for that verdict so repeated plays vary. Persisted on the
   * singleton, so it advances across every FeedbackScreen mount.
   */
  nextFeedbackOpener(correct: boolean): string {
    const kind = correct ? 'correct' : 'wrong';
    const i = this.openerIdx[kind];
    this.openerIdx[kind] = (i + 1) % 3;
    return `fb.${kind}.${i}`;
  }

  /** Warm the manifest once at startup; failures degrade to silent. */
  init(): void {
    void this.loadManifest();
  }

  /**
   * Prime the audio pool for autoplay. MUST be called synchronously inside a
   * real user gesture (pointer/touch/key handler) — playing the silent clip
   * there is what unlocks the elements for later gesture-less playback. Safe to
   * call repeatedly; only the first call does the work.
   */
  unlock(): void {
    if (this.unlocked) return;
    this.ensurePool();
    for (const audio of this.pool) {
      try {
        audio.muted = false;
        audio.volume = 1;
        audio.src = SILENT_WAV;
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            // A prime actually STARTED inside the gesture — the pool is now
            // unlocked for gesture-less playback. Latch here, not optimistically
            // at the top: if every prime is rejected (iOS Low Power Mode, a
            // WebView, or a gesture the platform doesn't treat as activating),
            // `unlocked` stays false so the next gesture primes again.
            this.unlocked = true;
            audio.pause();
            try {
              audio.currentTime = 0;
            } catch {
              // seek before load can throw; harmless, the next src resets it
            }
          }).catch(() => {
            // Prime blocked — leave `unlocked` false so a later gesture retries.
          });
        } else {
          // No promise (older browsers) — nothing to await, treat as unlocked.
          this.unlocked = true;
        }
      } catch {
        // Element unusable (very old browser) — playback just stays silent.
      }
    }
  }

  private ensurePool(): void {
    if (this.pool.length) return;
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = this.env.createAudio();
      audio.preload = 'auto';
      this.pool.push(audio);
    }
  }

  /** Next pool element (round-robin) — always the one the last clip did not use. */
  private acquire(): AudioLike {
    this.ensurePool();
    const audio = this.pool[this.poolIdx % this.pool.length];
    this.poolIdx++;
    return audio;
  }

  private loadManifest(): Promise<Manifest> {
    if (this.manifest) return Promise.resolve(this.manifest);
    if (!this.manifestLoad) {
      this.manifestLoad = this.env
        .fetchManifest(`${this.env.audioBase}manifest.json`)
        .then((m: Manifest) => {
          this.manifest = m ?? {};
          return this.manifest;
        })
        .catch(() => {
          this.manifest = {};
          return this.manifest;
        });
    }
    return this.manifestLoad;
  }

  /**
   * Start the clip for a manifest key from the top, fire-and-forget. Stops any
   * current clip first, so replay/scrub/scenario-change never leave overlapping
   * audio. No-op when muted or when the key has no clip.
   */
  play(key: string): void {
    void this.playAndWait(key);
  }

  /**
   * Play a clip and resolve when it finishes, is stopped, muted, or missing.
   * Lets the reveal sequence read the freeze line and options in order, exactly
   * like the play-by-play voice-over — and unblocks immediately on stop() so a
   * skip/quit/unmount never hangs.
   */
  playAndWait(key: string): Promise<void> {
    this.stop();
    if (!this.enabled) return Promise.resolve();
    const myToken = this.token;
    return this.loadManifest().then((manifest) => {
      // A stop()/play() landed while the manifest was loading — abandon this one.
      if (myToken !== this.token || !this.enabled) return;
      const file = manifest[key];
      if (!file) return;
      return new Promise<void>((resolve) => {
        const audio = this.acquire();
        // Reclaim the element from any prior use: kill a pending fade, drop old
        // handlers, rewind, and restore full volume so the new clip is audible.
        this.cancelFade(audio);
        audio.onended = null;
        audio.onerror = null;
        audio.muted = false;
        audio.volume = 1;
        audio.src = `${this.env.audioBase}${file}`;
        try {
          audio.currentTime = 0;
        } catch {
          // pre-load seek; the fresh src already starts at 0
        }
        this.current = audio;
        this.currentResolve = resolve;
        const finish = () => {
          audio.onended = null;
          audio.onerror = null;
          if (this.currentResolve === resolve) this.currentResolve = null;
          resolve();
        };
        audio.onended = finish;
        audio.onerror = finish;
        // Autoplay can reject (element never unlocked) — stay silent, don't throw.
        const p = audio.play();
        if (p && typeof p.then === 'function') p.catch(() => finish());
      });
    });
  }

  /** Stop and release the current clip. Pending play()s are cancelled. */
  stop(): void {
    this.token++;
    const audio = this.current;
    const resolve = this.currentResolve;
    this.current = null;
    this.currentResolve = null;
    // Fade the outgoing clip out instead of hard-cutting it (a hard pause
    // mid-waveform clicks/garbles at the section boundary). It fades on its own
    // pool element, so the next clip starts cleanly on the other one.
    if (audio) this.fadeOutAndRelease(audio);
    // Unblock any awaiter so its sequence can observe the cancellation and stop.
    if (resolve) resolve();
  }

  /**
   * Park a pool element cleanly. A clip that already finished or was never
   * playing is paused immediately; one cut mid-play is faded to silence over
   * CLIP_FADE_MS so the stop is inaudible, then paused. The element (and its
   * autoplay unlock) is kept for reuse — only its volume/handlers are reset.
   */
  private fadeOutAndRelease(audio: AudioLike): void {
    audio.onended = null;
    audio.onerror = null;
    this.cancelFade(audio);
    if (audio.paused || audio.ended) {
      audio.volume = 1;
      return;
    }
    const ramp = fadeRamp(audio.volume, CLIP_FADE_MS, CLIP_FADE_STEP_MS);
    let i = 0;
    const tick = this.env.setInterval(() => {
      audio.volume = ramp[i];
      i++;
      if (i >= ramp.length) {
        this.cancelFade(audio);
        audio.pause();
        audio.volume = 1; // restore for the next clip on this element
      }
    }, CLIP_FADE_STEP_MS);
    this.fades.set(audio, tick);
  }

  /** Cancel any in-progress fade interval on an element. */
  private cancelFade(audio: AudioLike): void {
    const tick = this.fades.get(audio);
    if (tick !== undefined) {
      this.env.clearInterval(tick);
      this.fades.delete(audio);
    }
  }
}

/**
 * Real browser bindings. Guarded so importing this module under Node (for unit
 * tests) does not touch `import.meta.env`, `Audio`, `window`, or `fetch` — those
 * are only reached in a browser, or when a method actually runs.
 */
function browserEnv(): NarrationEnv {
  const inBrowser = typeof window !== 'undefined';
  return {
    createAudio: () => new Audio() as unknown as AudioLike,
    audioBase: inBrowser ? `${import.meta.env.BASE_URL}audio/` : '/audio/',
    fetchManifest: (url) =>
      fetch(url)
        .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : {}))
        .catch(() => ({})),
    setInterval: (fn, ms) => window.setInterval(fn, ms),
    clearInterval: (id) => window.clearInterval(id),
  };
}

export { NarrationAudio };
export const narrationAudio = new NarrationAudio();
