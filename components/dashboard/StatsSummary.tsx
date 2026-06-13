import { UserSummaryStats } from '@/types';

export default function StatsSummary({ stats }: { stats: UserSummaryStats }) {
  const cards = [
    { label: 'Average WPM', value: stats.avgWpm },
    { label: 'Average Accuracy', value: `${stats.avgAccuracy}%` },
    { label: 'Total Hours Practiced', value: stats.totalHours },
    { label: 'Tests Completed', value: stats.totalTests },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.label} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{c.label}</p>
          <p className="text-2xl font-bold text-slate-800">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
