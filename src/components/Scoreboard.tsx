import type { SaveState } from '@/types';
import { LEVELS } from '@/data/levels';

interface ScoreboardProps {
  state: SaveState;
  onHome: () => void;
  onToggleSound: () => void;
}

export function Scoreboard({ state, onHome, onToggleSound }: ScoreboardProps) {
  return (
    <header className="blb-scoreboard">
      <div className="blb-brand" onClick={onHome} role="button" tabIndex={0}>
        <span className="blb-brand-dot" />
        <span className="blb-brand-name">BLUE LINE BRAIN</span>
      </div>
      <div className="blb-stats">
        <Stat
          label="LVL"
          value={`${LEVELS[state.level].patch} ${LEVELS[state.level].name}`}
        />
        <Stat label="XP" value={state.xp.toLocaleString()} />
        <Stat label="STREAK" value={`🔥 ${state.streak}`} accent={state.streak >= 3} />
        <Stat label="DAILY" value={`📅 ${state.dailyStreakDays}d`} />
      </div>
      <button
        className="blb-mute"
        aria-label="toggle sound"
        onClick={onToggleSound}
      >
        {state.soundOn ? '🔊' : '🔇'}
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
