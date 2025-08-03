import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { generateRevenueReport } from '@/services/billingService';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin();
const db = getFirestore(adminApp);

// GET /api/ai-provider/billing/revenue - Generate a revenue report
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // Set default date range to last 30 days if not provided
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr 
      ? new Date(startDateStr) 
      : new Date(new Date().setDate(endDate.getDate() - 30));
    
    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use ISO 8601 format (e.g., 2023-01-01)' },
        { status: 400 }
      );
    }
    
    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }
    
    // Generate the revenue report
    const report = await generateRevenueReport(providerId, startDate, endDate);
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    return NextResponse.json(
      { error: 'Failed to generate revenue report' },
      { status: 500 }
    );
  }
}
