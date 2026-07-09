/**
 * Orchestration for narration generation, with every side effect injected so
 * it can be unit-tested without a key, network, or disk. The thin CLI in
 * `generate-narration.ts` wires the real ElevenLabs fetch and `node:fs`.
 */
import type { Scenario } from '../src/types/index.ts';
import {
  type Manifest,
  type NarrationClip,
  type VoiceConfig,
  audioFileName,
  contentHash,
  expectedManifest,
  narratedScenarios,
} from './narration-manifest.ts';

export interface GenerateDeps {
  /** True if the MP3 already exists on disk (drives skip-existing). */
  exists: (filename: string) => boolean;
  /** Render narration text to MP3 bytes. The only network/key boundary. */
  fetchAudio: (text: string, cfg: VoiceConfig) => Promise<Uint8Array>;
  /** Persist rendered MP3 bytes under the audio dir. */
  writeAudio: (filename: string, bytes: Uint8Array) => void;
  /** Persist the id -> filename manifest. */
  writeManifest: (manifest: Manifest) => void;
  /** Delete a stray MP3 no longer referenced by the manifest. */
  removeAudio?: (filename: string) => void;
  /** Existing MP3 filenames in the audio dir, for stale pruning. */
  listAudio?: () => string[];
  log?: (msg: string) => void;
  /** Present only when a key is configured; absence means "cannot generate". */
  hasKey: boolean;
}

export interface GenerateResult {
  generated: string[];
  skipped: string[];
  pruned: string[];
  /** Filenames that were needed but could not be made (no key). */
  missing: string[];
  manifest: Manifest;
}

/**
 * Generate any missing narration MP3s, skipping ones already on disk, and
 * (re)write the manifest. Stops at the first render error so a systemic
 * failure (e.g. a bad key) does not burn credits across every clip; a rerun
 * resumes via skip-existing. Without a key it renders nothing but still
 * refreshes the manifest for whatever clips already exist.
 */
export async function generateNarration(
  scenarios: Scenario[],
  cfg: VoiceConfig,
  deps: GenerateDeps,
  extraClips: NarrationClip[] = []
): Promise<GenerateResult> {
  const log = deps.log ?? (() => {});
  const clips = [...extraClips, ...narratedScenarios(scenarios)];
  const generated: string[] = [];
  const skipped: string[] = [];
  const missing: string[] = [];
  const manifest: Manifest = {};

  for (const clip of clips) {
    const filename = audioFileName(clip.key, contentHash(clip.text, cfg));
    if (deps.exists(filename)) {
      skipped.push(filename);
      manifest[clip.key] = filename;
      continue;
    }
    if (!deps.hasKey) {
      missing.push(filename);
      continue; // leave it out of the manifest -> silent for this clip
    }
    log(`generating ${filename}  ("${clip.text.slice(0, 48)}...")`);
    const bytes = await deps.fetchAudio(clip.text, cfg);
    deps.writeAudio(filename, bytes);
    generated.push(filename);
    manifest[clip.key] = filename;
  }

  // Prune stale MP3s (superseded by an edit) that the manifest no longer names.
  // Skip pruning when the manifest is incomplete (no key, or any clip missing)
  // so an incomplete run never deletes a still-needed committed artifact.
  const pruned: string[] = [];
  if (deps.hasKey && missing.length === 0 && deps.listAudio && deps.removeAudio) {
    const keep = new Set(Object.values(manifest));
    for (const file of deps.listAudio()) {
      if (file.endsWith('.mp3') && !keep.has(file)) {
        deps.removeAudio(file);
        pruned.push(file);
      }
    }
  }

  deps.writeManifest(manifest);
  return { generated, skipped, pruned, missing, manifest };
}

export { expectedManifest };
