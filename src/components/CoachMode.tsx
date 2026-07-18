import { useState } from 'react';
import type { Sport } from '@/types';
import { SCENARIOS } from '@/data/scenarios';
import { sportOf } from '@/data/modules';

interface CoachModeProps {
  /**
   * Active sport, so the export ships that sport's scenarios and the schema
   * doc names the right surface and tracks.
   */
  sport: Sport;
  onClose: () => void;
}

/**
 * Per-sport wording for the whole Coach Mode screen (kid-facing note, coach
 * explainer, data-model doc). The schema is shared, but the emoji, surface
 * ("rink" vs "field"), game piece ("puck" vs "ball"), zone enum and category
 * examples differ by sport so a lacrosse coach never reads hockey terms.
 */
const COACH_COPY: Record<
  Sport,
  { emoji: string; surface: string; piece: string; zones: string; categories: string; coords: string }
> = {
  hockey: {
    emoji: '🏒',
    surface: 'rink',
    piece: 'puck',
    zones: 'defensive | neutral | offensive | skills',
    categories: 'retrieval, gap, coverage',
    coords: 'full rink, defensive zone is high-y',
  },
  lacrosse: {
    emoji: '🥍',
    surface: 'field',
    piece: 'ball',
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
      <p className="blb-coach-note">
        {copy.emoji} Players: this screen is for your coach or a parent. Head
        back and get your reps in.
      </p>
      <p className="blb-coach-p">
        Coaches - want drills built around your own team's game? The app runs
        on scenario cards: each one is a real game situation with answer
        choices, an explanation of why each wrong answer is tempting, and one
        coaching cue. Tap Export to get the current set as text (a format
        called JSON) - hand it to whoever builds your scenarios, or use it as a
        template to write your own. Building scenarios right inside the app
        (drag players onto the {copy.surface}, write the options, set the
        correct answer) is coming next.
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
        <h3>What every scenario needs</h3>
        <p>
          Every scenario follows the same shape: show a pattern, force a
          decision, explain the outcome. Each one needs:
        </p>
        <ul>
          <li>
            <code>id</code> · a short name no other scenario uses
          </li>
          <li>
            <code>zone</code> · {copy.zones}
          </li>
          <li>
            <code>category</code> · the skill it trains ({copy.categories},
            etc.) - this powers the "you miss the most on" tracking
          </li>
          <li>
            <code>difficulty</code> · rookie | varsity | elite
          </li>
          <li>
            <code>kind</code> · <code>mcq</code> (pick an answer) or{' '}
            <code>tap</code> (tap the right spot on the {copy.surface})
          </li>
          <li>
            <code>options[]</code> · each with <code>feedback</code> (why it's
            right or wrong) and, for wrong answers, <code>trap</code> (why a
            player would think it's right)
          </li>
          <li>
            <code>coachCue</code> · the ONE thing to remember
          </li>
          <li>
            <code>visual</code> · where the players and the {copy.piece} start,
            on a 0-100 grid ({copy.coords})
          </li>
        </ul>
      </div>
    </div>
  );
}
