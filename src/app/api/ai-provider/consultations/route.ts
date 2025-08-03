import { NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import initializeFirebaseAdmin from '@/lib/firebase-admin';
import { ConsultationHistory } from '@/types/ai-provider';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin;
const db = getFirestore(adminApp);

// GET /api/ai-provider/consultations - Get all consultations for a provider or agent
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!providerId && !agentId) {
      return NextResponse.json(
        { error: 'Provider ID or Agent ID is required' },
        { status: 400 }
      );
    }

    let query: FirebaseFirestore.Query = db.collection('consultations');
    
    // Filter by provider or agent
    if (agentId) {
      query = query.where('agentId', '==', agentId);
    } else if (providerId) {
      query = query.where('providerId', '==', providerId);
    }
    
    // Apply status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Apply date range filter if provided
    if (startDate) {
      query = query.where('startTime', '>=', new Date(startDate));
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.where('startTime', '<=', endOfDay);
    }
    
    // Order by start time (newest first) and limit results
    query = query.orderBy('startTime', 'desc').limit(limit);
    
    const snapshot = await query.get();
    
    const consultations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

// POST /api/ai-provider/consultations - Create a new consultation
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { providerId, agentId, patientId, startTime, endTime, sessionType = 'text' } = data;
    
    // Validate required fields
    if (!providerId || !agentId || !patientId || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create consultation object
    const now = new Date().toISOString();
    const newConsultation: Partial<ConsultationHistory> = {
      providerId,
      agentId,
      patientId,
      patientName: data.patientName || 'Anonymous',
      agentName: data.agentName || 'AI Agent',
      startTime: new Date(startTime).toISOString(),
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
      duration: 0, // Will be calculated when the consultation ends
      status: 'scheduled',
      sessionType,
      symptoms: data.symptoms || [],
      diagnosis: data.diagnosis || null,
      prescriptions: data.prescriptions || [],
      notes: data.notes || '',
      rating: undefined,
      revenue: data.revenue || 0,
      followUpRequired: data.followUpRequired || false,
      date: now
    };
    
    // Add to Firestore
    const docRef = await db.collection('consultations').add(newConsultation);
    
    // Update agent's consultation count
    await db.collection('ai-agents').doc(agentId).update({
      consultations: FieldValue.increment(1),
      lastActive: now
    });
    
    return NextResponse.json({
      id: docRef.id,
      ...newConsultation
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    );
  }
}
