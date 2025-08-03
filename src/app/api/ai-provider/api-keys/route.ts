import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

// Type for Firestore document data
interface ApiKeyDoc {
  id: string;
  [key: string]: any;
}

// Initialize Firebase Admin
const db = adminDb;

// GET /api/ai-provider/api-keys - Get all API keys for a provider
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

    const snapshot = await db.collection('api-keys')
      .where('providerId', '==', providerId)
      .where('revoked', '==', false)
      .get();
    
    const apiKeys = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      // Don't return the actual key hash for security
      return {
        id: doc.id,
        name: data.name,
        prefix: data.prefix,
        lastUsed: data.lastUsed,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        permissions: data.permissions || []
      };
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/ai-provider/api-keys - Create a new API key
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { providerId, name, expiresInDays = 365, permissions = [] } = data;
    
    if (!providerId || !name) {
      return NextResponse.json(
        { error: 'Provider ID and name are required' },
        { status: 400 }
      );
    }
    
    // Generate a random API key
    const apiKey = `sk_${uuidv4().replace(/-/g, '')}`;
    const prefix = apiKey.substring(0, 8);
    const keySuffix = apiKey.substring(8);
    
    // Hash the API key for secure storage
    const saltRounds = 12;
    const hashedKey = await bcrypt.hash(apiKey, saltRounds);
    
    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + expiresInDays);
    
    // Store in database
    const docRef = await db.collection('api-keys').add({
      providerId,
      name,
      prefix,
      keyHash: hashedKey,
      keySuffix: `...${keySuffix.substring(keySuffix.length - 4)}`,
      permissions,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastUsed: null,
      revoked: false
    });
    
    // Return the full key (only shown once)
    return NextResponse.json({
      id: docRef.id,
      name,
      key: apiKey, // Only time the full key is returned
      prefix,
      expiresAt: expiresAt.toISOString(),
      permissions
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
