'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TypingEngine from '@/components/typing/TypingEngine';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TestMode, TestResultInsert } from '@/types';
import CertificateButtons from '@/components/certificate/CertificateButtons';

export default function TestPage({ params }: { params: { mode: string } }) {
  const initialMode: TestMode = params.mode === 'long' ? 'long' : 'time';
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [lastResult, setLastResult] = useState<TestResultInsert | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedResultId, setSavedResultId] = useState<string | null>(null);

  const handleComplete = async (result: TestResultInsert) => {
    setLastResult(result);

    if (!user) return; // guests can still see their stats, just not saved

    setSaveStatus('saving');
    const { data, error } = await supabase
      .from('test_results')
      .insert({ ...result, user_id: user.id })
      .select('id')
      .single();

    if (error) {
      setSaveStatus('error');
      return;
    }

    setSavedResultId(data.id);
    setSaveStatus('saved');
  };

  return (
    <div>
      <TypingEngine initialMode={initialMode} onComplete={handleComplete} />

      {lastResult && (
        <div className="mt-6 max-w-3xl mx-auto text-center">
          {!user && (
            <p className="text-sm text-slate-500 mb-3">
              <button
                onClick={() => router.push('/login')}
                className="text-brand-600 hover:underline"
              >
                Log in
              </button>{' '}
              to save this result and earn a certificate.
            </p>
          )}

          {user && saveStatus === 'saving' && (
            <p className="text-sm text-slate-500 mb-3">Saving result...</p>
          )}
          {user && saveStatus === 'error' && (
            <p className="text-sm text-red-500 mb-3">Could not save result. You can still download a certificate below.</p>
          )}

          {user && (saveStatus === 'saved' || saveStatus === 'error') && (
            <CertificateButtons
              userName={user.user_metadata?.full_name ?? user.email ?? 'Typist'}
              wpm={lastResult.wpm}
              accuracy={lastResult.accuracy}
              date={new Date().toLocaleDateString()}
              testResultId={savedResultId}
            />
          )}
        </div>
      )}
    </div>
  );
}
