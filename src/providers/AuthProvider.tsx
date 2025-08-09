'use client';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useEffect } from "react";
import { ensureUserDoc } from "@/firebase/authBootstrap";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await ensureUserDoc(u);
        setUser(u);
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [setUser]);

  return <>{children}</>;
}