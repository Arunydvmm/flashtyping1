'use client';

import { useState } from 'react';
import { downloadCertificate } from './CertificateGenerator';

interface Props {
  userName: string;
  wpm: number;
  accuracy: number;
  date: string;
  testResultId: string | null;
}

export default function CertificateButtons({ userName, wpm, accuracy, date, testResultId }: Props) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  const handleDownload = () => {
    downloadCertificate({ userName, wpm, accuracy, date });
  };

  const handleEmail = async () => {
    if (!testResultId) return;
    setEmailStatus('sending');
    setEmailMessage(null);

    try {
      const res = await fetch('/api/send-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testResultId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailStatus('error');
        setEmailMessage(data.error ?? 'Failed to send email.');
        return;
      }

      setEmailStatus('sent');
      setEmailMessage('Certificate emailed!');
    } catch {
      setEmailStatus('error');
      setEmailMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handleDownload}
          className="px-5 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
        >
          Download Certificate
        </button>
        <button
          onClick={handleEmail}
          disabled={!testResultId || emailStatus === 'sending' || emailStatus === 'sent'}
          className="px-5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'sent' ? 'Sent ✓' : 'Email Certificate'}
        </button>
      </div>
      {emailMessage && (
        <p className={`text-sm ${emailStatus === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {emailMessage}
        </p>
      )}
    </div>
  );
}
