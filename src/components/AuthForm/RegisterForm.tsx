// src/components/AuthForm/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { registerUser } from '@/firebase/auth';
import { useAuthUser } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useAuthUser();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await registerUser(email, password);
      // Providers will update the store; no setUser here
      router.push('/collection');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Register</h2>
      <input
        className="w-full px-4 py-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full px-4 py-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Create Account
      </button>
    </form>
  );
}
