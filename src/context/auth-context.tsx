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
  refreshUser: () => Promise<{ user: User | null; role: string | null }>;
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
        // First check the users collection where we store the role
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            // If we have a role stored in the user document, use that
            const userData = userDoc.data();
            if (userData.role) {
                // If role exists but may be incorrect, verify against collections
                let currentRole: string = userData.role;
                const doctorDoc = await getDoc(doc(db, 'doctors', userId));
                const aiProviderDoc = await getDoc(doc(db, 'aiProviders', userId));
                const adminDoc = await getDoc(doc(db, 'admins', userId));

                if (doctorDoc.exists() && currentRole !== 'Doctor') {
                    currentRole = 'Doctor';
                } else if (aiProviderDoc.exists() && currentRole !== 'AI Provider') {
                    currentRole = 'AI Provider';
                } else if (adminDoc.exists() && currentRole !== 'Admin') {
                    currentRole = 'Admin';
                }

                // If corrected role differs, persist the fix
                if (currentRole !== userData.role) {
                    await setDoc(doc(db, 'users', userId), { role: currentRole }, { merge: true });
                }
                return currentRole;
            }
            // Fall back to checking specific role collections
            if (userData.isAIProvider) {
                return 'AI Provider';
            }
            // Probe collections to infer role and persist
            const doctorDoc = await getDoc(doc(db, 'doctors', userId));
            if (doctorDoc.exists()) {
                await setDoc(doc(db, 'users', userId), { role: 'Doctor' }, { merge: true });
                return 'Doctor';
            }
            const aiProviderDoc = await getDoc(doc(db, 'aiProviders', userId));
            if (aiProviderDoc.exists()) {
                await setDoc(doc(db, 'users', userId), { role: 'AI Provider' }, { merge: true });
                return 'AI Provider';
            }
            const adminDoc = await getDoc(doc(db, 'admins', userId));
            if (adminDoc.exists()) {
                await setDoc(doc(db, 'users', userId), { role: 'Admin' }, { merge: true });
                return 'Admin';
            }
            return 'Patient'; // Default role
        }

        // For backward compatibility, check the old role collections
        const doctorDoc = await getDoc(doc(db, 'doctors', userId));
        if (doctorDoc.exists()) return 'Doctor';

        const aiProviderDoc = await getDoc(doc(db, 'aiProviders', userId));
        if (aiProviderDoc.exists()) return 'AI Provider';

        const adminDoc = await getDoc(doc(db, 'admins', userId));
        if (adminDoc.exists()) return 'Admin';

        return 'Patient'; // Default role if no document exists
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'Patient'; // Default to Patient on error
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
      try {
        let role = 'Patient'; // Default role
        let registrationComplete = false;
        
        if (currentUser) {
          setUser(currentUser);
          
          // Get the user's role from Firestore
          role = await getUserRole(currentUser.uid) || 'Patient';
          setUserRole(role);
          
          // Only redirect if we're not already on a page for this role (case-insensitive comparison)
          const normalizedRole = role.toLowerCase();
          const currentPath = window.location.pathname;
          const shouldRedirect = 
            (normalizedRole === 'doctor' && !currentPath.startsWith('/doctor')) ||
            (normalizedRole === 'ai provider' && !currentPath.startsWith('/ai-provider')) ||
            (normalizedRole === 'admin' && !currentPath.startsWith('/admin')) ||
            (normalizedRole === 'patient' && !currentPath.startsWith('/dashboard') && currentPath !== '/');
            
          if (shouldRedirect) {
            if (normalizedRole === 'doctor') {
              router.push('/doctor/dashboard');
            } else if (normalizedRole === 'ai provider') {
              router.push('/ai-provider/dashboard');
            } else if (normalizedRole === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/dashboard');
            }
          }
          
          // Get the user's role with a default value
          const userRole = await getUserRole(currentUser.uid);
          role = userRole || 'Patient'; // Ensure role is never null
          setUserRole(role);
          
          // For AI Providers, check if registration is complete
          if (role === 'AI Provider') {
            const aiProviderDoc = await getDoc(doc(db, 'aiProviders', currentUser.uid));
            registrationComplete = aiProviderDoc.exists() && aiProviderDoc.data()?.registrationComplete !== false;
            
            // If registration is complete, ensure the user document is up to date
            if (registrationComplete) {
              await setDoc(doc(db, 'users', currentUser.uid), {
                role: 'AI Provider',
                isAIProvider: true,
                updatedAt: new Date().toISOString()
              }, { merge: true });
            }
          }
        } else {
          setUser(null);
          setUserRole(null);
        }

        // --- Redirection Logic ---
        // Skip redirection if we're on the become-provider page or in a registration flow
        const isSpecialPage = 
          pathname === '/dashboard/become-provider' ||
          pathname.startsWith('/ai-provider-register') ||
          pathname.startsWith('/patient-register') ||
          pathname.startsWith('/doctor-register');

        if (isSpecialPage) {
          setLoading(false);
          return;
        }

        // Only redirect if the user is on an auth page and has completed registration
        const loginPages = ['/login', '/register', '/admin/login'];
        const isAuthPage = loginPages.includes(pathname);

        if (currentUser && isAuthPage) {
          const normalizedRole = role.toLowerCase();
          
          // If this is an AI Provider with incomplete registration, redirect to registration
          if (normalizedRole === 'ai provider' && !registrationComplete) {
            router.push('/ai-provider-register/step-1');
            return;
          }

          // Otherwise, proceed with normal redirection (case-insensitive comparison)
          if (normalizedRole === 'doctor') {
            router.push('/doctor/dashboard');
          } else if (normalizedRole === 'ai provider') {
            router.push('/ai-provider/dashboard');
          } else if (normalizedRole === 'admin') {
            router.push('/admin/dashboard');
          } else if (normalizedRole === 'patient') {
            router.push('/dashboard');
          } else {
            // If user is logged in but has no recognized role, send them to home
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Don't get stuck in loading state if there's an error
        setLoading(false);
      } finally {
        // Ensure loading is set to false after all operations
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const signIn = async (email: string, pass: string) => {
    console.log('Sign in attempt with email:', email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const { user } = userCredential;
      console.log('Firebase auth successful, user ID:', user.uid);
      
      // Get the user's role after successful sign-in
      const role = await getUserRole(user.uid);
      console.log('Retrieved user role:', role);
      
      // Update the local state with the user's role
      if (role) {
        const normalizedRole = role.toLowerCase();
        console.log('Normalized role:', normalizedRole);
        setUserRole(role);
        
        // Redirect based on role (case-insensitive comparison)
        let redirectPath = '/dashboard'; // Default path
        if (normalizedRole === 'doctor') {
          redirectPath = '/doctor/dashboard';
        } else if (normalizedRole === 'ai provider') {
          redirectPath = '/ai-provider/dashboard';
        } else if (normalizedRole === 'admin') {
          redirectPath = '/admin/dashboard';
        }
        
        console.log('Redirecting to:', redirectPath);
        router.push(redirectPath);
      } else {
        console.warn('No role found for user, defaulting to patient dashboard');
        router.push('/dashboard');
      }
      
      return user;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error; // Re-throw to be handled by the login form
    }
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

      // Always create a user document in the users collection for authentication
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        // For AI Providers, we'll mark this specially
        isAIProvider: role === 'AI Provider',
        // Store the role in the user document for quick lookups
        role: role
      });

      // Add to role-specific collections
      if (role === 'Doctor') {
        await setDoc(doc(db, 'doctors', user.uid), userData);
      } else if (role === 'AI Provider') {
        // For AI providers, create a document in the aiProviders collection
        await setDoc(doc(db, 'aiProviders', user.uid), {
          ...userData,
          registrationComplete: false,
          registrationStep: 1,
          createdAt: new Date().toISOString()
        });
      } else if (role === 'Admin') {
        await setDoc(doc(db, 'admins', user.uid), userData);
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
      // Force a token refresh to get the latest claims
      await auth.currentUser.getIdToken(true);
      
      // Reload the user to get the latest data
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      
      // Get the latest role from Firestore
      const role = await getUserRole(auth.currentUser.uid);
      setUserRole(role || 'Patient');
      
      // Return the updated user and role
      return { user: auth.currentUser, role: role || 'Patient' };
    }
    return { user: null, role: null };
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signIn, signUp, googleSignIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
