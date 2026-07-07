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
const HOMEBLUE = '#1f4ed8';
const AWAYRED = '#c43030';

/** Fading segments between consecutive trail points, newest = strongest. */
function Trail({
  points,
  color,
  maxWidth,
  maxOpacity,
}: {
  points: { x: number; y: number }[];
  color: string;
  maxWidth: number;
  maxOpacity: number;
}) {
  if (points.length < 2) return null;
  const n = points.length - 1;
  return (
    <g pointerEvents="none">
      {points.slice(1).map((p, i) => {
        const a = points[i];
        const u = (i + 1) / n;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={p.x}
            y2={p.y}
            stroke={color}
            strokeWidth={maxWidth * u}
            strokeOpacity={maxOpacity * u}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

export function RinkDiagram({
  scenario,
  onTap,
  tapResult,
  playerPos,
  puckPos,
  hideAnnotations,
  puckTrail,
  playerTrails,
  carrierId,
  freezePulse,
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

      {/* Skating streaks behind moving players */}
      {playerTrails &&
        v.players.map((p) => {
          const pts = playerTrails[p.id];
          if (!pts) return null;
          return (
            <Trail
              key={`pt-${p.id}`}
              points={pts}
              color={p.team === 'home' ? HOMEBLUE : AWAYRED}
              maxWidth={4.2}
              maxOpacity={0.16}
            />
          );
        })}

      {/* Puck trail */}
      {puckTrail && (
        <Trail points={puckTrail} color="#0a0a0a" maxWidth={1.2} maxOpacity={0.4} />
      )}

      {/* Possession ring around the puck carrier */}
      {carrierId &&
        (() => {
          const c = v.players.find((p) => p.id === carrierId);
          if (!c) return null;
          const pos = playerPos?.[carrierId] ?? c;
          return (
            <g pointerEvents="none">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4.6"
                fill="rgba(255, 200, 60, 0.18)"
                stroke="none"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4.6"
                fill="none"
                stroke="#e6a817"
                strokeWidth="0.5"
                strokeDasharray="1.6 1.1"
              />
            </g>
          );
        })()}

      {/* Players */}
      {v.players.map((p) => {
        const pos = playerPos?.[p.id] ?? p;
        const isYou = p.id === v.youId;
        return (
          <g key={p.id}>
            {isYou && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4.4"
                fill="none"
                stroke="#e6a817"
                strokeWidth="0.8"
              />
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="3.2"
              fill={p.team === 'home' ? HOMEBLUE : AWAYRED}
              stroke={isYou ? '#fff' : '#0a0a0a'}
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
            {isYou &&
              (() => {
                // Tag sits above the player; flip below near the top boards.
                const below = pos.y < 12;
                const tagY = below ? pos.y + 5.6 : pos.y - 8.8;
                const tipY = below ? pos.y + 5.6 : pos.y - 5.6;
                return (
                  <g pointerEvents="none">
                    <path
                      d={
                        below
                          ? `M ${pos.x - 1.4} ${tipY} L ${pos.x + 1.4} ${tipY} L ${pos.x} ${tipY - 1.4} Z`
                          : `M ${pos.x - 1.4} ${tipY} L ${pos.x + 1.4} ${tipY} L ${pos.x} ${tipY + 1.4} Z`
                      }
                      fill="#e6a817"
                    />
                    <rect
                      x={pos.x - 4.6}
                      y={tagY}
                      width="9.2"
                      height="3.4"
                      rx="1.2"
                      fill="#e6a817"
                      stroke="#0a0a0a"
                      strokeWidth="0.25"
                    />
                    <text
                      x={pos.x}
                      y={tagY + 2.5}
                      textAnchor="middle"
                      fontSize="2.6"
                      fill="#0a0a0a"
                      fontWeight="800"
                      fontFamily="ui-monospace, monospace"
                    >
                      YOU
                    </text>
                  </g>
                );
              })()}
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

      {/* Whistle rings when the play freezes at the decision point */}
      {freezePulse && (
        <g pointerEvents="none">
          <circle className="blb-pulse-ring" cx={puck.x} cy={puck.y} r="3" />
          <circle
            className="blb-pulse-ring blb-pulse-ring-late"
            cx={puck.x}
            cy={puck.y}
            r="3"
          />
        </g>
      )}
    </svg>
  );
}
