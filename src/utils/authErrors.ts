// src/utils/authErrors.ts
export function authErrorMessage(code?: string) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/user-not-found':
      return 'No account found with that email.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was canceled. Please try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
