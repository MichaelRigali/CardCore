'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useAuthUser } from '@/store/useAuthStore';
import { ensureUserDoc } from '@/firebase/postAuth';
import { testFirebaseAuth } from '@/utils/firebaseTest';
import { authErrorMessage } from '@/utils/authErrors';
import { googleSignInWithPopupThenRedirectFallback, googleHandleRedirectResult } from '@/firebase/googleSignIn';
import { GoogleButton } from '@/components/GoogleButton';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const user = useAuthUser();

  // Redirect if already signed in (effect, not render)
  useEffect(() => {
    if (user) router.replace('/collection');
  }, [user, router]);

  // Test Firebase connectivity on mount
  useEffect(() => {
    testFirebaseAuth();
    
    // Debug environment variables
    console.log('[register] Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }, []);

  // Handle Google redirect result on mount
  useEffect(() => {
    (async () => {
      const cred = await googleHandleRedirectResult();
      if (cred?.user) {
        await ensureUserDoc(cred.user);
        // Providers will update the store; no setUser here
        router.push('/collection');
      }
    })();
  }, [router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log('[register] Starting registration process...');

    try {
      console.log('[register] Creating user with Firebase Auth...');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[register] Firebase Auth success, user created:', cred.user.uid);
      
      // Providers will update the store; no setUser here
      
      // Try to create Firestore doc, but don't let it block navigation
      console.log('[register] Calling ensureUserDoc (non-blocking)...');
      ensureUserDoc(cred.user).catch((e) => {
        console.warn('[register] ensureUserDoc failed, but continuing:', e);
      });
      
      console.log('[register] Success! Navigating to /collection');
      setSuccess(true);
      
      // Small delay to show success message, then navigate
      setTimeout(() => {
        router.push('/collection');
      }, 1000);
    } catch (err: unknown) {
      const error = err as { code?: string };
      console.error('[register] Registration failed:', err);
      setError(authErrorMessage(error?.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    console.log('[register] Starting Google sign-in process...');

    try {
      const cred = await googleSignInWithPopupThenRedirectFallback();
      if (cred?.user) {
        console.log('[register] Google sign-in success, user signed in:', cred.user.uid);
        
        // Providers will update the store; no setUser here
        
        // Try to create Firestore doc, but don't let it block navigation
        console.log('[register] Calling ensureUserDoc (non-blocking)...');
        ensureUserDoc(cred.user).catch((e) => {
          console.warn('[register] ensureUserDoc failed, but continuing:', e);
        });
        
        console.log('[register] Success! Navigating to /collection');
        router.push('/collection');
      }
      // else redirect flow will handle itself
    } catch (err: unknown) {
      const error = err as { code?: string };
      console.error('[register] Google sign-in failed:', err);
      setError(authErrorMessage(error?.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-600 mt-2">Join CardCore to start collecting</p>
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

          {success && (
            <div 
              className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              role="alert"
            >
              ✅ Account created successfully! Redirecting to collection...
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                fieldErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              disabled={isSubmitting}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                fieldErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Create a password"
              disabled={isSubmitting}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
              aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {fieldErrors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || googleLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
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
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
