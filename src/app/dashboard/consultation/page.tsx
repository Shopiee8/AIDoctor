"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import VapiConsultation from '@/ai/flows/vapi-consultation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConsultationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');

  // If no doctor ID is provided, redirect to the AI consultation page
  useEffect(() => {
    if (!doctorId) {
      router.replace('/dashboard/ai-consultation');
    }
  }, [doctorId, router]);

  // If no doctor ID, show a loading state (will redirect immediately)
  if (!doctorId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to AI consultation...</p>
        </div>
      </div>
    );
  }

  // If we have a doctor ID, show the consultation interface
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">AI Doctor Consultation</h2>
          <p className="text-sm text-muted-foreground">
            Speak with our AI doctor for a preliminary consultation
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/dashboard/ai-consultation')}
          className="hidden sm:flex"
        >
          Change Doctor
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Virtual Consultation</CardTitle>
        </CardHeader>
        <CardContent>
          <VapiConsultation doctorId={doctorId} />
        </CardContent>
      </Card>
    </div>
  );
}
