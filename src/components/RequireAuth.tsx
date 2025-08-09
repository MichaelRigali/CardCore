'use client';
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  if (user === undefined) return null; // optional: a loader while auth hydrates
  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold mb-2">Please sign in</h1>
        <Link className="underline" href="/login">Go to login</Link>
      </main>
    );
  }
  return <>{children}</>;
}