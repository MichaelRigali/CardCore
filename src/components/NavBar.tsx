'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold tracking-tight">
        CardCore
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/collection" className="hover:underline">
              Collection
            </Link>
            <Link href="/add-card" className="hover:underline">
              Add Card
            </Link>
            {/* Later: Add LogoutButton here */}
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
