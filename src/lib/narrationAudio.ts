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
 * Stale-manifest recovery: across a redeploy the service worker can keep
 * serving a cached manifest that either maps a scenario key to a content-hashed
 * filename since pruned (the clip 404s) or lacks a key added in the new deploy
 * (the clip is absent) - either way the session would go silent. In both cases
 * we refetch the manifest from the network (bypassing the service-worker cache)
 * once and retry with the fresh mapping, so a stale manifest can never
 * permanently silence narration.
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
  /**
   * Refetch the manifest bypassing the service-worker/HTTP cache, for
   * stale-manifest recovery after a redeploy. Distinct from `fetchManifest`
   * (which may be served from cache for the fast startup path).
   */
  refetchManifest: (url: string) => Promise<Manifest>;
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
  /** Coalesces concurrent network refetches during stale-manifest recovery. */
  private manifestRefresh: Promise<Manifest | null> | null = null;
  /**
   * Keys confirmed absent even after a network refetch. Replays of these
   * resolve instantly-silent instead of refetching on every play (the reveal
   * sequence awaits clips serially, so repeated no-store fetches would stall
   * it on a slow network). Cleared whenever a refetch adopts a changed
   * manifest - a new deploy may have added the key.
   */
  private missingKeys = new Set<string>();
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
   * Refetch the manifest from the network (cache-bypassing) and adopt it,
   * recovering from a stale key->filename map after a redeploy. Concurrent
   * calls share one in-flight request. Resolves with the freshly fetched
   * manifest on success, or null when the refetch failed or came back empty -
   * so callers can tell "confirmed absent" from "couldn't check". A failed or
   * empty refetch keeps the current mapping rather than blanking narration.
   */
  private refreshManifest(): Promise<Manifest | null> {
    if (!this.manifestRefresh) {
      this.manifestRefresh = this.env
        .refetchManifest(`${this.env.audioBase}manifest.json`)
        .then((m: Manifest) => {
          if (!m || !Object.keys(m).length) return null;
          const prev = this.manifest;
          const changed =
            !prev ||
            Object.keys(m).length !== Object.keys(prev).length ||
            Object.keys(m).some((k) => prev[k] !== m[k]);
          if (changed) this.missingKeys.clear();
          this.manifest = m;
          return m;
        })
        .catch(() => null)
        .finally(() => {
          this.manifestRefresh = null;
        });
    }
    return this.manifestRefresh;
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
      if (file) return this.playFile(key, file, myToken, true);
      // Key absent from the (possibly stale-cached) manifest: a clip added in a
      // deploy this session's manifest predates. The service worker can keep
      // serving the old manifest via StaleWhileRevalidate for the whole
      // session, so mirror the load-error path and refetch once from the
      // network before giving up — otherwise a newly added clip stays silent.
      // A key already confirmed missing over the network stays silent without
      // another fetch. Only a SUCCESSFUL refetch that still lacks the key
      // confirms absence - a failed/empty refetch (offline, flaky network)
      // stays silent for this attempt but leaves the key retryable.
      if (this.missingKeys.has(key)) return;
      return this.refreshManifest().then((fresh) => {
        const freshFile = fresh?.[key];
        if (!freshFile) {
          if (fresh) this.missingKeys.add(key);
          return;
        }
        if (myToken !== this.token || !this.enabled) return;
        return this.playFile(key, freshFile, myToken, true);
      });
    });
  }

  /**
   * Load `file` onto a pool element and play it, resolving when it ends, is
   * stopped, or fails. When `allowRetry` and the clip fails to load (typically a
   * 404 from a stale manifest after a redeploy), refetch the manifest from the
   * network once and retry with the fresh filename if the key now maps to a
   * different file — otherwise resolve silently.
   */
  private playFile(
    key: string,
    file: string,
    myToken: number,
    allowRetry: boolean
  ): Promise<void> {
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
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        audio.onended = null;
        audio.onerror = null;
        if (this.currentResolve === resolve) this.currentResolve = null;
        resolve();
      };
      // A clip that won't load is usually a stale manifest pointing at a pruned,
      // content-hashed filename. Refetch the manifest (cache-bypassing) once; if
      // the key now maps elsewhere, retry so the session doesn't go silent.
      const onLoadError = () => {
        if (settled) return;
        if (myToken !== this.token || !this.enabled || !allowRetry) {
          finish();
          return;
        }
        settled = true; // this attempt is done; a retry (if any) owns `resolve`
        audio.onended = null;
        audio.onerror = null;
        this.refreshManifest().then((fresh) => {
          const stale = myToken !== this.token || !this.enabled;
          const newFile = fresh?.[key];
          if (!stale && newFile && newFile !== file) {
            this.playFile(key, newFile, myToken, false).then(resolve);
            return;
          }
          if (this.currentResolve === resolve) this.currentResolve = null;
          resolve();
        });
      };
      audio.onended = finish;
      audio.onerror = onLoadError;
      // Autoplay can reject (element never unlocked, or stop() pausing a
      // still-pending play) - that is never a stale manifest, so stay silent
      // without a manifest refetch. Real load failures (e.g. a 404 on a pruned
      // filename) arrive via the onerror event and still recover above.
      const p = audio.play();
      if (p && typeof p.then === 'function') p.catch(() => finish());
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
    // Bypass the service-worker route and the HTTP cache: the `?fresh` query
    // dodges the manifest's StaleWhileRevalidate rule (which matches the bare
    // pathname only), and `cache: 'no-store'` forces a network hit. Used only
    // for stale-manifest recovery, so the extra round-trip is rare.
    refetchManifest: (url) =>
      fetch(`${url}?fresh=1`, { cache: 'no-store' })
        .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : {}))
        .catch(() => ({})),
    setInterval: (fn, ms) => window.setInterval(fn, ms),
    clearInterval: (id) => window.clearInterval(id),
  };
}

export { NarrationAudio };
export const narrationAudio = new NarrationAudio();
