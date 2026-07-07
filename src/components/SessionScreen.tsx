import { useEffect, useRef, useState } from 'react';
import type { Scenario, TapTarget } from '@/types';
import { DIFFICULTY_CONFIG } from '@/data/scenarios';
import { sfx } from '@/lib/sfx';
import { RinkDiagram } from './RinkDiagram';

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

export function SessionScreen({
  scenario,
  idx,
  total,
  onAnswer,
  onQuit,
}: SessionScreenProps) {
  const cfg = DIFFICULTY_CONFIG[scenario.difficulty];
  const [timeLeft, setTimeLeft] = useState(cfg.timer);
  const start = useRef(Date.now());

  // Reset when scenario changes
  useEffect(() => {
    start.current = Date.now();
    setTimeLeft(cfg.timer);
  }, [scenario.id, cfg.timer]);

  // Tick down
  useEffect(() => {
    if (timeLeft <= 0) {
      onAnswer(scenario, false, cfg.timer * 1000); // time-out = wrong
      return;
    }
    const t = setTimeout(() => {
      if (timeLeft <= 5) sfx.tick();
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, scenario, cfg.timer, onAnswer]);

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
  const urgent = timeLeft <= 5;

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
        <div className={`blb-timer ${urgent ? 'urgent' : ''}`}>{timeLeft}s</div>
      </div>

      <div className="blb-timer-bar">
        <div
          className={`blb-timer-fill ${urgent ? 'urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="blb-rink-wrap">
        <RinkDiagram
          scenario={scenario}
          onTap={scenario.kind === 'tap' ? onTapTarget : undefined}
        />
      </div>

      <h2 className="blb-scenario-title">{scenario.title}</h2>
      <p className="blb-scenario-setup">{scenario.setup}</p>

      {scenario.kind === 'mcq' && scenario.options && (
        <div className="blb-options">
          {scenario.options.slice(0, cfg.choices).map((opt, i) => (
            <button key={i} className="blb-option" onClick={() => onMcq(i)}>
              <span className="blb-option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="blb-option-text">{opt.text}</span>
            </button>
          ))}
        </div>
      )}
      {scenario.kind === 'tap' && (
        <div className="blb-tap-hint">👆 Tap a spot on the ice</div>
      )}
    </div>
  );
}
