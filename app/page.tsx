import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">
        Test your typing speed. Track your progress.
      </h1>
      <p className="text-slate-500 max-w-xl mx-auto mb-8">
        Take a quick 15/30/60 second test or work through a full passage,
        then earn a certificate and watch your stats improve over time.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/test/time"
          className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
        >
          Start Typing Test
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
