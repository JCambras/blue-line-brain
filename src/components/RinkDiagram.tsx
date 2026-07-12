import type { Scenario, TapTarget } from '@/types';
import { PlayerLayer, puckOnStick } from './PlayerLayer';

// Re-exported so existing importers (AnimatedRink, FieldDiagram) keep working.
export { puckOnStick };

interface RinkDiagramProps {
  scenario: Scenario;
  onTap?: (target: TapTarget) => void;
  tapResult?: { targetIdx: number; correct: boolean } | null;
  /** Live position overrides by player id, used while the play animation runs. */
  playerPos?: Record<string, { x: number; y: number }>;
  puckPos?: { x: number; y: number };
  /** Hide arrows/highlights/tap targets — the freeze-frame hints — during animation. */
  hideAnnotations?: boolean;
  /** Recent puck positions (oldest → newest) rendered as a fading trail. */
  puckTrail?: { x: number; y: number }[];
  /** Recent positions per moving player, rendered as skating streaks. */
  playerTrails?: Record<string, { x: number; y: number }[]>;
  /** Player currently carrying the puck — gets a possession ring. */
  carrierId?: string | null;
  /** Expanding whistle rings at the puck when the play freezes. */
  freezePulse?: boolean;
}

const ICE = '#eaf2ff';
const RED = '#d94343';
const BLUE = '#2256a8';

export function RinkDiagram(props: RinkDiagramProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ice */}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="8"
        ry="8"
        fill={ICE}
        stroke="#0a0a0a"
        strokeWidth="0.6"
      />

      {/* Goal lines */}
      <line x1="0" y1="6" x2="100" y2="6" stroke={RED} strokeWidth="0.4" />
      <line x1="0" y1="94" x2="100" y2="94" stroke={RED} strokeWidth="0.4" />

      {/* Blue lines */}
      <line x1="0" y1="33" x2="100" y2="33" stroke={BLUE} strokeWidth="1.2" />
      <line x1="0" y1="67" x2="100" y2="67" stroke={BLUE} strokeWidth="1.2" />

      {/* Center red line */}
      <line x1="0" y1="50" x2="100" y2="50" stroke={RED} strokeWidth="1.0" strokeDasharray="2 1.5" />

      {/* Center face-off */}
      <circle cx="50" cy="50" r="6" stroke={BLUE} strokeWidth="0.4" fill="none" />
      <circle cx="50" cy="50" r="0.8" fill={BLUE} />

      {/* End-zone face-off circles */}
      <circle cx="25" cy="20" r="7" stroke={RED} strokeWidth="0.4" fill="none" />
      <circle cx="75" cy="20" r="7" stroke={RED} strokeWidth="0.4" fill="none" />
      <circle cx="25" cy="80" r="7" stroke={RED} strokeWidth="0.4" fill="none" />
      <circle cx="75" cy="80" r="7" stroke={RED} strokeWidth="0.4" fill="none" />

      {/* Creases */}
      <path d="M 44 6 A 6 6 0 0 0 56 6 Z" fill="#cfe1ff" stroke={RED} strokeWidth="0.3" />
      <path d="M 44 94 A 6 6 0 0 1 56 94 Z" fill="#cfe1ff" stroke={RED} strokeWidth="0.3" />

      {/* Goals */}
      <rect x="46" y="3.5" width="8" height="2.5" fill="none" stroke={RED} strokeWidth="0.3" />
      <rect x="46" y="94" width="8" height="2.5" fill="none" stroke={RED} strokeWidth="0.3" />

      <PlayerLayer
        {...props}
        ballFill="#0a0a0a"
        ballStroke="#fff"
        ballStrokeWidth={0.3}
        ballTrailColor="#0a0a0a"
        ballTrailOpacity={0.4}
      />
    </svg>
  );
}
