// src/data/cards.ts
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client";

export async function fetchMyCards(uid: string) {
  // Go to the path: users/{uid}/cards
  const col = collection(db, "users", uid, "cards");

  // Build a query: order by createdAt DESC
  const q = query(col, orderBy("createdAt", "desc"));

  // Run the query once (not realtime)
  const snap = await getDocs(q);

  // Convert docs to plain objects { id, ...data }
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
