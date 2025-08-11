// app/collection/new/page.tsx
'use client';

import RequireAuth from '@/components/RequireAuth';

export default function NewCardPage() {
  return (
    <RequireAuth>
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Add New Card</h1>
        <p className="text-gray-600">Add new card functionality coming soon...</p>
      </main>
    </RequireAuth>
  );
}
