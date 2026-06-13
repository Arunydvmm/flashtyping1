import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  getUserPerformanceHistory,
  getRecentTests,
  getUserSummaryStats,
} from '@/lib/supabase/queries';
import StatsSummary from '@/components/dashboard/StatsSummary';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RecentTestsTable from '@/components/dashboard/RecentTestsTable';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [history, recentTests, summary] = await Promise.all([
    getUserPerformanceHistory(supabase, user.id),
    getRecentTests(supabase, user.id, 10),
    getUserSummaryStats(supabase, user.id),
  ]);

  const chartData = history.map((row) => ({
    date: new Date(row.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    wpm: row.wpm,
    accuracy: row.accuracy,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Dashboard</h1>

      <StatsSummary stats={summary} />

      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Performance Trends</h2>
        <PerformanceChart data={chartData} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Recent Tests</h2>
        <RecentTestsTable results={recentTests} />
      </div>
    </div>
  );
}
