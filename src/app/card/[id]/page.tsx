'use client';

import RequireAuth from '@/components/RequireAuth';

export default function CardDetailPage() {
  return (
    <RequireAuth>
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Card Details</h1>
        <p className="text-gray-600">Card detail functionality coming soon...</p>
      </main>
    </RequireAuth>
  );
}
