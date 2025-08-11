// app/collection/page.tsx
'use client';

import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import ClientCards from './ClientCards';

export default function CollectionPage() {
  return (
    <RequireAuth>
      <main className="p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Collection</h1>
          <Link
            href="/collection/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            + Add Card
          </Link>
        </header>

        {/* Grid of the signed-in user's cards */}
        <ClientCards />

        {/* Fallback for empty state (optional) */}
        {/* <p className="text-gray-600">No cards yet — click "Add Card" to create your first entry.</p> */}
      </main>
    </RequireAuth>
  );
}
