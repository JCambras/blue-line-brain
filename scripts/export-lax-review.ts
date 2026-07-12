/**
 * Coach red-pen review sheet for the lacrosse slate. Writes LAX_REVIEW.md at the
 * repo root: every lacrosse scenario (title, setup, options marked check/cross
 * with rationale + trap, and the coach cue) grouped by track and difficulty.
 *
 * Run: node --experimental-strip-types scripts/export-lax-review.ts
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SCENARIOS } from '../src/data/scenarios/index.ts';
import type { Scenario } from '../src/types/index.ts';

const TRACKS: { zone: string; heading: string }[] = [
  { zone: 'dodge', heading: 'Dodging & Initiating' },
  { zone: 'offball', heading: 'Off-Ball' },
  { zone: 'finish', heading: 'Finishing' },
  { zone: 'ride', heading: 'The Ride' },
];

const DIFFS: { key: string; label: string }[] = [
  { key: 'rookie', label: 'Rookie' },
  { key: 'varsity', label: 'Varsity' },
  { key: 'elite', label: 'Elite' },
];

function renderScenario(s: Scenario): string {
  const lines: string[] = [];
  lines.push(`#### ${s.title}  \`${s.id}\``);
  lines.push('');
  lines.push(`*${s.difficulty} · ${s.kind} · category: ${s.category}*`);
  lines.push('');
  lines.push(`**Setup:** ${s.setup}`);
  lines.push('');

  if (s.kind === 'mcq' && s.options) {
    for (const o of s.options) {
      const mark = o.correct ? '✓' : '✗';
      lines.push(`- ${mark} **${o.text}**`);
      lines.push(`    - ${o.correct ? 'Rationale' : 'Why it fails'}: ${o.feedback}`);
      if (!o.correct && o.trap) lines.push(`    - Trap: ${o.trap}`);
    }
  } else if (s.kind === 'tap' && s.tapTargets) {
    for (const t of s.tapTargets) {
      const mark = t.correct ? '✓' : '✗';
      lines.push(`- ${mark} **${t.label ?? `(${t.x}, ${t.y})`}**`);
      lines.push(`    - ${t.feedback}`);
    }
  }
  lines.push('');
  lines.push(`**Coach cue:** ${s.coachCue}`);
  lines.push('');
  return lines.join('\n');
}

const lax = SCENARIOS.filter((s) => s.sport === 'lacrosse');
const out: string[] = [];
out.push('# Lacrosse Attack — Coach Review Sheet');
out.push('');
out.push(
  `Generated from the scenario bank by \`scripts/export-lax-review.ts\`. ` +
    `${lax.length} lacrosse scenarios across ${TRACKS.length} tracks. Do not edit by hand.`
);
out.push('');

for (const track of TRACKS) {
  const inTrack = lax.filter((s) => s.zone === track.zone);
  out.push(`## ${track.heading}  _(${inTrack.length})_`);
  out.push('');
  for (const diff of DIFFS) {
    const group = inTrack.filter((s) => s.difficulty === diff.key);
    if (group.length === 0) continue;
    out.push(`### ${diff.label}`);
    out.push('');
    for (const s of group) out.push(renderScenario(s));
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, '..', 'LAX_REVIEW.md');
writeFileSync(target, out.join('\n'));
console.log(`Wrote ${target} (${lax.length} scenarios).`);
