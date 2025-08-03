import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, increment, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface BillingDetails {
  id: string;
  providerId: string;
  customerId?: string;
  email: string;
  name?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  taxInfo?: {
    taxId: string;
    type: 'individual' | 'company';
  };
  paymentMethod?: {
    type: 'card' | 'bank_account' | 'paypal';
    last4?: string;
    brand?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  providerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  description: string;
  type: 'subscription' | 'one_time' | 'refund' | 'payout';
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  totalPayments: number;
  activeSubscriptions: number;
  churnedSubscriptions: number;
  mrr: number;
  arr: number;
  currency: string;
  date: Date;
}

// Get billing details for a provider
export const getBillingDetails = async (providerId: string): Promise<BillingDetails | null> => {
  const billingRef = doc(db, 'billing', providerId);
  const billingSnap = await getDoc(billingRef);
  
  if (!billingSnap.exists()) {
    return null;
  }
  
  return {
    id: billingSnap.id,
    ...billingSnap.data(),
    createdAt: billingSnap.data().createdAt?.toDate(),
    updatedAt: billingSnap.data().updatedAt?.toDate(),
  } as BillingDetails;
};

// Update billing details for a provider
export const updateBillingDetails = async (
  providerId: string, 
  data: Partial<BillingDetails>
): Promise<BillingDetails> => {
  const billingRef = doc(db, 'billing', providerId);
  const now = new Date();
  
  await setDoc(
    billingRef, 
    {
      ...data,
      updatedAt: now,
    },
    { merge: true }
  );
  
  const updatedDoc = await getDoc(billingRef);
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
    createdAt: updatedDoc.data()?.createdAt?.toDate(),
    updatedAt: updatedDoc.data()?.updatedAt?.toDate(),
  } as BillingDetails;
};

// Get subscription for a provider
export const getSubscription = async (providerId: string): Promise<Subscription | null> => {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef, 
    where('providerId', '==', providerId),
    where('status', 'in', ['active', 'trialing', 'past_due'])
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  // Get the most recent active subscription
  const subscriptionDoc = querySnapshot.docs[0];
  const data = subscriptionDoc.data();
  
  return {
    id: subscriptionDoc.id,
    ...data,
    currentPeriodStart: data.currentPeriodStart?.toDate(),
    currentPeriodEnd: data.currentPeriodEnd?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Subscription;
};

// Get all available subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const plansRef = collection(db, 'subscriptionPlans');
  const q = query(plansRef, where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as SubscriptionPlan));
};

// Record a payment
export const recordPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
  const paymentsRef = collection(db, 'payments');
  const paymentId = uuidv4();
  const now = new Date();
  
  const paymentData = {
    ...payment,
    id: paymentId,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(doc(paymentsRef, paymentId), {
    ...paymentData,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  
  // Update provider's revenue metrics
  if (payment.status === 'succeeded' && payment.type === 'subscription') {
    const providerRef = doc(db, 'providers', payment.providerId);
    await updateDoc(providerRef, {
      totalRevenue: increment(payment.amount),
      updatedAt: Timestamp.fromDate(now),
    });
  }
  
  return paymentData;
};

// Get payment history for a provider
export const getPaymentHistory = async (providerId: string, resultsLimit: number = 10): Promise<Payment[]> => {
  const paymentsRef = collection(db, 'payments');
  const q = query(
    paymentsRef,
    where('providerId', '==', providerId),
    orderBy('createdAt', 'desc'),
    limit(resultsLimit)
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as Payment));
};

// Generate a revenue report for a provider
export const generateRevenueReport = async (
  providerId: string, 
  startDate: Date, 
  endDate: Date
): Promise<RevenueReport> => {
  // This would typically aggregate data from payments and subscriptions
  // For simplicity, we'll return a basic report
  const paymentsRef = collection(db, 'payments');
  const q = query(
    paymentsRef,
    where('providerId', '==', providerId),
    where('status', '==', 'succeeded'),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    where('createdAt', '<=', Timestamp.fromDate(endDate))
  );
  
  const querySnapshot = await getDocs(q);
  const payments = querySnapshot.docs.map(doc => doc.data() as Payment);
  
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Get active subscriptions
  const subscriptionsRef = collection(db, 'subscriptions');
  const activeSubsQuery = query(
    subscriptionsRef,
    where('providerId', '==', providerId),
    where('status', 'in', ['active', 'trialing'])
  );
  
  const activeSubsSnapshot = await getDocs(activeSubsQuery);
  
  // Calculate MRR (Monthly Recurring Revenue)
  // This is a simplified calculation
  const mrr = 0; // This would be calculated based on subscription plans
  
  return {
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    totalRevenue,
    totalPayments: payments.length,
    activeSubscriptions: activeSubsSnapshot.size,
    churnedSubscriptions: 0, // Would need to calculate based on previous period
    mrr,
    arr: mrr * 12, // Annual Recurring Revenue
    currency: 'USD', // Default currency
    date: new Date(),
  };
};
