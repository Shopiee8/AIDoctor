import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import type { AIAgent } from '@/services/aiProviderService';
import type { AIDoctor } from '@/types';

const AI_DOCTORS_COLLECTION = 'aiDoctors';
const AI_AGENTS_COLLECTION = 'aiAgents';

/**
 * Sync AI Agent to AI Doctor for patient search
 * This creates/updates an AI Doctor record based on AI Agent data
 */
export const syncAIAgentToDoctor = async (agent: AIAgent): Promise<void> => {
  try {
    if (!agent.id || !agent.providerId) {
      throw new Error('Agent ID and Provider ID are required for sync');
    }

    // Helper function to convert date to ISO string
    const toISOString = (date: any) => {
      if (!date) return new Date().toISOString();
      return date.toISOString ? date.toISOString() : new Date(date).toISOString();
    };

    // Map AI Agent to AI Doctor format
    const aiDoctor: Partial<AIDoctor> = {
      id: `ai-${agent.id}`, // Prefix to distinguish from human doctors
      providerId: agent.providerId,
      name: agent.name,
      specialty: agent.specialty,
      description: agent.description,
      avatar: agent.avatar,
      isActive: agent.status === 'active',
      rating: agent.rating || 4.8,
      responseTime: agent.responseTime || 30,
      metadata: {
        // Store any additional agent data in metadata
        totalConsultations: agent.consultations || 0,
        totalPatients: Math.floor((agent.consultations || 0) * 0.8), // Estimate unique patients
        successRate: agent.successRate || 95,
        lastActive: toISOString(agent.lastActive || new Date())
      },
      
      // Timestamps - all as ISO strings
      createdAt: toISOString(agent.createdAt || new Date()),
      updatedAt: toISOString(new Date()),
    };

    // Save to AI Doctors collection
    const doctorRef = doc(db, AI_DOCTORS_COLLECTION, aiDoctor.id!);
    await setDoc(doctorRef, aiDoctor, { merge: true });

    console.log(`Successfully synced AI Agent ${agent.name} to AI Doctor`);
  } catch (error) {
    console.error('Error syncing AI Agent to Doctor:', error);
    throw error;
  }
};

/**
 * Remove AI Doctor when AI Agent is deleted
 */
export const removeAIDoctorSync = async (agentId: string): Promise<void> => {
  try {
    const doctorId = `ai-${agentId}`;
    const doctorRef = doc(db, AI_DOCTORS_COLLECTION, doctorId);
    await deleteDoc(doctorRef);
    
    console.log(`Successfully removed AI Doctor sync for agent ${agentId}`);
  } catch (error) {
    console.error('Error removing AI Doctor sync:', error);
    throw error;
  }
};

/**
 * Sync all AI Agents for a provider to AI Doctors
 */
export const syncAllAgentsForProvider = async (providerId: string): Promise<void> => {
  try {
    // Get all agents for the provider
    const agentsQuery = query(
      collection(db, AI_AGENTS_COLLECTION),
      where('providerId', '==', providerId)
    );
    
    const agentsSnapshot = await getDocs(agentsQuery);
    const agents = agentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as AIAgent));

    // Sync each agent
    const syncPromises = agents.map(agent => syncAIAgentToDoctor(agent));
    await Promise.all(syncPromises);

    console.log(`Successfully synced ${agents.length} AI Agents for provider ${providerId}`);
  } catch (error) {
    console.error('Error syncing all agents for provider:', error);
    throw error;
  }
};

/**
 * Get all AI Doctors for patient search (across all providers)
 */
export const getAllAIDoctorsForSearch = async (): Promise<AIDoctor[]> => {
  try {
    const q = query(
      collection(db, AI_DOCTORS_COLLECTION),
      where('isVisibleInSearch', '==', true),
      where('isActive', '==', true),
      orderBy('searchPriority', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const now = new Date();
    const nowISO = now.toISOString();
    
    // Helper function to safely convert Firestore timestamps to ISO strings
    const toISOString = (date: any) => {
      if (!date) return nowISO;
      return date.toDate ? date.toDate().toISOString() : new Date(date).toISOString();
    };

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'AI Doctor',
        specialty: data.specialty || 'General Practice',
        description: data.description || 'AI-powered healthcare provider',
        avatar: data.avatar || '/default-avatar.png',
        rating: data.rating || 4.8,
        responseTime: data.responseTime || 30,
        isActive: data.isActive ?? true,
        providerId: data.providerId || 'system',
        // Convert all dates to ISO strings
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
        metadata: data.metadata || {},
        // Include any additional fields from the document
        ...data,
        // Ensure timestamps are properly converted to ISO strings
        ...(data.lastSyncedAt && { lastSyncedAt: toISOString(data.lastSyncedAt) }),
        // Map stats if they exist and convert dates to ISO strings
        ...(data.stats && {
          stats: {
            ...data.stats,
            lastActive: data.stats.lastActive ? toISOString(data.stats.lastActive) : nowISO,
          },
        }),
      } as AIDoctor;
    });
  } catch (error) {
    console.error('Error getting AI Doctors for search:', error);
    throw error;
  }
};

/**
 * Get AI Doctors by specialty for targeted search
 */
export const getAIDoctorsBySpecialty = async (specialty: string): Promise<AIDoctor[]> => {
  try {
    const q = query(
      collection(db, AI_DOCTORS_COLLECTION),
      where('specialty', '==', specialty),
      where('isVisibleInSearch', '==', true),
      where('isActive', '==', true),
      orderBy('searchPriority', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const now = new Date();
      const nowISO = now.toISOString();
      
      // Helper function to safely convert Firestore timestamps to ISO strings
      const toISOString = (date: any) => {
        if (!date) return nowISO;
        return date.toDate ? date.toDate().toISOString() : new Date(date).toISOString();
      };

      return {
        id: doc.id,
        name: data.name || 'AI Doctor',
        specialty: data.specialty || 'General Practice',
        description: data.description || 'AI-powered healthcare provider',
        avatar: data.avatar || '/default-avatar.png',
        rating: data.rating || 4.8,
        responseTime: data.responseTime || 30,
        isActive: data.isActive ?? true,
        providerId: data.providerId || 'system',
        // Convert all dates to ISO strings
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
        metadata: data.metadata || {},
        // Include any additional fields from the document
        ...data,
        // Ensure timestamps are properly converted to ISO strings
        ...(data.lastSyncedAt && { lastSyncedAt: toISOString(data.lastSyncedAt) }),
        // Map stats if they exist and convert dates to ISO strings
        ...(data.stats && {
          stats: {
            ...data.stats,
            lastActive: data.stats.lastActive ? toISOString(data.stats.lastActive) : nowISO,
          },
        }),
      } as AIDoctor;
    });
  } catch (error) {
    console.error('Error getting AI Doctors by specialty:', error);
    throw error;
  }
};

/**
 * Update AI Doctor visibility in search
 */
export const updateAIDoctorVisibility = async (
  agentId: string, 
  isVisible: boolean
): Promise<void> => {
  try {
    const doctorId = `ai-${agentId}`;
    const doctorRef = doc(db, AI_DOCTORS_COLLECTION, doctorId);
    
    await updateDoc(doctorRef, {
      isVisibleInSearch: isVisible,
      updatedAt: Timestamp.now(),
    });

    console.log(`Updated AI Doctor visibility for agent ${agentId}: ${isVisible}`);
  } catch (error) {
    console.error('Error updating AI Doctor visibility:', error);
    throw error;
  }
};

/**
 * Real-time sync listener for AI Agent changes
 */
export const subscribeToAgentChanges = (
  providerId: string,
  onAgentChange: (agents: AIAgent[]) => void
) => {
  const q = query(
    collection(db, AI_AGENTS_COLLECTION),
    where('providerId', '==', providerId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, async (querySnapshot) => {
    const agents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as AIAgent));

    // Auto-sync any changes to AI Doctors
    try {
      const syncPromises = agents
        .filter(agent => agent.status === 'active')
        .map(agent => syncAIAgentToDoctor(agent));
      
      await Promise.all(syncPromises);
    } catch (error) {
      console.error('Error auto-syncing agents:', error);
    }

    onAgentChange(agents);
  });
};

/**
 * Batch sync utility for migrating existing agents
 */
export const batchSyncExistingAgents = async (): Promise<{
  synced: number;
  errors: string[];
}> => {
  try {
    const agentsSnapshot = await getDocs(collection(db, AI_AGENTS_COLLECTION));
    const agents = agentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as AIAgent));

    let synced = 0;
    const errors: string[] = [];

    for (const agent of agents) {
      try {
        await syncAIAgentToDoctor(agent);
        synced++;
      } catch (error) {
        errors.push(`Failed to sync agent ${agent.name}: ${error}`);
      }
    }

    return { synced, errors };
  } catch (error) {
    console.error('Error in batch sync:', error);
    throw error;
  }
};