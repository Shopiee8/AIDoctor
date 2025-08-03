import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AIProviderData {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  registrationComplete: boolean;
  registrationStep: number;
  agentName?: string;
  agentSpecialty?: string;
  systemPrompt?: string;
  // System fields
  deleted?: boolean;
  // Add other fields as needed
}

export const completeAIProviderRegistration = async (
  userId: string,
  providerData: Partial<AIProviderData>
): Promise<void> => {
  try {
    // Get the temporary provider data
    const tempProviderRef = doc(db, 'temp-ai-providers', userId);
    const tempProviderDoc = await getDoc(tempProviderRef);
    
    if (!tempProviderDoc.exists()) {
      throw new Error('Temporary provider data not found');
    }

    const tempData = tempProviderDoc.data() as AIProviderData;
    
    // Create the final provider document
    const finalProviderData: AIProviderData = {
      ...tempData,
      ...providerData,
      registrationComplete: true,
      registrationStep: 3,
      completedAt: new Date().toISOString(),
    };

    // Save to the final collection
    await setDoc(doc(db, 'ai-providers', userId), finalProviderData);
    
    // Remove from temporary collection
    await setDoc(tempProviderRef, { deleted: true }, { merge: true });
    
    // Update the user's role in the users collection
    await setDoc(doc(db, 'users', userId), {
      role: 'AI Provider',
      registrationComplete: true
    }, { merge: true });
    
    return;
  } catch (error) {
    console.error('Error completing AI provider registration:', error);
    throw error;
  }
};

export const getAIProviderData = async (userId: string): Promise<AIProviderData | null> => {
  try {
    // First check the temp collection
    const tempProviderDoc = await getDoc(doc(db, 'temp-ai-providers', userId));
    if (tempProviderDoc.exists()) {
      return tempProviderDoc.data() as AIProviderData;
    }
    
    // Then check the final collection
    const providerDoc = await getDoc(doc(db, 'ai-providers', userId));
    if (providerDoc.exists()) {
      return providerDoc.data() as AIProviderData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting AI provider data:', error);
    return null;
  }
};
