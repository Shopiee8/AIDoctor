import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import initializeFirebaseAdmin from '@/lib/firebase-admin';
import { AIAgent } from '@/types/ai-provider';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin;
const db = getFirestore(adminApp);

// GET /api/ai-provider/agents - Get all agents for the current provider
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    const agentsRef = db.collection('ai-agents').where('providerId', '==', providerId);
    const snapshot = await agentsRef.get();
    
    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const agents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/ai-provider/agents - Create a new agent
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { providerId, ...agentData } = data;
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    // Add timestamps
    const now = new Date().toISOString();
    const newAgent = {
      ...agentData,
      providerId,
      status: agentData.status || 'inactive',
      createdAt: now,
      updatedAt: now,
      lastActive: now,
      consultations: 0,
      rating: 0,
      responseTime: 0,
      successRate: 0,
      revenue: 0
    };

    const docRef = await db.collection('ai-agents').add(newAgent);
    
    return NextResponse.json({
      id: docRef.id,
      ...newAgent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
