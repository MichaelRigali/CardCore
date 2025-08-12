'use client';

import { useState } from 'react';
import { useAuthUser } from '@/store/useAuthStore'; // expects user with uid
import { attachImageUrlToCard, createCardDoc, uploadCardImageAndGetUrl } from '@/lib/cards';

export default function CardTestPage() {
  const user = useAuthUser();
  const [name, setName] = useState('Charizard');
  const [setNameVal, setSetNameVal] = useState('Base Set');
  const [rarity, setRarity] = useState<'Rare Holo'>('Rare Holo');
  const [condition, setCondition] = useState<'NM'>('NM');
  const [value, setValue] = useState('187.00');
  const [file, setFile] = useState<File | null>(null);

  const [log, setLog] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const addLog = (s: string) => setLog(prev => prev + s + '\n');

  const runTest = async () => {
    if (!user) { alert('Login first'); return; }
    if (!file) { alert('Pick an image'); return; }

    setBusy(true);
    setLog('');
    try {
      addLog('1) Creating Firestore card doc…');
      const cardId = await createCardDoc({
        uid: user.uid,
        name,
        set: setNameVal,
        rarity: 'Rare Holo',
        condition: 'NM',
        valueEstimate: Number(value),
      });
      addLog(`   ✔ Created cardId: ${cardId}`);

      addLog('2) Uploading image to Storage…');
      const url = await uploadCardImageAndGetUrl({ uid: user.uid, cardId, file });
      addLog(`   ✔ Uploaded. URL: ${url}`);

      addLog('3) Attaching imageUrl to Firestore doc…');
      await attachImageUrlToCard({ uid: user.uid, cardId, imageUrl: url });
      addLog('   ✔ Firestore updated.');

      addLog('\n✅ Success. Check Firestore and Storage.');
    } catch (e: any) {
      addLog(`❌ Error: ${e?.message ?? String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Dev: Card Helper Test</h1>
      {!user && <p className="text-sm text-red-600">You must be logged in.</p>}

      <div className="space-y-2">
        <input className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input className="w-full border rounded p-2" value={setNameVal} onChange={e => setSetNameVal(e.target.value)} placeholder="Set (e.g., Base Set)" />
        <input className="w-full border rounded p-2" value={value} onChange={e => setValue(e.target.value)} placeholder="Value (e.g., 187.00)" />

        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-3 file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white file:rounded hover:file:bg-indigo-700"
        />
      </div>

      <button
        disabled={busy || !user}
        onClick={runTest}
        className="w-full rounded bg-indigo-600 text-white py-2 disabled:opacity-60"
      >
        {busy ? 'Running…' : 'Run Helper Test'}
      </button>

      <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">{log}</pre>
    </main>
  );
}
