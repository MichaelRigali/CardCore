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

// Initialize Firestore with standard configuration
let db: ReturnType<typeof getFirestore>;
try {
  db = getFirestore(app);
  console.log('[firebase] Firestore initialized successfully');
} catch (error) {
  console.warn('[firebase] Firestore initialization failed:', error);
  db = getFirestore(app);
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
