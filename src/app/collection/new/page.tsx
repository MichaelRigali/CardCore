// app/collection/new/page.tsx
'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function NewCardPage() {
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    setName: '',
    number: '',
    rarity: '',
    condition: '',
    purchasePrice: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return <main className="p-6">Please log in first.</main>;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!user) { // narrow here
        setErr("You must be logged in");
        return;
      }

    // Minimal validation (MVP)
    if (!form.name.trim()) {
      setErr('Name is required');
      return;
    }

    setSaving(true);
    try {
      const colRef = collection(db, 'users', user.uid, 'cards');
      await addDoc(colRef, {
        name: form.name.trim(),
        setName: form.setName || null,
        number: form.number || null,
        rarity: form.rarity || null,
        condition: form.condition || null,
        purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : null,
        notes: form.notes || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push('/collection'); // go back to the grid
    } catch (e: any) {
      setErr(e.message || 'Failed to save card');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Add Card</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Name (required)"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Set (e.g., Base Set)"
          value={form.setName}
          onChange={e => setForm(f => ({ ...f, setName: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Number (e.g., 4/102)"
          value={form.number}
          onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Rarity (e.g., Holo Rare)"
          value={form.rarity}
          onChange={e => setForm(f => ({ ...f, rarity: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Condition (e.g., NM)"
          value={form.condition}
          onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Purchase Price"
          type="number"
          value={form.purchasePrice}
          onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))}
        />
        <textarea
          className="w-full rounded border p-2"
          placeholder="Notes"
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        />

        {err && <p className="text-red-600">{err}</p>}

        <button
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </main>
  );
}
