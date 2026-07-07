import { useEffect, useRef, useState } from 'react';
import type { Scenario } from '@/types';
import { narrator } from '@/lib/narrator';
import { sfx } from '@/lib/sfx';
import { RinkDiagram, puckOnStick } from './RinkDiagram';

interface Frame {
  players: Record<string, { x: number; y: number }>;
  puck: { x: number; y: number };
}

interface ResolvedBeat {
  t: number;
  frame: Frame;
  narration?: string;
}

/** Trail history window (s) and sampling interval (s). */
const TRAIL_WINDOW = 0.45;
const TRAIL_SAMPLE = 0.05;
/** Minimum travel over the window before a trail is drawn — no streaks on gliding stops. */
const MIN_TRAVEL = 1.1;
/** Possession: grab the puck inside GRAB, keep it until it drifts past RELEASE. */
const GRAB_DIST = 3.6;
const RELEASE_DIST = 5.2;
/** How long the whistle rings hold on screen before the reveal starts (ms). */
const FREEZE_HOLD_MS = 750;

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

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

interface Trails {
  puck?: { x: number; y: number }[];
  players: Record<string, { x: number; y: number }[]>;
}

/** Build fading-trail point lists from sampled history; still objects get none. */
function buildTrails(history: { t: number; frame: Frame }[], current: Frame): Trails {
  const players: Trails['players'] = {};
  if (history.length < 2) return { players };
  const oldest = history[0].frame;
  const puckPts = [...history.map((h) => h.frame.puck), current.puck];
  const trails: Trails = {
    puck: dist(oldest.puck, current.puck) > MIN_TRAVEL ? puckPts : undefined,
    players,
  };
  for (const id of Object.keys(current.players)) {
    if (dist(oldest.players[id], current.players[id]) > MIN_TRAVEL) {
      players[id] = [...history.map((h) => h.frame.players[id]), current.players[id]];
    }
  }
  return trails;
}

interface AnimatedRinkProps {
  scenario: Scenario;
  /** Called once when the play reaches its freeze frame. */
  onDone: () => void;
}

/**
 * Plays the scenario's animated sequence: tweens players/puck through the
 * beat timeline with skating streaks, a puck trail, and a possession ring,
 * speaks + captions the play-by-play, then whistles the play dead and
 * calls onDone.
 */
export function AnimatedRink({ scenario, onDone }: AnimatedRinkProps) {
  const [frame, setFrame] = useState<Frame>(() => frameAt(resolveBeats(scenario), 0));
  const [trails, setTrails] = useState<Trails>({ players: {} });
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [caption, setCaption] = useState('');
  /** Keep the caption off the action: top of the rink when the play is low. */
  const [captionTop, setCaptionTop] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const beats = resolveBeats(scenario);
    const total = beats[beats.length - 1].t;
    const spoken = new Set<number>();
    const startTs = performance.now();
    const history: { t: number; frame: Frame }[] = [];
    let carrier: string | null = null;
    let raf = 0;
    let holdTimer = 0;
    let finished = false;

    const loop = (now: number) => {
      const t = (now - startTs) / 1000;
      beats.forEach((b, i) => {
        if (b.narration && b.t <= t && !spoken.has(i)) {
          spoken.add(i);
          setCaption(b.narration);
          // The line describes movement after this beat, so keep the caption
          // clear of both where the puck is and where it's going.
          const next = beats[Math.min(i + 1, beats.length - 1)];
          setCaptionTop(Math.max(frameAt(beats, t).puck.y, next.frame.puck.y) > 55);
          narrator.speak(b.narration);
        }
      });
      const f = frameAt(beats, t);
      // Display frame: the carried puck rides the stick (same shift
      // RinkDiagram applies), so the trail history matches what is drawn.
      const fd: Frame = {
        players: f.players,
        puck: puckOnStick(f.puck, scenario.visual.players, f.players),
      };

      // Sample history for trails
      if (!history.length || t - history[history.length - 1].t >= TRAIL_SAMPLE) {
        history.push({ t, frame: fd });
      }
      while (history.length && history[0].t < t - TRAIL_WINDOW) history.shift();

      // Possession with hysteresis so the ring doesn't flicker on handoffs
      if (carrier && dist(f.players[carrier], f.puck) > RELEASE_DIST) carrier = null;
      if (!carrier) {
        let best: string | null = null;
        let bestD = GRAB_DIST;
        for (const id of Object.keys(f.players)) {
          const d = dist(f.players[id], f.puck);
          if (d < bestD) {
            best = id;
            bestD = d;
          }
        }
        carrier = best;
      }

      setFrame(fd);
      setTrails(buildTrails(history, fd));
      setCarrierId(carrier);

      if (t >= total) {
        if (!finished) {
          finished = true;
          // Whistle the play dead: hold the freeze frame with pulse rings
          // for a beat before the question takes over.
          setTrails({ players: {} });
          setCarrierId(null);
          setFrozen(true);
          sfx.whistle();
          holdTimer = window.setTimeout(() => onDoneRef.current(), FREEZE_HOLD_MS);
        }
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(holdTimer);
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
        puckTrail={trails.puck}
        playerTrails={trails.players}
        carrierId={carrierId}
        freezePulse={frozen}
      />
      {caption && (
        <div className={`blb-anim-caption ${captionTop ? 'top' : ''}`}>{caption}</div>
      )}
    </>
  );
}
