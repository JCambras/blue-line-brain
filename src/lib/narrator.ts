/**
 * Voice narration via the Web Speech API. No external assets.
 * Falls back to silent no-ops when speechSynthesis is unavailable,
 * so all `speak` calls resolve immediately in that case.
 */
class Narrator {
  enabled = true;
  private voice: SpeechSynthesisVoice | null = null;

  private get synth(): SpeechSynthesis | null {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;
  }

  private pickVoice(): void {
    const synth = this.synth;
    if (!synth) return;
    const voices = synth.getVoices();
    if (voices.length === 0) return;
    // Prefer natural-sounding English voices where available.
    const preferred = ['Samantha', 'Google US English', 'Alex', 'Daniel', 'Microsoft'];
    this.voice =
      preferred
        .map((name) => voices.find((v) => v.name.startsWith(name) && v.lang.startsWith('en')))
        .find(Boolean) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      voices[0];
  }

  /** Call once at startup — voices load asynchronously in Chrome. */
  init(): void {
    const synth = this.synth;
    if (!synth) return;
    this.pickVoice();
    if (!this.voice) {
      synth.addEventListener('voiceschanged', () => this.pickVoice(), { once: true });
    }
  }

  /**
   * Speak a line; resolves when finished (or immediately when muted,
   * unavailable, or cancelled).
   */
  speak(text: string, opts: { rate?: number; pitch?: number } = {}): Promise<void> {
    const synth = this.synth;
    if (!this.enabled || !synth) return Promise.resolve();
    if (!this.voice) this.pickVoice();
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) u.voice = this.voice;
      u.rate = opts.rate ?? 1.05;
      u.pitch = opts.pitch ?? 1.0;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synth.speak(u);
    });
  }

  /** Stop all queued and in-flight speech. Pending speak() promises resolve. */
  cancel(): void {
    this.synth?.cancel();
  }
}

export const narrator = new Narrator();
