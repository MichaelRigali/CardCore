'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useAuthUser } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in (effect, not render)
  useEffect(() => {
    if (user) router.replace('/collection');
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Providers will update the store; no setUser here
      router.replace('/collection');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
               value={password} onChange={e => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded p-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
