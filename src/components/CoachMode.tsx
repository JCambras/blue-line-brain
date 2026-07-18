import { useState } from 'react';
import type { Sport } from '@/types';
import { SCENARIOS } from '@/data/scenarios';
import { sportOf } from '@/data/modules';

interface CoachModeProps {
  /** Active sport, so the schema doc names the right surface and tracks. */
  sport: Sport;
  onClose: () => void;
}

/**
 * Per-sport wording for the data-model doc. The schema is shared, but its
 * surface ("rink" vs "field"), zone enum and category examples differ by sport
 * so a lacrosse coach never reads hockey terms.
 */
const COACH_COPY: Record<Sport, { surface: string; zones: string; categories: string; coords: string }> = {
  hockey: {
    surface: 'rink',
    zones: 'defensive | neutral | offensive | skills',
    categories: 'retrieval, gap, coverage',
    coords: 'full rink, defensive zone is high-y',
  },
  lacrosse: {
    surface: 'field',
    zones: 'dodge | offball | finish | ride',
    categories: 'dodge, feed, shot, ride',
    coords: 'full field, defensive end is high-y',
  },
};

export function CoachMode({ sport, onClose }: CoachModeProps) {
  const [exported, setExported] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copy = COACH_COPY[sport];

  const exportJSON = () => {
    const scenarios = SCENARIOS.filter((s) => sportOf(s) === sport);
    setExported(JSON.stringify(scenarios, null, 2));
  };
  const copyJSON = () => {
    if (!exported) return;
    navigator.clipboard?.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="blb-coach">
      <button className="blb-back" onClick={onClose}>
        ← Back
      </button>
      <h1 className="blb-coach-h">COACH MODE</h1>
      <p className="blb-coach-p">
        Custom scenario authoring is the highest-leverage feature for getting
        team-specific reps in. This v1 ships with a JSON export so you can hand
        the data model to a developer or use it as a starting template. Full
        in-app authoring (drag players onto the {copy.surface}, write options,
        set the correct answer, validate) is the next milestone.
      </p>
      <div className="blb-coach-actions">
        <button
          className="blb-cta-primary blb-coach-btn"
          onClick={exportJSON}
        >
          📤 Export current scenarios
        </button>
        {exported && (
          <button className="blb-coach-btn" onClick={copyJSON}>
            {copied ? 'Copied ✓' : '📋 Copy JSON'}
          </button>
        )}
      </div>
      {exported && (
        <pre className="blb-coach-json">
          {exported.slice(0, 4000)}
          {exported.length > 4000 ? '\n…(truncated for preview)' : ''}
        </pre>
      )}

      <div className="blb-coach-spec">
        <h3>Scenario data model</h3>
        <p>Every scenario follows pattern → decision → outcome. Required fields:</p>
        <ul>
          <li>
            <code>id</code> · unique slug
          </li>
          <li>
            <code>zone</code> · {copy.zones}
          </li>
          <li>
            <code>category</code> · for weakness detection ({copy.categories},
            etc.)
          </li>
          <li>
            <code>difficulty</code> · rookie | varsity | elite
          </li>
          <li>
            <code>kind</code> · mcq | tap
          </li>
          <li>
            <code>options[]</code> with <code>feedback</code> and <code>trap</code>{' '}
            (for wrong answers — explain why a kid would think it's right)
          </li>
          <li>
            <code>coachCue</code> · ONE thing to remember
          </li>
          <li>
            <code>visual</code> · normalized 0–100 coordinates ({copy.coords})
          </li>
        </ul>
      </div>
    </div>
  );
}
