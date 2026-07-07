import { useMemo } from 'react';
import type { SaveState, SessionMode } from '@/types';
import { BADGES } from '@/data/badges';
import { weakestCategory } from '@/lib/picker';
import { todayKey } from '@/lib/storage';

interface HomeScreenProps {
  state: SaveState;
  startSession: (m: SessionMode) => void;
  openCoach: () => void;
  resetProgress: () => void;
}

export function HomeScreen({
  state,
  startSession,
  openCoach,
  resetProgress,
}: HomeScreenProps) {
  const today = todayKey();
  const dailyDone = state.dailyLastDone === today;
  const weakest = useMemo(() => weakestCategory(state), [state]);

  return (
    <div className="blb-home">
      <section className="blb-cta-row">
        <button
          className={`blb-cta blb-cta-primary ${dailyDone ? 'done' : ''}`}
          onClick={() => startSession('daily5')}
        >
          <span className="blb-cta-tag">DAILY 5</span>
          <span className="blb-cta-title">
            {dailyDone ? "Today's done ✓" : 'Three minutes. Five reps.'}
          </span>
          <span className="blb-cta-sub">
            {dailyDone ? 'Come back tomorrow' : 'Build the habit'}
          </span>
        </button>
        <button
          className="blb-cta blb-cta-boss"
          onClick={() => startSession('boss')}
          disabled={!state.unlocked.varsity}
        >
          <span className="blb-cta-tag">BOSS BATTLE</span>
          <span className="blb-cta-title">10 questions · 8 to win</span>
          <span className="blb-cta-sub">
            {state.unlocked.varsity ? 'Bring your A-game' : 'Unlock at 80% Rookie'}
          </span>
        </button>
      </section>

      <section className="blb-zones">
        <h2 className="blb-section-h">PICK A ZONE</h2>
        <div className="blb-zone-grid">
          <ZoneCard
            label="DEFENSIVE ZONE"
            sub="Retrieval · coverage · breakouts"
            onClick={() => startSession('defensive')}
            accent="#1f4ed8"
          />
          <ZoneCard
            label="NEUTRAL ZONE"
            sub="Gap · rush defense · transition"
            onClick={() => startSession('neutral')}
            accent="#6b21a8"
          />
          <ZoneCard
            label="OFFENSIVE ZONE"
            sub="Blue line · pinching · shots"
            onClick={() => startSession('offensive')}
            accent="#b91c1c"
          />
          <ZoneCard
            label="SKILLS LAB"
            sub="Hands · feet · stick details"
            onClick={() => startSession('skills')}
            accent="#0f766e"
          />
        </div>
      </section>

      <section className="blb-side-row">
        <div className="blb-side-card">
          <h3 className="blb-side-h">PRACTICE WEAKEST</h3>
          {weakest ? (
            <>
              <div className="blb-side-body">
                Your softest category: <strong>{weakest}</strong>
              </div>
              <button
                className="blb-side-btn"
                onClick={() => startSession('weakest')}
              >
                Drill it
              </button>
            </>
          ) : (
            <div className="blb-side-body blb-muted">
              Play a few sessions and we'll find your weak spot.
            </div>
          )}
        </div>

        <div className="blb-side-card">
          <h3 className="blb-side-h">GAME DAY CHEAT SHEET</h3>
          <ul className="blb-cheat">
            <li>Scan before you touch.</li>
            <li>Protect the house.</li>
            <li>Hard tape passes.</li>
            <li>Move after you pass.</li>
            <li>Head up at the blue line.</li>
          </ul>
        </div>

        <div className="blb-side-card">
          <h3 className="blb-side-h">JERSEY PATCHES</h3>
          {state.badges.length === 0 ? (
            <div className="blb-side-body blb-muted">
              Earn badges by mastering categories.
            </div>
          ) : (
            <div className="blb-badges">
              {state.badges.map((b) => (
                <div key={b} className="blb-badge" title={BADGES[b]?.desc}>
                  <span className="blb-badge-icon">{BADGES[b]?.icon}</span>
                  <span className="blb-badge-name">{BADGES[b]?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="blb-foot-row">
        <button className="blb-text-btn" onClick={openCoach}>
          🎓 Coach Mode
        </button>
        <button className="blb-text-btn blb-danger" onClick={resetProgress}>
          ↻ Reset progress
        </button>
      </section>
    </div>
  );
}

function ZoneCard({
  label,
  sub,
  accent,
  onClick,
}: {
  label: string;
  sub: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      className="blb-zone-card"
      onClick={onClick}
      style={{ ['--accent' as string]: accent } as React.CSSProperties}
    >
      <div className="blb-zone-bar" />
      <div className="blb-zone-label">{label}</div>
      <div className="blb-zone-sub">{sub}</div>
    </button>
  );
}
