// src/firebase/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Register a new user
  export const registerUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  // Log in a user
  export const loginUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // Log out current user
  export const logoutUser = () => {
    return signOut(auth);
  };
  
  // Listen to auth state changes (e.g., auto-login)
  export const subscribeToAuthChanges = (
    callback: (user: User | null) => void
  ) => {
    return onAuthStateChanged(auth, callback);
  };
  