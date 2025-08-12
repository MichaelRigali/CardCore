'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useAuthStore } from '@/store/authStore';
import { ensureUserDoc } from '@/firebase/postAuth';
import { authErrorMessage } from '@/utils/authErrors';
import { googleSignInWithPopupThenRedirectFallback, googleHandleRedirectResult } from '@/firebase/googleSignIn';
import { GoogleButton } from '@/components/GoogleButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);

  // Handle Google redirect result on mount
  useEffect(() => {
    (async () => {
      const cred = await googleHandleRedirectResult();
      if (cred?.user) {
        await ensureUserDoc(cred.user);
        setUser(cred.user);
        router.push('/collection');
      }
    })();
  }, [setUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    console.log('[login] Starting login process...');

    try {
      console.log('[login] Signing in with Firebase Auth...');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('[login] Firebase Auth success, user signed in:', cred.user.uid);
      
      // Set user in Zustand store immediately after successful auth
      console.log('[login] Setting user in Zustand store...');
      setUser(cred.user);
      
      // Try to create Firestore doc, but don't let it block navigation
      console.log('[login] Calling ensureUserDoc (non-blocking)...');
      ensureUserDoc(cred.user).catch((e) => {
        console.warn('[login] ensureUserDoc failed, but continuing:', e);
      });
      
      console.log('[login] Success! Navigating to /collection');
      router.push('/collection');
    } catch (err: unknown) {
      const error = err as { code?: string };
      console.error('[login] Login failed:', err);
      setError(authErrorMessage(error?.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    console.log('[login] Starting Google sign-in process...');

    try {
      const cred = await googleSignInWithPopupThenRedirectFallback();
      if (cred?.user) {
        console.log('[login] Google sign-in success, user signed in:', cred.user.uid);
        
        // Set user in Zustand store immediately after successful auth
        console.log('[login] Setting user in Zustand store...');
        setUser(cred.user);
        
        // Try to create Firestore doc, but don't let it block navigation
        console.log('[login] Calling ensureUserDoc (non-blocking)...');
        ensureUserDoc(cred.user).catch((e) => {
          console.warn('[login] ensureUserDoc failed, but continuing:', e);
        });
        
        console.log('[login] Success! Navigating to /collection');
        router.push('/collection');
      }
      // else redirect flow will handle itself
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('[login] Google sign-in failed, detailed error:', {
        code: error?.code,
        message: error?.message,
        fullError: err
      });
      setError(authErrorMessage(error?.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-gray-600 mt-2">Welcome back to CardCore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div 
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || googleLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <GoogleButton
          onClick={handleGoogleSignIn}
          loading={googleLoading}
          disabled={isSubmitting}
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
