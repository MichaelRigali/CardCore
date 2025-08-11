'use client';

import RequireAuth from '@/components/RequireAuth';

export default function AddCardPage() {
  return (
    <RequireAuth>
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Add Card</h1>
        <p className="text-gray-600">Add card functionality coming soon...</p>
      </main>
    </RequireAuth>
  );
}
