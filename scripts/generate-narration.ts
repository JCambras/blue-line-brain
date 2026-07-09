/**
 * Build-time narration generator.
 * Run: `npm run narrate` (reads ELEVENLABS_API_KEY from .env).
 *
 * Renders each animated scenario's `animation.narration` to an MP3 in
 * public/audio/ via the ElevenLabs TTS API and writes public/audio/manifest.json
 * (scenario id -> filename). Runs are incremental: a clip whose text and voice
 * settings are unchanged already exists on disk and is skipped, so reruns are
 * cheap. The generated MP3s are committed as build artifacts — the app never
 * needs a key, and a missing clip simply plays silent.
 *
 * The ElevenLabs key and API calls live ONLY here; the client never touches them.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENARIOS } from '../src/data/scenarios/index.ts';
import { type VoiceConfig } from './narration-manifest.ts';
import { generateNarration } from './narration-core.ts';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');

/** Load .env into process.env without overriding already-exported vars. */
function loadDotEnv(): void {
  const file = path.join(ROOT, '.env');
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim() ?? '';
const cfg: VoiceConfig = {
  // "Brian" — a warm, clear, calm American voice that reads like a coach.
  voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() || 'nPczCjzI2devNBz1zQrb',
  modelId: process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_turbo_v2_5',
  // Mono, 22.05 kHz, 32 kbps — plenty for speech and keeps the committed audio small.
  outputFormat: process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || 'mp3_22050_32',
  // Warm, expressive rink-coach delivery: lower stability lets the read breathe
  // and inflect, higher style adds emphasis, high similarity keeps Brian's
  // timbre, speaker boost adds presence. Folded into the content hash, so
  // changing any of these re-renders every clip on the next `npm run narrate`.
  voiceSettings: {
    stability: 0.35,
    similarityBoost: 0.85,
    style: 0.45,
    useSpeakerBoost: true,
  },
};

/** The one place that talks to ElevenLabs. */
async function fetchAudio(text: string, c: VoiceConfig): Promise<Uint8Array> {
  const url =
    `https://api.elevenlabs.io/v1/text-to-speech/${c.voiceId}` +
    `?output_format=${encodeURIComponent(c.outputFormat)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: c.modelId,
      voice_settings: {
        stability: c.voiceSettings.stability,
        similarity_boost: c.voiceSettings.similarityBoost,
        style: c.voiceSettings.style,
        use_speaker_boost: c.voiceSettings.useSpeakerBoost,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ElevenLabs API ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

async function main(): Promise<void> {
  mkdirSync(AUDIO_DIR, { recursive: true });

  const result = await generateNarration(SCENARIOS, cfg, {
    hasKey: apiKey.length > 0,
    exists: (f) => existsSync(path.join(AUDIO_DIR, f)),
    fetchAudio,
    writeAudio: (f, bytes) => writeFileSync(path.join(AUDIO_DIR, f), bytes),
    writeManifest: (m) => writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n'),
    listAudio: () => readdirSync(AUDIO_DIR),
    removeAudio: (f) => rmSync(path.join(AUDIO_DIR, f), { force: true }),
    log: (m) => console.log('  ' + m),
  });

  console.log(
    `\nnarration: ${result.generated.length} generated, ` +
      `${result.skipped.length} already present, ${result.pruned.length} stale removed.`
  );

  if (result.missing.length > 0) {
    console.error(
      `\n${result.missing.length} clip(s) still need rendering but ELEVENLABS_API_KEY is not set.\n` +
        `Copy .env.example to .env and add your key, then rerun \`npm run narrate\`.\n` +
        `The app still builds and runs — those scenarios just play silent.`
    );
    process.exit(1);
  }
  console.log('All narration clips are present. Manifest written to public/audio/manifest.json');
}

main().catch((err) => {
  console.error(`\nnarration generation failed: ${err instanceof Error ? err.message : err}`);
  console.error('Already-rendered clips are kept; rerun to resume (skip-existing).');
  process.exit(1);
});
