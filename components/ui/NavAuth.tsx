'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NavAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Link href="/login" className="text-slate-600 hover:text-brand-600">
          Login
        </Link>
        <Link
          href="/register"
          className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
        >
          Sign Up
        </Link>
      </>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <Link href="/dashboard" className="text-slate-600 hover:text-brand-600">
        Dashboard
      </Link>
      <button onClick={handleLogout} className="text-slate-600 hover:text-red-500">
        Logout
      </button>
    </>
  );
}
