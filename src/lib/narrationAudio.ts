/**
 * Plays pre-rendered narration MP3s (built by scripts/generate-narration.ts)
 * for a scenario's animation phase. Loads only static files from public/audio/
 * via a manifest — it NEVER calls the ElevenLabs API. Missing manifest or clip
 * = silent, no error. Respects the sound toggle through `enabled`.
 */
type Manifest = Record<string, string>;

const AUDIO_BASE = `${import.meta.env.BASE_URL}audio/`;

class NarrationAudio {
  enabled = true;
  private manifest: Manifest | null = null;
  private manifestLoad: Promise<Manifest> | null = null;
  private current: HTMLAudioElement | null = null;
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
   * Start the clip for a scenario from the top. Stops any current clip first,
   * so replay/scrub/scenario-change never leave overlapping audio. No-op when
   * muted or when the scenario has no clip.
   */
  play(scenarioId: string): void {
    this.stop();
    if (!this.enabled) return;
    const myToken = this.token;
    void this.loadManifest().then((manifest) => {
      // A stop()/play() landed while the manifest was loading — abandon this one.
      if (myToken !== this.token || !this.enabled) return;
      const file = manifest[scenarioId];
      if (!file) return;
      const audio = new Audio(`${AUDIO_BASE}${file}`);
      audio.preload = 'auto';
      this.current = audio;
      // Autoplay can reject (no user gesture / policy) — stay silent, don't throw.
      void audio.play().catch(() => {});
    });
  }

  /** Stop and release the current clip. Pending play()s are cancelled. */
  stop(): void {
    this.token++;
    const audio = this.current;
    this.current = null;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
  }
}

export const narrationAudio = new NarrationAudio();
