'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/store/useAuthStore';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthUser();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);
  
  if (!user) return (
    <main className="p-6">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </main>
  );

  return <>{children}</>;
}