/**
 * Pure helpers shared by the narration generator and its tests: which spoken
 * clips a scenario needs (the animation voice-over, the freeze-line prompt, and
 * each answer option), the content hash that busts the cache when text or voice
 * config changes, and the MP3 filename / manifest shape.
 *
 * No filesystem or network access lives here so it can be unit-tested without
 * a key or a mock server.
 *
 * Manifest keys (kept in sync with the client in `src/lib/narrationAudio.ts`,
 * `src/components/SessionScreen.tsx`, and `src/components/FeedbackScreen.tsx`):
 *   `<id>`          - the animation play-by-play voice-over
 *   `<id>.freeze`   - the freeze-line decision prompt
 *   `<id>.opt.<i>`  - answer option i (0-based), as it is read to the player
 *   `<id>.fb`       - the results-beat feedback: correct answer + its rationale
 *   `fb.correct.<i>` / `fb.wrong.<i>` - generic, scenario-independent openers
 *                     the results beat rotates through before the `.fb` clip
 * The filename is `<key>.<hash>.mp3`, so `<id>`'s file keeps its historical
 * `<id>.<hash>.mp3` name and only the new freeze/option/feedback clips are added.
 */
import { createHash } from 'node:crypto';
import type { Scenario } from '../src/types/index.ts';
import { DIFFICULTY_CONFIG } from '../src/data/scenarios/index.ts';

/** ElevenLabs voice_settings - shape the delivery (expressiveness, warmth, pace). */
export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  /**
   * Playback pace (ElevenLabs `speed`, ~0.7-1.2, 1.0 = natural). Below 1 slows
   * the read for an unhurried coach delivery. Optional so older manifests/tests
   * that omit it hash exactly as before (see `contentHash`).
   */
  speed?: number;
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

/** Join a spoken answer to its rationale with clean sentence punctuation. */
function joinSpoken(head: string, tail: string): string {
  const h = head.trim();
  const t = tail.trim();
  const stopped = /[.!?]$/.test(h) ? h : `${h}.`;
  return t ? `${stopped} ${t}` : stopped;
}

/**
 * The results-beat feedback line for a scenario: the correct answer stated as a
 * verb-first imperative, then its rationale (the correct option's/target's
 * `feedback`). Played after a rotating generic opener (see STATIC_OPENER_CLIPS),
 * for both right and wrong answers. Returns null when there is no correct
 * choice to speak (keeps test scenarios without a keyed answer out of the bank).
 */
export function feedbackSpeech(s: Scenario): string | null {
  if (s.kind === 'mcq') {
    const opt = s.options?.find((o) => o.correct);
    const text = opt?.text?.trim();
    if (!text) return null;
    return joinSpoken(text, opt!.feedback ?? '');
  }
  if (s.kind === 'tap') {
    const target = s.tapTargets?.find((t) => t.correct);
    if (!target) return null;
    // Labels are terse coach phrases ("Off the wall", "Trail the middle",
    // "Goal-side"); spoken verbatim they read naturally after every opener
    // ("...you want to - Trail the middle."). The rationale follows.
    const answer = target.label?.trim() || 'The highlighted spot';
    return joinSpoken(answer, target.feedback ?? '');
  }
  return null;
}

/** Every spoken clip a scenario needs, in play order (voice-over, freeze, opts, feedback). */
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
  const feedback = feedbackSpeech(s);
  if (feedback) clips.push({ key: `${s.id}.fb`, text: feedback });
  return clips;
}

/**
 * Generic, scenario-independent opener clips the results beat rotates through
 * before the per-scenario `.fb` clip, so the coach never sounds monotonous.
 * The correct/wrong openers lead straight into the stated answer (see
 * `feedbackSpeech`) - "That's right! You want to -" flows into "Skate it up the
 * wall...". Kept identical to the keys the client rotates in
 * `src/components/FeedbackScreen.tsx`.
 */
export const STATIC_OPENER_CLIPS: NarrationClip[] = [
  { key: 'fb.correct.0', text: "That's correct, nice job." },
  { key: 'fb.correct.1', text: "That's right! You want to -" },
  { key: 'fb.correct.2', text: 'Correct!' },
  { key: 'fb.wrong.0', text: 'Nope, in this case you want to -' },
  { key: 'fb.wrong.1', text: "That's incorrect, you actually want to -" },
  { key: 'fb.wrong.2', text: 'Not quite -' },
];

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
  const base = `${vs.stability}|${vs.similarityBoost}|${vs.style}|${vs.useSpeakerBoost}`;
  // `speed` is appended only when set, so configs that omit it (older manifests,
  // unit tests) keep their historical hash while a retuned pace re-renders.
  const voice = vs.speed === undefined ? base : `${base}|${vs.speed}`;
  return createHash('sha256')
    .update([cfg.voiceId, cfg.modelId, cfg.outputFormat, voice, text].join('\x00'))
    .digest('hex')
    .slice(0, 8);
}

/** MP3 filename for a clip. Keys are id-derived and path-safe. */
export function audioFileName(key: string, hash: string): string {
  return `${key}.${hash}.mp3`;
}

/**
 * The manifest every clip should map to for the given config. `extraClips`
 * carries the scenario-independent openers (STATIC_OPENER_CLIPS) so the real
 * build includes them; it defaults to none so unit tests stay per-scenario.
 */
export function expectedManifest(
  scenarios: Scenario[],
  cfg: VoiceConfig,
  extraClips: NarrationClip[] = []
): Manifest {
  const manifest: Manifest = {};
  for (const clip of [...extraClips, ...narratedScenarios(scenarios)]) {
    manifest[clip.key] = audioFileName(clip.key, contentHash(clip.text, cfg));
  }
  return manifest;
}
