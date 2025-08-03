'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, History, BarChart2 } from 'lucide-react';

type Subscription = {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  cancelAtPeriodEnd: boolean;
};

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  description: string;
  type: string;
  createdAt: string | Date;
};

const MOCK_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: ['5 AI Agents', '100 consultations/month', 'Basic Analytics']
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: ['20 AI Agents', '500 consultations/month', 'Advanced Analytics']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: ['Unlimited Agents', 'Unlimited consultations', 'Premium Support']
  }
];

export function BillingSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscription');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock data loading
  useEffect(() => {
    if (!user?.uid) return;
    
    const timer = setTimeout(() => {
      setSubscription({
        id: 'sub_mock123',
        planId: 'professional',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        cancelAtPeriodEnd: false,
      });

      setPaymentHistory([
        {
          id: 'pm_1',
          amount: 9900,
          currency: 'usd',
          status: 'succeeded',
          description: 'Monthly Subscription - Professional Plan',
          type: 'subscription',
          createdAt: new Date(),
        },
        {
          id: 'pm_2',
          amount: 9900,
          currency: 'usd',
          status: 'succeeded',
          description: 'Monthly Subscription - Professional Plan',
          type: 'subscription',
          createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      ]);

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.uid]);

  const handleSubscribe = async (planId: string) => {
    if (!user?.uid) return;
    
    setIsUpdating(true);
    
    try {
      // In a real app, you would make an API call here
      const plan = MOCK_PLANS.find(p => p.id === planId);
      
      toast({
        title: 'Subscription Updated',
        description: `You are now subscribed to the ${plan?.name} plan.`,
      });
      
      setSubscription({
        id: 'sub_mock123',
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        cancelAtPeriodEnd: false,
      });
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription and payment methods
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MOCK_PLANS.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${
              subscription?.planId === plan.id 
                ? 'border-primary ring-2 ring-primary' 
                : 'hover:border-primary/50'
            }`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(plan.price * 100, 'USD')}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{plan.interval}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={
                  isUpdating || 
                  (subscription?.planId === plan.id && !subscription?.cancelAtPeriodEnd)
                }
              >
                {isUpdating 
                  ? 'Processing...'
                  : subscription?.planId === plan.id && !subscription?.cancelAtPeriodEnd
                    ? 'Current Plan'
                    : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your payment history and download invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === 'succeeded'
                            ? 'default'
                            : payment.status === 'pending'
                            ? 'outline'
                            : 'destructive'
                        }
                        className="capitalize"
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
