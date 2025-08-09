'use client';

import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';

export default function NavBar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold tracking-tight">
        CardCore
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/collection" className="hover:underline">
              Collection
            </Link>
            <Link href="/collection/new" className="hover:underline">
              Add Card
            </Link>
            <button
              onClick={() => signOut(getAuth())}
              className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600"
              aria-label="Log out"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
