import type { ModuleId, Screen } from '@/types';
import { ladderFor } from '@/data/levels';
import { BADGES } from '@/data/badges';
import { SCENARIOS } from '@/data/scenarios';

interface ResultsScreenProps {
  screen: Extract<Screen, { kind: 'results' }>;
  moduleId: ModuleId;
  onHome: () => void;
}

export function ResultsScreen({ screen, moduleId, onHome }: ResultsScreenProps) {
  const levels = ladderFor(moduleId).levels;
  const { results, xpEarned, newBadges, leveledUp, mode } = screen;
  const correctCount = results.filter((r) => r.correct).length;
  const acc = Math.round((correctCount / results.length) * 100);
  const avgTime = (
    results.reduce((a, r) => a + r.timeMs, 0) / results.length / 1000
  ).toFixed(1);

  // Pick a takeaway: prefer a missed scenario's coach cue
  const wrongRes = results.find((r) => !r.correct);
  const sampleId = wrongRes?.scenarioId ?? results[0].scenarioId;
  const takeaway =
    SCENARIOS.find((s) => s.id === sampleId)?.coachCue ??
    'Scan early. Move feet. Stick first.';

  const bossWin = mode === 'boss' && correctCount >= 8;

  return (
    <div className="blb-results">
      <h1 className="blb-results-h">
        {bossWin ? '🏆 BOSS BEATEN' : mode === 'boss' ? 'BOSS HELD' : 'SHIFT COMPLETE'}
      </h1>

      <div className="blb-results-stats">
        <div className="blb-rstat">
          <div className="blb-rstat-v">+{xpEarned}</div>
          <div className="blb-rstat-l">XP EARNED</div>
        </div>
        <div className="blb-rstat">
          <div className="blb-rstat-v">{acc}%</div>
          <div className="blb-rstat-l">ACCURACY</div>
        </div>
        <div className="blb-rstat">
          <div className="blb-rstat-v">{avgTime}s</div>
          <div className="blb-rstat-l">AVG TIME</div>
        </div>
      </div>

      {leveledUp && (
        <div className="blb-levelup">
          <div className="blb-levelup-tag">CALLED UP</div>
          <div className="blb-levelup-name">
            {levels[leveledUp].patch} {levels[leveledUp].name}
          </div>
        </div>
      )}

      {newBadges.length > 0 && (
        <div className="blb-newbadges">
          <div className="blb-newbadges-h">NEW PATCHES</div>
          {newBadges.map((b) => (
            <div key={b} className="blb-newbadge">
              <span style={{ fontSize: 24 }}>{BADGES[b]?.icon}</span>
              <div>
                <div className="blb-newbadge-name">{BADGES[b]?.name}</div>
                <div className="blb-newbadge-desc">{BADGES[b]?.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="blb-takeaway">
        <div className="blb-takeaway-tag">REMEMBER NEXT GAME</div>
        <div className="blb-takeaway-text">"{takeaway}"</div>
      </div>

      <button className="blb-next" onClick={onHome}>
        BACK TO LOCKER ROOM
      </button>
    </div>
  );
}
