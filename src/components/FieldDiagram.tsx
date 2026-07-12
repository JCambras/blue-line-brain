import type { Scenario, TapTarget } from '@/types';
import { PlayerLayer } from './PlayerLayer';

/**
 * Lacrosse field surface - a drop-in for RinkDiagram with the identical props
 * interface. The turf/lines/creases/goals below are lacrosse-specific; the
 * players, ball, arrows, tap targets, trails, possession ring and freeze pulse
 * are drawn by the shared, sport-agnostic PlayerLayer.
 *
 * Home attacks the TOP goal (small y), matching the rink convention.
 */

interface FieldDiagramProps {
  scenario: Scenario;
  onTap?: (target: TapTarget) => void;
  tapResult?: { targetIdx: number; correct: boolean } | null;
  playerPos?: Record<string, { x: number; y: number }>;
  puckPos?: { x: number; y: number };
  hideAnnotations?: boolean;
  puckTrail?: { x: number; y: number }[];
  playerTrails?: Record<string, { x: number; y: number }[]>;
  carrierId?: string | null;
  freezePulse?: boolean;
}

const TURF_A = '#3f9159';
const TURF_B = '#469a60';
const LINE = '#eaf5ec';
const CREASE_FILL = 'rgba(226,112,58,0.16)';
const GOAL = '#e2703a';

export function FieldDiagram(props: FieldDiagramProps) {
  // Mowing stripes: alternating turf bands clipped to the rounded field.
  const bands = Array.from({ length: 10 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="lax-field-clip">
          <rect x="0" y="0" width="100" height="100" rx="8" ry="8" />
        </clipPath>
      </defs>

      {/* Turf with mowing stripes */}
      <g clipPath="url(#lax-field-clip)">
        <rect x="0" y="0" width="100" height="100" fill={TURF_A} />
        {bands.map((i) => (
          <rect
            key={`band-${i}`}
            x="0"
            y={i * 10}
            width="100"
            height="10"
            fill={i % 2 === 0 ? TURF_A : TURF_B}
          />
        ))}
      </g>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="8"
        ry="8"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="0.6"
      />

      {/* Goal-line-extended, full width, faint */}
      <line x1="0" y1="8" x2="100" y2="8" stroke={LINE} strokeWidth="0.35" strokeOpacity="0.55" />
      <line x1="0" y1="92" x2="100" y2="92" stroke={LINE} strokeWidth="0.35" strokeOpacity="0.55" />

      {/* Restraining lines */}
      <line x1="0" y1="30" x2="100" y2="30" stroke={LINE} strokeWidth="0.7" />
      <line x1="0" y1="70" x2="100" y2="70" stroke={LINE} strokeWidth="0.7" />

      {/* Midfield line + wing lines */}
      <line x1="0" y1="50" x2="100" y2="50" stroke={LINE} strokeWidth="0.9" />
      <line x1="33" y1="41" x2="33" y2="59" stroke={LINE} strokeWidth="0.7" />
      <line x1="67" y1="41" x2="67" y2="59" stroke={LINE} strokeWidth="0.7" />

      {/* Center X */}
      <g stroke={LINE} strokeWidth="0.7">
        <line x1="48.5" y1="48.5" x2="51.5" y2="51.5" />
        <line x1="51.5" y1="48.5" x2="48.5" y2="51.5" />
      </g>

      {/* Creases */}
      <circle cx="50" cy="8" r="6" fill={CREASE_FILL} stroke={LINE} strokeWidth="0.4" />
      <circle cx="50" cy="92" r="6" fill={CREASE_FILL} stroke={LINE} strokeWidth="0.4" />

      {/* Goal mouths (post-and-crossbar, opening facing the field) */}
      <path d="M 47 8 L 47 5 L 53 5 L 53 8" fill="none" stroke={GOAL} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M 47 92 L 47 95 L 53 95 L 53 92" fill="none" stroke={GOAL} strokeWidth="0.9" strokeLinejoin="round" />

      <PlayerLayer
        {...props}
        ballFill="#f4f4f4"
        ballStroke="#0a0a0a"
        ballStrokeWidth={0.35}
        ballTrailColor="#f4f4f4"
        ballTrailOpacity={0.5}
      />
    </svg>
  );
}
