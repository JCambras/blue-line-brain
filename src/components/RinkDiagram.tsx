import type { Scenario, TapTarget } from '@/types';

interface RinkDiagramProps {
  scenario: Scenario;
  onTap?: (target: TapTarget) => void;
  tapResult?: { targetIdx: number; correct: boolean } | null;
  /** Live position overrides by player id, used while the play animation runs. */
  playerPos?: Record<string, { x: number; y: number }>;
  puckPos?: { x: number; y: number };
  /** Hide arrows/highlights/tap targets — the freeze-frame hints — during animation. */
  hideAnnotations?: boolean;
}

const ICE = '#eaf2ff';
const RED = '#d94343';
const BLUE = '#2256a8';
const HOMEBLUE = '#1f4ed8';
const AWAYRED = '#c43030';

export function RinkDiagram({
  scenario,
  onTap,
  tapResult,
  playerPos,
  puckPos,
  hideAnnotations,
}: RinkDiagramProps) {
  const v = scenario.visual;
  const puck = puckPos ?? v.puck;

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
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke={RED}
        strokeWidth="1.0"
        strokeDasharray="2 1.5"
      />

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
      <path
        d="M 44 94 A 6 6 0 0 1 56 94 Z"
        fill="#cfe1ff"
        stroke={RED}
        strokeWidth="0.3"
      />

      {/* Goals */}
      <rect x="46" y="3.5" width="8" height="2.5" fill="none" stroke={RED} strokeWidth="0.3" />
      <rect x="46" y="94" width="8" height="2.5" fill="none" stroke={RED} strokeWidth="0.3" />

      {/* Highlights (focus zones) */}
      {!hideAnnotations &&
        v.highlights?.map((h, i) => (
        <circle
          key={`h-${i}`}
          cx={h.x}
          cy={h.y}
          r={h.radius}
          fill="rgba(255,210,80,0.28)"
          stroke="rgba(255,180,30,0.6)"
          strokeWidth="0.4"
          strokeDasharray="1.2 1"
        />
      ))}

      {/* Arrow marker */}
      <defs>
        <marker
          id="arrow-h"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="3"
          markerHeight="3"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0a0a0a" />
        </marker>
      </defs>
      {!hideAnnotations &&
        v.arrows?.map((a, i) => (
          <line
          key={`a-${i}`}
          x1={a.fromX}
          y1={a.fromY}
          x2={a.toX}
          y2={a.toY}
          stroke="#0a0a0a"
          strokeWidth="0.7"
          strokeDasharray={a.dashed ? '1.5 1' : undefined}
          markerEnd="url(#arrow-h)"
        />
      ))}

      {/* Tap targets (only in tap mode) */}
      {scenario.kind === 'tap' &&
        !hideAnnotations &&
        scenario.tapTargets?.map((t, i) => {
          const isResult = tapResult?.targetIdx === i;
          const showResultColor = isResult
            ? tapResult.correct
              ? '#1a8f3a'
              : '#c0392b'
            : 'rgba(20,40,80,0.18)';
          return (
            <g
              key={`t-${i}`}
              style={{ cursor: onTap ? 'pointer' : 'default' }}
              onClick={() => onTap && onTap(t)}
            >
              <circle
                cx={t.x}
                cy={t.y}
                r={t.radius}
                fill={showResultColor}
                stroke={isResult ? showResultColor : 'rgba(20,40,80,0.5)'}
                strokeWidth="0.5"
                strokeDasharray="1 0.8"
                opacity="0.85"
              />
              <circle cx={t.x} cy={t.y} r="1.2" fill="#0a0a0a" opacity="0.6" />
            </g>
          );
        })}

      {/* Players */}
      {v.players.map((p) => {
        const pos = playerPos?.[p.id] ?? p;
        return (
          <g key={p.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="3.2"
              fill={p.team === 'home' ? HOMEBLUE : AWAYRED}
              stroke="#0a0a0a"
              strokeWidth="0.4"
            />
            {p.label && (
              <text
                x={pos.x}
                y={pos.y + 1.2}
                textAnchor="middle"
                fontSize="3.2"
                fill="#fff"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                {p.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Puck */}
      <circle
        cx={puck.x}
        cy={puck.y}
        r="1.4"
        fill="#0a0a0a"
        stroke="#fff"
        strokeWidth="0.3"
      />
    </svg>
  );
}
