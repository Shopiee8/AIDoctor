import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User
} from 'firebase/auth';

// Type for user data
export interface AppUser extends User {
  role?: string;
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AppUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user as AppUser;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AppUser> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user as AppUser;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): AppUser | null => {
  return auth.currentUser as AppUser | null;
};

// Auth state change listener
export const onAuthStateChanged = (callback: (user: AppUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(user as AppUser | null);
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

// Get user role
export const getUserRole = (): string | undefined => {
  return (auth.currentUser as AppUser)?.role;
};
