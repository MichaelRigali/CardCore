// src/firebase/client.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// ✅ Replace with your Firebase project settings from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ✅ Only initialize once (avoids Fast Refresh errors in dev)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Force long polling in development to avoid WebChannel 400 errors
const forceLongPolling = process.env.NODE_ENV !== 'production';

// Clear any existing Firestore instances to force re-initialization with our settings
if (typeof window !== 'undefined' && forceLongPolling) {
  // @ts-ignore - accessing internal Firebase state
  if (app._firestoreInstances) {
    // @ts-ignore
    delete app._firestoreInstances;
  }
}

// Initialize Firestore with forced long-polling in development
let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: false,
    experimentalForceLongPolling: forceLongPolling,
  });
  console.log('[firebase] Firestore initialized with long-polling settings');
} catch (error) {
  // If initialization fails, fall back to getFirestore but log the error
  console.warn('[firebase] Firestore initialization failed, falling back to default:', error);
  db = getFirestore(app);
}

// Log settings for debugging
if (typeof window !== 'undefined') {
  console.log('[firestore:init]', {
    env: process.env.NODE_ENV,
    forceLongPolling,
    timestamp: new Date().toISOString(),
    firestoreInstance: db.constructor.name,
  });
  
  // Note: Firestore settings are not accessible after initialization
  // The settings we applied during initializeFirestore should be active
}

// ✅ Export Firebase services
export const auth = getAuth(app);
export { db };
export const storage = getStorage(app);

// ✅ Optional: connect to local emulators if enabled
if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  } catch {}
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch {}
  try {
    connectStorageEmulator(storage, "localhost", 9199);
  } catch {}
}
