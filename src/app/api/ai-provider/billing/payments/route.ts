import { NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';
import { getPaymentHistory, recordPayment, type Payment } from '@/services/billingService';

// Use the pre-initialized Firestore instance
const db = adminDb; 

// GET /api/ai-provider/billing/payments - Get payment history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    const payments = await getPaymentHistory(providerId, limit);
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

// POST /api/ai-provider/billing/payments - Record a new payment
export async function POST(request: Request) {
  try {
    const paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    if (!paymentData.providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    if (!paymentData.amount || paymentData.amount <= 0) {
      return NextResponse.json(
        { error: 'A valid payment amount is required' },
        { status: 400 }
      );
    }
    
    const payment = await recordPayment(paymentData);
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
