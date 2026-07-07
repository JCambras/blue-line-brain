/**
 * Web Audio sound effects with no external assets.
 * All synthesized with simple oscillators.
 */
class Sfx {
  private ctx: AudioContext | null = null;
  enabled = true;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.ctx = new Ctor();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  private beep(
    freq: number,
    durMs: number,
    type: OscillatorType = 'sine',
    vol = 0.15
  ): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
    o.start(now);
    o.stop(now + durMs / 1000);
  }

  correct(): void {
    this.beep(660, 90, 'triangle');
    setTimeout(() => this.beep(990, 140, 'triangle'), 70);
  }

  wrong(): void {
    this.beep(180, 220, 'sawtooth', 0.12);
  }

  tick(): void {
    this.beep(1200, 30, 'square', 0.04);
  }

  levelup(): void {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => this.beep(f, 120, 'triangle', 0.18), i * 90)
    );
  }

  badge(): void {
    this.beep(800, 90, 'square');
    setTimeout(() => this.beep(1200, 180, 'square'), 90);
  }

  /** Referee pea-whistle: high square tone with a fast trill. */
  whistle(): void {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    o.type = 'square';
    o.frequency.value = 2350;
    lfo.type = 'sine';
    lfo.frequency.value = 28; // the pea rattle
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    o.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    const dur = 0.45;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    g.gain.setValueAtTime(0.05, now + dur - 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.start(now);
    lfo.start(now);
    o.stop(now + dur);
    lfo.stop(now + dur);
  }
}

export const sfx = new Sfx();
