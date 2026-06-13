'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CharStatus, TypingStats } from '@/types';
import { calculateWpm, calculateRawWpm, calculateAccuracy } from '@/lib/typingUtils';

interface TypingState {
  input: string;
  targetText: string;
  charStatuses: CharStatus[];
  startTime: number | null;
  endTime: number | null;
  errors: number;
  isFinished: boolean;
}

export function useTypingEngine(targetText: string, durationLimit?: number) {
  const [state, setState] = useState<TypingState>(() => ({
    input: '',
    targetText,
    charStatuses: new Array(targetText.length).fill('pending'),
    startTime: null,
    endTime: null,
    errors: 0,
    isFinished: false,
  }));

  const [timeLeft, setTimeLeft] = useState(durationLimit ?? 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic for time-based mode
  useEffect(() => {
    if (state.startTime && durationLimit && !state.isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState((s) => ({ ...s, isFinished: true, endTime: Date.now() }));
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.startTime, durationLimit, state.isFinished]);

  const finishTest = useCallback(() => {
    setState((prev) => {
      if (prev.isFinished) return prev;
      return { ...prev, isFinished: true, endTime: Date.now() };
    });
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  /**
   * CORE INPUT HANDLER
   * Compares each typed character against the target text and updates
   * per-character status (correct/incorrect/current) + running error count.
   */
  const handleInput = useCallback((value: string) => {
    setState((prev) => {
      if (prev.isFinished) return prev;

      // Start the timer on first keystroke
      const startTime = prev.startTime ?? Date.now();

      const newStatuses: CharStatus[] = new Array(prev.targetText.length).fill('pending');
      let errorCount = 0;

      for (let i = 0; i < prev.targetText.length; i++) {
        if (i < value.length) {
          if (value[i] === prev.targetText[i]) {
            newStatuses[i] = 'correct';
          } else {
            newStatuses[i] = 'incorrect';
            errorCount++;
          }
        } else if (i === value.length) {
          newStatuses[i] = 'current';
        }
      }

      // Long-format mode: finish automatically once full text is typed
      const reachedEnd = prev.targetText.length > 0 && value.length >= prev.targetText.length;

      return {
        ...prev,
        input: value,
        charStatuses: newStatuses,
        startTime,
        errors: errorCount,
        isFinished: reachedEnd || prev.isFinished,
        endTime: reachedEnd ? Date.now() : prev.endTime,
      };
    });
  }, []);

  /**
   * Live stats — recompute on demand (call from a render or effect)
   */
  const getStats = useCallback((): TypingStats => {
    const { input, startTime, endTime, errors } = state;
    const elapsedMs = startTime ? (endTime ?? Date.now()) - startTime : 0;
    const correctChars = input.length - errors;

    return {
      wpm: calculateWpm(correctChars, elapsedMs),
      rawWpm: calculateRawWpm(input.length, elapsedMs),
      accuracy: calculateAccuracy(correctChars, input.length),
      errors,
      correctChars,
      totalTyped: input.length,
      timeElapsed: elapsedMs / 1000,
    };
  }, [state]);

  const reset = useCallback((newText?: string) => {
    const text = newText ?? targetText;
    setState({
      input: '',
      targetText: text,
      charStatuses: new Array(text.length).fill('pending'),
      startTime: null,
      endTime: null,
      errors: 0,
      isFinished: false,
    });
    setTimeLeft(durationLimit ?? 0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [targetText, durationLimit]);

  return {
    state,
    timeLeft,
    handleInput,
    getStats,
    finishTest,
    reset,
  };
}
