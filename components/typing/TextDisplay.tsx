'use client';

import { useEffect, useRef } from 'react';
import { CharStatus } from '@/types';

interface Props {
  targetText: string;
  charStatuses: CharStatus[];
}

export default function TextDisplay({ targetText, charStatuses }: Props) {
  const currentRef = useRef<HTMLSpanElement>(null);

  // Smooth auto-scroll: keep the current character centered for long texts
  useEffect(() => {
    currentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [charStatuses]);

  return (
    <div className="font-mono text-xl md:text-2xl leading-relaxed tracking-wide max-h-56 overflow-y-auto p-6 rounded-xl bg-slate-50 border border-slate-200 select-none">
      {targetText.split('').map((char, idx) => {
        const status = charStatuses[idx];
        let className = 'text-slate-400'; // pending

        if (status === 'correct') className = 'text-green-600';
        else if (status === 'incorrect') className = 'text-red-500 bg-red-100 rounded-sm';

        const isCurrent = status === 'current';

        return (
          <span
            key={idx}
            ref={isCurrent ? currentRef : null}
            className={`relative ${className}`}
          >
            {isCurrent && (
              <span className="absolute -left-0.5 top-0 w-0.5 h-[1.2em] bg-brand-600 animate-pulse" />
            )}
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
