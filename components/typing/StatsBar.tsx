'use client';

import { TypingStats } from '@/types';
import { formatTime } from '@/lib/typingUtils';

interface Props {
  stats: TypingStats;
  timeLeft?: number;
  mode: 'time' | 'long';
  progressPercent?: number; // for long-format mode
}

export default function StatsBar({ stats, timeLeft, mode, progressPercent }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
      <Stat label="WPM" value={stats.wpm} highlight />
      <Stat label="Accuracy" value={`${stats.accuracy}%`} />
      <Stat label="Errors" value={stats.errors} danger={stats.errors > 0} />

      {mode === 'time' && typeof timeLeft === 'number' && (
        <Stat label="Time Left" value={formatTime(timeLeft)} />
      )}

      {mode === 'long' && typeof progressPercent === 'number' && (
        <div className="flex flex-col items-center min-w-[120px]">
          <span className="text-xs uppercase tracking-wide text-slate-500">Progress</span>
          <div className="w-full h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col items-center min-w-[80px]">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span
        className={`text-2xl font-bold ${
          danger ? 'text-red-500' : highlight ? 'text-brand-600' : 'text-slate-800'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
