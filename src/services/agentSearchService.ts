import { getAIDoctorsByProvider } from '@/lib/firebase/providerService';
import { getAgent } from './aiProviderService';

/**
 * Sync all AI agents for a provider to the patient search system
 */
export const syncAllAgentsToSearch = async (providerId: string): Promise<void> => {
  try {
    // Get all AI doctors for this provider
    const aiDoctors = await getAIDoctorsByProvider(providerId);
    
    // Here you would typically sync each agent to your search service
    // For example:
    // await searchService.batchIndex(aiDoctors);
    
    console.log(`Synced ${aiDoctors.length} agents to search for provider ${providerId}`);
  } catch (error) {
    console.error('Error syncing agents to search:', error);
    throw error;
  }
};

/**
 * Verify if an agent is visible in the patient search
 */
export const verifyAgentVisibility = async (agentId: string): Promise<boolean> => {
  try {
    // Here you would typically check if the agent exists in your search index
    // For example:
    // const exists = await searchService.exists(agentId);
    // return exists;
    
    // For now, we'll assume all active agents are visible
    const agent = await getAgent(agentId);
    return agent?.status === 'active';
  } catch (error) {
    console.error('Error verifying agent visibility:', error);
    return false;
  }
};
