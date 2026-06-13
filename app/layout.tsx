import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import NavAuth from '@/components/ui/NavAuth';

export const metadata: Metadata = {
  title: 'TypeFast — Typing Test Platform',
  description: 'Test and improve your typing speed and accuracy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-brand-600">
              TypeFast
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/test/time" className="text-slate-600 hover:text-brand-600">
                Practice
              </Link>
              <NavAuth />
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
