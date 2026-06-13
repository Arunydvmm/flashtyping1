export const dynamic = 'force-dynamic';

import Link from 'next/link';

// This page is shown if someone navigates directly to /test/result.
// Actual results are displayed inline on /test/[mode] after completing a test.
export default function ResultPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">No result to show</h1>
      <p className="text-slate-500 mb-8">
        Complete a typing test first to see your results.
      </p>
      <Link
        href="/test/time"
        className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
      >
        Start a Test
      </Link>
    </div>
  );
}
