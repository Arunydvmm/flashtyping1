import { TestResult } from '@/types';

export default function RecentTestsTable({ results }: { results: TestResult[] }) {
  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
        No tests yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Mode</th>
            <th className="px-4 py-3 text-right">WPM</th>
            <th className="px-4 py-3 text-right">Accuracy</th>
            <th className="px-4 py-3 text-right">Errors</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 capitalize">
                {r.mode === 'time' ? `${r.duration_setting}s` : 'Long format'}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-brand-600">{r.wpm}</td>
              <td className="px-4 py-3 text-right">{r.accuracy}%</td>
              <td className="px-4 py-3 text-right text-red-500">{r.incorrect_chars}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
