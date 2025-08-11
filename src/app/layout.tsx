import '../styles/globals.css';
import { ReactNode } from 'react';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
