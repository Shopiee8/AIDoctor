import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSubscription, getSubscriptionPlans } from '@/services/billingService';
import { Timestamp } from 'firebase-admin/firestore';

// Use the pre-initialized Firestore instance
const db = adminDb;

// GET /api/ai-provider/billing/subscription - Get current subscription and available plans
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
    
    // Get current subscription
    const subscription = await getSubscription(providerId);
    
    // Get available plans
    const plans = await getSubscriptionPlans();
    
    return NextResponse.json({
      currentSubscription: subscription,
      availablePlans: plans,
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}

// POST /api/ai-provider/billing/subscription - Create or update subscription
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { providerId, planId, paymentMethodId } = data;
    
    if (!providerId || !planId) {
      return NextResponse.json(
        { error: 'Provider ID and Plan ID are required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would integrate with a payment provider like Stripe here
    // For now, we'll simulate a successful subscription creation
    
    const now = new Date();
    const subscriptionId = `sub_${Math.random().toString(36).substring(2, 15)}`;
    const subscriptionData = {
      id: subscriptionId,
      providerId,
      planId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: new Date(now.setMonth(now.getMonth() + 1)), // 1 month from now
      cancelAtPeriodEnd: false,
      createdAt: now,
      updatedAt: now,
    };
    
    // Save to Firestore
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.set({
      ...subscriptionData,
      currentPeriodStart: Timestamp.fromDate(now),
      currentPeriodEnd: Timestamp.fromDate(new Date(now.setMonth(now.getMonth() + 1))),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    
    // Record the payment
    const paymentRef = db.collection('payments').doc();
    await paymentRef.set({
      id: paymentRef.id,
      providerId,
      amount: 9900, // $99.00 in cents
      currency: 'usd',
      status: 'succeeded',
      description: `Subscription to plan ${planId}`,
      type: 'subscription',
      referenceId: subscriptionId,
      metadata: {
        planId,
      },
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    
    return NextResponse.json({
      success: true,
      subscription: subscriptionData,
    });
  } catch (error) {
    console.error('Error creating/updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-provider/billing/subscription - Cancel subscription
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    
    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would integrate with a payment provider like Stripe here
    // For now, we'll simulate a successful cancellation
    
    // Find the active subscription
    const subscriptionsRef = db.collection('subscriptions');
    const q = subscriptionsRef
      .where('providerId', '==', providerId)
      .where('status', 'in', ['active', 'trialing', 'past_due'])
      .limit(1);
    
    const querySnapshot = await q.get();
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    const subscriptionDoc = querySnapshot.docs[0];
    const now = new Date();
    
    // Update the subscription to be canceled at period end
    await subscriptionDoc.ref.update({
      status: 'canceled',
      cancelAtPeriodEnd: true,
      updatedAt: Timestamp.fromDate(now),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period',
      canceledAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
