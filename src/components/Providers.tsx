'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { authStore } from '@/store/auth.store';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      const curr = authStore.getState().user;
      const next = fbUser
        ? { uid: fbUser.uid, email: fbUser.email ?? null, displayName: fbUser.displayName ?? null, photoURL: fbUser.photoURL ?? null }
        : null;
      // Only set when different to avoid churn
      if (
        (curr === null && next !== null) ||
        (curr !== null && next === null) ||
        (curr && next && (curr.uid !== next.uid || curr.email !== next.email || curr.displayName !== next.displayName || curr.photoURL !== next.photoURL))
      ) {
        authStore.setState({ user: next });
      }
    });
    return () => unsub();
  }, []);

  return <>{children}</>;
}
