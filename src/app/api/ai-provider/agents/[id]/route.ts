import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import initializeFirebaseAdmin from '@/lib/firebase-admin';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin;
const db = getFirestore(adminApp);

// GET /api/ai-provider/agents/[id] - Get a specific agent
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await db.collection('ai-agents').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-provider/agents/[id] - Update an agent
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Don't allow updating these fields directly
    const { id: _, providerId, ...updateData } = data;
    
    const now = new Date().toISOString();
    
    const docRef = db.collection('ai-agents').doc(id);
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
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-provider/agents/[id] - Delete an agent
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // First, check if the agent exists
    const doc = await db.collection('ai-agents').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Perform a soft delete by updating the status
    await db.collection('ai-agents').doc(id).update({
      status: 'inactive',
      deletedAt: new Date().toISOString()
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
