import { auth } from '@/firebase/client';

export async function testFirebaseAuth() {
  try {
    console.log('[firebase-test] Testing Firebase Auth connectivity...');
    console.log('[firebase-test] Auth instance:', auth);
    console.log('[firebase-test] Auth config:', auth.config);
    console.log('[firebase-test] Auth app:', auth.app);
    
    // Test if we can access Firebase Auth methods
    if (typeof auth.onAuthStateChanged === 'function') {
      console.log('[firebase-test] ✅ onAuthStateChanged is available');
    } else {
      console.log('[firebase-test] ❌ onAuthStateChanged is NOT available');
    }
    
    return true;
  } catch (error) {
    console.error('[firebase-test] Firebase Auth test failed:', error);
    return false;
  }
}
