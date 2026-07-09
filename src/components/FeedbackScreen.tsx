import { useEffect } from 'react';
import type { Screen } from '@/types';
import { narrationAudio } from '@/lib/narrationAudio';
import { RinkDiagram } from './RinkDiagram';

interface FeedbackScreenProps {
  screen: Extract<Screen, { kind: 'feedback' }>;
  onNext: () => void;
}

export function FeedbackScreen({ screen, onNext }: FeedbackScreenProps) {
  const { scenario, correct, optionIdx, tapIdx } = screen;

  // Results beat: the coach speaks the verdict out loud - a rotating generic
  // opener, then this scenario's correct-answer + rationale clip - for both
  // right and wrong answers. Every clip is a pre-rendered coach-voice MP3 (keys
  // match scripts/narration-manifest.ts); missing audio just plays silent, and
  // narrationAudio's `enabled` gate honors the sound toggle. Cancels cleanly on
  // next/skip/quit/unmount so no line ever trails into the following screen.
  useEffect(() => {
    let cancelled = false;
    const opener = narrationAudio.nextFeedbackOpener(correct);
    void (async () => {
      await narrationAudio.playAndWait(opener);
      if (cancelled) return;
      await narrationAudio.playAndWait(`${scenario.id}.fb`);
    })();
    return () => {
      cancelled = true;
      narrationAudio.stop();
    };
  }, [scenario.id, correct]);
  const isMcq = scenario.kind === 'mcq';
  const opt = isMcq && optionIdx != null ? scenario.options![optionIdx] : null;
  const tap =
    !isMcq && tapIdx != null && tapIdx >= 0 ? scenario.tapTargets![tapIdx] : null;
  const correctOption = scenario.options?.find((o) => o.correct);
  const correctTap = scenario.tapTargets?.find((t) => t.correct);

  const verdictText = correct
    ? 'CORRECT'
    : optionIdx == null && tapIdx == null
      ? 'TIME'
      : 'NOT QUITE';

  return (
    <div className="blb-feedback">
      <div className={`blb-verdict ${correct ? 'good' : 'bad'}`}>
        <div className="blb-verdict-icon">{correct ? '✓' : '✗'}</div>
        <div className="blb-verdict-text">{verdictText}</div>
      </div>

      <div className="blb-rink-wrap blb-rink-feedback">
        <RinkDiagram
          scenario={scenario}
          tapResult={tap ? { targetIdx: tapIdx!, correct: tap.correct } : null}
        />
      </div>

      <div className="blb-feedback-body">
        {opt && (
          <>
            <div className="blb-feedback-line">
              <strong>You picked:</strong> {opt.text}
            </div>
            <div className="blb-feedback-explain">{opt.feedback}</div>
            {!correct && opt.trap && (
              <div className="blb-feedback-trap">💭 {opt.trap}</div>
            )}
            {!correct && correctOption && (
              <div className="blb-feedback-correct">
                <strong>Right read:</strong> {correctOption.text} —{' '}
                {correctOption.feedback}
              </div>
            )}
          </>
        )}
        {tap && (
          <>
            <div className="blb-feedback-line">
              <strong>You picked:</strong> {tap.label ?? 'that spot'}
            </div>
            <div className="blb-feedback-explain">{tap.feedback}</div>
            {!correct && correctTap && (
              <div className="blb-feedback-correct">
                <strong>Right spot:</strong> {correctTap.label ?? 'the highlighted area'} —{' '}
                {correctTap.feedback}
              </div>
            )}
          </>
        )}
        {!opt && !tap && (
          <div className="blb-feedback-explain">
            Time ran out. Speed is the skill — train the read until it's automatic.
            {correctOption && (
              <div style={{ marginTop: 8 }}>
                <strong>Right read:</strong> {correctOption.text}
              </div>
            )}
            {correctTap && (
              <div style={{ marginTop: 8 }}>
                <strong>Right spot:</strong> {correctTap.label}
              </div>
            )}
          </div>
        )}

        <div className="blb-coach-cue">
          <span className="blb-coach-tag">COACH</span>
          {scenario.coachCue}
        </div>
      </div>

      <button className="blb-next" onClick={onNext}>
        NEXT →
      </button>
    </div>
  );
}
