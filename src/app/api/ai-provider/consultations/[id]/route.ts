import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import initializeFirebaseAdmin from '@/lib/firebase-admin';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin;
const db = getFirestore(adminApp);

// GET /api/ai-provider/consultations/[id] - Get a specific consultation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await db.collection('consultations').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-provider/consultations/[id] - Update a consultation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Don't allow updating these fields directly
    const { id: _, providerId, agentId, patientId, ...updateData } = data;
    
    const now = new Date().toISOString();
    
    // If updating status to completed, calculate duration
    if (updateData.status === 'completed' && !updateData.endTime) {
      const doc = await db.collection('consultations').doc(id).get();
      if (doc.exists) {
        const consultation = doc.data();
        const startTime = new Date(consultation?.startTime).getTime();
        const endTime = new Date().getTime();
        updateData.duration = Math.round((endTime - startTime) / (1000 * 60)); // in minutes
        updateData.endTime = now;
      }
    }
    
    const docRef = db.collection('consultations').doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: now
    });
    
    // Get the updated document
    const updatedDoc = await docRef.get();
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-provider/consultations/[id] - Cancel a consultation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // First, check if the consultation exists
    const doc = await db.collection('consultations').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }
    
    const consultation = doc.data();
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation data not found' },
        { status: 404 }
      );
    }
    
    // If consultation is already completed or cancelled, return error
    if (['completed', 'cancelled'].includes(consultation.status)) {
      return NextResponse.json(
        { error: `Cannot delete a ${consultation.status} consultation` },
        { status: 400 }
      );
    }
    
    // Update the consultation status to cancelled
    await db.collection('consultations').doc(id).update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString()
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error cancelling consultation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel consultation' },
      { status: 500 }
    );
  }
}
