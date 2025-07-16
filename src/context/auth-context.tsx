// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signUp: (email: string, pass: string, role: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      const publicRoutes = ['/login', '/register', '/', '/privacy', '/doctor-register', '/ai-provider-register', '/patient-register'];
      const isPublic = publicRoutes.some(route => pathname.startsWith(route));

      if (!currentUser && !isPublic) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signIn = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  };
  
  const signUp = async (email: string, pass: string, role: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    // In a real app, you'd save the role to Firestore here.
    // For now, we use localStorage as a temporary solution.
    localStorage.setItem('userRole', role);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Role would need to be determined/set here as well.
    localStorage.setItem('userRole', 'Patient'); // Default role for Google sign-in
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, googleSignIn, signOut }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
