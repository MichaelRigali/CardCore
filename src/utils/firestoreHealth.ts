import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';

export async function firestoreHealthcheck() {
  try {
    // Try a harmless read of a non-existent doc; success indicates connectivity.
    await getDoc(doc(db, '__healthcheck__', 'ping'));
    // eslint-disable-next-line no-console
    console.log('[firestore] healthcheck OK');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[firestore] healthcheck failed:', e);
  }
}
