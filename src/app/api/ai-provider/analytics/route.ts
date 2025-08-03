import { NextResponse } from 'next/server';
import { getFirestore, type DocumentData } from 'firebase-admin/firestore';
import initializeFirebaseAdmin from '../../../../lib/firebase-admin';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// --- Interfaces ---

interface Agent extends DocumentData {
  id: string;
  name: string;
  specialty: string;
  status: string;
  consultations?: number;
  revenue?: number;
  rating?: number;
}

interface Consultation extends DocumentData {
  id: string;
  status: string;
  revenue?: number;
  rating?: number;
  startTime?: string | Date;
  specialty?: string;
}

interface DayData {
  date: string;
  consultations: number;
  revenue: number;
  activeAgents?: number;
}

interface SpecialtyData {
  specialty: string;
  agents: number;
  consultations: number;
  revenue: number;
}

interface TopAgent {
  id: string;
  name: string;
  specialty: string;
  consultations: number;
  revenue: number;
  rating: number;
  status: string;
}

interface AnalyticsResponse {
  summary: {
    totalAgents: number;
    activeAgents: number;
    totalConsultations: number;
    completedConsultations: number;
    cancelledConsultations: number;
    completionRate: number;
    averageRating: number;
    totalRevenue: number;
    timeRange: {
      start: string;
      end: string;
    };
  };
  timeSeries: DayData[];
  bySpecialty: SpecialtyData[];
  topAgents: TopAgent[];
}

// --- Firestore Initialization ---
const adminApp = initializeFirebaseAdmin;
const db = getFirestore(adminApp);

// --- GET /api/ai-provider/analytics ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const timeRange = searchParams.get('timeRange') || '30d';

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    // --- Time Range Calculation ---
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '30d':
      default:
        startDate = subDays(now, 30);
        break;
    }

    const startDateStr = startOfDay(startDate).toISOString();
    const endDateStr = endOfDay(now).toISOString();

    // --- Fetch Agents ---
    const agentsSnapshot = await db
      .collection('ai-agents')
      .where('providerId', '==', providerId)
      .get();

    const agents = agentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        specialty: data.specialty || 'Unknown',
        status: data.status || 'unknown',
        consultations: data.consultations || 0,
        revenue: data.revenue || 0,
        rating: data.rating,
        createdAt: data.createdAt,
        lastActive: data.lastActive
      } as Agent;
    });

    // --- Fetch Consultations ---
    const consultationsSnapshot = await db
      .collection('consultations')
      .where('providerId', '==', providerId)
      .where('startTime', '>=', startDateStr)
      .where('startTime', '<=', endDateStr)
      .get();

    const consultations = consultationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        status: data.status || 'unknown',
        revenue: data.revenue || 0,
        rating: data.rating,
        startTime: data.startTime,
        specialty: data.specialty
      } as Consultation;
    });

    // --- Summary Calculations ---
    const totalConsultations = consultations.length;
    const completedConsultations = consultations.filter(c => c.status === 'completed').length;
    const cancelledConsultations = consultations.filter(c => c.status === 'cancelled').length;
    const totalRevenue = consultations.reduce((sum, c) => sum + (c.revenue || 0), 0);

    const ratedConsultations = consultations.filter(c => c.status === 'completed' && c.rating);
    const averageRating = ratedConsultations.length > 0
      ? ratedConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedConsultations.length
      : 0;

    // --- Time Series (Daily Breakdown) ---
    const dateMap = new Map<string, DayData>();
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      dateMap.set(dateKey, {
        date: dateKey,
        consultations: 0,
        revenue: 0,
        activeAgents: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    consultations.forEach(c => {
      if (!c.startTime) return;
      const dateKey = format(new Date(c.startTime), 'yyyy-MM-dd');
      const dayData = dateMap.get(dateKey)!;
      dayData.consultations += 1;
      dayData.revenue += c.revenue || 0;
    });

    // --- Specialty Breakdown ---
    const specialtyMap = new Map<string, SpecialtyData>();
    agents.forEach(agent => {
      const specialty = agent.specialty || 'Other';
      const specialtyData = specialtyMap.get(specialty) || {
        specialty,
        agents: 0,
        consultations: 0,
        revenue: 0,
      };
      specialtyData.agents += 1;
      specialtyData.consultations += agent.consultations || 0;
      specialtyData.revenue += agent.revenue || 0;
      specialtyMap.set(specialty, specialtyData);
    });

    // --- Top Agents ---
    const topAgents: TopAgent[] = [...agents]
      .sort((a, b) => (b.consultations || 0) - (a.consultations || 0))
      .slice(0, 5)
      .map(agent => ({
        id: agent.id,
        name: agent.name,
        specialty: agent.specialty,
        consultations: agent.consultations || 0,
        revenue: agent.revenue || 0,
        rating: agent.rating || 0,
        status: agent.status,
      }));

    // --- Final Response ---
    const response: AnalyticsResponse = {
      summary: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        totalConsultations,
        completedConsultations,
        cancelledConsultations,
        completionRate: totalConsultations > 0
          ? (completedConsultations / totalConsultations) * 100
          : 0,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        timeRange: {
          start: startDateStr,
          end: endDateStr,
        },
      },
      timeSeries: Array.from(dateMap.values()),
      bySpecialty: Array.from(specialtyMap.values()),
      topAgents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
