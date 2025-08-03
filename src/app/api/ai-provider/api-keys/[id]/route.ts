import { NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';

// Initialize Firebase Admin
const db = adminDb;

// GET /api/ai-provider/api-keys/[id] - Get a specific API key
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await db.collection('api-keys').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }
    
    const data = doc.data();
    
    if (!data) {
      return NextResponse.json(
        { error: 'API key data is corrupted' },
        { status: 500 }
      );
    }
    
    // Don't return sensitive information
    return NextResponse.json({
      id: doc.id,
      name: data.name || '',
      prefix: data.prefix || '',
      keySuffix: data.keySuffix || '',
      permissions: data.permissions || [],
      createdAt: data.createdAt || null,
      expiresAt: data.expiresAt || null,
      lastUsed: data.lastUsed || null,
      revoked: data.revoked || false
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-provider/api-keys/[id] - Update an API key
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Only allow updating name, permissions, and expiration
    const { name, permissions, expiresInDays } = data;
    const updateData: any = { updatedAt: new Date().toISOString() };
    
    if (name) updateData.name = name;
    if (permissions) updateData.permissions = permissions;
    if (expiresInDays) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      updateData.expiresAt = expiresAt.toISOString();
    }
    
    await db.collection('api-keys').doc(id).update(updateData);
    
    // Get the updated document
    const updatedDoc = await db.collection('api-keys').doc(id).get();
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-provider/api-keys/[id] - Revoke an API key
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the API key exists
    const doc = await db.collection('api-keys').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }
    
    // Mark as revoked instead of deleting (for audit purposes)
    await db.collection('api-keys').doc(id).update({
      revoked: true,
      revokedAt: new Date().toISOString()
    });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
