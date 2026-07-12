import type { Player, Scenario, TapTarget } from '@/types';
import { puckOnStick } from './RinkDiagram';

/**
 * Lacrosse field surface — a drop-in for RinkDiagram with the identical props
 * interface. The turf/lines/creases/goals below are lacrosse-specific; the
 * player / YOU-tag / arrow / tap-target / trail / possession-ring / freeze-pulse
 * drawing is copied unchanged from RinkDiagram (it is sport-agnostic). The ball
 * uses the shared `puckOnStick` shift so a carried ball rides the carrier's
 * crosse just as a carried puck rides the stick.
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

export function FieldDiagram({
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
}: FieldDiagramProps) {
  const v = scenario.visual;
  const ball = puckOnStick(puckPos ?? v.puck, v.players, playerPos);

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
        <marker
          id="arrow-l"
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
      <path
        d="M 47 8 L 47 5 L 53 5 L 53 8"
        fill="none"
        stroke={GOAL}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M 47 92 L 47 95 L 53 95 L 53 92"
        fill="none"
        stroke={GOAL}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

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

      {/* Arrows */}
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
            markerEnd="url(#arrow-l)"
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

      {/* Ball trail */}
      {puckTrail && (
        <Trail points={puckTrail} color="#f4f4f4" maxWidth={1.2} maxOpacity={0.5} />
      )}

      {/* Possession ring around the ball carrier */}
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

      {/* Ball */}
      <circle
        cx={ball.x}
        cy={ball.y}
        r="1.4"
        fill="#f4f4f4"
        stroke="#0a0a0a"
        strokeWidth="0.35"
      />

      {/* Whistle rings when the play freezes at the decision point */}
      {freezePulse && (
        <g pointerEvents="none">
          <circle className="blb-pulse-ring" cx={ball.x} cy={ball.y} r="3" />
          <circle
            className="blb-pulse-ring blb-pulse-ring-late"
            cx={ball.x}
            cy={ball.y}
            r="3"
          />
        </g>
      )}
    </svg>
  );
}
