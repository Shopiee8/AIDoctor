
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PatientRegisterStepOne() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/patient-register/step-2');
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Link href="/" className="inline-block mb-4">
          <Stethoscope className="h-8 w-8 text-primary mx-auto" />
        </Link>
        <div className="flex justify-center gap-2 my-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</div>
          <Link href="/patient-register/step-2" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">2</Link>
          <Link href="/patient-register/step-3" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</Link>
          <Link href="/patient-register/step-4" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">4</Link>
          <Link href="/patient-register/step-5" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">5</Link>
        </div>
        <CardTitle className="text-2xl font-headline">Profile Picture</CardTitle>
        <CardDescription>You can upload a profile picture later from your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground p-8">
            Profile picture upload is temporarily disabled to resolve a configuration issue. Please continue.
        </div>
        <div className="mt-8">
          <Button onClick={handleContinue} className="w-full">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
