/**
 * Utility script to sync existing AI agents to the patient search system
 * This should be run by AI providers to ensure their existing agents are visible to patients
 */

import { syncAllAgentsToSearch, verifyAgentVisibility } from '@/services/agentSearchService';
import { getAIDoctorsByProvider } from '@/lib/firebase/providerService';

/**
 * Sync all existing AI agents for a provider to the patient search system
 */
export const syncProviderAgentsToSearch = async (providerId: string): Promise<{
  success: boolean;
  syncedCount: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  let syncedCount = 0;

  try {
    console.log(`Starting sync for provider: ${providerId}`);
    
    // Sync all agents to search
    await syncAllAgentsToSearch(providerId);
    
    // Verify all agents are now visible
    const aiDoctors = await getAIDoctorsByProvider(providerId);
    syncedCount = aiDoctors.length;
    
    console.log(`Successfully synced ${syncedCount} AI agents to patient search`);
    
    return {
      success: true,
      syncedCount,
      errors
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(errorMessage);
    console.error('Error syncing agents to search:', error);
    
    return {
      success: false,
      syncedCount,
      errors
    };
  }
};

/**
 * Verify that all AI agents for a provider are visible in patient search
 */
export const verifyProviderAgentsVisibility = async (providerId: string): Promise<{
  totalAgents: number;
  visibleAgents: number;
  hiddenAgents: string[];
}> => {
  try {
    console.log(`Verifying agent visibility for provider: ${providerId}`);
    
    // Get all AI doctors for this provider
    const aiDoctors = await getAIDoctorsByProvider(providerId);
    const hiddenAgents: string[] = [];
    
    // Check each agent's visibility
    for (const aiDoctor of aiDoctors) {
      if (!aiDoctor.isActive) {
        hiddenAgents.push(`${aiDoctor.name} (${aiDoctor.id}) - Inactive`);
        continue;
      }
      
      // Verify agent visibility in the search index
      const isVisible = await verifyAgentVisibility(aiDoctor.id || '');
      if (!isVisible) {
        hiddenAgents.push(`${aiDoctor.name} (${aiDoctor.id}) - Not found in search index`);
      }
    }
    
    const visibleAgents = aiDoctors.length - hiddenAgents.length;
    
    console.log(`Visibility check complete: ${visibleAgents}/${aiDoctors.length} agents visible`);
    
    return {
      totalAgents: aiDoctors.length,
      visibleAgents,
      hiddenAgents
    };
  } catch (error) {
    console.error('Error verifying agent visibility:', error);
    return {
      totalAgents: 0,
      visibleAgents: 0,
      hiddenAgents: ['Error checking visibility']
    };
  }
};

/**
 * Get sync status report for a provider
 */
export const getProviderSyncStatus = async (providerId: string): Promise<{
  providerId: string;
  totalAgents: number;
  visibleAgents: number;
  syncStatus: 'complete' | 'partial' | 'none';
  recommendations: string[];
}> => {
  try {
    const visibility = await verifyProviderAgentsVisibility(providerId);
    const recommendations: string[] = [];
    
    let syncStatus: 'complete' | 'partial' | 'none' = 'complete';
    
    if (visibility.visibleAgents === 0 && visibility.totalAgents > 0) {
      syncStatus = 'none';
      recommendations.push('Run syncProviderAgentsToSearch() to make your agents visible to patients');
    } else if (visibility.visibleAgents < visibility.totalAgents) {
      syncStatus = 'partial';
      recommendations.push('Some agents are not visible. Check agent status and re-sync if needed');
    }
    
    if (visibility.hiddenAgents.length > 0) {
      recommendations.push('Hidden agents: ' + visibility.hiddenAgents.join(', '));
    }
    
    if (visibility.totalAgents === 0) {
      recommendations.push('No AI agents found. Create agents in your dashboard first');
    }
    
    return {
      providerId,
      totalAgents: visibility.totalAgents,
      visibleAgents: visibility.visibleAgents,
      syncStatus,
      recommendations
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      providerId,
      totalAgents: 0,
      visibleAgents: 0,
      syncStatus: 'none',
      recommendations: ['Error checking sync status']
    };
  }
};

/**
 * Batch sync multiple providers (admin function)
 */
export const batchSyncProviders = async (providerIds: string[]): Promise<{
  totalProviders: number;
  successfulSyncs: number;
  failedSyncs: string[];
  totalAgentsSynced: number;
}> => {
  const failedSyncs: string[] = [];
  let successfulSyncs = 0;
  let totalAgentsSynced = 0;
  
  console.log(`Starting batch sync for ${providerIds.length} providers`);
  
  for (const providerId of providerIds) {
    try {
      const result = await syncProviderAgentsToSearch(providerId);
      
      if (result.success) {
        successfulSyncs++;
        totalAgentsSynced += result.syncedCount;
        console.log(`✅ Provider ${providerId}: ${result.syncedCount} agents synced`);
      } else {
        failedSyncs.push(`${providerId}: ${result.errors.join(', ')}`);
        console.log(`❌ Provider ${providerId}: Sync failed`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      failedSyncs.push(`${providerId}: ${errorMessage}`);
      console.log(`❌ Provider ${providerId}: Exception during sync`);
    }
  }
  
  console.log(`Batch sync complete: ${successfulSyncs}/${providerIds.length} providers synced`);
  
  return {
    totalProviders: providerIds.length,
    successfulSyncs,
    failedSyncs,
    totalAgentsSynced
  };
};

// Export for use in dashboard or admin tools
export const syncUtils = {
  syncProviderAgentsToSearch,
  verifyProviderAgentsVisibility,
  getProviderSyncStatus,
  batchSyncProviders
};