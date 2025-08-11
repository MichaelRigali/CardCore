import { create } from 'zustand';
import type { User } from 'firebase/auth';

type AuthState = {
  user: User | null;
  initialized: boolean;
  setUser: (u: User | null) => void;
  setInitialized: (v: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (u) => set({ user: u }),
  setInitialized: (v) => set({ initialized: v }),
  clearUser: () => set({ user: null }),
}));
