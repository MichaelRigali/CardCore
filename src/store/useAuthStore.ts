'use client';

import { useStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import { authStore, type AuthUser } from './auth.store';

export const useAuthUser = () => useStore(authStore, (s) => s.user);
export const useAuthEmail = () => useStore(authStore, (s) => s.user?.email ?? null);
export const useAuthDisplay = () => useStore(authStore, (s) => s.user?.displayName ?? null);
export const useAuthPhoto = () => useStore(authStore, (s) => s.user?.photoURL ?? null);

// If you need actions in some component:
export const useSetUser = () => useStore(authStore, s => s.setUser);
export const useClearUser = () => useStore(authStore, s => s.clearUser);

// (Optionally remove export of `useAuthActions` entirely to avoid misuse)

// Non-hook helpers for places that shouldn't subscribe
export const getAuthUser = () => authStore.getState().user;
export const setAuthUser = (u: AuthUser) => authStore.getState().setUser(u);
export const clearAuthUser = () => authStore.getState().clearUser();
