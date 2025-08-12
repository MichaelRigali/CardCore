import { createStore } from 'zustand/vanilla';

export type AuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
} | null;

export type AuthState = {
  user: AuthUser;
  setUser: (u: AuthUser) => void;
  clearUser: () => void;
};

const makeStore = () =>
  createStore<AuthState>()((set) => ({
    user: null,
    setUser: (u) => set({ user: u }),
    clearUser: () => set({ user: null }),
  }));

// 🔒 Ensure a single store instance across HMR in dev
const g = globalThis as unknown as { __authStore?: ReturnType<typeof makeStore> };
export const authStore = g.__authStore ?? (g.__authStore = makeStore());
