'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const initialized = useAuthStore(s => s.initialized);

  useEffect(() => {
    if (!initialized) return;
    if (!user) router.replace('/login');
  }, [initialized, user, router]);

  if (!initialized) return (
    <main className="p-6">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </main>
  );
  
  if (!user) return (
    <main className="p-6">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </main>
  );

  return <>{children}</>;
}