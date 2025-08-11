"use client";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(s => s.setUser);
  const setInitialized = useAuthStore(s => s.setInitialized);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setInitialized(true); // critical: remove infinite loading gates
    });
    return () => unsub();
  }, [setUser, setInitialized]);

  return <>{children}</>;
}
