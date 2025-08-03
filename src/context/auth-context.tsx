// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signUp: (email: string, pass: string, role: string, additionalData?: { displayName?: string }) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const doctorSeedData = [
    { id: "ai-julia", name: "Julia, AI Doctor", specialty: "AI Cardiologist", location: "Virtual", rating: 4.9, image: "https://placehold.co/200x200.png", imageHint: "robot abstract", available: true, type: "AI", fees: "$25", nextAvailable: "Available 24/7" },
    { id: "human-michael-brown", name: "Dr. Michael Brown", specialty: "Psychologist", location: "Minneapolis, MN", languages: "English, German", experience: "18 Years", votes: "90% (228 / 240)", fees: "$400", nextAvailable: "04:00 PM - 20 Nov, Wed", rating: 5.0, available: true, image: "https://placehold.co/200x200.png", imageHint: "doctor portrait", degree: "B.S, M.S - Psychology", isFavorited: true, isVerified: true, type: "Human" },
    { id: "ai-sam", name: "Sam, AI Doctor", specialty: "AI General Practice", location: "Virtual", rating: 4.8, image: "https://placehold.co/200x200.png", imageHint: "robot friendly", available: true, type: "AI", fees: "$15", nextAvailable: "Available 24/7" },
    { id: "human-nicholas-tello", name: "Dr. Nicholas Tello", specialty: "Pediatrician", location: "Ogden, IA", languages: "English, Korean", experience: "15 Years", votes: "95% (200 / 220)", fees: "$400", nextAvailable: "11:00 AM - 14 Nov, Thu", rating: 4.6, available: true, image: "https://placehold.co/200x200.png", imageHint: "doctor friendly", degree: "MBBS, MD - Pediatrics", type: "Human" },
    { id: "human-harold-bryant", name: "Dr. Harold Bryant", specialty: "Neurologist", location: "Winona, MS", languages: "English, French", experience: "20 Years", votes: "98% (252 / 287)", fees: "$600", nextAvailable: "10:00 AM - 15 Oct, Tue", rating: 4.8, available: true, image: "https://placehold.co/200x200.png", imageHint: "doctor serious", degree: "MBBS, DNB - Neurology", type: "Human" },
    { id: "human-sandra-jones", name: "Dr. Sandra Jones", specialty: "Cardiologist", location: "Beckley, WV", languages: "English, Spanish", experience: "30 Years", votes: "92% (270 / 300)", fees: "$450", nextAvailable: "11.00 AM - 19 Oct, Sat", rating: 4.8, available: false, image: "https://placehold.co/200x200.png", imageHint: "doctor smiling", degree: "MBBS, MD - Cardialogy", isVerified: true, type: "Human" },
    { id: "human-charles-scott", name: "Dr. Charles Scott", specialty: "Neurologist", location: "Hamshire, TX", languages: "English, French", experience: "20 Years", votes: "98% (252 / 287)", fees: "$600", nextAvailable: "10:00 AM - 15 Oct, Tue", rating: 4.2, available: true, image: "https://placehold.co/200x200.png", imageHint: "doctor portrait", degree: "MBBS, DNB - Neurology", isVerified: true, type: "Human" },
    { id: "human-robert-thomas", name: "Dr. Robert Thomas", specialty: "Cardiologist", location: "Oakland, CA", languages: "English, Spanish", experience: "30 Years", votes: "92% (270 / 300)", fees: "$450", nextAvailable: "11.00 AM - 19 Oct, Sat", rating: 4.2, available: false, image: "https://placehold.co/200x200.png", imageHint: "doctor professional", degree: "MBBS, MD - Cardialogy", type: "Human" },
    { id: "human-margaret-koller", name: "Dr. Margaret Koller", specialty: "Psychologist", location: "Killeen, TX", languages: "English, Portuguese", experience: "15 Years", votes: "94% (268 / 312)", fees: "$700", nextAvailable: "10.30 AM - 29 Oct, Tue", rating: 4.7, available: true, image: "https://placehold.co/200x200.png", imageHint: "doctor kind", degree: "B.S, M.S - Psychology", type: "Human" },
    { id: "human-cath-busick", name: "Dr. Cath Busick", specialty: "Pediatrician", location: "Schenectady, NY", languages: "English, Arabic", experience: "12 Years", votes: "87% (237 / 250)", fees: "$750", nextAvailable: "02:00 PM - 04 Nov, Mon", rating: 4.7, available: false, image: "https://placehold.co/200x200.png", imageHint: "doctor portrait", degree: "MBBS, MD - Pediatrics", type: "Human" },
];

async function seedDoctorsCollection() {
    const doctorsCollectionRef = doc(db, 'doctors', '--seed-check--');
    const docSnap = await getDoc(doctorsCollectionRef);

    if (!docSnap.exists()) {
        console.log("Seeding doctors collection...");
        const batch = writeBatch(db);
        doctorSeedData.forEach(doctor => {
            const docRef = doc(db, "doctors", doctor.id);
            batch.set(docRef, doctor);
        });
        batch.set(doctorsCollectionRef, { seeded: true });
        await batch.commit();
        console.log("Doctors collection seeded successfully.");
    }
}

// Function to get user role from Firestore
async function getUserRole(userId: string): Promise<string | null> {
    try {
        const doctorDoc = await getDoc(doc(db, 'doctors', userId));
        if (doctorDoc.exists()) return 'Doctor';

        const aiProviderDoc = await getDoc(doc(db, 'ai-providers', userId));
        if (aiProviderDoc.exists()) return 'AI Provider';

        const adminDoc = await getDoc(doc(db, 'admins', userId));
        if (adminDoc.exists()) return 'Admin';

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) return 'Patient';

        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      let role = null;
      let registrationComplete = false;
      
      if (currentUser) {
        setUser(currentUser);
        role = await getUserRole(currentUser.uid);
        setUserRole(role);
        
        // Check if this is an AI Provider with incomplete registration
        if (role === 'AI Provider') {
          const tempAiProviderDoc = await getDoc(doc(db, 'temp-ai-providers', currentUser.uid));
          if (tempAiProviderDoc.exists()) {
            registrationComplete = tempAiProviderDoc.data()?.registrationComplete === true;
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);

      // --- Redirection Logic ---
      // Only redirect if the user is on an auth page and has completed registration
      const loginPages = ['/login', '/register', '/admin/login'];
      const isAuthPage = loginPages.includes(pathname) || 
                         pathname.startsWith('/patient-register') || 
                         pathname.startsWith('/doctor-register') || 
                         pathname.startsWith('/ai-provider-register');

      if (currentUser && isAuthPage) {
        // If this is an AI Provider with incomplete registration, stay on the registration flow
        if (role === 'AI Provider' && !registrationComplete) {
          // Only redirect to step-1 if we're not already in the registration flow
          if (!pathname.startsWith('/ai-provider-register')) {
            router.push('/ai-provider-register/step-1');
          }
          return;
        }

        // Otherwise, proceed with normal redirection
        switch (role) {
          case 'Patient':
            router.push('/dashboard');
            break;
          case 'Doctor':
            router.push('/doctor/dashboard');
            break;
          case 'AI Provider':
            router.push('/ai-provider/dashboard');
            break;
          case 'Admin':
            router.push('/admin/dashboard');
            break;
          default:
            // If user is logged in but has no role or is in a registration flow,
            // but not on the right page, send them to home.
            if (!pathname.startsWith('/patient-register') && 
                !pathname.startsWith('/doctor-register') && 
                !pathname.startsWith('/ai-provider-register')) {
              router.push('/');
            }
        }
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const signIn = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  };
  
  const signUp = async (email: string, password: string, role: string, additionalData: { displayName?: string } = {}): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Set display name if provided
      if (additionalData.displayName && user) {
        try {
          await updateProfile(user, { displayName: additionalData.displayName });
          // Force token refresh to ensure the display name is updated
          await user.getIdToken(true);
        } catch (profileError) {
          console.error('Error updating profile:', profileError);
          // Don't throw the error, continue with registration
        }
      }

      // Create user document in the appropriate collection based on role
      const userData = {
        email: user.email,
        displayName: additionalData.displayName || user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL || null,
        role,
        createdAt: new Date().toISOString(),
      };

      // Add to appropriate collection based on role
      if (role === 'Doctor') {
        await setDoc(doc(db, 'doctors', user.uid), userData);
      } else if (role === 'AI Provider') {
        // For AI providers, we'll mark registration as incomplete
        // and store the initial data in a temporary collection
        await setDoc(doc(db, 'temp-ai-providers', user.uid), {
          ...userData,
          registrationComplete: false,
          registrationStep: 1,
          createdAt: new Date().toISOString()
        });
      } else if (role === 'Admin') {
        await setDoc(doc(db, 'admins', user.uid), userData);
      } else {
        // Default to patient
        await setDoc(doc(db, 'users', user.uid), userData);
      }

      // Update local state
      setUser(user);
      setUserRole(role);
      
      // Seed doctors collection for new users
      await seedDoctorsCollection();
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await seedDoctorsCollection();
  };

  const signOut = async () => {
    const wasAdmin = pathname.startsWith('/admin');
    await firebaseSignOut(auth);
    setUserRole(null);
    if (wasAdmin) {
        router.push('/admin/login');
    } else {
        // Go to home page after logout, not login page
        router.push('/');
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      const role = await getUserRole(auth.currentUser.uid);
      setUserRole(role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signIn, signUp, googleSignIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
