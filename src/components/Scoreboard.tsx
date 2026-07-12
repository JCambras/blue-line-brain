import type { ModuleId, ModuleProgress } from '@/types';
import { ladderFor } from '@/data/levels';

interface ScoreboardProps {
  prog: ModuleProgress;
  moduleId: ModuleId;
  soundOn: boolean;
  onHome: () => void;
  onToggleSound: () => void;
}

export function Scoreboard({ prog, moduleId, soundOn, onHome, onToggleSound }: ScoreboardProps) {
  const level = ladderFor(moduleId).levels[prog.level];
  return (
    <header className="blb-scoreboard">
      <div className="blb-brand" onClick={onHome} role="button" tabIndex={0}>
        <span className="blb-brand-dot" />
        <span className="blb-brand-name">BLUE LINE BRAIN</span>
      </div>
      <div className="blb-stats">
        <Stat label="LVL" value={`${level.patch} ${level.name}`} />
        <Stat label="XP" value={prog.xp.toLocaleString()} />
        <Stat label="STREAK" value={`🔥 ${prog.streak}`} accent={prog.streak >= 3} />
        <Stat label="DAILY" value={`📅 ${prog.dailyStreakDays}d`} />
      </div>
      <button
        className="blb-mute"
        aria-label="toggle sound"
        onClick={onToggleSound}
      >
        {soundOn ? '🔊' : '🔇'}
      </button>
    </header>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`blb-stat ${accent ? 'blb-stat-accent' : ''}`}>
      <div className="blb-stat-label">{label}</div>
      <div className="blb-stat-value">{value}</div>
    </div>
  );
}
