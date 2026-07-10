import { useEffect, useRef, useState } from 'react';
import type { Scenario, TapTarget } from '@/types';
import { DIFFICULTY_CONFIG } from '@/data/scenarios';
import { sfx } from '@/lib/sfx';
import { narrationAudio } from '@/lib/narrationAudio';
import { OPTION_GAP_MS, OPTION_LEAD_IN_MS } from '@/lib/narrationTiming';
import { RinkDiagram } from './RinkDiagram';
import { AnimatedRink } from './AnimatedRink';

interface SessionScreenProps {
  scenario: Scenario;
  idx: number;
  total: number;
  onAnswer: (
    s: Scenario,
    correct: boolean,
    timeMs: number,
    optIdx?: number,
    tapIdx?: number
  ) => void;
  onQuit: () => void;
}

/**
 * anim   — the play sequence runs with voice-over; question hidden.
 * reveal — frozen at the decision point; options appear and are read aloud.
 * live   — all options out, the decision timer is running.
 */
type Phase = 'anim' | 'reveal' | 'live';

export function SessionScreen({
  scenario,
  idx,
  total,
  onAnswer,
  onQuit,
}: SessionScreenProps) {
  const cfg = DIFFICULTY_CONFIG[scenario.difficulty];
  const [phase, setPhase] = useState<Phase>(scenario.animation ? 'anim' : 'reveal');
  const [revealed, setRevealed] = useState(0);
  const [readingIdx, setReadingIdx] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(cfg.timer);
  const start = useRef(Date.now());

  // Reset when scenario changes
  useEffect(() => {
    setPhase(scenario.animation ? 'anim' : 'reveal');
    setRevealed(0);
    setReadingIdx(-1);
    setTimeLeft(cfg.timer);
    start.current = Date.now();
  }, [scenario.id, cfg.timer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Replay: restart the animation + coach narration from the top without
  // touching the score or session position. Stops any in-flight audio, rewinds
  // the reveal state, and remounts AnimatedRink (switching to the 'anim' phase
  // unmounts the frozen RinkDiagram and mounts a fresh AnimatedRink). Respects
  // the sound toggle through narrationAudio's own `enabled` gate.
  const replay = () => {
    if (!scenario.animation) return;
    narrationAudio.stop();
    setRevealed(0);
    setReadingIdx(-1);
    setTimeLeft(cfg.timer);
    setPhase('anim');
  };

  // Reveal phase: coach reads the freeze line, then each option as it appears.
  // Every clip is the pre-rendered ElevenLabs coach voice (keys match
  // scripts/narration-manifest.ts); missing audio just plays silent.
  useEffect(() => {
    if (phase !== 'reveal') return;
    let cancelled = false;
    // Cancels an in-flight pacing beat (lead-in or inter-option gap) so a
    // skip/quit/unmount during it neither hangs the sequence nor leaks a timer.
    let cancelSleep: (() => void) | undefined;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          cancelSleep = undefined;
          resolve();
        }, ms);
        cancelSleep = () => {
          clearTimeout(timer);
          cancelSleep = undefined;
          resolve();
        };
      });
    start.current = Date.now(); // the clock is fair from when choices appear
    (async () => {
      if (scenario.animation?.freezeLine) {
        await narrationAudio.playAndWait(`${scenario.id}.freeze`);
      }
      if (cancelled) return;
      if (scenario.kind === 'mcq' && scenario.options) {
        // Unhurried beat so the jump from the freeze prompt into the options
        // isn't rushed.
        await sleep(OPTION_LEAD_IN_MS);
        if (cancelled) return;
        const n = Math.min(cfg.choices, scenario.options.length);
        for (let i = 0; i < n; i++) {
          if (cancelled) return;
          // A shorter beat between option reads so the coach doesn't run them
          // together — none before the first, the lead-in already spaced it.
          if (i > 0) {
            await sleep(OPTION_GAP_MS);
            if (cancelled) return;
          }
          setRevealed(i + 1);
          setReadingIdx(i);
          await narrationAudio.playAndWait(`${scenario.id}.opt.${i}`);
        }
      }
      if (!cancelled) {
        setReadingIdx(-1);
        setRevealed(cfg.choices);
        setPhase('live');
      }
    })();
    return () => {
      cancelled = true;
      cancelSleep?.();
      narrationAudio.stop();
    };
  }, [phase, scenario, cfg.choices]);

  // Decision timer — only ticks once every option is out.
  useEffect(() => {
    if (phase !== 'live') return;
    if (timeLeft <= 0) {
      onAnswer(scenario, false, cfg.timer * 1000); // time-out = wrong
      return;
    }
    const t = setTimeout(() => {
      if (timeLeft <= 5) sfx.tick();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, scenario, cfg.timer, onAnswer]);

  const onMcq = (i: number) => {
    if (!scenario.options) return;
    const opt = scenario.options[i];
    onAnswer(scenario, opt.correct, Date.now() - start.current, i);
  };

  const onTapTarget = (t: TapTarget) => {
    const tIdx = scenario.tapTargets?.indexOf(t) ?? -1;
    onAnswer(scenario, t.correct, Date.now() - start.current, undefined, tIdx);
  };

  const timerPct = Math.max(0, (timeLeft / cfg.timer) * 100);
  const urgent = phase === 'live' && timeLeft <= 5;
  const animating = phase === 'anim' && !!scenario.animation;

  return (
    <div className="blb-session">
      <div className="blb-session-bar">
        <button className="blb-back" onClick={onQuit}>
          ← Quit
        </button>
        <div className="blb-session-meta">
          <span className="blb-pip" style={{ color: cfg.cssVar }}>
            {cfg.label}
          </span>
          <span className="blb-pip">{scenario.zone.toUpperCase()}</span>
          <span className="blb-pip">
            {idx + 1}/{total}
          </span>
        </div>
        <div className={`blb-timer ${urgent ? 'urgent' : ''}`}>
          {phase === 'live' ? `${timeLeft}s` : '▶'}
        </div>
      </div>

      <div className="blb-timer-bar">
        <div
          className={`blb-timer-fill ${urgent ? 'urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="blb-rink-wrap">
        {animating ? (
          <>
            <AnimatedRink
              scenario={scenario}
              onDone={() => setPhase('reveal')}
            />
            <button className="blb-skip" onClick={() => setPhase('reveal')}>
              Skip ▸▸
            </button>
          </>
        ) : (
          <>
            <RinkDiagram
              scenario={scenario}
              onTap={scenario.kind === 'tap' ? onTapTarget : undefined}
            />
            {scenario.animation && (
              <button className="blb-replay" onClick={replay}>
                ↺ Replay
              </button>
            )}
          </>
        )}
      </div>

      <h2 className="blb-scenario-title">{scenario.title}</h2>
      {!animating && <p className="blb-scenario-setup">{scenario.setup}</p>}

      {scenario.kind === 'mcq' && scenario.options && !animating && (
        <div className="blb-options">
          {scenario.options.slice(0, cfg.choices).map((opt, i) => {
            const shown = phase === 'live' || i < revealed;
            return (
              <button
                key={i}
                className={`blb-option ${shown ? '' : 'pending'} ${
                  readingIdx === i ? 'reading' : ''
                }`}
                disabled={!shown}
                onClick={() => onMcq(i)}
              >
                <span className="blb-option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="blb-option-text">{opt.text}</span>
              </button>
            );
          })}
        </div>
      )}
      {scenario.kind === 'tap' && !animating && (
        <div className="blb-tap-hint">👆 Tap a spot on the ice</div>
      )}
    </div>
  );
}
