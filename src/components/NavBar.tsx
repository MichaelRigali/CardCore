'use client';

import Link from 'next/link';
import { useAuthUser } from '@/store/useAuthStore';

export default function Navbar() {
  const user = useAuthUser();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold tracking-tight">CardCore</Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm opacity-90">{user.displayName || user.email || 'Signed in'}</span>
            <Link href="/logout" className="rounded bg-gray-700 px-3 py-1 text-sm">Sign Out</Link>
          </>
        ) : (
          <>
            <Link href="/login" className="rounded bg-indigo-600 px-3 py-1 text-sm">Login</Link>
            <Link href="/signup" className="rounded border border-white/20 px-3 py-1 text-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
