/**
 * Pure timing constants + helpers for coach-voice playback. Kept free of any
 * browser API (no `Audio`, no `import.meta`) so both `narrationAudio.ts` and the
 * unit tests can import it.
 */

/**
 * Silence beat inserted after the freeze-line prompt and before the coach reads
 * option "A", so the jump from the question into the options is not rushed.
 */
export const OPTION_LEAD_IN_MS = 500;

/**
 * When a clip is cut while still playing (phase change, skip, replay, quit), a
 * hard `pause()` at a non-zero waveform sample clicks/garbles. Ramp the volume
 * to zero over this window first so the stop is inaudible. Clips that finish or
 * are already paused are released with no fade.
 */
export const CLIP_FADE_MS = 60;
/** Volume-ramp tick during the fade. */
export const CLIP_FADE_STEP_MS = 15;

/**
 * Linear volume ramp from `startVol` down to exactly 0 over `fadeMs`, sampled
 * every `stepMs`. Returns the successive volumes to apply (the last is always
 * 0). Always at least one step so the release is guaranteed silent.
 */
export function fadeRamp(startVol: number, fadeMs: number, stepMs: number): number[] {
  const steps = Math.max(1, Math.round(fadeMs / stepMs));
  const out: number[] = [];
  for (let i = 1; i <= steps; i++) {
    out.push(Math.max(0, startVol * (1 - i / steps)));
  }
  return out;
}
