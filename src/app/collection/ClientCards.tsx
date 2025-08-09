// app/collection/ClientCards.tsx
'use client';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { fetchMyCards } from "@/data/cards";

export default function ClientCards() {
  const user = useAuthStore(s => s.user);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMyCards(user.uid).then((res) => {
      setCards(res);
      setLoading(false);
    });
  }, [user]);

  if (!user) return null;

  if (loading) return <p>Loading your cards…</p>;

  if (cards.length === 0) {
    return <p className="text-gray-600">No cards yet — click “Add Card” to create your first entry.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.id} className="rounded-xl border p-3">
          <div className="text-lg font-semibold">{c.name}</div>
          {c.setName && <div className="text-sm text-gray-600">{c.setName}</div>}
          {c.number && <div className="text-sm text-gray-600">#{c.number}</div>}
        </div>
      ))}
    </div>
  );
}
