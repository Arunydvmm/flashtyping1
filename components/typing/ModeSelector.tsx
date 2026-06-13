'use client';

import { TestMode } from '@/types';

interface Props {
  mode: TestMode;
  duration: number;
  onModeChange: (mode: TestMode) => void;
  onDurationChange: (duration: number) => void;
  onRestart: () => void;
}

const DURATIONS = [15, 30, 60];

export default function ModeSelector({
  mode,
  duration,
  onModeChange,
  onDurationChange,
  onRestart,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex rounded-lg overflow-hidden border border-slate-200">
        <button
          onClick={() => onModeChange('time')}
          className={`px-4 py-2 text-sm font-medium ${
            mode === 'time' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'
          }`}
        >
          Time-based
        </button>
        <button
          onClick={() => onModeChange('long')}
          className={`px-4 py-2 text-sm font-medium ${
            mode === 'long' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'
          }`}
        >
          Long Format
        </button>
      </div>

      {mode === 'time' && (
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => onDurationChange(d)}
              className={`px-3 py-2 text-sm font-medium ${
                duration === d ? 'bg-brand-100 text-brand-700' : 'bg-white text-slate-600'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onRestart}
        className="ml-auto px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
      >
        ↻ Restart
      </button>
    </div>
  );
}
