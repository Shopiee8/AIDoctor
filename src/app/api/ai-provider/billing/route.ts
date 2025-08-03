import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { getBillingDetails, updateBillingDetails } from '@/services/billingService';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin();
const db = getFirestore(adminApp);

// GET /api/ai-provider/billing - Get billing details for the authenticated provider
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
    
    const billingDetails = await getBillingDetails(providerId);
    
    if (!billingDetails) {
      return NextResponse.json(
        { error: 'Billing details not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(billingDetails);
  } catch (error) {
    console.error('Error fetching billing details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing details' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-provider/billing - Update billing details
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { providerId, ...updateData } = data;
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // Validate required fields if this is the first time setting up billing
    if (!updateData.customerId) {
      if (!updateData.email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }
      
      if (!updateData.address) {
        return NextResponse.json(
          { error: 'Address is required' },
          { status: 400 }
        );
      }
    }
    
    const updatedDetails = await updateBillingDetails(providerId, updateData);
    
    return NextResponse.json(updatedDetails);
  } catch (error) {
    console.error('Error updating billing details:', error);
    return NextResponse.json(
      { error: 'Failed to update billing details' },
      { status: 500 }
    );
  }
}
