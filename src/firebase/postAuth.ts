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
  
  console.log('[ensureUserDoc] Starting user document creation for:', u.uid);
  
  // Wrap everything in a try-catch to ensure it never blocks the UI
  try {
    // Quick check if doc exists - if this fails, we'll just create it
    console.log('[ensureUserDoc] Checking if document exists...');
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Create the document with merge to be idempotent
      console.log('[ensureUserDoc] Document does not exist, creating...');
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
    console.error('[ensureUserDoc] Firestore operation failed, detailed error:', {
      error: err,
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
      errorCode: (err as any)?.code,
      userUid: u.uid
    });
    
    // Try one more time with just the write operation
    try {
      console.log('[ensureUserDoc] Attempting fallback write...');
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
      console.error('[ensureUserDoc] All Firestore operations failed, final error:', {
        error: err2,
        errorMessage: err2 instanceof Error ? err2.message : 'Unknown error',
        errorCode: (err2 as any)?.code,
        userUid: u.uid
      });
    }
  }
}
