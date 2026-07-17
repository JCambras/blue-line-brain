import { useMemo } from 'react';
import type { ModuleId, ModuleProgress, SaveState, SessionMode } from '@/types';
import { BADGES } from '@/data/badges';
import { MODULES, scenariosForModule, type AppModule } from '@/data/modules';
import { weakestCategory } from '@/lib/picker';
import { todayKey } from '@/lib/storage';

interface HomeScreenProps {
  state: SaveState;
  prog: ModuleProgress;
  activeModule: AppModule;
  setModule: (id: ModuleId) => void;
  startSession: (m: SessionMode) => void;
  openCoach: () => void;
  resetProgress: () => void;
}

/** Badges earned across any module (streak / daily grind), shown in both. */
const CROSS_MODULE_BADGES = new Set(['head_up_hero', 'daily_grinder']);

export function HomeScreen({
  state,
  prog,
  activeModule,
  setModule,
  startSession,
  openCoach,
  resetProgress,
}: HomeScreenProps) {
  const today = todayKey();
  const dailyDone = prog.dailyLastDone === today;
  const weakest = useMemo(
    () => weakestCategory(state, activeModule.sport),
    [state, activeModule.sport]
  );
  // Real Examples: moments from the player's own games. The section only shows
  // when the active module actually has some (hockey seeds them; lacrosse has
  // none, so it stays untouched). Adding a future example is a single data
  // entry - see src/data/scenarios/real-examples.ts.
  const realExamples = useMemo(
    () => scenariosForModule(activeModule.id).filter((s) => s.realGame),
    [activeModule.id]
  );
  // Show this module's badges plus the cross-cutting ones in either module.
  const visibleBadges = state.badges.filter((b) => {
    if (CROSS_MODULE_BADGES.has(b)) return true;
    return activeModule.sport === 'lacrosse' ? b.startsWith('lax_') : !b.startsWith('lax_');
  });

  return (
    <div className="blb-home">
      <section className="blb-modswitch">
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`blb-modbtn ${m.id === activeModule.id ? 'active' : ''}`}
            onClick={() => setModule(m.id)}
          >
            {m.switchLabel}
          </button>
        ))}
      </section>

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
          disabled={!prog.unlocked.varsity}
        >
          <span className="blb-cta-tag">BOSS BATTLE</span>
          <span className="blb-cta-title">10 questions · 8 to win</span>
          <span className="blb-cta-sub">
            {prog.unlocked.varsity ? 'Bring your A-game' : 'Unlock at 80% Rookie'}
          </span>
        </button>
      </section>

      <section className="blb-zones">
        <h2 className="blb-section-h">{activeModule.trackHeading}</h2>
        <div className="blb-zone-grid">
          {activeModule.tracks.map((t) => (
            <ZoneCard
              key={t.key}
              label={t.label}
              sub={t.sub}
              onClick={() => startSession(t.key)}
              accent={t.accent}
            />
          ))}
        </div>
      </section>

      {realExamples.length > 0 && (
        <section className="blb-real">
          <h2 className="blb-section-h">REAL EXAMPLES</h2>
          <button className="blb-real-card" onClick={() => startSession('real')}>
            <span className="blb-real-tag">📼 FROM YOUR OWN GAMES</span>
            <span className="blb-real-title">Learn from your game moments</span>
            <span className="blb-real-sub">
              {realExamples.length}{' '}
              {realExamples.length === 1 ? 'moment' : 'moments'} · this actually
              happened to you
            </span>
          </button>
        </section>
      )}

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
            {activeModule.cheatSheet.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="blb-side-card">
          <h3 className="blb-side-h">JERSEY PATCHES</h3>
          {visibleBadges.length === 0 ? (
            <div className="blb-side-body blb-muted">
              Earn badges by mastering categories.
            </div>
          ) : (
            <div className="blb-badges">
              {visibleBadges.map((b) => (
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
