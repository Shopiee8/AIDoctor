import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';

// Types
export interface AIAgent {
  id?: string;
  name: string;
  specialty: string;
  status: 'active' | 'inactive' | 'training';
  avatar: string;
  description: string;
  consultations: number;
  rating: number;
  responseTime: number;
  successRate: number;
  revenue: number;
  createdAt: Date;
  lastActive: Date;
  apiKey: string;
  settings: {
    maxConsultations: number;
    workingHours: string;
    languages: string[];
    autoRespond: boolean;
  };
  providerId: string; // ID of the provider who owns this agent
}

export interface ConsultationHistory {
  id?: string;
  patientName: string;
  agentId: string;
  agentName: string;
  date: Date;
  duration: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  rating: number;
  revenue: number;
  symptoms: string[];
  diagnosis: string;
  providerId: string; // ID of the provider who owns this consultation
}

const AGENTS_COLLECTION = 'aiAgents';
const CONSULTATIONS_COLLECTION = 'consultations';

// AI Agents

export const getAgents = async (providerId: string): Promise<AIAgent[]> => {
  const q = query(
    collection(db, AGENTS_COLLECTION),
    where('providerId', '==', providerId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    lastActive: doc.data().lastActive?.toDate()
  } as AIAgent));
};

export const getAgent = async (id: string): Promise<AIAgent | null> => {
  const docRef = doc(db, AGENTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    lastActive: docSnap.data().lastActive?.toDate()
  } as AIAgent;
};

export const addAgent = async (agent: Omit<AIAgent, 'id' | 'createdAt' | 'lastActive'>): Promise<string> => {
  const docRef = await addDoc(collection(db, AGENTS_COLLECTION), {
    ...agent,
    createdAt: Timestamp.now(),
    lastActive: Timestamp.now()
  });
  return docRef.id;
};

export const updateAgent = async (id: string, agent: Partial<AIAgent>): Promise<void> => {
  const docRef = doc(db, AGENTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...agent,
    lastActive: Timestamp.now()
  });
};

export const deleteAgent = async (id: string): Promise<void> => {
  const docRef = doc(db, AGENTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// Real-time agent updates
export const subscribeToAgents = (
  providerId: string, 
  callback: (agents: AIAgent[]) => void
) => {
  const q = query(
    collection(db, AGENTS_COLLECTION),
    where('providerId', '==', providerId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const agents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as AIAgent));
    callback(agents);
  });
};

// Consultations

export const getConsultations = async (providerId: string, limitCount: number = 10): Promise<ConsultationHistory[]> => {
  const q = query(
    collection(db, CONSULTATIONS_COLLECTION),
    where('providerId', '==', providerId),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate()
  } as ConsultationHistory));
};

// Analytics

export const getAnalytics = async (providerId: string) => {
  // Get all agents for this provider
  const agents = await getAgents(providerId);
  
  // Get recent consultations
  const recentConsultations = await getConsultations(providerId, 100);
  
  // Calculate basic metrics
  const totalConsultations = recentConsultations.length;
  const totalRevenue = recentConsultations.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const averageRating = recentConsultations.length > 0 
    ? recentConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) / recentConsultations.length
    : 0;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  
  // Group consultations by month for trends
  const monthlyData = recentConsultations.reduce((acc, c) => {
    if (!c.date) return acc;
    
    const month = c.date.toLocaleString('default', { month: 'short' });
    const year = c.date.getFullYear();
    const key = `${month} ${year}`;
    
    if (!acc[key]) {
      acc[key] = { consultations: 0, revenue: 0 };
    }
    
    acc[key].consultations += 1;
    acc[key].revenue += c.revenue || 0;
    
    return acc;
  }, {} as Record<string, { consultations: number; revenue: number }>);
  
  // Convert to array and sort by date
  const consultationTrends = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      consultations: data.consultations,
      revenue: data.revenue
    }))
    .sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
  
  // Calculate specialty distribution
  const specialtyCounts = agents.reduce((acc, agent) => {
    const specialty = agent.specialty || 'Other';
    acc[specialty] = (acc[specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalAgents = agents.length;
  const specialtyDistribution = Object.entries(specialtyCounts).map(([specialty, count]) => ({
    specialty,
    count,
    percentage: Math.round((count / totalAgents) * 100)
  }));
  
  // Find top performing agent (by revenue)
  const agentRevenue = recentConsultations.reduce((acc, c) => {
    if (!c.agentId) return acc;
    
    acc[c.agentId] = (acc[c.agentId] || 0) + (c.revenue || 0);
    return acc;
  }, {} as Record<string, number>);
  
  const topAgentId = Object.entries(agentRevenue).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topAgent = topAgentId ? agents.find(a => a.id === topAgentId) : null;
  
  return {
    totalConsultations,
    totalRevenue,
    averageRating: parseFloat(averageRating.toFixed(1)),
    activeAgents,
    monthlyGrowth: 0, // This would need historical data to calculate
    topPerformingAgent: topAgent?.name || 'N/A',
    consultationTrends,
    specialtyDistribution
  };
};

// Real-time analytics updates
export const subscribeToAnalytics = (
  providerId: string,
  callback: (analytics: any) => void
) => {
  // This is a simplified version - in a real app, you might want to use Firestore
  // real-time queries or Cloud Functions for more complex analytics
  const updateAnalytics = async () => {
    const analytics = await getAnalytics(providerId);
    callback(analytics);
  };
  
  // Initial update
  updateAnalytics();
  
  // Subscribe to changes in agents and consultations
  const agentsUnsubscribe = subscribeToAgents(providerId, updateAnalytics);
  
  // In a real app, you'd also subscribe to consultation changes
  
  // Return cleanup function
  return () => {
    agentsUnsubscribe();
  };
};
