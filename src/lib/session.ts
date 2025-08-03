import { auth } from './firebase';
import { User as FirebaseUser } from 'firebase/auth';

export interface SessionUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  // In a real app, you would get the current user from your auth provider
  // For now, we'll return a mock user for development
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user-123',
      email: 'dev@example.com',
      displayName: 'Developer',
      photoURL: null,
      emailVerified: true,
    };
  }

  // In production, get the current user from Firebase Auth
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    emailVerified: currentUser.emailVerified,
  };
}

export async function getServerSession(): Promise<SessionUser | null> {
  // This would be used in server components to get the session
  // Implementation depends on your authentication setup
  return getCurrentUser();
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}
