'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import TextDisplay from './TextDisplay';
import StatsBar from './StatsBar';
import ModeSelector from './ModeSelector';
import { TestMode, TestResultInsert } from '@/types';
import { getTimeBasedText, getRandomLongPassage } from '@/lib/textGenerator';

interface Props {
  initialMode?: TestMode;
  onComplete?: (result: TestResultInsert) => void;
}

export default function TypingEngine({ initialMode = 'time', onComplete }: Props) {
  const [mode, setMode] = useState<TestMode>(initialMode);
  const [duration, setDuration] = useState(30);
  const [textId, setTextId] = useState<string | null>(null);
  const [targetText, setTargetText] = useState(() => getTimeBasedText(30));
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep stable refs for mode/duration/textId so the completion effect
  // always reads the latest values without being in its dependency array.
  const modeRef = useRef(mode);
  const durationRef = useRef(duration);
  const textIdRef = useRef(textId);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { textIdRef.current = textId; }, [textId]);

  const engine = useTypingEngine(targetText, mode === 'time' ? duration : undefined);
  const { state, timeLeft, handleInput, getStats, reset } = engine;

  const stats = getStats();

  const loadNewText = useCallback((m: TestMode, d: number) => {
    if (m === 'time') {
      const text = getTimeBasedText(d);
      setTextId(null);
      setTargetText(text);
      reset(text);
    } else {
      const passage = getRandomLongPassage();
      setTextId(passage.id);
      setTargetText(passage.text);
      reset(passage.text);
    }
  }, [reset]);

  useEffect(() => {
    loadNewText(mode, duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeChange = (m: TestMode) => {
    setMode(m);
    loadNewText(m, duration);
  };

  const handleDurationChange = (d: number) => {
    setDuration(d);
    loadNewText('time', d);
  };

  const handleRestart = () => loadNewText(mode, duration);

  // Fire completion callback once the test finishes.
  // Read final stats directly from state to avoid stale closure on getStats().
  useEffect(() => {
    if (!state.isFinished || !onComplete) return;

    const elapsedMs = state.startTime && state.endTime
      ? state.endTime - state.startTime
      : 0;
    const elapsedSec = elapsedMs / 1000;
    const correctChars = state.input.length - state.errors;
    const wpm = elapsedMs > 0 ? Math.round((correctChars / 5) / (elapsedMs / 60000)) : 0;
    const rawWpm = elapsedMs > 0 ? Math.round((state.input.length / 5) / (elapsedMs / 60000)) : 0;
    const accuracy = state.input.length > 0
      ? Math.round((correctChars / state.input.length) * 1000) / 10
      : 100;

    onComplete({
      mode: modeRef.current,
      duration_setting: modeRef.current === 'time' ? durationRef.current : null,
      text_id: textIdRef.current,
      wpm,
      raw_wpm: rawWpm,
      accuracy,
      total_chars: state.input.length,
      correct_chars: correctChars,
      incorrect_chars: state.errors,
      time_taken: elapsedSec,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isFinished]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  const progressPercent =
    mode === 'long' && targetText.length > 0
      ? (state.input.length / targetText.length) * 100
      : undefined;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ModeSelector
        mode={mode}
        duration={duration}
        onModeChange={handleModeChange}
        onDurationChange={handleDurationChange}
        onRestart={handleRestart}
      />

      <StatsBar
        stats={stats}
        timeLeft={mode === 'time' ? timeLeft : undefined}
        mode={mode}
        progressPercent={progressPercent}
      />

      <div
        className="relative cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <TextDisplay targetText={targetText} charStatuses={state.charStatuses} />

        {/* Hidden input captures all keystrokes; text is rendered via TextDisplay */}
        <input
          ref={inputRef}
          type="text"
          value={state.input}
          onChange={(e) => handleInput(e.target.value)}
          disabled={state.isFinished}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="absolute inset-0 w-full h-full opacity-0 cursor-text"
          aria-label="Typing input"
        />

        {!state.startTime && !state.isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl pointer-events-none">
            <span className="text-slate-500 text-sm">Start typing to begin...</span>
          </div>
        )}
      </div>

      {state.isFinished && (
        <div className="mt-6 p-6 rounded-xl bg-brand-50 border border-brand-100 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Test Complete!</h3>
          <p className="text-slate-600 text-sm">
            {stats.wpm} WPM · {stats.accuracy}% accuracy · {stats.errors} errors
          </p>
        </div>
      )}
    </div>
  );
}
