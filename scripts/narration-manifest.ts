/**
 * Pure helpers shared by the narration generator and its tests: which spoken
 * clips a scenario needs (the animation voice-over, the freeze-line prompt, and
 * each answer option), the content hash that busts the cache when text or voice
 * config changes, and the MP3 filename / manifest shape.
 *
 * No filesystem or network access lives here so it can be unit-tested without
 * a key or a mock server.
 *
 * Manifest keys (kept in sync with the client in `src/lib/narrationAudio.ts`
 * and `src/components/SessionScreen.tsx`):
 *   `<id>`          - the animation play-by-play voice-over
 *   `<id>.freeze`   - the freeze-line decision prompt
 *   `<id>.opt.<i>`  - answer option i (0-based), as it is read to the player
 * The filename is `<key>.<hash>.mp3`, so `<id>`'s file keeps its historical
 * `<id>.<hash>.mp3` name and only the new freeze/option clips are added.
 */
import { createHash } from 'node:crypto';
import type { Scenario } from '../src/types/index.ts';
import { DIFFICULTY_CONFIG } from '../src/data/scenarios/index.ts';

/** ElevenLabs voice_settings - shape the delivery (expressiveness, warmth). */
export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

/** The knobs that affect the rendered audio; folded into the content hash. */
export interface VoiceConfig {
  voiceId: string;
  modelId: string;
  outputFormat: string;
  /** Delivery settings - part of the hash so retuning the voice re-renders. */
  voiceSettings: VoiceSettings;
}

export interface NarrationClip {
  /** Manifest key AND filename base (see module header). */
  key: string;
  text: string;
}

/** Scenario id (or `<id>.freeze` / `<id>.opt.<i>`) -> current MP3 filename. */
export type Manifest = Record<string, string>;

/** How many options are actually read for a scenario (matches SessionScreen). */
export function readableOptionCount(s: Scenario): number {
  if (s.kind !== 'mcq' || !s.options?.length) return 0;
  const choices = DIFFICULTY_CONFIG[s.difficulty]?.choices ?? s.options.length;
  return Math.min(choices, s.options.length);
}

/**
 * The exact spoken line for option `i` of `n`, kept identical to how
 * SessionScreen used to read it aloud so the coach voice preserves the cadence.
 * Only used at build time to render the clip text.
 */
export function optionSpeech(i: number, n: number, text: string): string {
  const letter = String.fromCharCode(65 + i);
  const lead = i === 0 ? 'Do you, ' : i === n - 1 ? 'Or, ' : '';
  return `${lead}${letter}: ${text}`;
}

/** Every spoken clip a scenario needs, in play order (voice-over, freeze, opts). */
export function scenarioClips(s: Scenario): NarrationClip[] {
  const clips: NarrationClip[] = [];
  const narration = s.animation?.narration?.trim();
  if (narration) clips.push({ key: s.id, text: narration });
  const freeze = s.animation?.freezeLine?.trim();
  if (freeze) clips.push({ key: `${s.id}.freeze`, text: freeze });
  const n = readableOptionCount(s);
  for (let i = 0; i < n; i++) {
    const text = s.options![i].text.trim();
    if (text) clips.push({ key: `${s.id}.opt.${i}`, text: optionSpeech(i, n, text) });
  }
  return clips;
}

/** All spoken clips across the bank, in bank order. */
export function narratedScenarios(scenarios: Scenario[]): NarrationClip[] {
  return scenarios.flatMap(scenarioClips);
}

/**
 * 8 hex chars over (voice, model, format, text). Any edit to the text or the
 * voice settings yields a new hash -> a new filename -> a regenerated clip,
 * while unchanged clips keep their name and are skipped on the next run.
 */
export function contentHash(text: string, cfg: VoiceConfig): string {
  // Fields are joined with a NUL byte (not a space) so the hash is unambiguous
  // and matches every already-committed clip filename. Do NOT change this
  // separator - it would invalidate the whole cache and force a full re-render.
  const vs = cfg.voiceSettings;
  const voice = `${vs.stability}|${vs.similarityBoost}|${vs.style}|${vs.useSpeakerBoost}`;
  return createHash('sha256')
    .update([cfg.voiceId, cfg.modelId, cfg.outputFormat, voice, text].join('\x00'))
    .digest('hex')
    .slice(0, 8);
}

/** MP3 filename for a clip. Keys are id-derived and path-safe. */
export function audioFileName(key: string, hash: string): string {
  return `${key}.${hash}.mp3`;
}

/** The manifest every clip should map to for the given config. */
export function expectedManifest(
  scenarios: Scenario[],
  cfg: VoiceConfig
): Manifest {
  const manifest: Manifest = {};
  for (const clip of narratedScenarios(scenarios)) {
    manifest[clip.key] = audioFileName(clip.key, contentHash(clip.text, cfg));
  }
  return manifest;
}
