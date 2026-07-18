import type { Sport } from '@/types';

interface OnboardProps {
  /** Active sport, so the welcome copy speaks the player's game. */
  sport: Sport;
  onClose: () => void;
}

/**
 * First-run welcome. The three rules are sport-agnostic except the opener and
 * the CTA, which are voiced per sport: hockey players "read the ice" and "lace
 * 'em up" (skates); lacrosse players "read the field" and get "sticks up".
 */
export function Onboard({ sport, onClose }: OnboardProps) {
  const lacrosse = sport === 'lacrosse';
  const readLine = lacrosse ? 'Read the field' : 'Read the ice';
  const cta = lacrosse ? 'STICKS UP' : "LACE 'EM UP";

  return (
    <div className="blb-modal-bg">
      <div className="blb-modal">
        <div className="blb-modal-tag">WELCOME, KID</div>
        <h2>Three rules.</h2>
        <ol className="blb-modal-list">
          <li>
            <strong>{readLine}</strong> — every scenario shows a real situation.
          </li>
          <li>
            <strong>Pick fast</strong> — the timer matters. Speed is the skill.
          </li>
          <li>
            <strong>Wrong is fine</strong> — every miss tells you why. Then you go
            again.
          </li>
        </ol>
        <button
          className="blb-cta-primary blb-modal-btn"
          onClick={onClose}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
