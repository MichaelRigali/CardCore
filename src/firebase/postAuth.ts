import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import type { User } from 'firebase/auth';

/**
 * Ensure a Firestore user profile exists at users/{uid}.
 * - Completely non-blocking: if Firestore fails, UI continues
 * - Idempotent: merge prevents duplicate fields
 * - Silent fallback: no errors thrown to user
 */
export async function ensureUserDoc(u: User) {
  const ref = doc(db, 'users', u.uid);
  
  // Wrap everything in a try-catch to ensure it never blocks the UI
  try {
    // Quick check if doc exists - if this fails, we'll just create it
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Create the document with merge to be idempotent
      await setDoc(
        ref,
        {
          email: u.email ?? null,
          displayName: u.displayName ?? null,
          photoURL: u.photoURL ?? null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('[ensureUserDoc] User document created successfully');
    } else {
      console.log('[ensureUserDoc] User document already exists');
    }
  } catch (err) {
    // If anything fails, just log it and continue - don't block the UI
    console.warn('[ensureUserDoc] Firestore operation failed, continuing without user doc:', err);
    
    // Try one more time with just the write operation
    try {
      await setDoc(
        ref,
        {
          email: u.email ?? null,
          displayName: u.displayName ?? null,
          photoURL: u.photoURL ?? null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('[ensureUserDoc] Fallback write succeeded');
    } catch (err2) {
      // Final fallback - just log and continue
      console.warn('[ensureUserDoc] All Firestore operations failed, user doc may not be created:', err2);
    }
  }
}
