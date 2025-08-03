import { db, storage } from '@/lib/firebase';
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
  DocumentData
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
    const providerDoc = await getDoc(doc(db, PROVIDERS_COLLECTION, userId));
    if (providerDoc.exists()) {
      return {
        id: providerDoc.id,
        ...providerDoc.data(),
        createdAt: providerDoc.data().createdAt?.toDate(),
        updatedAt: providerDoc.data().updatedAt?.toDate(),
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
  try {
    const now = Timestamp.now();
    const providerRef = doc(db, PROVIDERS_COLLECTION, providerData.userId);
    
    await setDoc(providerRef, {
      ...providerData,
      createdAt: providerData.createdAt || now,
      updatedAt: now,
    }, { merge: true });
  } catch (error) {
    console.error('Error saving AI provider:', error);
    throw error;
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
