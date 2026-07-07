import { useEffect, useRef, useState } from 'react';
import type { Scenario } from '@/types';
import { narrator } from '@/lib/narrator';
import { RinkDiagram } from './RinkDiagram';

interface Frame {
  players: Record<string, { x: number; y: number }>;
  puck: { x: number; y: number };
}

interface ResolvedBeat {
  t: number;
  frame: Frame;
  narration?: string;
}

/** Ease-in-out per segment so skaters accelerate and glide, not teleport. */
function easeInOut(u: number): number {
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

/**
 * Expand partial beats into absolute frames: unmentioned players/puck carry
 * forward from the previous beat, starting from the `visual` positions.
 */
function resolveBeats(scenario: Scenario): ResolvedBeat[] {
  const anim = scenario.animation!;
  let players: Frame['players'] = Object.fromEntries(
    scenario.visual.players.map((p) => [p.id, { x: p.x, y: p.y }])
  );
  let puck = { ...scenario.visual.puck };
  return anim.beats.map((b) => {
    players = { ...players, ...(b.players ?? {}) };
    if (b.puck) puck = { ...b.puck };
    return { t: b.t, frame: { players: { ...players }, puck: { ...puck } }, narration: b.narration };
  });
}

function frameAt(beats: ResolvedBeat[], t: number): Frame {
  if (t <= beats[0].t) return beats[0].frame;
  const last = beats[beats.length - 1];
  if (t >= last.t) return last.frame;
  let i = 0;
  while (t > beats[i + 1].t) i++;
  const a = beats[i];
  const b = beats[i + 1];
  const u = easeInOut((t - a.t) / (b.t - a.t));
  const players: Frame['players'] = {};
  for (const id of Object.keys(b.frame.players)) {
    const pa = a.frame.players[id];
    const pb = b.frame.players[id];
    players[id] = { x: pa.x + (pb.x - pa.x) * u, y: pa.y + (pb.y - pa.y) * u };
  }
  return {
    players,
    puck: {
      x: a.frame.puck.x + (b.frame.puck.x - a.frame.puck.x) * u,
      y: a.frame.puck.y + (b.frame.puck.y - a.frame.puck.y) * u,
    },
  };
}

interface AnimatedRinkProps {
  scenario: Scenario;
  /** Called once when the play reaches its freeze frame. */
  onDone: () => void;
}

/**
 * Plays the scenario's animated sequence: tweens players/puck through the
 * beat timeline, speaks + captions the play-by-play, then calls onDone.
 */
export function AnimatedRink({ scenario, onDone }: AnimatedRinkProps) {
  const [frame, setFrame] = useState<Frame>(() => frameAt(resolveBeats(scenario), 0));
  const [caption, setCaption] = useState('');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const beats = resolveBeats(scenario);
    const total = beats[beats.length - 1].t;
    const spoken = new Set<number>();
    const startTs = performance.now();
    let raf = 0;
    let finished = false;

    const loop = (now: number) => {
      const t = (now - startTs) / 1000;
      beats.forEach((b, i) => {
        if (b.narration && b.t <= t && !spoken.has(i)) {
          spoken.add(i);
          setCaption(b.narration);
          narrator.speak(b.narration);
        }
      });
      setFrame(frameAt(beats, t));
      if (t >= total) {
        if (!finished) {
          finished = true;
          onDoneRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      narrator.cancel();
    };
  }, [scenario]);

  return (
    <>
      <RinkDiagram
        scenario={scenario}
        playerPos={frame.players}
        puckPos={frame.puck}
        hideAnnotations
      />
      {caption && <div className="blb-anim-caption">{caption}</div>}
    </>
  );
}
