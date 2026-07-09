/**
 * Plays pre-rendered narration MP3s (built by scripts/generate-narration.ts):
 * the animation voice-over, the freeze-line prompt, and each answer option.
 * Loads only static files from public/audio/ via a manifest — it NEVER calls
 * the ElevenLabs API. Missing manifest or clip = silent, no error. Respects the
 * sound toggle through `enabled`.
 *
 * Manifest keys match scripts/narration-manifest.ts:
 *   `<id>` (voice-over), `<id>.freeze` (prompt), `<id>.opt.<i>` (option i).
 */
type Manifest = Record<string, string>;

const AUDIO_BASE = `${import.meta.env.BASE_URL}audio/`;

class NarrationAudio {
  enabled = true;
  private manifest: Manifest | null = null;
  private manifestLoad: Promise<Manifest> | null = null;
  private current: HTMLAudioElement | null = null;
  /** Resolver for the in-flight playAndWait, called on stop so awaiters unblock. */
  private currentResolve: (() => void) | null = null;
  /** Bumped on every play()/stop() so a slow manifest fetch can't start stale audio. */
  private token = 0;

  /** Warm the manifest once at startup; failures degrade to silent. */
  init(): void {
    void this.loadManifest();
  }

  private loadManifest(): Promise<Manifest> {
    if (this.manifest) return Promise.resolve(this.manifest);
    if (!this.manifestLoad) {
      this.manifestLoad = fetch(`${AUDIO_BASE}manifest.json`)
        .then((r) => (r.ok ? r.json() : {}))
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
        const audio = new Audio(`${AUDIO_BASE}${file}`);
        audio.preload = 'auto';
        this.current = audio;
        this.currentResolve = resolve;
        const finish = () => {
          if (this.currentResolve === resolve) this.currentResolve = null;
          resolve();
        };
        audio.addEventListener('ended', finish, { once: true });
        audio.addEventListener('error', finish, { once: true });
        // Autoplay can reject (no user gesture / policy) — stay silent, don't throw.
        void audio.play().catch(() => finish());
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
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    // Unblock any awaiter so its sequence can observe the cancellation and stop.
    if (resolve) resolve();
  }
}

export const narrationAudio = new NarrationAudio();
