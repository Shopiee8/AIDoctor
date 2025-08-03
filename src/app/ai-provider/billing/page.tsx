'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { BillingSettings } from '@/components/billing/billing-settings';

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?callbackUrl=${encodeURIComponent('/ai-provider/billing')}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
    <div className="container mx-auto py-8">
      <BillingSettings />
    </div>
  );
}
