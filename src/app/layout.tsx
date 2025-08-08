'use client';


import '../styles/globals.css';
import { ReactNode, useEffect } from 'react';
import { subscribeToAuthChanges } from '@/firebase/auth';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [setUser]);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
