import type { Player, Scenario, TapTarget } from '@/types';

/**
 * Sport-agnostic overlay shared by RinkDiagram and FieldDiagram: highlights,
 * arrows, tap targets, skating streaks, the ball trail, the possession ring,
 * the players with their YOU tag, the ball itself, and the freeze pulse. Each
 * surface draws its own field markings first, then renders this layer on top.
 * Only the ball's colors differ between sports, so they are passed in.
 */

/**
 * Carried pucks/balls are authored at the carrier's exact coordinates (see
 * AUTHORING.md). Drawing there buries it under the player disc, so shift it to
 * the rim - onto the carrier's stick/crosse. Loose balls (farther than
 * STICK_REACH from everyone) render exactly where the data puts them. Not
 * idempotent - a shifted position can land within reach of a second player - so
 * it must be applied to raw authored/tweened positions exactly once, here on the
 * render path. AnimatedRink applies it separately to build trail history that
 * matches what is drawn.
 */
const STICK_REACH = 3.6;

export function puckOnStick(
  puck: { x: number; y: number },
  players: Player[],
  playerPos?: Record<string, { x: number; y: number }>
): { x: number; y: number } {
  let carrier: Player | null = null;
  let carrierPos = puck;
  let nd = Infinity;
  for (const p of players) {
    const pos = playerPos?.[p.id] ?? p;
    const d = Math.hypot(pos.x - puck.x, pos.y - puck.y);
    if (d < nd) {
      nd = d;
      carrier = p;
      carrierPos = pos;
    }
  }
  if (!carrier || nd >= STICK_REACH) return puck;
  // Stick direction: the authored offset when there is one, fading to
  // "toward the net they attack" when the puck sits at the carrier's center.
  // The blend keeps the direction continuous while a pass leaves the blade.
  const attackY = carrier.team === 'home' ? -1 : 1;
  const u = Math.min(1, nd / 1.2);
  const dx = nd > 0 ? ((puck.x - carrierPos.x) / nd) * u : 0;
  const dy = (nd > 0 ? ((puck.y - carrierPos.y) / nd) * u : 0) + attackY * (1 - u);
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: carrierPos.x + (dx / len) * STICK_REACH,
    y: carrierPos.y + (dy / len) * STICK_REACH,
  };
}

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

export interface PlayerLayerProps {
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
  /** Ball styling differs by sport (dark puck vs light lacrosse ball). */
  ballFill: string;
  ballStroke: string;
  ballStrokeWidth: number;
  ballTrailColor: string;
  ballTrailOpacity: number;
}

export function PlayerLayer({
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
  ballFill,
  ballStroke,
  ballStrokeWidth,
  ballTrailColor,
  ballTrailOpacity,
}: PlayerLayerProps) {
  const v = scenario.visual;
  const ball = puckOnStick(puckPos ?? v.puck, v.players, playerPos);

  return (
    <>
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
          id="blb-arrow"
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
            markerEnd="url(#blb-arrow)"
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
        <Trail points={puckTrail} color={ballTrailColor} maxWidth={1.2} maxOpacity={ballTrailOpacity} />
      )}

      {/* Possession ring around the ball carrier */}
      {carrierId &&
        (() => {
          const c = v.players.find((p) => p.id === carrierId);
          if (!c) return null;
          const pos = playerPos?.[carrierId] ?? c;
          return (
            <g pointerEvents="none">
              <circle cx={pos.x} cy={pos.y} r="4.6" fill="rgba(255, 200, 60, 0.18)" stroke="none" />
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
              <circle cx={pos.x} cy={pos.y} r="4.4" fill="none" stroke="#e6a817" strokeWidth="0.8" />
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
        fill={ballFill}
        stroke={ballStroke}
        strokeWidth={ballStrokeWidth}
      />

      {/* Whistle rings when the play freezes at the decision point */}
      {freezePulse && (
        <g pointerEvents="none">
          <circle className="blb-pulse-ring" cx={ball.x} cy={ball.y} r="3" />
          <circle className="blb-pulse-ring blb-pulse-ring-late" cx={ball.x} cy={ball.y} r="3" />
        </g>
      )}
    </>
  );
}
