import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from './client';

export async function googleSignInWithPopupThenRedirectFallback() {
  const provider = new GoogleAuthProvider();
  
  // Configure provider with your specific Web Client ID and account selection prompt
  provider.setCustomParameters({ 
    prompt: 'select_account',
    client_id: '276818570445-5cfsdm40pcnj06v6qlkrrvlh92iuduto.apps.googleusercontent.com'
  });
  
  console.log('[googleSignIn] Provider configured:', {
    clientId: provider.clientId,
    customParameters: provider.customParameters
  });
  
  try {
    // Primary path: try popup first
    console.log('[googleSignIn] Attempting popup sign-in...');
    const result = await signInWithPopup(auth, provider);
    console.log('[googleSignIn] Popup sign-in successful:', result.user.uid);
    return result;
  } catch (err: unknown) {
    // Popup blocked or unsupported: fall back to redirect
    const error = err as { code?: string; message?: string };
    console.error('[googleSignIn] Popup failed, error details:', {
      code: error?.code,
      message: error?.message,
      fullError: err
    });
    
    if (error?.code === 'auth/popup-blocked') {
      console.log('[googleSignIn] Popup blocked, falling back to redirect...');
      await signInWithRedirect(auth, provider);
      return null;
    } else {
      // Re-throw other errors to be handled by the caller
      throw err;
    }
  }
}

export async function googleHandleRedirectResult() {
  try {
    const cred = await getRedirectResult(auth);
    return cred;
  } catch (e) {
    console.warn('[googleSignIn] Redirect result error:', e);
    return null;
  }
}
