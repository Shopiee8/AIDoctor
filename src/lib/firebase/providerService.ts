import { db, storage, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { AIProvider, AIDoctor } from '@/types';

// AI Provider Collection
const PROVIDERS_COLLECTION = 'aiProviders';
const AI_DOCTORS_COLLECTION = 'aiDoctors';

// ==================== AI Provider Operations ====================

/**
 * Get AI Provider by user ID
 */
export const getAIProvider = async (userId: string): Promise<AIProvider | null> => {
  try {
    // First check the AI Providers collection
    const providerDoc = await getDoc(doc(db, PROVIDERS_COLLECTION, userId));
    if (providerDoc.exists()) {
      return {
        id: providerDoc.id,
        ...providerDoc.data(),
        createdAt: providerDoc.data().createdAt?.toDate(),
        updatedAt: providerDoc.data().updatedAt?.toDate(),
      } as AIProvider;
    }

    // If not found in AI Providers, check the users collection
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists() && (userDoc.data().role === 'AI Provider' || userDoc.data().isAIProvider)) {
      // Return a minimal AIProvider object with the user's data
      return {
        id: userDoc.id,
        userId: userDoc.id,
        organizationName: userDoc.data().organizationName || 'My Organization',
        website: userDoc.data().website || null,
        subscriptionPlan: userDoc.data().subscriptionPlan || 'free',
        subscriptionStatus: userDoc.data().subscriptionStatus || 'active',
        settings: userDoc.data().settings || {
          notifications: true,
          emailNotifications: true,
          defaultLanguage: 'en',
        },
        createdAt: userDoc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: userDoc.data().updatedAt?.toDate?.() || new Date(),
      } as AIProvider;
    }

    return null;
  } catch (error) {
    console.error('Error getting AI provider:', error);
    throw error;
  }
};

/**
 * Create or update AI Provider
 */
export const saveAIProvider = async (providerData: Partial<AIProvider> & { userId: string }): Promise<void> => {
  // Ensure the user's role is updated to 'AI Provider' in the users collection and session
  await setDoc(doc(db, 'users', providerData.userId), {
    role: 'AI Provider',
    updatedAt: Timestamp.now(),
    isAIProvider: true
  }, { merge: true });
  
  // Force refresh the auth token to update the user's claims
  const user = auth.currentUser;
  if (user) {
    await user.getIdToken(true); // Force token refresh
  }
  console.log('Starting saveAIProvider with data:', JSON.stringify(providerData, null, 2));
  
  try {
    const now = Timestamp.now();
    const providerRef = doc(db, PROVIDERS_COLLECTION, providerData.userId);
    const batch = writeBatch(db);
    
    console.log('Preparing batch write for provider data');
    
    // 1. Save the provider data
    const providerDoc = {
      ...providerData,
      createdAt: providerData.createdAt || now,
      updatedAt: now,
    };
    
    console.log('Setting provider document:', JSON.stringify(providerDoc, null, 2));
    batch.set(providerRef, providerDoc, { merge: true });
    
    // 2. Mark registration as complete in temp-ai-providers
    const tempProviderRef = doc(db, 'temp-ai-providers', providerData.userId);
    const tempProviderData = {
      registrationComplete: true,
      registrationStep: 'complete',
      updatedAt: now,
      completedAt: now
    };
    
    console.log('Updating temp provider with completion data:', JSON.stringify(tempProviderData, null, 2));
    batch.set(tempProviderRef, tempProviderData, { merge: true });
    
    console.log('Committing batch write...');
    // 3. Commit both operations atomically
    await batch.commit();
    
    console.log('AI Provider registration completed successfully');
    
    // Verify the data was saved correctly
    try {
      const savedProvider = await getAIProvider(providerData.userId);
      console.log('Provider data after save:', JSON.stringify(savedProvider, null, 2));
      
      const tempProvider = await getDoc(tempProviderRef);
      console.log('Temp provider after update:', tempProvider.exists() ? tempProvider.data() : 'Not found');
    } catch (verificationError) {
      console.error('Error verifying saved data:', verificationError);
      // Don't fail the whole operation if verification fails
    }
    
  } catch (error) {
    console.error('Error in saveAIProvider:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      providerData: JSON.stringify(providerData, null, 2)
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to save AI provider: ${errorMessage}`);
  }
};

// ==================== AI Doctor Operations ====================

/**
 * Get all AI Doctors for a provider
 */
export const getAIDoctorsByProvider = async (providerId: string): Promise<AIDoctor[]> => {
  try {
    const q = query(
      collection(db, AI_DOCTORS_COLLECTION),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      stats: {
        ...doc.data().stats,
        lastActive: doc.data().stats?.lastActive?.toDate(),
      },
    } as AIDoctor));
  } catch (error) {
    console.error('Error getting AI doctors:', error);
    throw error;
  }
};

/**
 * Get AI Doctor by ID
 */
export const getAIDoctor = async (doctorId: string): Promise<AIDoctor | null> => {
  try {
    const docRef = doc(db, AI_DOCTORS_COLLECTION, doctorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        stats: {
          ...data.stats,
          lastActive: data.stats?.lastActive?.toDate(),
        },
      } as AIDoctor;
    }
    return null;
  } catch (error) {
    console.error('Error getting AI doctor:', error);
    throw error;
  }
};

/**
 * Create or update AI Doctor
 */
export const saveAIDoctor = async (
  doctorData: Partial<AIDoctor> & { providerId: string; name: string; specialty: string }
): Promise<string> => {
  try {
    const now = Timestamp.now();
    const isNew = !doctorData.id;
    const doctorId = doctorData.id || crypto.randomUUID();
    
    const doctorRef = doc(db, AI_DOCTORS_COLLECTION, doctorId);
    
    const data = {
      ...doctorData,
      id: doctorId,
      isActive: doctorData.isActive !== false, // Default to true if not specified
      createdAt: doctorData.createdAt || now,
      updatedAt: now,
    };
    
    await setDoc(doctorRef, data, { merge: true });
    return doctorId;
  } catch (error) {
    console.error('Error saving AI doctor:', error);
    throw error;
  }
};

/**
 * Delete AI Doctor
 */
export const deleteAIDoctor = async (doctorId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, AI_DOCTORS_COLLECTION, doctorId));
  } catch (error) {
    console.error('Error deleting AI doctor:', error);
    throw error;
  }
};

// ==================== File Uploads ====================

/**
 * Upload AI Doctor Avatar
 */
export const uploadAIDoctorAvatar = async (
  file: File, 
  doctorId: string
): Promise<{ url: string; path: string }> => {
  try {
    const storagePath = `ai-doctors/${doctorId}/avatar/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      url: downloadURL,
      path: storagePath
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

/**
 * Delete AI Doctor Avatar
 */
export const deleteAIDoctorAvatar = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw error;
  }
};

// ==================== Analytics ====================

/**
 * Get AI Doctor Stats
 */
export const getAIDoctorStats = async (doctorId: string): Promise<AIDoctor['stats']> => {
  try {
    // In a real app, you might want to calculate these from a separate analytics collection
    // For now, we'll just return the stats from the doctor document
    const doctor = await getAIDoctor(doctorId);
    return doctor?.stats || {
      totalConsultations: 0,
      averageRating: 0,
      totalPatients: 0,
    };
  } catch (error) {
    console.error('Error getting AI doctor stats:', error);
    throw error;
  }
};

/**
 * Get AI Doctor Consultations
 */
export const getAIDoctorConsultations = async (
  doctorId: string, 
  limit: number = 10
): Promise<Array<{
  id: string;
  patientId: string;
  patientName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  rating?: number;
  notes?: string;
}>> => {
  try {
    // In a real app, you would query the consultations collection
    // For now, we'll return mock data
    return [];
  } catch (error) {
    console.error('Error getting AI doctor consultations:', error);
    throw error;
  }
};
