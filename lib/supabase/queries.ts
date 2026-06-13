import { SupabaseClient } from '@supabase/supabase-js';
import { TestResult, UserSummaryStats } from '@/types';

export async function getUserPerformanceHistory(
  supabase: SupabaseClient,
  userId: string,
  limit = 50
) {
  const { data, error } = await supabase
    .from('test_results')
    .select('created_at, wpm, accuracy')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getRecentTests(
  supabase: SupabaseClient,
  userId: string,
  limit = 10
): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as TestResult[];
}

export async function getUserSummaryStats(
  supabase: SupabaseClient,
  userId: string
): Promise<UserSummaryStats> {
  const { data, error } = await supabase
    .from('test_results')
    .select('wpm, accuracy, time_taken')
    .eq('user_id', userId);

  if (error) throw error;

  const rows = data ?? [];
  const totalTests = rows.length;
  const avgWpm = rows.reduce((sum, r) => sum + r.wpm, 0) / (totalTests || 1);
  const avgAccuracy = rows.reduce((sum, r) => sum + r.accuracy, 0) / (totalTests || 1);
  const totalHours = rows.reduce((sum, r) => sum + r.time_taken, 0) / 3600;

  return {
    avgWpm: totalTests ? Math.round(avgWpm) : 0,
    avgAccuracy: totalTests ? Math.round(avgAccuracy * 10) / 10 : 0,
    totalHours: Math.round(totalHours * 10) / 10,
    totalTests,
  };
}
