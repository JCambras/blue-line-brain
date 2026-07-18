import { useCallback, useEffect, useState } from 'react';
import type {
  SaveState,
  Screen,
  SessionMode,
  SessionResult,
  Scenario,
  LevelKey,
  ModuleId,
} from '@/types';
import { SCENARIOS } from '@/data/scenarios';
import { moduleById, sportOf } from '@/data/modules';
import { levelFromXP } from '@/data/levels';
import {
  loadState,
  saveState,
  clearState,
  defaultState,
  todayKey,
  yesterdayKey,
} from '@/lib/storage';
import { pickScenarios, weakestCategory, accuracyForDifficulty } from '@/lib/picker';
import { sfx } from '@/lib/sfx';
import { narrationAudio } from '@/lib/narrationAudio';

import { Scoreboard } from '@/components/Scoreboard';
import { ProgressStrip } from '@/components/ProgressStrip';
import { HomeScreen } from '@/components/HomeScreen';
import { SessionScreen } from '@/components/SessionScreen';
import { FeedbackScreen } from '@/components/FeedbackScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { CoachMode } from '@/components/CoachMode';
import { Onboard } from '@/components/Onboard';

export default function App() {
  const [state, setState] = useState<SaveState>(() => loadState());
  const [screen, setScreen] = useState<Screen>({ kind: 'home' });
  const [showOnboard, setShowOnboard] = useState(false);
  const [moduleId, setModuleId] = useState<ModuleId>(state.activeModule);
  const activeModule = moduleById(moduleId);
  const prog = state.perModule[moduleId];

  // Deliver new deploys on the next visit. The PWA registers with
  // `autoUpdate`, so a new service worker skips waiting and claims this page as
  // soon as it activates - but the already-loaded shell (JS/CSS/HTML) stays in
  // memory until a reload, which is why returning users (especially installed
  // iOS home-screen PWAs) can sit a version behind for a long time. Reload once
  // when control passes to a new worker so the fresh shell is picked up
  // automatically - no "tap to refresh" a young kid would ignore. Two guards:
  // on a page that loaded uncontrolled, skip only the very first
  // controllerchange (the initial SW claim on a first install - a deploy
  // activating later in that same session still reloads), and a one-shot
  // flag so we reload at most once per page (no reload loop). The update check
  // runs at load, so this usually lands at startup - but controllerchange can
  // also fire mid-session on a long-lived page (the browser's own SW re-check,
  // or a deploy activating while the app is open), which drops the in-flight
  // run. Accepted tradeoff: durable progress lives in localStorage; only the
  // transient run screen is React state.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let wasControlled = !!navigator.serviceWorker.controller;
    let reloading = false;
    const onControllerChange = () => {
      if (!wasControlled) {
        wasControlled = true;
        return;
      }
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  // Prefetch the coach-voice audio manifest once at startup, and prime the
  // audio pool on the first user gesture. Narration starts from timers/effects,
  // never synchronously inside a click, so without this priming the browser's
  // autoplay policy (strict on iOS/Safari) would block every clip and the app
  // would be silent. The listeners fire inside the real gesture, which is what
  // unlocks the elements; `unlock()` is idempotent so the first one wins.
  useEffect(() => {
    narrationAudio.init();
    const unlock = () => narrationAudio.unlock();
    const opts = { capture: true } as const;
    const events = ['pointerdown', 'touchstart', 'keydown'] as const;
    for (const ev of events) window.addEventListener(ev, unlock, opts);
    return () => {
      for (const ev of events) window.removeEventListener(ev, unlock, opts);
    };
  }, []);

  // Persist state
  useEffect(() => {
    saveState(state);
    sfx.enabled = state.soundOn;
    narrationAudio.enabled = state.soundOn;
    // Toggling sound off mid-play must cut narration immediately.
    if (!state.soundOn) narrationAudio.stop();
  }, [state]);

  // Persist the active module so the app reopens where the player left off.
  useEffect(() => {
    setState((s) => (s.activeModule === moduleId ? s : { ...s, activeModule: moduleId }));
  }, [moduleId]);

  // First-run onboarding
  useEffect(() => {
    if (Object.keys(state.scenarioStats).length === 0) {
      setShowOnboard(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = useCallback(
    (mode: SessionMode) => {
      // Every mode is scoped to the active sport so hockey and lacrosse never
      // bleed into each other's Daily 5, Boss, or weakest-spot drills.
      const sport = activeModule.sport;
      const unlocked = state.perModule[moduleId].unlocked;
      // Real Examples are their own opt-in section, so keep them out of every
      // generic pool (Daily 5, Boss, Weakest, zone tracks) - the `real` mode
      // below is the only way in.
      const inSport = (s: Scenario) => sportOf(s) === sport && !s.realGame;
      let scenarios: Scenario[] = [];
      if (mode === 'daily5') {
        scenarios = pickScenarios(state, 5, inSport, unlocked);
      } else if (mode === 'boss') {
        scenarios = pickScenarios(state, 10, inSport, unlocked);
      } else if (mode === 'weakest') {
        const cat = weakestCategory(state, sport);
        scenarios = pickScenarios(
          state,
          5,
          (s) => inSport(s) && (cat ? s.category === cat : true),
          unlocked
        );
      } else if (mode === 'real') {
        // Personal coaching moments from the player's own games - always
        // reviewable, never gated behind difficulty unlocks.
        scenarios = pickScenarios(
          state,
          5,
          (s) => sportOf(s) === sport && !!s.realGame,
          { varsity: true, elite: true }
        );
      } else {
        scenarios = pickScenarios(state, 5, (s) => inSport(s) && s.zone === mode, unlocked);
      }
      if (scenarios.length === 0) {
        alert('No scenarios available yet for this mode. Try Daily 5.');
        return;
      }
      setScreen({ kind: 'session', mode, scenarios, idx: 0, results: [] });
    },
    [state, activeModule.sport, moduleId]
  );

  const handleAnswer = useCallback(
    (
      scenario: Scenario,
      correct: boolean,
      timeMs: number,
      optionIdx?: number,
      tapIdx?: number
    ) => {
      if (correct) sfx.correct();
      else sfx.wrong();

      if (screen.kind !== 'session') return;
      const newResults = [...screen.results, { scenarioId: scenario.id, correct, timeMs }];
      setScreen({
        kind: 'feedback',
        scenario,
        correct,
        optionIdx,
        tapIdx,
        timeMs,
        results: newResults,
        session: { mode: screen.mode, scenarios: screen.scenarios, idx: screen.idx },
      });
    },
    [screen]
  );

  const advanceFromFeedback = useCallback(() => {
    if (screen.kind !== 'feedback') return;
    const { session, results } = screen;
    const nextIdx = session.idx + 1;
    if (nextIdx >= session.scenarios.length) {
      finishSession(session.mode, results);
      return;
    }
    setScreen({
      kind: 'session',
      mode: session.mode,
      scenarios: session.scenarios,
      idx: nextIdx,
      results,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const finishSession = useCallback((mode: SessionMode, results: SessionResult[]) => {
    setState((prev) => {
      const next: SaveState = JSON.parse(JSON.stringify(prev));
      // Progress belongs to the module the session drew from, not necessarily
      // whatever is active now. The run is sport-scoped, so the first scenario
      // decides it.
      const firstSc = SCENARIOS.find((x) => x.id === results[0]?.scenarioId);
      const runModuleId: ModuleId =
        firstSc && sportOf(firstSc) === 'lacrosse' ? 'lacrosse' : 'hockey';
      const runSport = runModuleId;
      const mp = next.perModule[runModuleId];
      let xpEarned = 0;
      let runStreak = mp.streak;
      const newBadges: string[] = [];

      results.forEach((r) => {
        const cur = next.scenarioStats[r.scenarioId] ?? {
          attempts: 0,
          correct: 0,
          lastSeen: 0,
          confidence: 0,
        };
        cur.attempts += 1;
        cur.lastSeen = Date.now();

        if (r.correct) {
          cur.correct += 1;
          cur.confidence = Math.min(5, cur.confidence + 1);
          xpEarned += 10;
          if (r.timeMs < 6000) xpEarned += 5; // fast bonus
          runStreak += 1;
          if (runStreak > 0 && runStreak % 3 === 0) xpEarned += 10; // streak 3 bonus
          if (runStreak >= 10 && !next.badges.includes('head_up_hero')) {
            next.badges.push('head_up_hero');
            newBadges.push('head_up_hero');
          }
        } else {
          cur.confidence = Math.max(0, cur.confidence - 1);
          runStreak = 0;
        }
        next.scenarioStats[r.scenarioId] = cur;

        // Category-based badges (only on correct)
        const sc = SCENARIOS.find((x) => x.id === r.scenarioId);
        if (sc && r.correct && sportOf(sc) === 'hockey') {
          if (sc.category === 'retrieval' && !next.badges.includes('retrieval_radar')) {
            next.badges.push('retrieval_radar');
            newBadges.push('retrieval_radar');
          }
          if (sc.id === 'net-front' && !next.badges.includes('net_front_guard')) {
            next.badges.push('net_front_guard');
            newBadges.push('net_front_guard');
          }
          if (sc.category === 'gap' && !next.badges.includes('gap_master')) {
            next.badges.push('gap_master');
            newBadges.push('gap_master');
          }
          if (sc.category === 'breakout' && !next.badges.includes('tape_to_tape')) {
            next.badges.push('tape_to_tape');
            newBadges.push('tape_to_tape');
          }
        }

        // Lacrosse category badges (only on correct)
        if (sc && r.correct && sportOf(sc) === 'lacrosse') {
          const laxBadge: Record<string, string> = {
            dodge: 'lax_dodger',
            feed: 'lax_feeder',
            offball: 'lax_ghost',
            shot: 'lax_sniper',
            ride: 'lax_ride_or_die',
          };
          const badge = laxBadge[sc.category];
          if (badge && !next.badges.includes(badge)) {
            next.badges.push(badge);
            newBadges.push(badge);
          }
        }
      });

      mp.streak = runStreak;
      mp.bestStreak = Math.max(mp.bestStreak, runStreak);
      mp.xp += xpEarned;

      // Difficulty unlocks (scoped to this module's own scenarios)
      if (!mp.unlocked.varsity && accuracyForDifficulty(next, 'rookie', runSport) >= 0.8) {
        mp.unlocked.varsity = true;
      }
      if (!mp.unlocked.elite && accuracyForDifficulty(next, 'varsity', runSport) >= 0.8) {
        mp.unlocked.elite = true;
      }

      // Boss battle badge (sport-aware: lacrosse boss awards lax_boss)
      if (mode === 'boss') {
        const correctCount = results.filter((r) => r.correct).length;
        if (correctCount >= 8) {
          const bossBadge = runModuleId === 'lacrosse' ? 'lax_boss' : 'blue_line_boss';
          if (!next.badges.includes(bossBadge)) {
            next.badges.push(bossBadge);
            newBadges.push(bossBadge);
          }
        }
      }

      // Daily streak (per module)
      if (mode === 'daily5') {
        const today = todayKey();
        if (mp.dailyLastDone !== today) {
          mp.dailyStreakDays = mp.dailyLastDone === yesterdayKey() ? mp.dailyStreakDays + 1 : 1;
          mp.dailyLastDone = today;
          if (mp.dailyStreakDays >= 5 && !next.badges.includes('daily_grinder')) {
            next.badges.push('daily_grinder');
            newBadges.push('daily_grinder');
          }
        }
      }

      // Level up?
      const oldLevel = mp.level;
      const newLevel: LevelKey = levelFromXP(mp.xp, runModuleId);
      mp.level = newLevel;
      const leveledUp = newLevel !== oldLevel ? newLevel : null;

      if (leveledUp) sfx.levelup();
      if (newBadges.length > 0) sfx.badge();

      setScreen({ kind: 'results', mode, results, xpEarned, newBadges, leveledUp });
      return next;
    });
  }, []);

  const resetProgress = () => {
    if (confirm('Wipe all progress?')) {
      clearState();
      setState({ ...defaultState(), soundOn: state.soundOn });
      setModuleId('hockey');
      setScreen({ kind: 'home' });
    }
  };

  return (
    <div className="blb-root">
      <Scoreboard
        prog={prog}
        moduleId={moduleId}
        soundOn={state.soundOn}
        onHome={() => setScreen({ kind: 'home' })}
        onToggleSound={() => setState((s) => ({ ...s, soundOn: !s.soundOn }))}
      />
      <ProgressStrip xp={prog.xp} moduleId={moduleId} />

      <main className="blb-main">
        {screen.kind === 'home' && (
          <HomeScreen
            state={state}
            prog={prog}
            activeModule={activeModule}
            setModule={setModuleId}
            startSession={startSession}
            openCoach={() => setScreen({ kind: 'coach' })}
            resetProgress={resetProgress}
          />
        )}
        {screen.kind === 'session' && (
          <SessionScreen
            scenario={screen.scenarios[screen.idx]}
            idx={screen.idx}
            total={screen.scenarios.length}
            onAnswer={handleAnswer}
            onQuit={() => setScreen({ kind: 'home' })}
          />
        )}
        {screen.kind === 'feedback' && (
          <FeedbackScreen screen={screen} onNext={advanceFromFeedback} />
        )}
        {screen.kind === 'results' && (
          <ResultsScreen
            screen={screen}
            moduleId={moduleId}
            onHome={() => setScreen({ kind: 'home' })}
          />
        )}
        {screen.kind === 'coach' && (
          <CoachMode sport={activeModule.sport} onClose={() => setScreen({ kind: 'home' })} />
        )}
      </main>

      {showOnboard && (
        <Onboard sport={activeModule.sport} onClose={() => setShowOnboard(false)} />
      )}
    </div>
  );
}
